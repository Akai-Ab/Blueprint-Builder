const STORAGE_KEY = 'bb-draft';

export function saveDraft(data: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
