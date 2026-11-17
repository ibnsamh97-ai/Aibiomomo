import { FileText, Play, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { PLANT_DRAMA_SCENES, type PlantDramaScene } from '../utils/iraqiScript';

interface DramaScenesExplorerProps {
  activeSceneId: string | null;
  onSelectScene: (scene: PlantDramaScene) => void;
  onLoadSceneToEditor: (scene: PlantDramaScene) => void;
  onGenerateSceneAudio: (scene: PlantDramaScene) => void;
  isGenerating: boolean;
}

export function DramaScenesExplorer({
  activeSceneId,
  onSelectScene,
  onLoadSceneToEditor,
  onGenerateSceneAudio,
  isGenerating,
}: DramaScenesExplorerProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const selectedScene =
    PLANT_DRAMA_SCENES.find((s) => s.id === activeSceneId) ?? PLANT_DRAMA_SCENES[0];

  return (
    <section id="scenes" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-emerald-700">
            تقسيم النص الدرامي · طاقم عمل الأنسجة النباتية
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            مشاهد المسلسل الأربعة
          </h2>
        </div>
        <p className="max-w-xl text-sm text-slate-600">
          اختر أي مشهد لقراءة سطوره العراقية، إدراجه في المحرر، أو توليد مقطعه الصوتي بشكل مستقل.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Scene Selector List */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-3">
          {PLANT_DRAMA_SCENES.map((scene) => {
            const isSelected = scene.id === selectedScene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelectScene(scene)}
                aria-pressed={isSelected}
                className={`w-full text-right rounded-xl border p-4 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-mono-tabular font-semibold text-emerald-700">
                    {scene.orderLabel}
                  </span>
                  <span>{scene.dramaRole}</span>
                </div>
                <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900">
                  {scene.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {scene.biologicalRole}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Scene Spotlight */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-12">
            <div className="sm:col-span-5 bg-slate-100 min-h-[220px]">
              {!failedImages[selectedScene.id] ? (
                <img
                  src={selectedScene.imageUrl}
                  alt={selectedScene.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [selectedScene.id]: true }))
                  }
                  className="h-full w-full object-cover min-h-[220px] max-h-[320px] sm:max-h-none"
                />
              ) : (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 p-6 text-center">
                  <Play className="h-8 w-8 text-emerald-700 mb-2" aria-hidden="true" />
                  <p className="font-display font-bold text-slate-800">{selectedScene.title}</p>
                </div>
              )}
            </div>

            <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="font-mono-tabular text-emerald-700 font-semibold">
                    {selectedScene.orderLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>الدور: {selectedScene.dramaRole}</span>
                </div>

                <h3 className="mt-2 font-display text-2xl font-bold text-slate-900">
                  {selectedScene.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{selectedScene.biologicalRole}</p>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-800">
                    {selectedScene.scriptText}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onGenerateSceneAudio(selectedScene)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>توليد صوت هذا المشهد</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLoadSceneToEditor(selectedScene)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>نسخ للمحرر</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
