import { useState, useEffect } from 'react';
import type { Blueprint } from './types';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import { api } from './utils/api';
import { clearDraft } from './utils/storage';

type View = 'dashboard' | 'builder';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [current, setCurrent] = useState<Blueprint | undefined>();

  useEffect(() => { loadBlueprints(); }, []);

  async function loadBlueprints() {
    try {
      const list = await api('/api/blueprints');
      setBlueprints(list);
    } catch { /* server might not be ready */ }
  }

  function handleNew() {
    clearDraft();
    setCurrent(undefined);
    setView('builder');
  }

  function handleSelect(bp: Blueprint) {
    setCurrent(bp);
    setView('builder');
  }

  async function handleDelete(id: string) {
    try {
      await api(`/api/blueprints/${id}`, { method: 'DELETE' });
      await loadBlueprints();
    } catch { /* silent */ }
  }

  async function handleDuplicate(bp: Blueprint) {
    try {
      const { id, createdAt, updatedAt, ...rest } = bp;
      await api('/api/blueprints', {
        method: 'POST',
        body: JSON.stringify({ ...rest, name: `${rest.name} (copy)` })
      });
      await loadBlueprints();
    } catch { /* silent */ }
  }

  async function handleSave(bp: Blueprint) {
    try {
      if (bp.id) {
        await api(`/api/blueprints/${bp.id}`, {
          method: 'PUT', body: JSON.stringify(bp)
        });
      } else {
        await api('/api/blueprints', {
          method: 'POST', body: JSON.stringify(bp)
        });
      }
      clearDraft();
      await loadBlueprints();
      setView('dashboard');
    } catch { /* silent */ }
  }

  function handleReset() {
    clearDraft();
    setCurrent(undefined);
    setView('dashboard');
    loadBlueprints();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header bp={current || null} onReset={handleReset} />
      {view === 'dashboard' ? (
        <Dashboard
          blueprints={blueprints}
          onNew={handleNew}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      ) : (
        <Builder
          blueprint={current}
          onSave={handleSave}
          onBack={() => { loadBlueprints(); setView('dashboard'); }}
        />
      )}
    </div>
  );
}
