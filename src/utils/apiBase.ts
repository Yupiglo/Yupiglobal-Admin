export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

export const buildApiUrl = (path: string): string => {
  const clean = path.replace(/^\//, "");
  return `${API_BASE_URL}/${clean}`;
};

export const buildAssetUrl = (path: string): string => {
  const raw = (path ?? "").toString().trim();
  if (!raw) return raw;

  if (raw.startsWith("data:")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  const clean = raw.replace(/^\//, "");

  try {
    const origin = new URL(API_BASE_URL).origin;
    return `${origin}/${clean}`;
  } catch {
    const fallbackOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
    return `${fallbackOrigin}/${clean}`;
  }
};
