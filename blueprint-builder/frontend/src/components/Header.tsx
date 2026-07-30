import type { Blueprint } from '../types';

export default function Header({ bp, onReset }: { bp: Blueprint | null; onReset: () => void }) {
  return (
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          <span class="text-lg font-bold text-gray-900">Blueprint Builder</span>
        </div>
        <div class="flex items-center gap-3">
          {bp?.name && (
            <span class="text-sm text-gray-500 truncate max-w-48">{bp.name}</span>
          )}
          {bp && (
            <button
              type="button"
              onClick={onReset}
              class="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              New Blueprint
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
