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
      className={`text-left p-4 rounded-lg border-2 transition-all active:scale-[0.99] ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{name}</span>
            {selected && (
              <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">Selected</span>
            )}
          </div>
          {detail && (
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">{detail.description}</div>
          )}
        </div>
        <div className={`ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
          selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {detail && selected && (
        <div className="mt-3 pt-3 border-t border-blue-100 animate-fade-in">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              detail.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
              detail.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>{detail.difficulty}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Popularity: {detail.popularity}%
            </span>
          </div>
          <div className="mt-1.5 text-xs text-gray-500">
            <span className="font-medium">Best for:</span> {detail.bestFor}
          </div>
          {detail.advantages.length > 0 && (
            <div className="mt-1.5">
              <div className="text-xs font-medium text-gray-600 mb-0.5">Advantages:</div>
              <ul className="text-xs text-gray-500 space-y-0.5">
                {detail.advantages.slice(0, 2).map((a, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-green-400 mt-0.5">+</span>
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
              className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              View documentation →
            </a>
          )}
        </div>
      )}
    </button>
  );
}
