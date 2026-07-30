import { useState, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

interface ToastCtx {
  toast: (type: ToastType, message: string) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(Ctx);
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 3500);
  }, []);

  const iconMap: Record<ToastType, ReactNode> = {
    success: (
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    info: (
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  };

  const bgMap: Record<ToastType, string> = {
    success: 'bg-white/95 backdrop-blur-sm border-green-200 shadow-green-500/10',
    error: 'bg-white/95 backdrop-blur-sm border-red-200 shadow-red-500/10',
    warning: 'bg-white/95 backdrop-blur-sm border-amber-200 shadow-amber-500/10',
    info: 'bg-white/95 backdrop-blur-sm border-blue-200 shadow-blue-500/10',
  };

  const textMap: Record<ToastType, string> = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-amber-800',
    info: 'text-blue-800',
  };

  return (
    <Ctx.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3.5 px-5 py-4 rounded-2xl border shadow-2xl max-w-sm transition-all duration-300 hover:scale-[1.02] ${
              bgMap[t.type]
            } ${t.exiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
          >
            {iconMap[t.type]}
            <p className={`text-sm font-semibold ${textMap[t.type]}`}>{t.message}</p>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
