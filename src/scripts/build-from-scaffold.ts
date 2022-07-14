import fs from 'fs';

// Import ignorefile
import ignoreFile from '@data/ignore-file.json';

// import helpers
import { getConfigFile } from '@helpers';
import { changeCase } from '@helpers/string-functions';

// Ignore these files
const ignoreFiles = ignoreFile.ignore;

export const buildFromScaffold = async (
  command: string,
  name: string,
  scaffold?: string
) => {
  const config = getConfigFile();

  if (config) {
    const scaffoldPath = scaffold || config.commands[command].scaffoldUrl;
    const outputDirectory = `${
      config.commands[command].outputDirectory
    }/${changeCase(name, 'kebabCase')}`;

    // Create the directory tree if it doesn't exist
    fs.mkdirSync(outputDirectory, { recursive: true });

    // get the directory contents
    const files = fs.readdirSync(scaffoldPath);

    // loop through the files
    files.forEach((file) => {
      // ignore files
      if (ignoreFiles.includes(file)) return;

      // get the file contents
      const fileContents = fs.readFileSync(`${scaffoldPath}/${file}`, 'utf8');

      // replace the each placeholder with the correctly formatted name
      const newContents = fileContents
        .replace(/%TYPE%/g, command)
        .replace(/%KEBAB_CASE%/g, changeCase(name, 'kebabCase'))
        .replace(/%CAMEL_CASE%/g, changeCase(name, 'camelCase'))
        .replace(/%SNAKE_CASE%/g, changeCase(name, 'snakeCase'))
        .replace(/%PASCAL_CASE%/g, changeCase(name, 'pascalCase'))
        .replace(/%SENTENCE_CASE%/g, changeCase(name, 'sentenceCase'));
      // write the new file contents to the output directory
      fs.writeFileSync(`${outputDirectory}/${file}`, newContents);
    });
  }
};

export default buildFromScaffold;
