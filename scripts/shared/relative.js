import { sep, relative as relativePath } from 'path';

// Makes sure there is an explicit ./ to avoid accidental bare import specifiers
export default function relative(dir, path) {
  let p = relativePath(dir, path);

  if (p.startsWith('.'+sep) || p.startsWith('..'+sep)) return p;
  return '.'+sep+p;
}
