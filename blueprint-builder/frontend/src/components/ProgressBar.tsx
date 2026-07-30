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
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-500">
          <span className="font-medium text-blue-600">{filled}</span>
          <span className="text-gray-400"> of {total} sections complete</span>
        </span>
        <span className="text-gray-500 font-medium">{pct}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
