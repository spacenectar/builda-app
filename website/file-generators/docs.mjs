#! /usr/bin/env node

/**
 * This file automatically generates the MDX docs for storybook from any
 * markdown files in the '/docs' directory or any file added to the
 * 'includes' array.
 */

import {
  statSync,
  readdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  rmSync
} from 'fs';
import { join, resolve, basename, dirname } from 'path';
import camelCase from 'camelcase';

// Replaces old CJS __dirname with variable mapped to project root
const __dirname = dirname(resolve('./package.json'));

const includes = ['README.md', './docs'];

const output = resolve(__dirname, '.storybook/.docs');

const rootReadMe = `
# What's this?

This folder is where the MDX versions of the files in the docs folder are stored.
It is automatically generated by by the 'gendocs' script and can safely
be ignored.
`;

const formatName = (fileName) => {
  return camelCase(fileName, { pascalCase: true })
    .replace(/([A-Z][a-z])/g, ' $1')
    .replace(/(\d)/g, ' $1')
    .trim();
};
// read all files in the includes array and if they are markdown files, process them
// if it s a directory, recursively read all files in the directory and start again
const recurseDirectories = (file) => {
  if (statSync(file).isDirectory()) {
    const dirs = readdirSync(file);
    return dirs.forEach((dir) => recurseDirectories(join(file, dir)));
  }

  const filePath = resolve(__dirname, file);
  const baseFileName = basename(filePath);

  if (statSync(filePath).isFile() && file.endsWith('.mdx')) {
    // don't process the file, just rename and move it
    console.log(file);
    return copyFileSync(
      filePath,
      resolve(__dirname, output, baseFileName.replace('.mdx', '.stories.mdx'))
    );
  }

  const fileContents = readFileSync(filePath, 'utf8');
  let dirName = filePath
    .replace(`/${baseFileName}`, '')
    .replace(__dirname, '')
    .replace(`/docs/`, '')
    .trim();

  dirName = formatName(dirName);
  let pageTitle = baseFileName.replace('.md', '');
  pageTitle = formatName(pageTitle);

  pageTitle === 'Readme' && (pageTitle = 'Introduction');
  pageTitle === 'Index' && (pageTitle = 'Introduction');

  const metaTitle = dirName ? `${dirName}/${pageTitle}` : pageTitle;

  let convertedContent = `import { Meta, Description } from '@storybook/addon-docs';\n\n`;
  convertedContent += `<Meta title="Docs/${metaTitle}" />\n\n`;
  fileContents.split('\n').forEach((line) => {
    const regex = /\[([\Ss ]+)\]\((.\/[a-z-/]+.md)\)/;
    if (regex.test(line)) {
      const [, , link] = line.match(regex);
      const directory = dirName.replace(' ', '-').toLowerCase();
      let convertedLink = link
        .replace(/\.\/(docs)?\/*/, '@temp@')
        .replace(/\//g, '-')
        .replace('.md', '--page');
      if (!directory) {
        convertedLink = convertedLink.replace('@temp@', '?path=/story/docs-');
      } else {
        convertedLink = convertedLink.replace(
          '@temp@',
          `?path=/story/docs-${directory}-`
        );
      }

      const newLine = line.replace(link, convertedLink);

      convertedContent += newLine + '\n';
    } else {
      convertedContent += line + '\n';
    }
  });

  let fileName = '';
  if (baseFileName === 'README.md') {
    fileName = 'introduction.stories.mdx';
  } else {
    fileName = baseFileName
      .replace('.md', '.stories.mdx')
      .replace('_', '-')
      .toLowerCase();
  }
  // Output the file to the output folder
  writeFileSync(resolve(__dirname, output, fileName), convertedContent, 'utf8');
};

// Execute the script
(function () {
  // Check the output dir exists and create it if not
  if (!existsSync(resolve(__dirname, output))) {
    mkdirSync(resolve(__dirname, output));
  } else {
    // If the output dir exists, delete all files in it so we can start fresh
    rmSync(resolve(__dirname, output), { force: true, recursive: true });
    mkdirSync(resolve(__dirname, output));
  }
  // Create the root README file
  writeFileSync(resolve(__dirname, output, 'README.md'), rootReadMe, 'utf8');

  // Process the includes array
  return includes.map((d) => recurseDirectories(d));
})();
