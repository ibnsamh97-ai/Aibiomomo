import { Download, Pause, Play, Trash2, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDuration, parseWavMetadata } from '../utils/iraqiScript';

export interface GeneratedAudioClip {
  id: string;
  title: string;
  createdAt: string;
  voiceLabel: string;
  styleLabel: string;
  modeLabel: string;
  audioBase64: string;
  textPreview: string;
}

interface AudioPlayerDeckProps {
  clips: GeneratedAudioClip[];
  activeClipId: string | null;
  onSelectClip: (id: string) => void;
  onDeleteClip: (id: string) => void;
  isGenerating: boolean;
}

function extractWaveformPeaks(base64Wav: string, barCount = 56): number[] {
  try {
    const clean = base64Wav.replace(/^data:audio\/[a-zA-Z0-9.+-]+;base64,/, '').trim();
    const binary = atob(clean);
    const headerOffset = 44;
    if (binary.length <= headerOffset + 4) {
      return Array.from({ length: barCount }, () => 0.15);
    }

    const totalSamples = Math.floor((binary.length - headerOffset) / 2);
    const step = Math.max(1, Math.floor(totalSamples / barCount));
    const peaks: number[] = [];

    for (let i = 0; i < barCount; i++) {
      const sampleStart = i * step;
      let maxAmp = 0;
      const stride = Math.max(1, Math.floor(step / 16));
      for (let j = 0; j < step && sampleStart + j < totalSamples; j += stride) {
        const byteIdx = headerOffset + (sampleStart + j) * 2;
        const low = binary.charCodeAt(byteIdx);
        const high = binary.charCodeAt(byteIdx + 1);
        let val = (high << 8) | low;
        if (val >= 0x8000) val -= 0x10000;
        const norm = Math.abs(val) / 32768;
        if (norm > maxAmp) maxAmp = norm;
      }
      peaks.push(Math.max(0.08, Math.min(1, maxAmp)));
    }

    return peaks;
  } catch {
    return Array.from({ length: barCount }, () => 0.25);
  }
}

