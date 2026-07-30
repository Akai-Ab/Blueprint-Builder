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

function getSection(step: BuilderStep) {
  return sections.find(s => s.id === step) || null;
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

  async function handleSave() {
    onSave({ ...bp, updatedAt: new Date().toISOString() });
  }

  if (generated) {
    return (
      <div class="max-w-4xl mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">Generated Documents</h2>
        <div class="space-y-6">
          {Object.entries(generated).map(([key, content]) => (
            <details class="bg-white rounded-xl border border-gray-200" open={key === 'prd'}>
              <summary class="px-5 py-3 cursor-pointer font-semibold text-gray-800 hover:bg-gray-50 rounded-xl">
                {key === 'prd' ? 'PRD' : key === 'readme' ? 'README' : key === 'apiSpec' ? 'API Specification' : 'Database Design'}
              </summary>
              <div class="px-5 pb-4">
                <pre class="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg">{content}</pre>
              </div>
            </details>
          ))}
        </div>
        <div class="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => { setGenerated(null); onSave(bp); }}
            class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Save Blueprint
          </button>
          <button
            type="button"
            onClick={onBack}
            class="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-4">
        <button type="button" onClick={onBack} class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex gap-2">
          {[stepOrder.indexOf(step) + 1, stepOrder.length].join(' / ')}
        </div>
      </div>

      <ProgressBar bp={bp} current={step} />

      {step === 'basics' && (
        <div>
          <h2 class="text-2xl font-bold mb-2">Project Basics</h2>
          <p class="text-gray-500 mb-6">Tell us about your project</p>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={bp.name}
                onInput={e => updateField('name', (e.target as HTMLInputElement).value)}
                placeholder="My Awesome Project"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={bp.description}
                onInput={e => updateField('description', (e.target as HTMLInputElement).value)}
                placeholder="A brief description of your project"
                rows={3}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {section?.options.map(opt => (
                  <button
                    type="button"
                    onClick={() => setSingleOption('projectType', opt)}
                    class={`p-3 rounded-lg border-2 text-center transition-all ${
                      bp.projectType === opt
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          <h2 class="text-2xl font-bold mb-1">{section.title}</h2>
          <p class="text-gray-500 mb-4">{section.description}</p>

          <SearchBar value={search} onChange={setSearch} />

          {recommendations.length > 0 && step === 'features' && (
            <div class="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div class="text-sm font-medium text-purple-800 mb-1">Recommended</div>
              <div class="flex flex-wrap gap-2">
                {recommendations.slice(0, 3).map(r => (
                  <button
                    type="button"
                    onClick={() => toggleOption(section.key, r)}
                    class={`text-xs px-2.5 py-1 rounded-full border ${
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

          <div class="grid gap-3">
            {filteredOptions.map(opt => (
              <OptionCard
                key={opt}
                name={opt}
                selected={(bp[section.key] as string[])?.includes(opt) || false}
                onToggle={() => toggleOption(section.key, opt)}
              />
            ))}
            {filteredOptions.length === 0 && (
              <p class="text-gray-400 text-center py-8">No options match your search</p>
            )}
          </div>
        </div>
      )}

      {step === 'review' && (
        <div>
          <h2 class="text-2xl font-bold mb-1">Review Your Blueprint</h2>
          <p class="text-gray-500 mb-6">Review your selections before generating documents</p>

          {validation.length > 0 && (
            <div class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 class="font-semibold text-amber-800 mb-2">Issues Found</h3>
              <ul class="space-y-1">
                {validation.map((iss, i) => (
                  <li class="text-sm text-amber-700 flex items-start gap-2">
                    <span class="mt-0.5 shrink-0">
                      {iss.type === 'missing' ? '!' : iss.type === 'conflict' ? '!' : '?'}
                    </span>
                    <span>{iss.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 class="font-semibold text-purple-800 mb-2">AI Recommendations</h3>
              <ul class="space-y-1">
                {recommendations.map((r, i) => (
                  <li class="text-sm text-purple-700 flex items-start gap-2">
                    <span class="text-purple-400 mt-0.5">*</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div class="bg-white rounded-xl border border-gray-200 divide-y">
            {sections.filter(s => s.id !== 'basics').map(s => {
              const val = bp[s.key] as string[];
              return (
                <div class="p-4 flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">{s.title}</span>
                  <div class="flex flex-wrap gap-1 justify-end ml-4">
                    {val?.length > 0 ? val.map(v => (
                      <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{v}</span>
                    )) : (
                      <span class="text-xs text-gray-400">Not set</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div class="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleGenerate}
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Generate Documents
            </button>
            <button
              type="button"
              onClick={handleSave}
              class="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Save Draft
            </button>
          </div>
        </div>
      )}

      {step !== 'review' && (
        <div class="flex justify-between mt-8">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepOrder.indexOf(step) === 0}
            class="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {stepOrder.indexOf(step) === stepOrder.length - 1 ? 'Review' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}
