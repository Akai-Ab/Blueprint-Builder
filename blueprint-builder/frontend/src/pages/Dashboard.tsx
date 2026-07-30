import { useState } from 'react';
import type { Blueprint } from '../types';
import { api } from '../utils/api';

export default function Dashboard({ blueprints, onNew, onSelect, onDelete, onDuplicate }: {
  blueprints: Blueprint[];
  onNew: () => void;
  onSelect: (bp: Blueprint) => void;
  onDelete: (id: string) => void;
  onDuplicate: (bp: Blueprint) => void;
}) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'newest'>('newest');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = blueprints
    .filter(bp => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        bp.name?.toLowerCase().includes(q) ||
        bp.description?.toLowerCase().includes(q) ||
        bp.projectType?.toLowerCase().includes(q) ||
        bp.features?.some(f => f.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });

  function handleDelete(id: string) {
    onDelete(id);
    setConfirmDelete(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Blueprints</h1>
          <p className="text-gray-500 mt-1">Create and manage your project blueprints</p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Blueprint
        </button>
      </div>

      {/* Search and sort bar */}
      {blueprints.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search blueprints by name, description, or features..."
              value={search}
              onInput={e => setSearch((e.target as HTMLInputElement).value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'newest')}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="name">Name</option>
          </select>
        </div>
      )}

      {/* Empty state */}
      {blueprints.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No blueprints yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Create your first project blueprint to get started. You'll be guided through selecting technologies, features, and integrations.
          </p>
          <button
            type="button"
            onClick={onNew}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Your First Blueprint
          </button>
        </div>
      )}

      {/* No results state */}
      {blueprints.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500">No blueprints match "<span className="font-medium">{search}</span>"</p>
          <button type="button" onClick={() => setSearch('')} className="text-sm text-blue-600 hover:text-blue-700 mt-2">
            Clear search
          </button>
        </div>
      )}

      {/* Blueprint grid */}
      {filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map(bp => (
            <div
              key={bp.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <button
                    type="button"
                    onClick={() => onSelect(bp)}
                    className="text-left flex-1 min-w-0"
                  >
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{bp.name || 'Untitled Blueprint'}</h3>
                    {bp.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{bp.description}</p>
                    )}
                  </button>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {bp.projectType && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                        {bp.projectType}
                      </span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {['frontend', 'backend', 'database', 'features'].filter(k => {
                        const v = bp[k as keyof Blueprint];
                        return Array.isArray(v) && v.length > 0;
                      }).length} categories
                    </span>
                  </div>
                </div>

                {/* Feature tags */}
                {bp.features && bp.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {bp.features.slice(0, 6).map(f => (
                      <span key={f} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">{f}</span>
                    ))}
                    {bp.features.length > 6 && (
                      <span className="text-xs text-gray-400 px-1 py-0.5">+{bp.features.length - 6} more</span>
                    )}
                  </div>
                )}

                {/* Tech tags */}
                {bp.frontend && bp.frontend.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {bp.frontend.slice(0, 3).map(t => (
                      <span key={t} className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">{t}</span>
                    ))}
                    {bp.backend && bp.backend.length > 0 && bp.backend.slice(0, 2).map(t => (
                      <span key={t} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">{t}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {bp.createdAt && (
                      <span>Created {new Date(bp.createdAt).toLocaleDateString()}</span>
                    )}
                    {bp.updatedAt && (
                      <span>Updated {new Date(bp.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onDuplicate(bp)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>

                    {confirmDelete === bp.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(bp.id!)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 border border-gray-300 text-xs rounded hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(bp.id!)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blueprint count */}
      {blueprints.length > 0 && (
        <div className="text-center mt-6 text-xs text-gray-400">
          {filtered.length} of {blueprints.length} blueprints
        </div>
      )}
    </div>
  );
}
