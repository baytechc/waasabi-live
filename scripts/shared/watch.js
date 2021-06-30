// Created by Luke Jackson for Servør
// https://github.com/lukejacksonn/servor

import fs from 'fs';

export default process.platform !== 'linux'
    ? (x, cb) => fs.watch(x, { recursive: true }, cb)
    : (x, cb) => {
        if (fs.statSync(x).isDirectory()) {
          fs.watch(x, cb);
          fs.readdirSync(x).forEach((xx) => fileWatch(`${x}/${xx}`, cb));
        }
      };
