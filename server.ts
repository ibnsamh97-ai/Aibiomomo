import 'dotenv/config';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  buildIraqiVoiceStylePrompt,
  splitScriptForDualCast,
  validateScriptInput,
  type NarrationMode,
  type TtsEngineModel,
  type VoiceName,
  type VoiceStylePresetId,
} from './src/utils/iraqiScript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_VOICES: VoiceName[] = ['Fenrir', 'Charon', 'Puck', 'Kore', 'Zephyr'];
const ALLOWED_PRESETS: VoiceStylePresetId[] = [
  'turkish_drama',
  'bioverse_reel',
  'warm_storyteller',
];
const ALLOWED_MODELS: TtsEngineModel[] = [
  'gemini-3.8-flash-tts',
  'gemini-3.8-flash-lite-tts',
];

function getGeminiClient(apiVersion?: string): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    ...(apiVersion ? { apiVersion } : {}),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractAudioBase64(response: unknown): string | undefined {
  const res = response as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { data?: string; mimeType?: string };
        }>;
      };
    }>;
  };
  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return part.inlineData.data;
    }
  }
  return undefined;
}

function mapApiError(error: unknown): { status: number; message: string } {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();

  if (lower.includes('api_key') || lower.includes('permission_denied') || lower.includes('403')) {
    return {
      status: 403,
      message:
        'تعذر التحقق من مفتاح Gemini API. يرجى التحقق من المفتاح في إعدادات الأسرار (Settings > Secrets).',
    };
  }
  if (lower.includes('resource_exhausted') || lower.includes('429')) {
    return {
      status: 429,
      message: 'تم تجاوز حد الطلبات المؤقت لواجهة الصوت. انتظر قليلاً ثم أعد المحاولة.',
    };
  }
  if (lower.includes('not_found') || lower.includes('404')) {
    return {
      status: 502,
      message: 'نموذج الصوت المطلوب غير متاح حالياً. جرب تبديل المحرك إلى Flash TTS أو أعد المحاولة.',
    };
  }
  return {
    status: 500,
    message: raw || 'حدث خطأ غير متوقع أثناء معالجة الصوت العراقي.',
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  app.post('/api/tts', async (req: Request, res: Response) => {
    try {
      const {
        text,
        voiceName = 'Fenrir',
        secondaryVoiceName = 'Charon',
        stylePreset = 'turkish_drama',
        customStyleNote = '',
        mode = 'single',
        modelChoice = 'gemini-3.8-flash-tts',
      } = (req.body ?? {}) as {
        text?: string;
        voiceName?: VoiceName;
        secondaryVoiceName?: VoiceName;
        stylePreset?: VoiceStylePresetId;
        customStyleNote?: string;
        mode?: NarrationMode;
        modelChoice?: TtsEngineModel;
      };

      const validation = validateScriptInput(text ?? '');
      if (!validation.valid) {
        res.status(400).json({ error: validation.error });
        return;
      }

      const safeVoice: VoiceName = ALLOWED_VOICES.includes(voiceName) ? voiceName : 'Fenrir';
      const safeSecondaryVoice: VoiceName = ALLOWED_VOICES.includes(secondaryVoiceName)
        ? secondaryVoiceName
        : 'Charon';
      const safePreset: VoiceStylePresetId = ALLOWED_PRESETS.includes(stylePreset)
        ? stylePreset
        : 'turkish_drama';
      const safeMode: NarrationMode = mode === 'dual' ? 'dual' : 'single';

      // Dual-speaker mode requires gemini-3.8-flash-tts
      const selectedModel: TtsEngineModel =
        safeMode === 'dual'
          ? 'gemini-3.8-flash-tts'
          : ALLOWED_MODELS.includes(modelChoice)
            ? modelChoice
            : 'gemini-3.8-flash-tts';

      const styleDirection = buildIraqiVoiceStylePrompt(safePreset, customStyleNote);
      const cleanText = (text ?? '').trim();
      const ai = getGeminiClient('v1beta');

      let audioBase64: string | undefined;

      if (safeMode === 'dual') {
        const turns = splitScriptForDualCast(cleanText);
        const speakerPair =
          turns.length >= 2
            ? turns
            : [
                { speaker: 'الراوي' as const, text: cleanText },
                { speaker: 'المعلق' as const, text: 'تابع الشرح الكامل على منصة بايوڤيرس.' },
              ];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: speakerPair.map((turn) => {
                const speakerId = turn.speaker === 'الراوي' ? 'Narrator' : 'Commentator';
                return {
                  text: `${speakerId}: ${turn.text}`,
                  speechMetadata: {
                    speaker: speakerId,
                    style:
                      turn.speaker === 'الراوي'
                        ? styleDirection
                        : `${styleDirection} Slightly sharper, dramatic trailer co-host cadence.`,
                  },
                };
              }),
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Narrator',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: safeVoice },
                    },
                  },
                  {
                    speaker: 'Commentator',
                    voiceConfig: {
                      prebuiltVoiceConfig: {
                        voiceName:
                          safeSecondaryVoice === safeVoice
                            ? safeVoice === 'Fenrir'
                              ? 'Charon'
                              : 'Fenrir'
                            : safeSecondaryVoice,
                      },
                    },
                  },
                ],
              },
            },
          },
        });

        audioBase64 = extractAudioBase64(response);
      } else {
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style: styleDirection,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: safeVoice },
              },
            },
          },
        });

        audioBase64 = extractAudioBase64(response);
      }

      if (!audioBase64) {
        res.status(502).json({
          error: 'لم يُرجع محرك الصوت بيانات صوتية صالحة. يرجى تعديل النص أو إعادة المحاولة.',
        });
        return;
      }

      res.json({
        audioBase64,
        mimeType: 'audio/wav',
        modelUsed: selectedModel,
        voiceName: safeVoice,
        mode: safeMode,
      });
    } catch (error) {
      const mapped = mapApiError(error);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.post('/api/enhance-iraqi', async (req: Request, res: Response) => {
    try {
      const { text } = (req.body ?? {}) as { text?: string };
      const validation = validateScriptInput(text ?? '');
      if (!validation.valid) {
        res.status(400).json({ error: validation.error });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: (text ?? '').trim(),
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            'You are an expert Iraqi Arabic dialect voice-director. Your job is to add subtle, accurate Arabic diacritics (تشكيل خفيف) and natural dramatic punctuation (commas ، and pauses ...) to the provided Iraqi Arabic script so a TTS engine pronounces every Iraqi colloquial word (such as تبدي، يسوي، وعدنا، الماي، بيها، اللي تخلي، خشنة، بايوڤيرس) accurately in authentic Baghdadi dialect. CRITICAL: Do NOT translate into Modern Standard Arabic (الفصحى), do NOT add new sentences, and do NOT change or remove any Iraqi words. Return ONLY the lightly vocalized Iraqi script text.',
        },
      });

      const enhancedText = response.text?.trim();
      if (!enhancedText) {
        res.status(502).json({ error: 'لم يتمكن المحسن من معالجة النص حالياً.' });
        return;
      }

      res.json({ enhancedText });
    } catch (error) {
      const mapped = mapApiError(error);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Bioverse Iraqi Voice Studio running on http://0.0.0.0:${port}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
