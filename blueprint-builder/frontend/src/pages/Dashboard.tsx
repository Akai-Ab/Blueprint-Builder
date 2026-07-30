import type { Blueprint } from '../types';

export default function Dashboard({ blueprints, onNew, onSelect }: {
  blueprints: Blueprint[];
  onNew: () => void;
  onSelect: (bp: Blueprint) => void;
}) {
  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Blueprints</h1>
          <p class="text-gray-500 mt-1">Create and manage your project blueprints</p>
        </div>
        <button
          type="button"
          onClick={onNew}
          class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Blueprint
        </button>
      </div>

      {blueprints.length === 0 && (
        <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-1">No blueprints yet</h3>
          <p class="text-gray-400 mb-4">Create your first project blueprint to get started</p>
          <button
            type="button"
            onClick={onNew}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Blueprint
          </button>
        </div>
      )}

      {blueprints.length > 0 && (
        <div class="grid gap-4">
          {blueprints.map(bp => (
            <button
              type="button"
              onClick={() => onSelect(bp)}
              class="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900">{bp.name}</h3>
                  {bp.description && (
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">{bp.description}</p>
                  )}
                </div>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                  {bp.projectType || 'Not set'}
                </span>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                {bp.features?.slice(0, 4).map(f => (
                  <span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{f}</span>
                ))}
                {(bp.features?.length || 0) > 4 && (
                  <span class="text-xs text-gray-400 px-1 py-0.5">+{bp.features!.length - 4} more</span>
                )}
              </div>
              {bp.createdAt && (
                <div class="text-xs text-gray-400 mt-2">
                  Created {new Date(bp.createdAt).toLocaleDateString()}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
