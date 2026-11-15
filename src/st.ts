// Transforme un style CSS écrit en texte ("left: 10px; top: 4px") en objet React.
const cache = new Map<string, Record<string, string>>();
export function st(css: string): Record<string, string> {
  const hit = cache.get(css);
  if (hit) return hit;
  const out: Record<string, string> = {};
  css.split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop) return;
    const key = prop.startsWith('--') ? prop : prop.replace(/^-webkit-/, 'Webkit-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = val;
  });
  if (cache.size < 2000) cache.set(css, out);
  return out;
}
