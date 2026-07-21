// Shared by every POST endpoint that reads a JSON body — Vercel's default
// body parser occasionally hands the handler a raw string instead of an
// already-parsed object, so each endpoint falls back to parsing it here.
// Prefixed with an underscore so Vercel doesn't treat this file as its own
// route.
export function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}