export function AudioPlayerDeck({
  clips,
  activeClipId,
  onSelectClip,
  onDeleteClip,
  isGenerating,
}: AudioPlayerDeckProps) {
  const activeClip = clips.find((c) => c.id === activeClipId) ?? clips[0] ?? null;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  const audioUrl = useMemo(() => {
    if (!activeClip) return null;
    const clean = activeClip.audioBase64
      .replace(/^data:audio\/[a-zA-Z0-9.+-]+;base64,/, '')
      .trim();
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }, [activeClip]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const wavMeta = useMemo(() => {
    if (!activeClip) return null;
    return parseWavMetadata(activeClip.audioBase64);
  }, [activeClip]);

  const peaks = useMemo(() => {
    if (!activeClip) return [];
    return extractWaveformPeaks(activeClip.audioBase64, 60);
  }, [activeClip]);

  // Reset playback state when switching clips
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(wavMeta?.durationSeconds ?? 0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [activeClip?.id, wavMeta?.durationSeconds]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Draw waveform bars reflecting actual audio amplitude and playback progress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(240, rect.width);
    const height = Math.max(64, rect.height);
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const effectiveDuration = duration > 0 ? duration : wavMeta?.durationSeconds ?? 1;
    const progressRatio = Math.min(1, Math.max(0, currentTime / effectiveDuration));
    const count = peaks.length;
    const gap = 3;
    const barWidth = Math.max(2, (width - gap * (count - 1)) / count);

    for (let i = 0; i < count; i++) {
      // Draw RTL-friendly progress from right to left
      const barProgressIndex = (count - 1 - i) / count;
      const isPlayed = progressRatio > 0 && barProgressIndex < progressRatio;
      const amp = peaks[i];
      const barHeight = Math.max(6, amp * (height - 12));
      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      ctx.fillStyle = isPlayed ? '#047857' : '#CBD5E1';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  }, [peaks, currentTime, duration, wavMeta?.durationSeconds]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      el.pause();
    }
  };

  const handleSeek = (nextTime: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleDownload = (clip: GeneratedAudioClip) => {
    const clean = clip.audioBase64
      .replace(/^data:audio\/[a-zA-Z0-9.+-]+;base64,/, '')
      .trim();
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bioverse-iraqi-${clip.id.slice(0, 8)}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const effectiveDuration = duration > 0 ? duration : wavMeta?.durationSeconds ?? 0;

  return (
    <section id="player" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-emerald-700">
            معاينة الموجة الصوتية وتصدير الملف
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            المشغل الصوتي وسجل المقاطع
          </h2>
        </div>
        <p className="text-sm text-slate-600 tabular-nums">
          {clips.length > 0 ? `${clips.length} مقطع متاح للتشغيل والتحميل` : 'جاهز لاستقبال أول تسجيل'}
        </p>
      </div>

      {!activeClip ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Volume2 className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
          <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
            {isGenerating ? 'جاري توليد الصوت باللهجة العراقية...' : 'لم يتم توليد أي مقطع صوتي بعد'}
          </h3>
          <p className="mx-auto mt-1.5 max-w-lg text-sm text-slate-600">
            اضغط على زر "توليد الصوت باللهجة العراقية" في الاستوديو أعلاه أو اختر أحد المشاهد الأربعة
            لسماع الصوت وتنزيله بصيغة WAV.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Active Player */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6">
            <audio
              ref={audioRef}
              src={audioUrl ?? undefined}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                if (Number.isFinite(d) && d > 0) setDuration(d);
              }}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            />

            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span>{activeClip.voiceLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeClip.styleLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeClip.modeLabel}</span>
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-slate-900">
                  {activeClip.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(activeClip)}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>تحميل ملف WAV</span>
              </button>
            </div>

            {/* Waveform Canvas */}
            <div className="my-5 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
              <canvas
                ref={canvasRef}
                data-testid="audio-visualizer"
                className="h-20 w-full block"
                aria-label="رسم الموجة الصوتية للمقطع العراقي"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'إيقاف الصوت مؤقتاً' : 'تشغيل الصوت'}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Play className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>

                <div className="flex-1">
                  <label htmlFor="audio-seek-slider" className="sr-only">
                    شريط التقديم والتأخير الصوتي
                  </label>
                  <input
                    id="audio-seek-slider"
                    type="range"
                    min={0}
                    max={effectiveDuration || 1}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                </div>

                <span dir="ltr" className="font-mono-tabular text-xs font-semibold text-slate-700 shrink-0">
                  {formatDuration(currentTime)} / {formatDuration(effectiveDuration)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-500 ml-2">سرعة التشغيل:</span>
                  {[0.85, 1, 1.15, 1.25].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPlaybackRate(rate)}
                      aria-pressed={playbackRate === rate}
                      dir="ltr"
                      className={`rounded-md px-2.5 py-1 font-mono-tabular text-xs font-semibold transition-colors cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {wavMeta && (
                  <p dir="ltr" className="font-mono-tabular text-xs text-slate-500">
                    {wavMeta.sampleRate} Hz · {wavMeta.bitsPerSample}-bit ·{' '}
                    {Math.round(wavMeta.dataByteLength / 1024)} KB
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Clips History List */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-display text-base font-bold text-slate-900 mb-3">
              سجل المقاطع المولّدة
            </h3>
            <ul className="divide-y divide-slate-100">
              {clips.map((clip) => {
                const selected = clip.id === activeClip.id;
                return (
                  <li key={clip.id} className="py-3 first:pt-0 last:pb-0">
                    <div
                      className={`flex items-start justify-between gap-3 rounded-lg p-2.5 transition-colors ${
                        selected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectClip(clip.id)}
                        className="flex-1 text-right cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
                      >
                        <p className="text-sm font-bold text-slate-900">{clip.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {clip.voiceLabel} · {clip.styleLabel} · {clip.createdAt}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                          {clip.textPreview}
                        </p>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDownload(clip)}
                          aria-label={`تحميل ${clip.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 cursor-pointer"
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteClip(clip.id)}
                          aria-label={`حذف ${clip.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
