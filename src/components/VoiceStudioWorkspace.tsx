import { Loader2, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import {
  VOICE_OPTIONS,
  VOICE_STYLE_PRESETS,
  countArabicWords,
  estimateSpeechDurationSeconds,
  formatDuration,
  type NarrationMode,
  type TtsEngineModel,
  type VoiceName,
  type VoiceStylePresetId,
} from '../utils/iraqiScript';

interface VoiceStudioWorkspaceProps {
  scriptText: string;
  onChangeScript: (next: string) => void;
  onResetScript: () => void;
  onEnhanceIraqi: () => void;
  isEnhancing: boolean;
  voiceName: VoiceName;
  onChangeVoiceName: (v: VoiceName) => void;
  secondaryVoiceName: VoiceName;
  onChangeSecondaryVoiceName: (v: VoiceName) => void;
  stylePreset: VoiceStylePresetId;
  onChangeStylePreset: (p: VoiceStylePresetId) => void;
  mode: NarrationMode;
  onChangeMode: (m: NarrationMode) => void;
  modelChoice: TtsEngineModel;
  onChangeModelChoice: (m: TtsEngineModel) => void;
  customStyleNote: string;
  onChangeCustomStyleNote: (note: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  errorMessage: string | null;
  onDismissError: () => void;
}

export function VoiceStudioWorkspace({
  scriptText,
  onChangeScript,
  onResetScript,
  onEnhanceIraqi,
  isEnhancing,
  voiceName,
  onChangeVoiceName,
  secondaryVoiceName,
  onChangeSecondaryVoiceName,
  stylePreset,
  onChangeStylePreset,
  mode,
  onChangeMode,
  modelChoice,
  onChangeModelChoice,
  customStyleNote,
  onChangeCustomStyleNote,
  onGenerate,
  isGenerating,
  errorMessage,
  onDismissError,
}: VoiceStudioWorkspaceProps) {
  const words = countArabicWords(scriptText);
  const chars = scriptText.trim().length;
  const estSeconds = estimateSpeechDurationSeconds(scriptText);

  return (
    <section
      id="studio"
      className="border-t border-b border-slate-200 bg-white py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700">
              محرر النص وإعدادات الأداء العراقي
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              استوديو تحويل النص إلى صوت
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
            <span className="font-mono-tabular">{words} كلمة</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{chars} / 4500 حرف</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">المدة التقديرية {formatDuration(estSeconds)}</span>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            <p>{errorMessage}</p>
            <button
              type="button"
              onClick={onDismissError}
              className="text-xs font-semibold text-red-700 hover:text-red-900 underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Script Editor Zone */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="iraqi-script-input"
                className="font-display text-base font-bold text-slate-900"
              >
                النص المطلوب تحويله باللهجة العراقية
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onEnhanceIraqi}
                  disabled={isEnhancing || isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  {isEnhancing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                  )}
                  <span>{isEnhancing ? 'جاري الضبط...' : 'تحسين التشكيل العراقي'}</span>
                </button>

                <button
                  type="button"
                  onClick={onResetScript}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>استعادة النص الكامل</span>
                </button>
              </div>
            </div>

            <textarea
              id="iraqi-script-input"
              rows={15}
              value={scriptText}
              onChange={(e) => onChangeScript(e.target.value)}
              placeholder="اكتب أو الصق النص باللهجة العراقية هنا..."
              className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] p-4 text-base leading-8 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />

            <p className="text-xs leading-relaxed text-slate-500">
              نصيحة إخراجية: تقسيم الجمل إلى سطور قصيرة يساعد المحرك على أخذ وقفات درامية طبيعية،
              ويتيح في وضع "ثنائي درامي" توزيع المشاهد بين الراوي الرئيسي والمعلق.
            </p>
          </div>

          {/* Voice & Dialect Control Deck */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 flex flex-col gap-5">
            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-2">
                نمط الإلقاء الصوتي
              </span>
              <div
                role="group"
                aria-label="نمط الإلقاء الصوتي"
                className="grid grid-cols-2 gap-1 rounded-lg bg-slate-200/80 p-1"
              >
                <button
                  type="button"
                  onClick={() => onChangeMode('single')}
                  aria-pressed={mode === 'single'}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    mode === 'single'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  راوي واحد
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMode('dual')}
                  aria-pressed={mode === 'dual'}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    mode === 'dual'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ثنائي درامي
                </button>
              </div>
            </div>

            {/* Style Preset */}
            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-2">
                أسلوب اللهجة العراقية والأداء
              </span>
              <div className="flex flex-col gap-2">
                {VOICE_STYLE_PRESETS.map((preset) => {
                  const active = preset.id === stylePreset;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onChangeStylePreset(preset.id)}
                      aria-pressed={active}
                      className={`text-right rounded-lg border px-3.5 py-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        active
                          ? 'border-emerald-600 bg-white'
                          : 'border-slate-200 bg-white/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900">{preset.label}</span>
                        {active && (
                          <span className="text-xs font-semibold text-emerald-700">مفعّل</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{preset.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice Pickers */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label
                  htmlFor="primary-voice-select"
                  className="block text-xs font-semibold text-slate-600 mb-1.5"
                >
                  {mode === 'dual' ? 'صوت الراوي الرئيسي' : 'اختيار نبرة الصوت'}
                </label>
                <select
                  id="primary-voice-select"
                  value={voiceName}
                  onChange={(e) => onChangeVoiceName(e.target.value as VoiceName)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nameAr} — {v.characterAr}
                    </option>
                  ))}
                </select>
              </div>

              {mode === 'dual' && (
                <div>
                  <label
                    htmlFor="secondary-voice-select"
                    className="block text-xs font-semibold text-slate-600 mb-1.5"
                  >
                    صوت المعلق الدرامي الثاني
                  </label>
                  <select
                    id="secondary-voice-select"
                    value={secondaryVoiceName}
                    onChange={(e) => onChangeSecondaryVoiceName(e.target.value as VoiceName)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  >
                    {VOICE_OPTIONS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nameAr} — {v.characterAr}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Engine Selection (hidden/locked to Flash TTS when dual mode is active) */}
            {mode === 'single' && (
              <div>
                <span className="block text-xs font-semibold text-slate-600 mb-2">
                  محرك التوليد الصوتي
                </span>
                <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-200/80 p-1">
                  <button
                    type="button"
                    onClick={() => onChangeModelChoice('gemini-3.8-flash-tts')}
                    aria-pressed={modelChoice === 'gemini-3.8-flash-tts'}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      modelChoice === 'gemini-3.8-flash-tts'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    تصميم صوت درامي
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeModelChoice('gemini-3.8-flash-lite-tts')}
                    aria-pressed={modelChoice === 'gemini-3.8-flash-lite-tts'}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      modelChoice === 'gemini-3.8-flash-lite-tts'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    توليد فائق السرعة
                  </button>
                </div>
              </div>
            )}

            {/* Custom Direction Note */}
            <div>
              <label
                htmlFor="custom-style-note"
                className="block text-xs font-semibold text-slate-600 mb-1.5"
              >
                توجيه إضافي للنبرة (اختياري)
              </label>
              <input
                id="custom-style-note"
                type="text"
                value={customStyleNote}
                onChange={(e) => onChangeCustomStyleNote(e.target.value)}
                placeholder="مثال: إبراز عبارة مشاهد الأكشن الصلبة بنبرة حماسية"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="mt-1 inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                  <span>جاري تحويل النص إلى صوت عراقي...</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>توليد الصوت باللهجة العراقية</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
