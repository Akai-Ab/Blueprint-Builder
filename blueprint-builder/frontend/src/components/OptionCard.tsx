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
      class={`text-left p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="font-medium text-gray-900">{name}</div>
          {detail && (
            <div class="text-sm text-gray-500 mt-1">{detail.description}</div>
          )}
        </div>
        <div class={`ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
          selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
          {selected && (
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {detail && selected && (
        <div class="mt-2 pt-2 border-t border-gray-100">
          <div class="flex flex-wrap gap-1">
            <span class={`text-xs px-2 py-0.5 rounded-full ${
              detail.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
              detail.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>{detail.difficulty}</span>
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Popularity: {detail.popularity}%
            </span>
          </div>
          <div class="mt-1 text-xs text-gray-500">
            <span class="font-medium">Best for:</span> {detail.bestFor}
          </div>
          {detail.advantages.length > 0 && (
            <div class="mt-1">
              <div class="text-xs font-medium text-gray-600">Advantages:</div>
              <ul class="text-xs text-gray-500 list-disc list-inside">
                {detail.advantages.slice(0, 2).map(a => <li>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
