import { useState } from 'react';
import type { Blueprint } from '../types';

export default function Dashboard({ blueprints, onNew, onSelect, onDelete }: {
  blueprints: Blueprint[];
  onNew: () => void;
  onSelect: (bp: Blueprint) => void;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleDelete(id: string) {
    setConfirmDelete(id);
  }

  function confirmDeleteAction() {
    if (confirmDelete) {
      setDeleting(confirmDelete);
      onDelete(confirmDelete);
      setConfirmDelete(null);
      setTimeout(() => setDeleting(null), 300);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Blueprints</h1>
          <p className="text-gray-500 mt-1">Create and manage your project blueprints</p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all font-medium shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Blueprint
        </button>
      </div>

      {blueprints.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 animate-fade-in-up">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No blueprints yet</h3>
          <p className="text-gray-400 mb-6 max-w-xs mx-auto">Create your first project blueprint to get started with the guided builder</p>
          <button
            type="button"
            onClick={onNew}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all font-medium"
          >
            Create Your First Blueprint
          </button>
        </div>
      )}

      {blueprints.length > 0 && (
        <div className="grid gap-3">
          {blueprints.map((bp, i) => (
            <div
              key={bp.id}
              className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start p-5">
                <button
                  type="button"
                  onClick={() => onSelect(bp)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{bp.name || 'Untitled Blueprint'}</h3>
                      {bp.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{bp.description}</p>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full whitespace-nowrap ml-3 shrink-0">
                      {bp.projectType || 'Not set'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {bp.frontend?.slice(0, 2).map(f => (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                    {bp.backend?.slice(0, 2).map(b => (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{b}</span>
                    ))}
                    {(bp.frontend?.length || 0) + (bp.backend?.length || 0) > 4 && (
                      <span className="text-xs text-gray-400 px-1 py-0.5">
                        +{(bp.frontend?.length || 0) + (bp.backend?.length || 0) - 4} more
                      </span>
                    )}
                  </div>
                  {bp.createdAt && (
                    <div className="text-xs text-gray-400 mt-2">
                      Created {new Date(bp.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(bp.id!)}
                  disabled={deleting === bp.id}
                  className="ml-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 shrink-0"
                  title="Delete blueprint"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Blueprint?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
