import { useState, useEffect, useCallback } from 'react';
import type { Blueprint } from './types';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider, useToast } from './components/Toast';
import { api, ApiError } from './utils/api';
import { clearDraft } from './utils/storage';

type View = 'dashboard' | 'builder';

function AppInner() {
  const [view, setView] = useState<View>('dashboard');
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [current, setCurrent] = useState<Blueprint | undefined>();
  const { toast } = useToast();

  useEffect(() => { loadBlueprints(); }, []);

  async function loadBlueprints() {
    try {
      const list = await api<Blueprint[]>('/api/blueprints', { log: 'list blueprints' });
      setBlueprints(list);
    } catch (e) {
      if (e instanceof ApiError) {
        console.warn('[App] Failed to load blueprints, server may not be ready');
      }
    }
  }

  const handleNew = useCallback(() => {
    clearDraft();
    setCurrent(undefined);
    setView('builder');
  }, []);

  function handleSelect(bp: Blueprint) {
    setCurrent(bp);
    setView('builder');
  }

  async function handleSave(bp: Blueprint) {
    try {
      if (bp.id) {
        await api(`/api/blueprints/${bp.id}`, {
          method: 'PUT', body: JSON.stringify(bp), log: 'update blueprint'
        });
        toast('success', 'Blueprint updated successfully');
      } else {
        await api('/api/blueprints', {
          method: 'POST', body: JSON.stringify(bp), log: 'create blueprint'
        });
        toast('success', 'Blueprint created successfully');
      }
      clearDraft();
      await loadBlueprints();
      setView('dashboard');
    } catch (e) {
      toast('error', e instanceof ApiError ? e.message : 'Failed to save blueprint');
    }
  }

  async function handleDelete(id: string) {
    try {
      await api(`/api/blueprints/${id}`, { method: 'DELETE', log: 'delete blueprint' });
      toast('success', 'Blueprint deleted');
      await loadBlueprints();
    } catch (e) {
      toast('error', e instanceof ApiError ? e.message : 'Failed to delete blueprint');
    }
  }

  function handleReset() {
    clearDraft();
    setCurrent(undefined);
    setView('dashboard');
    loadBlueprints();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header bp={current || null} onReset={handleReset} />
      {view === 'dashboard' ? (
        <Dashboard
          blueprints={blueprints}
          onNew={handleNew}
          onSelect={handleSelect}
          onDelete={handleDelete}
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

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </ErrorBoundary>
  );
}
