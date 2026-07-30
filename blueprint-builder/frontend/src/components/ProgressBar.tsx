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
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{filled} of {total} sections complete</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
