export const DEFAULT_IRAQI_SCRIPT = `خلي نتخيل عالم النبات، مثل مسلسل تركي ضخم.
القصة كلها تبدي من النسيج الأساس.
يشكّل كتل نسيجية داخلية، مثل القشرة، واللب، والأشعة اللبية.
وهو اللي يسوي الشغل الحقيقي: البناء الضوئي، والخزن، والتنفس، والإسناد.
وعدنا نسيج البشرة، حارس البوابة.
يحمي النبات، ويسيطر على تبادل الغازات، ويمتص الماي.
أما المشاهد القوية والملحمية، فنحتاج بيها الخلايا السكلرنكيمية، مثل الخلايا الصخرية.
هي اللي تخلي ثمرة الكمثرى خشنة ومتصلبة.
وهذا الملصق العائلي للمسلسل:
النسيج الأساس: طاقم العمل الداخلي.
البشرة: الحارس الواقف على باب القصر.
الخلايا الصخرية: مشاهد الأكشن الصلبة.
والنسيج البرنكيمي: الشخصيات الطيبة، اللي تساعد الكل، وتخزن الأسرار.
هذا الشرح، وكل مواضيع الأحياء، موجودة بمنصة بايوڤيرس.
إذا تريد تجربها، علّق بكلمة أحياء، وأرسلك الرابط.`;

export type VoiceName = 'Fenrir' | 'Charon' | 'Puck' | 'Kore' | 'Zephyr';

export type VoiceStylePresetId = 'turkish_drama' | 'bioverse_reel' | 'warm_storyteller';

export type NarrationMode = 'single' | 'dual';

export type TtsEngineModel = 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts';

export interface VoiceOption {
  id: VoiceName;
  nameAr: string;
  characterAr: string;
  toneSummary: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'Fenrir',
    nameAr: 'فنرير (Fenrir)',
    characterAr: 'صوت درامي عميق',
    toneSummary: 'مثالي لمقدمات المسلسلات والمشاهد الملحمية الثقيلة',
  },
  {
    id: 'Charon',
    nameAr: 'كارون (Charon)',
    characterAr: 'راوي وثائقي رزين',
    toneSummary: 'نبرة هادئة متزنة للشرح العلمي الدقيق والعميق',
  },
  {
    id: 'Puck',
    nameAr: 'باك (Puck)',
    characterAr: 'صوت شبابي حيوي',
    toneSummary: 'طاقة عالية وإيقاع سريع لمقاطع الريلز ومنصات التواصل',
  },
  {
    id: 'Kore',
    nameAr: 'كوري (Kore)',
    characterAr: 'صوت واضح ودافئ',
    toneSummary: 'أداء متوازن ومريح للأذن في السرد التعليمي الطويل',
  },
  {
    id: 'Zephyr',
    nameAr: 'زفير (Zephyr)',
    characterAr: 'صوت سلس وعصري',
    toneSummary: 'إلقاء مرن وودود يناسب التعريف بالمنصات والمحتوى التفاعلي',
  },
];

export interface VoiceStylePreset {
  id: VoiceStylePresetId;
  label: string;
  subtitle: string;
  styleDirection: string;
}

export const VOICE_STYLE_PRESETS: VoiceStylePreset[] = [
  {
    id: 'turkish_drama',
    label: 'دراما تركية ملحمية',
    subtitle: 'نبرة تشويقية بلهجة عراقية بغدادية أصيلة مع وقفات درامية',
    styleDirection:
      'Authentic Baghdadi Iraqi Arabic narrator delivering a dramatic, cinematic Turkish-series trailer voiceover. Warm chest resonance, expressive pauses between scenes, clear Iraqi dialect pronunciation (like تبدي, يسوي, وعدنا, الماي, بيها, اللي تخلي), dramatic emphasis on action words.',
  },
  {
    id: 'bioverse_reel',
    label: 'شرح بايوڤيرس السريع',
    subtitle: 'إيقاع تعليمي مشوّق مناسب لفيديوهات الريلز وتيك توك',
    styleDirection:
      'Engaging, energetic Iraqi Arabic science communicator from Baghdad explaining biology with enthusiasm and clarity. Natural conversational Baghdadi rhythm, crisp articulation of scientific terms alongside colloquial Iraqi expressions, upbeat pacing with a welcoming call-to-action ending.',
  },
  {
    id: 'warm_storyteller',
    label: 'حكواتي بغدادي دافئ',
    subtitle: 'سرد قصصي هادئ ومريح قريب من القلب',
    styleDirection:
      'Warm, intimate Baghdadi Iraqi storyteller speaking naturally to a friend. Gentle pacing, rich Iraqi colloquial cadence, clear and unhurried storytelling tone.',
  },
];

