import { fileURLToPath } from 'url';
import { join, dirname, relative, resolve } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../');

export function R(...args) {
  return resolve(ROOT, ...args);
}

export function rel(p) {
  return relative(ROOT, p);
}


export default ROOT;