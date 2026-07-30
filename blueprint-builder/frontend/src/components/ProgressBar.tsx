import type { Blueprint, BuilderStep } from '../types';

const stepOrder: BuilderStep[] = [
  'basics', 'platforms', 'frontend', 'backend',
  'database', 'features', 'integrations', 'quality', 'review'
];

export default function ProgressBar({ bp, current }: { bp: Blueprint; current: BuilderStep }) {
  const filled = stepOrder.filter(s => {
    if (s === 'review') return false;
    const key = s === 'basics' ? 'projectType' as const : s as keyof Blueprint;
    const val = bp[key];
    return Array.isArray(val) ? val.length > 0 : Boolean(val);
  }).length;

  const total = stepOrder.length - 1;
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">
            <span className="font-bold text-blue-600 text-base">{filled}</span>
            <span className="text-slate-400"> of {total} sections complete</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  i < Math.floor(pct / 20) ? 'bg-gradient-to-r from-blue-500 to-blue-400 scale-125' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-slate-500 font-bold">{pct}%</span>
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-lg shadow-blue-500/30"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
