import { optionDetails } from '../data/options';

export default function OptionCard({
  name, selected, onToggle
}: {
  name: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const detail = optionDetails[name];

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] group relative overflow-hidden ${
        selected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg shadow-blue-500/10'
          : 'border-slate-200 bg-white/80 backdrop-blur-sm hover:border-slate-300 hover:shadow-soft hover:bg-white'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <span className={`font-bold transition-colors ${selected ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>{name}</span>
              {selected && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-2 py-0.5 rounded-full">Selected</span>
              )}
            </div>
            {detail && (
              <div className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{detail.description}</div>
            )}
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
            selected ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 scale-110' : 'border-slate-300 group-hover:border-slate-400'
          }`}>
            {selected && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        {detail && selected && (
          <div className="mt-4 pt-4 border-t border-blue-200/60 animate-fade-in">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                detail.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                detail.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>{detail.difficulty}</span>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg">
                Popularity: {detail.popularity}%
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Best for:</span> {detail.bestFor}
            </div>
            {detail.advantages.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-semibold text-slate-600 mb-1.5">Advantages:</div>
                <ul className="text-xs text-slate-600 space-y-1">
                  {detail.advantages.slice(0, 2).map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detail.docsUrl && (
              <a
                href={detail.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-2.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                View documentation
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
