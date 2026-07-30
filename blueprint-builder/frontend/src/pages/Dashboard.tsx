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
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Blueprints</h1>
          <p className="text-slate-500">Create and manage your project blueprints</p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="group flex items-center gap-2.5 px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-glow hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 font-semibold shadow-lg shadow-blue-500/20"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Blueprint
        </button>
      </div>

      {blueprints.length === 0 && (
        <div className="text-center py-24 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-soft animate-fade-in-up relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-50"></div>
          <div className="relative">
            <div className="animate-float mb-6">
              <svg className="w-24 h-24 text-blue-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No blueprints yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Create your first project blueprint to get started with the guided builder</p>
            <button
              type="button"
              onClick={onNew}
              className="group px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-glow hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 font-semibold shadow-lg shadow-blue-500/20"
            >
              Create Your First Blueprint
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      )}

      {blueprints.length > 0 && (
        <div className="grid gap-4">
          {blueprints.map((bp, i) => (
            <div
              key={bp.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-elevated transition-all duration-300 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
              <div className="flex items-start p-6 relative">
                <button
                  type="button"
                  onClick={() => onSelect(bp)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors duration-300">{bp.name || 'Untitled Blueprint'}</h3>
                      {bp.description && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{bp.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-semibold bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 px-3 py-1.5 rounded-full whitespace-nowrap ml-3 shrink-0 border border-slate-200">
                      {bp.projectType || 'Not set'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {bp.frontend?.slice(0, 2).map(f => (
                      <span key={f} className="text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 px-2.5 py-1 rounded-full border border-blue-200">{f}</span>
                    ))}
                    {bp.backend?.slice(0, 2).map(b => (
                      <span key={b} className="text-xs font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-600 px-2.5 py-1 rounded-full border border-green-200">{b}</span>
                    ))}
                    {(bp.frontend?.length || 0) + (bp.backend?.length || 0) > 4 && (
                      <span className="text-xs font-medium text-slate-400 px-1.5 py-1 bg-slate-100 rounded-full border border-slate-200">
                        +{(bp.frontend?.length || 0) + (bp.backend?.length || 0) - 4} more
                      </span>
                    )}
                  </div>
                  {bp.createdAt && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created {new Date(bp.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(bp.id!)}
                  disabled={deleting === bp.id}
                  className="ml-4 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 shrink-0 duration-300"
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full animate-fade-in-up border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Blueprint?</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-all duration-200 hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
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
