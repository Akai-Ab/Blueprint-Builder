const logPrefix = '[API]';

export async function api<T = unknown>(path: string, options?: RequestInit & { log?: string }): Promise<T> {
  const label = options?.log || path;
  console.debug(`${logPrefix} → ${label}`, options?.body ? { body: truncate(options.body as string, 200) } : '');

  try {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const msg = `HTTP ${res.status}${body ? `: ${truncate(body, 150)}` : ''}`;
      console.error(`${logPrefix} ✗ ${label} — ${msg}`);
      throw new ApiError(msg, res.status);
    }

    const data: T = res.status === 204 ? null as T : await res.json();
    console.debug(`${logPrefix} ← ${label}`, res.status);
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`${logPrefix} ✗ ${label} — network error: ${msg}`);
    throw new ApiError(`Network error: ${msg}`, 0);
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max) + '…' : s;
}
