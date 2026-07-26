// Local-first storage adapter. Replace the two functions with Supabase calls later.
export function readState(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function writeState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Demo fallback: if a browser quota is reached, keep the in-memory state alive.
  }
}
