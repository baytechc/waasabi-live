import fs from 'fs-extra';
import path from 'path';

async function copy(source, dest) {
  const targetdir = path.join(dest, path.basename(source));

  await fs.emptyDir(targetdir);
  await fs.copy(source, targetdir);
}

function copySync(source, dest) {
  if (fs.statSync(source).isDirectory()) {
    const targetdir = path.join(dest, path.basename(source));

    fs.emptyDirSync(targetdir);
    fs.copySync(source, targetdir);
  } else {
    const targetfile = path.join(dest, path.basename(source));

    fs.ensureDirSync(dest);
    fs.copySync(source, targetfile);
  }
}

function copyContentsSync(source, dest) {
  fs.copySync(source, dest);
}

export {
  copy as default,
  copy,
  copySync,
  copyContentsSync,
}