export interface PlantDramaScene {
  id: string;
  orderLabel: string;
  title: string;
  dramaRole: string;
  biologicalRole: string;
  scriptText: string;
  imageUrl: string;
  imageAlt: string;
  accentTone: 'emerald' | 'slate' | 'amber' | 'teal';
}

export const PLANT_DRAMA_SCENES: PlantDramaScene[] = [
  {
    id: 'ground-tissue',
    orderLabel: 'المشهد 01',
    title: 'النسيج الأساس',
    dramaRole: 'طاقم العمل الداخلي',
    biologicalRole: 'القشرة، واللب، والأشعة اللبية · البناء الضوئي والخزن والإسناد',
    scriptText: `خلي نتخيل عالم النبات، مثل مسلسل تركي ضخم.
القصة كلها تبدي من النسيج الأساس.
يشكّل كتل نسيجية داخلية، مثل القشرة، واللب، والأشعة اللبية.
وهو اللي يسوي الشغل الحقيقي: البناء الضوئي، والخزن، والتنفس، والإسناد.`,
    imageUrl: '/src/assets/images/tissue_ground_card_1794839053812.jpg',
    imageAlt: 'رسم علمي لخلايا النسيج الأساس الأخضر في النبات',
    accentTone: 'emerald',
  },
  {
    id: 'epidermis',
    orderLabel: 'المشهد 02',
    title: 'نسيج البشرة',
    dramaRole: 'الحارس الواقف على باب القصر',
    biologicalRole: 'حماية النبات · السيطرة على تبادل الغازات · امتصاص الماي',
    scriptText: `وعدنا نسيج البشرة، حارس البوابة.
يحمي النبات، ويسيطر على تبادل الغازات، ويمتص الماي.`,
    imageUrl: '/src/assets/images/plant_drama_hero_1794839054052.jpg',
    imageAlt: 'بوابة القصر النباتي التي تمثل نسيج البشرة الحامي',
    accentTone: 'slate',
  },
  {
    id: 'sclerenchyma',
    orderLabel: 'المشهد 03',
    title: 'الخلايا السكلرنكيمية والصخرية',
    dramaRole: 'مشاهد الأكشن الصلبة',
    biologicalRole: 'تصلّب الأنسجة · تمنح ثمرة الكمثرى ملمسها الخشن والمتصلب',
    scriptText: `أما المشاهد القوية والملحمية، فنحتاج بيها الخلايا السكلرنكيمية، مثل الخلايا الصخرية.
هي اللي تخلي ثمرة الكمثرى خشنة ومتصلبة.`,
    imageUrl: '/src/assets/images/tissue_sclerenchyma_card_1794839054264.jpg',
    imageAlt: 'مقطع عرضي لثمرة الكمثرى يوضح الخلايا الصخرية الصلبة',
    accentTone: 'amber',
  },
  {
    id: 'parenchyma-outro',
    orderLabel: 'المشهد 04',
    title: 'النسيج البرنكيمي وخاتمة بايوڤيرس',
    dramaRole: 'الشخصيات الطيبة · الملصق العائلي',
    biologicalRole: 'مساعدة باقي الأنسجة وخزن الأسرار والغذاء · دعوة منصة بايوڤيرس',
    scriptText: `وهذا الملصق العائلي للمسلسل:
النسيج الأساس: طاقم العمل الداخلي.
البشرة: الحارس الواقف على باب القصر.
الخلايا الصخرية: مشاهد الأكشن الصلبة.
والنسيج البرنكيمي: الشخصيات الطيبة، اللي تساعد الكل، وتخزن الأسرار.
هذا الشرح، وكل مواضيع الأحياء، موجودة بمنصة بايوڤيرس.
إذا تريد تجربها، علّق بكلمة أحياء، وأرسلك الرابط.`,
    imageUrl: '/src/assets/images/tissue_ground_card_1794839053812.jpg',
    imageAlt: 'النسيج البرنكيمي الطيب الداعم لبقية خلايا النبات',
    accentTone: 'teal',
  },
];

