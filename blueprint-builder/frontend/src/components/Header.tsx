import type { Blueprint } from '../types';

export default function Header({ bp, onReset }: { bp: Blueprint | null; onReset: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 group"
        >
          <svg className="w-7 h-7 text-blue-500 group-hover:text-blue-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Blueprint Builder</span>
        </button>
        <div className="flex items-center gap-3">
          {bp?.name && (
            <span className="text-sm text-gray-500 truncate max-w-48">{bp.name}</span>
          )}
          {bp && (
            <button
              type="button"
              onClick={onReset}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
            >
              Exit Builder
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
