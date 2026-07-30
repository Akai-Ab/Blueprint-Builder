export default function SearchBar({ value, onChange }: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative mb-6 group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Search options..."
        value={value}
        onInput={e => onChange((e.target as HTMLInputElement).value)}
        className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all duration-200 bg-white hover:border-slate-300"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
