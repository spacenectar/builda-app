#! /usr/bin/env node

import fs from 'node:fs';
import path from 'path';
import { ConfigFile } from 'types/config-file';
import printMessage from '../../helpers/print-message';
import { generateLines } from './helpers/generate-lines';

const message = `/**
 This file is autogenerated by Builda, please do not edit it.
 To generate an updated version, please run \`builda index\`
 **/`;

/**
 * Automatically generates the index registries for all directories specified in `directories` below. It runs automatically when `yarn preflight` runs or you can run it via `yarn genreg`
 */
export default (config: ConfigFile) => {
  const { indexes } = config;

  const { directories, indexExt } = indexes;

  const ext = indexExt || 'ts';

  directories.forEach((directory) => {
    let checkedDir = directory;
    let subdirs = [];
    let lines = '';

    if (directory.includes('*')) {
      checkedDir = directory.replace('/*', '');
      // scan directory for subdirectories
      subdirs = fs.readdirSync(path.resolve(checkedDir));
      subdirs.forEach((dir) => {
        const pathString = path.resolve(`${checkedDir}/${dir}`);
        return (lines += `${generateLines({
          directory: pathString,
          parent: dir
        })}\n`);
      });
    } else {
      lines = generateLines({ directory });
    }

    const fileContents = `${message}\n\n${lines}`;
    if (lines) {
      fs.writeFileSync(path.resolve(checkedDir, `index.${ext}`), fileContents);
    }
  });

  printMessage('Generating indexes', 'config');
};