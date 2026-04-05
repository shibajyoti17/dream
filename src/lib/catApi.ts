/**
 * The Cat API — https://api.thecatapi.com/v1/
 * Key: set VITE_CAT_API_KEY in .env.local (see .env.example).
 */

const BASE = "https://api.thecatapi.com/v1";

export function getCatApiKey(): string | undefined {
  const k = import.meta.env.VITE_CAT_API_KEY;
  return typeof k === "string" && k.trim().length > 0 ? k.trim() : undefined;
}

export type CatImage = {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Array<{
    name: string;
    temperament?: string;
    origin?: string;
    description?: string;
  }>;
};

export type Breed = {
  id: string;
  name: string;
  description: string;
  temperament: string;
  origin: string;
  life_span: string;
};

function headers(): HeadersInit {
  const key = getCatApiKey();
  if (!key) throw new Error("MISSING_API_KEY");
  return { "x-api-key": key };
}

export async function fetchCatImages(
  params: Record<string, string | number | undefined>
): Promise<CatImage[]> {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const res = await fetch(`${BASE}/images/search?${q}`, { headers: headers() });
  if (!res.ok) throw new Error(`IMAGES_${res.status}`);
  return res.json() as Promise<CatImage[]>;
}

export async function fetchBreeds(): Promise<Breed[]> {
  const res = await fetch(`${BASE}/breeds`, { headers: headers() });
  if (!res.ok) throw new Error(`BREEDS_${res.status}`);
  return res.json() as Promise<Breed[]>;
}

/** Deterministic index from calendar day string `YYYY-MM-DD`. */
export function indexForDay(dayKey: string, modulo: number): number {
  if (modulo <= 0) return 0;
  let h = 0;
  for (let i = 0; i < dayKey.length; i++) {
    h = (Math.imul(31, h) + dayKey.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}

export function calendarDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
