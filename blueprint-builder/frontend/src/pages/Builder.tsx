import { useState, useEffect } from 'react';
import type { Blueprint, BuilderStep, ValidationIssue } from '../types';
import { sections } from '../data/options';
import ProgressBar from '../components/ProgressBar';
import SearchBar from '../components/SearchBar';
import OptionCard from '../components/OptionCard';
import { saveDraft, loadDraft } from '../utils/storage';
import { api } from '../utils/api';

const stepOrder: BuilderStep[] = [
  'basics', 'platforms', 'frontend', 'backend',
  'database', 'features', 'integrations', 'quality', 'review'
];

const stepLabels: Record<BuilderStep, string> = {
  basics: 'Basics',
  platforms: 'Platforms',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  features: 'Features',
  integrations: 'Integrations',
  quality: 'Quality',
  review: 'Review'
};

const stepIcons: Record<BuilderStep, string> = {
  basics: '1',
  platforms: '2',
  frontend: '3',
  backend: '4',
  database: '5',
  features: '6',
  integrations: '7',
  quality: '8',
  review: '9'
};

function getSection(step: BuilderStep) {
  return sections.find(s => s.id === step) || null;
}

function isStepFilled(bp: Blueprint, step: BuilderStep) {
  if (step === 'review') return true;
  const section = getSection(step);
  if (!section) return false;
  if (step === 'basics') return Boolean(bp.name?.trim() && bp.projectType);
  const val = bp[section.key] as string[] | undefined;
  return Array.isArray(val) && val.length > 0;
}

