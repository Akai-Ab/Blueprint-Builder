import type { Blueprint } from '../types';

export default function Header({ bp, onReset }: { bp: Blueprint | null; onReset: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            <span className="text-lg font-bold text-gray-900">Blueprint Builder</span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">
            {bp ? 'Edit Blueprint' : 'Dashboard'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {bp?.name && (
            <span className="text-sm text-gray-500 truncate max-w-48">{bp.name}</span>
          )}
          {bp && (
            <button
              type="button"
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
              New Blueprint
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
