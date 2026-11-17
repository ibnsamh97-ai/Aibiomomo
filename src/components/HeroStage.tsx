import { ArrowDown, Mic, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { formatDuration } from '../utils/iraqiScript';

interface HeroStageProps {
  wordCount: number;
  estimatedSeconds: number;
  sceneCount: number;
  onGenerateFull: () => void;
  isGenerating: boolean;
}

export function HeroStage({
  wordCount,
  estimatedSeconds,
  sceneCount,
  onGenerateFull,
  isGenerating,
}: HeroStageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Copy & Primary Action */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span>منصة بايوڤيرس للأحياء</span>
                <span aria-hidden="true">·</span>
                <span>تعليق صوتي باللهجة العراقية</span>
                <span aria-hidden="true">·</span>
                <span>تصدير WAV عالي الدقة</span>
              </div>

              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] text-balance">
                حوّل نص عالم النبات إلى تعليق صوتي عراقي درامي بلمسة واحدة
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                تم تجهيز نصك الكامل عن الأنسجة النباتية (النسيج الأساس، البشرة، الخلايا الصخرية،
                والنسيج البرنكيمي) داخل الاستوديو بنبرة درامية بغدادية أصيلة جاهزة للمونتاج والنشر.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onGenerateFull}
                disabled={isGenerating}
                className="inline-flex items-center gap-2.5 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <Mic className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{isGenerating ? 'جاري توليد الصوت العراقي...' : 'توليد الصوت الكامل الآن'}</span>
              </button>

              <a
                href="#scenes"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>استعرض مشاهد المسلسل</span>
              </a>
            </div>
          </div>

          {/* Botanical Palace Visual */}
          <div className="lg:col-span-6">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src="/src/assets/images/plant_drama_hero_1794839054052.jpg"
                  alt="رسم توضيحي لعالم النبات كقصر متكامل: البشرة كسور خارجي، النسيج الأساس في الوسط، والخلايا الصلبة كأعمدة"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50 p-6 text-center">
                  <Sparkles className="h-10 w-10 text-emerald-700 mb-3" aria-hidden="true" />
                  <p className="font-display text-lg font-bold text-slate-900">
                    عالم النبات · مسلسل بايوڤيرس الدرامي
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    النسيج الأساس، حارس البوابة البشرة، والخلايا الصخرية الصلبة
                  </p>
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent px-4 pb-4 pt-14 sm:px-5 sm:pb-5">
                <p className="text-xs font-semibold text-emerald-200">
                  التصور البصري للنص · قصر الأنسجة النباتية
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  البشرة تحرس البوابة، والنسيج الأساس يدير العمل الداخلي، والصخرية تتولى مشاهد الأكشن
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-column studio specs strip */}
        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-slate-500">كلمات النص الحالي</dt>
            <dd className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              {wordCount} كلمة
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">تقسيم المشاهد</dt>
            <dd className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              0{sceneCount} مشاهد
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">المدة التقديرية للإلقاء</dt>
            <dd className="mt-1 font-mono-tabular text-2xl font-semibold text-emerald-700">
              {formatDuration(estimatedSeconds)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">صيغة التصدير الصوتي</dt>
            <dd className="mt-1 font-mono-tabular text-2xl font-semibold text-slate-900">
              WAV · 24kHz
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
