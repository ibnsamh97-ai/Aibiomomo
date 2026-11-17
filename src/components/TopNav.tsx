import { Menu, Volume2, X } from 'lucide-react';
import { useState } from 'react';

interface TopNavProps {
  onQuickGenerate: () => void;
  isGenerating: boolean;
}

export function TopNav({ onQuickGenerate, isGenerating }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
        >
          بايوڤيرس صوت
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#studio"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-emerald-600"
          >
            الاستوديو الصوتي
          </a>
          <a
            href="#scenes"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-emerald-600"
          >
            مشاهد المسلسل
          </a>
          <a
            href="#player"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-emerald-600"
          >
            المشغل والمكتبة
          </a>
          <a
            href="#dialect-guide"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-emerald-600"
          >
            قاموس اللهجة
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onQuickGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{isGenerating ? 'جاري التوليد...' : 'توليد الصوت الآن'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="التنقل على الهاتف"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-2 text-sm font-medium text-slate-700"
        >
          <a
            href="#studio"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-2 rounded-md hover:bg-slate-50"
          >
            الاستوديو الصوتي
          </a>
          <a
            href="#scenes"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-2 rounded-md hover:bg-slate-50"
          >
            مشاهد المسلسل
          </a>
          <a
            href="#player"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-2 rounded-md hover:bg-slate-50"
          >
            المشغل والمكتبة
          </a>
          <a
            href="#dialect-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-2 rounded-md hover:bg-slate-50"
          >
            قاموس اللهجة
          </a>
        </nav>
      )}
    </header>
  );
}
