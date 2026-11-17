import { useState } from 'react';
import { AudioPlayerDeck, type GeneratedAudioClip } from './components/AudioPlayerDeck';
import { DialectGuideSection } from './components/DialectGuideSection';
import { DramaScenesExplorer } from './components/DramaScenesExplorer';
import { HeroStage } from './components/HeroStage';
import { TopNav } from './components/TopNav';
import { VoiceStudioWorkspace } from './components/VoiceStudioWorkspace';
import {
  DEFAULT_IRAQI_SCRIPT,
  PLANT_DRAMA_SCENES,
  VOICE_OPTIONS,
  VOICE_STYLE_PRESETS,
  countArabicWords,
  estimateSpeechDurationSeconds,
  validateScriptInput,
  type NarrationMode,
  type PlantDramaScene,
  type TtsEngineModel,
  type VoiceName,
  type VoiceStylePresetId,
} from './utils/iraqiScript';

export default function App() {
  const [scriptText, setScriptText] = useState<string>(DEFAULT_IRAQI_SCRIPT);
  const [activeSceneId, setActiveSceneId] = useState<string>(PLANT_DRAMA_SCENES[0].id);

  const [voiceName, setVoiceName] = useState<VoiceName>('Fenrir');
  const [secondaryVoiceName, setSecondaryVoiceName] = useState<VoiceName>('Charon');
  const [stylePreset, setStylePreset] = useState<VoiceStylePresetId>('turkish_drama');
  const [mode, setMode] = useState<NarrationMode>('single');
  const [modelChoice, setModelChoice] = useState<TtsEngineModel>('gemini-3.8-flash-tts');
  const [customStyleNote, setCustomStyleNote] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [clips, setClips] = useState<GeneratedAudioClip[]>([]);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);

  const wordCount = countArabicWords(scriptText);
  const estimatedSeconds = estimateSpeechDurationSeconds(scriptText);

  const runTtsGeneration = async (targetText: string, clipTitle: string) => {
    const validation = validateScriptInput(targetText);
    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'النص غير صالح للتحويل.');
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: targetText,
          voiceName,
          secondaryVoiceName,
          stylePreset,
          customStyleNote,
          mode,
          modelChoice,
        }),
      });

      const data = (await response.json()) as {
        audioBase64?: string;
        error?: string;
      };

      if (!response.ok || !data.audioBase64) {
        throw new Error(data.error || 'تعذر توليد الملف الصوتي حالياً.');
      }

      const voiceMeta = VOICE_OPTIONS.find((v) => v.id === voiceName);
      const styleMeta = VOICE_STYLE_PRESETS.find((s) => s.id === stylePreset);
      const nowTime = new Date().toLocaleTimeString('ar-IQ', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newClip: GeneratedAudioClip = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: clipTitle,
        createdAt: nowTime,
        voiceLabel: voiceMeta?.nameAr ?? voiceName,
        styleLabel: styleMeta?.label ?? 'دراما عراقية',
        modeLabel: mode === 'dual' ? 'ثنائي درامي' : 'راوي واحد',
        audioBase64: data.audioBase64,
        textPreview: targetText.trim().split('\n')[0] ?? '',
      };

      setClips((prev) => [newClip, ...prev]);
      setActiveClipId(newClip.id);
      document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بخدمة التوليد الصوتي.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceIraqi = async () => {
    const validation = validateScriptInput(scriptText);
    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'النص غير صالح.');
      return;
    }

    setErrorMessage(null);
    setIsEnhancing(true);

    try {
      const response = await fetch('/api/enhance-iraqi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scriptText }),
      });

      const data = (await response.json()) as {
        enhancedText?: string;
        error?: string;
      };

      if (!response.ok || !data.enhancedText) {
        throw new Error(data.error || 'تعذر ضبط التشكيل العراقي حالياً.');
      }

      setScriptText(data.enhancedText);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'حدث خطأ أثناء تحسين التشكيل العراقي.'
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleLoadSceneToEditor = (scene: PlantDramaScene) => {
    setActiveSceneId(scene.id);
    setScriptText(scene.scriptText);
    setErrorMessage(null);
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerateSceneAudio = (scene: PlantDramaScene) => {
    setActiveSceneId(scene.id);
    void runTtsGeneration(scene.scriptText, `${scene.orderLabel}: ${scene.title}`);
  };

  const handleDeleteClip = (id: string) => {
    setClips((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeClipId === id) {
        setActiveClipId(remaining[0]?.id ?? null);
      }
      return remaining;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <TopNav
        onQuickGenerate={() => void runTtsGeneration(scriptText, 'تسجيل النص الكامل · بايوڤيرس')}
        isGenerating={isGenerating}
      />

      <main className="flex-1">
        <HeroStage
          wordCount={wordCount}
          estimatedSeconds={estimatedSeconds}
          sceneCount={PLANT_DRAMA_SCENES.length}
          onGenerateFull={() => void runTtsGeneration(scriptText, 'تسجيل النص الكامل · بايوڤيرس')}
          isGenerating={isGenerating}
        />

        <DramaScenesExplorer
          activeSceneId={activeSceneId}
          onSelectScene={(scene) => setActiveSceneId(scene.id)}
          onLoadSceneToEditor={handleLoadSceneToEditor}
          onGenerateSceneAudio={handleGenerateSceneAudio}
          isGenerating={isGenerating}
        />

        <VoiceStudioWorkspace
          scriptText={scriptText}
          onChangeScript={setScriptText}
          onResetScript={() => {
            setScriptText(DEFAULT_IRAQI_SCRIPT);
            setErrorMessage(null);
          }}
          onEnhanceIraqi={() => void handleEnhanceIraqi()}
          isEnhancing={isEnhancing}
          voiceName={voiceName}
          onChangeVoiceName={setVoiceName}
          secondaryVoiceName={secondaryVoiceName}
          onChangeSecondaryVoiceName={setSecondaryVoiceName}
          stylePreset={stylePreset}
          onChangeStylePreset={setStylePreset}
          mode={mode}
          onChangeMode={setMode}
          modelChoice={modelChoice}
          onChangeModelChoice={setModelChoice}
          customStyleNote={customStyleNote}
          onChangeCustomStyleNote={setCustomStyleNote}
          onGenerate={() => void runTtsGeneration(scriptText, 'تسجيل الاستوديو · لهجة عراقية')}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          onDismissError={() => setErrorMessage(null)}
        />

        <AudioPlayerDeck
          clips={clips}
          activeClipId={activeClipId}
          onSelectClip={setActiveClipId}
          onDeleteClip={handleDeleteClip}
          isGenerating={isGenerating}
        />

        <DialectGuideSection />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-medium text-slate-700">
            بايوڤيرس صوت · استوديو التحويل الصوتي باللهجة العراقية
          </p>
          <p>مخصص لمحتوى الأحياء التعليمي والدراما العلمية</p>
        </div>
      </footer>
    </div>
  );
}