export default function Builder({
  blueprint: initialBp,
  onSave,
  onBack
}: {
  blueprint?: Blueprint;
  onSave: (bp: Blueprint) => void;
  onBack: () => void;
}) {
  const [bp, setBp] = useState<Blueprint>(() => {
    const draft = loadDraft();
    return draft && !initialBp ? draft : (initialBp || {
      name: '', description: '', projectType: '', platforms: [],
      frontend: [], backend: [], mobile: [], desktop: [],
      database: [], storage: [], orm: [], authentication: [],
      hosting: [], cdn: [], cache: [], queue: [], search: [],
      monitoring: [], features: [], integrations: [], quality: []
    });
  });
  const [step, setStep] = useState<BuilderStep>('basics');
  const [search, setSearch] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [validation, setValidation] = useState<ValidationIssue[]>([]);
  const [generated, setGenerated] = useState<Record<string, string> | null>(null);

  useEffect(() => { saveDraft(bp); }, [bp]);

  async function fetchRecommendations() {
    try {
      const recs = await api('/api/recommendations', {
        method: 'POST', body: JSON.stringify(bp)
      });
      setRecommendations(recs);
    } catch { /* silent */ }
  }

  async function handleValidate() {
    try {
      const result = await api('/api/validate', {
        method: 'POST', body: JSON.stringify(bp)
      });
      setValidation(result.issues);
      return result.valid;
    } catch { return false; }
  }

  async function handleGenerate() {
    try {
      const docs = await api('/api/generate', {
        method: 'POST', body: JSON.stringify(bp)
      });
      setGenerated(docs);
    } catch { /* silent */ }
  }

  function updateField(key: keyof Blueprint, value: unknown) {
    setBp(prev => ({ ...prev, [key]: value }));
  }

  function toggleOption(key: keyof Blueprint, option: string) {
    setBp(prev => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  }

  function setSingleOption(key: keyof Blueprint, option: string) {
    setBp(prev => ({ ...prev, [key]: option }));
  }

  const section = getSection(step);
  const filteredOptions = section
    ? section.options.filter(o =>
        !search || o.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  function goNext() {
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) {
      setStep(stepOrder[idx + 1]);
      if (stepOrder[idx + 1] === 'review') {
        fetchRecommendations();
        handleValidate();
      }
    }
  }

  function goPrev() {
    const idx = stepOrder.indexOf(step);
    if (idx > 0) setStep(stepOrder[idx - 1]);
  }

  function goToStep(s: BuilderStep) {
    if (s === step) return;
    setStep(s);
    if (s === 'review') {
      fetchRecommendations();
      handleValidate();
    }
  }

  function handleSave() {
    onSave({ ...bp, updatedAt: new Date().toISOString() });
  }

  function selectedCount(key: keyof Blueprint): number {
    const val = bp[key];
    return Array.isArray(val) ? val.length : val ? 1 : 0;
  }

  function sidebarSelectionSummary() {
    return sections.filter(s => s.id !== 'basics' && s.id !== 'review').map(s => {
      const val = bp[s.key] as string[];
      return { title: s.title, items: val || [], count: val?.length || 0 };
    });
  }

  // Generated documents view
  if (generated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Generated Documents</h2>
        <div className="space-y-6">
          {Object.entries(generated).map(([key, content]) => (
            <details className="bg-white rounded-xl border border-gray-200" open={key === 'prd'}>
              <summary className="px-5 py-3 cursor-pointer font-semibold text-gray-800 hover:bg-gray-50 rounded-xl">
                {key === 'prd' ? 'PRD' : key === 'readme' ? 'README' : key === 'apiSpec' ? 'API Specification' : 'Database Design'}
              </summary>
              <div className="px-5 pb-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg">{content}</pre>
              </div>
            </details>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => { setGenerated(null); handleSave(); }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Save Blueprint
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top bar with back button and step indicator */}
      <div className="flex items-center justify-between mb-6">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Dashboard</span>
        </button>
        <div className="text-sm text-gray-400">
          Step {stepOrder.indexOf(step) + 1} of {stepOrder.length}
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar bp={bp} current={step} />

      {/* Three-column layout */}
      <div className="flex gap-6 mt-6">
        {/* Left: Step navigation */}
        <nav className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sections</span>
            </div>
            <div className="py-1">
              {stepOrder.map(s => {
                const idx = stepOrder.indexOf(s);
                const currentIdx = stepOrder.indexOf(step);
                const filled = isStepFilled(bp, s);
                const isPast = idx < currentIdx;
                const isCurrent = s === step;
                const isClickable = idx <= currentIdx + 1;

                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => isClickable && goToStep(s)}
                    disabled={!isClickable}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 text-blue-700'
                        : isClickable
                          ? 'text-gray-600 hover:bg-gray-50'
                          : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      filled
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {filled ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        stepIcons[s]
                      )}
                    </span>
                    <span className="text-sm font-medium">{stepLabels[s]}</span>
                    {filled && !isCurrent && (
                      <svg className="w-3.5 h-3.5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Center: Main content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Basics step */}
            {step === 'basics' && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Project Basics</h2>
                <p className="text-gray-500 mb-6">Tell us about your project</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name</label>
                    <input
                      type="text"
                      value={bp.name}
                      onInput={e => updateField('name', (e.target as HTMLInputElement).value)}
                      placeholder="My Awesome Project"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={bp.description}
                      onInput={e => updateField('description', (e.target as HTMLInputElement).value)}
                      placeholder="A brief description of your project"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {section?.options.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSingleOption('projectType', opt)}
                          className={`p-3.5 rounded-lg border-2 text-center transition-all ${
                            bp.projectType === opt
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:shadow-sm'
                          }`}
                        >
                          <div className="font-medium text-sm">{opt}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tech selection steps */}
            {step !== 'basics' && step !== 'review' && section && (
              <div>
                <h2 className="text-2xl font-bold mb-1">{section.title}</h2>
                <p className="text-gray-500 mb-4">{section.description}</p>

                <SearchBar value={search} onChange={setSearch} />

                {recommendations.length > 0 && step === 'features' && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-sm font-medium text-purple-800 mb-1.5">Recommended</div>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.slice(0, 3).map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => toggleOption(section.key, r)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                            (bp[section.key] as string[])?.includes(r)
                              ? 'bg-purple-200 border-purple-300 text-purple-800'
                              : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'
                          }`}
                        >
                          + {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredOptions.map(opt => (
                    <OptionCard
                      key={opt}
                      name={opt}
                      selected={(bp[section.key] as string[])?.includes(opt) || false}
                      onToggle={() => toggleOption(section.key, opt)}
                    />
                  ))}
                  {filteredOptions.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No options match your search</p>
                  )}
                </div>
              </div>
            )}

            {/* Review step */}
            {step === 'review' && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Review Your Blueprint</h2>
                <p className="text-gray-500 mb-6">Review your selections before generating documents</p>

                {validation.length > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <h3 className="font-semibold text-amber-800">Issues Found</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {validation.map((iss, i) => (
                        <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                          <span className="mt-0.5 shrink-0 font-bold">
                            {iss.type === 'missing' ? '!' : iss.type === 'conflict' ? '!' : '?'}
                          </span>
                          <span>{iss.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendations.length > 0 && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h3 className="font-semibold text-purple-800">AI Recommendations</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {recommendations.map((r, i) => (
                        <li key={i} className="text-sm text-purple-700 flex items-start gap-2">
                          <span className="text-purple-400 mt-0.5">*</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 divide-y overflow-hidden">
                  {sections.filter(s => s.id !== 'basics').map(s => {
                    const val = bp[s.key] as string[];
                    return (
                      <div key={s.id} className="px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-medium text-gray-700">{s.title}</span>
                        <div className="flex flex-wrap gap-1.5 justify-end ml-4 max-w-[60%]">
                          {val?.length > 0 ? val.map(v => (
                            <span key={v} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{v}</span>
                          )) : (
                            <span className="text-xs text-gray-400 italic">Not set</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Project basics summary */}
                  <div className="px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-700">Project</span>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-gray-900">{bp.name || <span className="italic text-gray-400 font-normal">Not set</span>}</div>
                      {bp.projectType && <div className="text-xs text-gray-500">{bp.projectType}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary panel */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-20">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selection Summary</span>
            </div>
            <div className="divide-y divide-gray-100">
              {sidebarSelectionSummary().map(({ title, items, count }) => (
                <div key={title} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">{title}</span>
                    {count > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">{count}</span>
                    )}
                  </div>
                  {items.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {items.slice(0, 4).map(item => (
                        <span key={item} className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded truncate max-w-full">{item}</span>
                      ))}
                      {items.length > 4 && (
                        <span className="text-[11px] text-gray-400">+{items.length - 4}</span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 text-[11px] text-gray-300 italic">None selected</div>
                  )}
                </div>
              ))}
            </div>
            {/* Project info in sidebar */}
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
              <div className="text-xs text-gray-500 truncate">
                {bp.name ? (
                  <span className="font-medium text-gray-700">{bp.name}</span>
                ) : (
                  <span className="italic">Unnamed project</span>
                )}
              </div>
              {bp.projectType && (
                <div className="text-xs text-gray-400 mt-0.5">{bp.projectType}</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky action bar */}
      {step !== 'review' && (
        <div className="sticky bottom-0 mt-6 bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-lg">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepOrder.indexOf(step) === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 text-sm font-medium transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={goNext}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
          >
            {stepOrder.indexOf(step) === stepOrder.length - 2 ? 'Review' : 'Next'}
          </button>
        </div>
      )}

      {/* Review action bar */}
      {step === 'review' && (
        <div className="sticky bottom-0 mt-6 bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-lg">
          <button
            type="button"
            onClick={goPrev}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
            >
              Generate Documents
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
