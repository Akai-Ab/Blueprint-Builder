import { useState, useEffect } from 'react';
import type { Blueprint, BuilderStep, ValidationIssue } from '../types';
import { sections } from '../data/options';
import ProgressBar from '../components/ProgressBar';
import SearchBar from '../components/SearchBar';
import OptionCard from '../components/OptionCard';
import { useToast } from '../components/Toast';
import { saveDraft, loadDraft } from '../utils/storage';
import { api, ApiError } from '../utils/api';

const stepOrder: BuilderStep[] = [
  'basics', 'platforms', 'frontend', 'backend',
  'database', 'features', 'integrations', 'quality', 'review'
];

const stepLabels: Record<BuilderStep, string> = {
  basics: 'Basics', platforms: 'Platforms', frontend: 'Frontend',
  backend: 'Backend', database: 'Database', features: 'Features',
  integrations: 'Integrations', quality: 'Quality', review: 'Review'
};

function getSection(step: BuilderStep) {
  return sections.find(s => s.id === step) || null;
}

const emptyBp: Blueprint = {
  name: '', description: '', projectType: '', platforms: [],
  frontend: [], backend: [], mobile: [], desktop: [],
  database: [], storage: [], orm: [], authentication: [],
  hosting: [], cdn: [], cache: [], queue: [], search: [],
  monitoring: [], features: [], integrations: [], quality: []
};

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
    return draft && !initialBp ? { ...emptyBp, ...draft } : (initialBp || { ...emptyBp });
  });
  const [step, setStep] = useState<BuilderStep>(() => {
    return initialBp ? 'review' : 'basics';
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [validation, setValidation] = useState<ValidationIssue[]>([]);
  const [generated, setGenerated] = useState<Record<string, string> | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();

  useEffect(() => { saveDraft(bp); }, [bp]);

  async function fetchRecommendations() {
    setLoading(prev => ({ ...prev, recs: true }));
    try {
      const recs = await api<string[]>('/api/recommendations', {
        method: 'POST', body: JSON.stringify(bp), log: 'recommendations'
      });
      setRecommendations(recs);
    } catch {
      toast('warning', 'Failed to load recommendations');
    } finally {
      setLoading(prev => ({ ...prev, recs: false }));
    }
  }

  async function handleValidate(): Promise<boolean> {
    setLoading(prev => ({ ...prev, validate: true }));
    try {
      const result = await api<{ valid: boolean; issues: ValidationIssue[] }>('/api/validate', {
        method: 'POST', body: JSON.stringify(bp), log: 'validate'
      });
      setValidation(result.issues);
      return result.valid;
    } catch {
      toast('warning', 'Validation service unavailable');
      return false;
    } finally {
      setLoading(prev => ({ ...prev, validate: false }));
    }
  }

  async function handleGenerate() {
    setLoading(prev => ({ ...prev, generate: true }));
    try {
      const docs = await api<Record<string, string>>('/api/generate', {
        method: 'POST', body: JSON.stringify(bp), log: 'generate'
      });
      setGenerated(docs);
      toast('success', 'Documents generated successfully');
    } catch (e) {
      toast('error', e instanceof ApiError ? e.message : 'Failed to generate documents');
    } finally {
      setLoading(prev => ({ ...prev, generate: false }));
    }
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
  const stepIdx = stepOrder.indexOf(step);

  async function goNext() {
    if (step === 'basics' && !bp.name?.trim()) {
      toast('warning', 'Please enter a project name');
      return;
    }
    if (step === 'basics' && !bp.projectType) {
      toast('warning', 'Please select a project type');
      return;
    }
    if (stepIdx < stepOrder.length - 1) {
      const next = stepOrder[stepIdx + 1];
      setStep(next);
      setSearch('');
      if (next === 'review') {
        fetchRecommendations();
        handleValidate();
      }
    }
  }

  function goPrev() {
    if (stepIdx > 0) {
      setStep(stepOrder[stepIdx - 1]);
      setSearch('');
    }
  }

  async function handleSave() {
    onSave({ ...bp, updatedAt: new Date().toISOString() });
  }

  function stepIsComplete(s: BuilderStep): boolean {
    if (s === 'review') return false;
    const key = s === 'basics' ? 'projectType' : s;
    const val = bp[key as keyof Blueprint];
    return Array.isArray(val) ? val.length > 0 : Boolean(val);
  }

  const generatedTabs = [
    { key: 'prd', label: 'PRD' },
    { key: 'readme', label: 'README' },
    { key: 'apiSpec', label: 'API Spec' },
    { key: 'databaseDesign', label: 'Database Design' },
  ];

  if (generated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Generated Documents</h2>
          <button
            type="button"
            onClick={() => setGenerated(null)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Back to Review
          </button>
        </div>
        <div className="space-y-4">
          {generatedTabs.map(({ key, label }) => {
            const content = generated[key];
            if (!content) return null;
            return (
              <details className="bg-white rounded-xl border border-gray-200 overflow-hidden" open={key === 'prd'}>
                <summary className="px-5 py-3.5 cursor-pointer font-semibold text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <svg className={`w-4 h-4 ${key === 'prd' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {label}
                </summary>
                <div className="px-5 pb-4 border-t border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg mt-3 overflow-x-auto">{content}</pre>
                </div>
              </details>
            );
          })}
        </div>
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => { setGenerated(null); onSave(bp); }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all font-medium shadow-sm"
          >
            Save Blueprint
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-[0.97] transition-all text-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          title="Back to dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm">
            {stepOrder.map((s, i) => (
              <div key={s} className="flex items-center">
                <button
                  type="button"
                  onClick={() => i < stepIdx ? setStep(s) : undefined}
                  disabled={i > stepIdx}
                  className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
                    i === stepIdx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : stepIsComplete(s)
                        ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                  title={stepLabels[s]}
                >
                  {stepIsComplete(s) && i !== stepIdx ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </button>
                {i < stepOrder.length - 1 && (
                  <div className={`w-4 h-0.5 mx-0.5 rounded-full ${i < stepIdx ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowDebug(!showDebug)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all text-xs font-mono"
          title="Toggle debug panel"
        >
          {'{ }'}
        </button>
      </div>

      <div className="mb-2 text-center">
        <span className="text-sm font-medium text-gray-500">
          Step {stepIdx + 1} of {stepOrder.length}: {stepLabels[step]}
        </span>
      </div>

      <ProgressBar bp={bp} current={step} />

      {showDebug && (
        <div className="mb-6 p-4 bg-gray-900 text-gray-100 rounded-xl text-xs font-mono overflow-auto max-h-64 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 font-semibold">Debug Panel</span>
            <button
              type="button"
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(bp, null, 2)}</pre>
        </div>
      )}

      <div key={step} className="animate-fade-in-up">
        {step === 'basics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Basics</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2.5">Project Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {section?.options.map(opt => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setSingleOption('projectType', opt)}
                      className={`p-3.5 rounded-lg border-2 text-center transition-all active:scale-[0.97] ${
                        bp.projectType === opt
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step !== 'basics' && step !== 'review' && section && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h2>
            <p className="text-gray-500 mb-4">{section.description}</p>

            <SearchBar value={search} onChange={setSearch} />

            {loading.recs && recommendations.length === 0 && step === 'features' && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <div className="spinner w-4 h-4 inline-block" />
                  Loading recommendations...
                </div>
              </div>
            )}

            {recommendations.length > 0 && step === 'features' && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg animate-fade-in">
                <div className="text-sm font-medium text-purple-800 mb-1.5">Recommended for you</div>
                <div className="flex flex-wrap gap-1.5">
                  {recommendations.slice(0, 3).map(r => {
                    const selected = (bp[section.key] as string[])?.includes(r);
                    return (
                      <button
                        type="button"
                        key={r}
                        onClick={() => toggleOption(section.key, r)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          selected
                            ? 'bg-purple-200 border-purple-300 text-purple-800'
                            : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300'
                        }`}
                      >
                        {selected ? '✓' : '+'} {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid gap-3">
              {filteredOptions.map(opt => (
                <OptionCard
                  key={opt}
                  name={opt}
                  selected={(bp[section.key] as string[])?.includes(opt) || false}
                  onToggle={() => toggleOption(section.key, opt)}
                />
              ))}
              {filteredOptions.length === 0 && (
                <p className="text-gray-400 text-center py-8 animate-fade-in">No options match your search</p>
              )}
            </div>

            {section.dependsOn && (
              <p className="text-xs text-gray-400 mt-3">
                This section is available based on your previous selections
              </p>
            )}
          </div>
        )}

        {step === 'review' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Review Your Blueprint</h2>
            <p className="text-gray-500 mb-6">Review your selections before generating documents</p>

            {(loading.validate || loading.recs) && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="spinner w-5 h-5 text-blue-500 inline-block" />
                  {loading.validate ? 'Validating blueprint...' : 'Fetching recommendations...'}
                </div>
              </div>
            )}

            {validation.length > 0 && !loading.validate && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="font-semibold text-amber-800">Issues Found</h3>
                </div>
                <ul className="space-y-1.5">
                  {validation.map((iss, i) => (
                    <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-amber-200 text-amber-700 text-xs flex items-center justify-center font-bold">
                        {iss.type === 'missing' ? '!' : iss.type === 'conflict' ? '✗' : '?'}
                      </span>
                      <span>{iss.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validation.length === 0 && !loading.validate && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">No issues found</span>
                </div>
              </div>
            )}

            {recommendations.length > 0 && !loading.recs && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="font-semibold text-purple-800">AI Recommendations</h3>
                </div>
                <ul className="space-y-1.5">
                  {recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-purple-700 flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5 shrink-0">•</span>
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
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-700">{s.title}</span>
                    <div className="flex flex-wrap gap-1 justify-end ml-4 max-w-md">
                      {val?.length > 0 ? val.map(v => (
                        <span key={v} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{v}</span>
                      )) : (
                        <span className="text-xs text-gray-400 italic">Not set</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading.generate}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading.generate ? (
                  <>
                    <div className="spinner w-4 h-4 inline-block" />
                    Generating...
                  </>
                ) : (
                  'Generate Documents'
                )}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-[0.97] transition-all text-gray-700"
              >
                Save Draft
              </button>
            </div>
          </div>
        )}
      </div>

      {step !== 'review' && (
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIdx === 0}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <span className="text-xs text-gray-400 self-center">
            {stepIdx + 1} / {stepOrder.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all font-medium shadow-sm flex items-center gap-1.5"
          >
            {stepIdx === stepOrder.length - 1 ? 'Review' : 'Next'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