export interface DualCastLine {
  speaker: 'الراوي' | 'المعلق';
  text: string;
}

export interface WavMetadata {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  dataByteLength: number;
  durationSeconds: number;
}

export function countArabicWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function estimateSpeechDurationSeconds(text: string, rate = 1): number {
  const words = countArabicWords(text);
  if (words === 0) return 0;
  const safeRate = rate > 0 ? rate : 1;
  // Dramatic Iraqi Arabic narration averages ~2.05 words/sec including natural pauses
  return Math.max(1, Math.round(words / (2.05 * safeRate)));
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function validateScriptInput(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: false, error: 'الرجاء كتابة أو لصق النص العراقي قبل توليد الصوت.' };
  }
  if (trimmed.length < 4) {
    return { valid: false, error: 'النص قصير جداً؛ يرجى إدخال جملة واضحة للتحويل الصوتي.' };
  }
  if (trimmed.length > 4500) {
    return {
      valid: false,
      error: 'تجاوز النص الحد المسموح للمقطع الواحد (4500 حرف). قسّمه إلى مشاهد أصغر.',
    };
  }
  return { valid: true };
}

export function buildIraqiVoiceStylePrompt(
  presetId: VoiceStylePresetId,
  customNote?: string
): string {
  const preset =
    VOICE_STYLE_PRESETS.find((item) => item.id === presetId) ?? VOICE_STYLE_PRESETS[0];
  const note = customNote?.trim();
  return note ? `${preset.styleDirection} Additional direction: ${note}` : preset.styleDirection;
}

export function splitScriptForDualCast(text: string): DualCastLine[] {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];
  if (lines.length === 1) {
    return [{ speaker: 'الراوي', text: lines[0] }];
  }

  // Group adjacent lines into balanced dramatic turns between الراوي and المعلق
  const result: DualCastLine[] = [];
  let currentSpeaker: 'الراوي' | 'المعلق' = 'الراوي';

  for (let i = 0; i < lines.length; i += 2) {
    const chunk = lines.slice(i, i + 2).join(' ');
    result.push({
      speaker: currentSpeaker,
      text: chunk,
    });
    currentSpeaker = currentSpeaker === 'الراوي' ? 'المعلق' : 'الراوي';
  }

  return result;
}

export function parseWavMetadata(base64Wav: string): WavMetadata | null {
  try {
    const clean = base64Wav.replace(/^data:audio\/[a-zA-Z0-9.+-]+;base64,/, '').trim();
    if (!clean) return null;

    let bytes: Uint8Array;
    if (typeof Buffer !== 'undefined') {
      bytes = new Uint8Array(Buffer.from(clean, 'base64'));
    } else {
      const binary = atob(clean);
      bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
    }

    if (bytes.length < 44) return null;
    const headerStr = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const waveStr = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (headerStr !== 'RIFF' || waveStr !== 'WAVE') return null;

    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const channels = view.getUint16(22, true);
    const sampleRate = view.getUint32(24, true);
    const bitsPerSample = view.getUint16(34, true);

    if (!channels || !sampleRate || !bitsPerSample) return null;

    const dataByteLength = Math.max(0, bytes.length - 44);
    const bytesPerSecond = sampleRate * channels * (bitsPerSample / 8);
    const durationSeconds = bytesPerSecond > 0 ? dataByteLength / bytesPerSecond : 0;

    return {
      sampleRate,
      channels,
      bitsPerSample,
      dataByteLength,
      durationSeconds,
    };
  } catch {
    return null;
  }
}
