const STORAGE_KEY = 'bb-draft';
const LOG_KEY = 'bb-debug-log';

export function saveDraft(data: unknown) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[storage] Failed to save draft', e);
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('[storage] Failed to load draft', e);
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('[storage] Failed to clear draft', e);
  }
}

export function addDebugLog(entry: unknown) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    existing.push({ ts: new Date().toISOString(), data: entry });
    if (existing.length > 100) existing.splice(0, existing.length - 100);
    localStorage.setItem(LOG_KEY, JSON.stringify(existing));
  } catch {
    /* best effort */
  }
}

export function getDebugLog(): unknown[] {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearDebugLog() {
  try {
    localStorage.removeItem(LOG_KEY);
  } catch {
    /* noop */
  }
}
