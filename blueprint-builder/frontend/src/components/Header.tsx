import type { Blueprint } from '../types';

export default function Header({ bp, onReset }: { bp: Blueprint | null; onReset: () => void }) {
  return (
    <header className="glass sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2.5 group transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full group-hover:bg-blue-500/30 transition-all duration-300"></div>
            <svg className="w-8 h-8 text-blue-500 relative" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text group-hover:scale-[1.02] transition-all duration-300">Blueprint Builder</span>
        </button>
        <div className="flex items-center gap-4">
          {bp?.name && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600 truncate max-w-xs">{bp.name}</span>
            </div>
          )}
          {bp && (
            <button
              type="button"
              onClick={onReset}
              className="text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all px-3 py-1.5 rounded-lg duration-200"
            >
              Exit Builder
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
