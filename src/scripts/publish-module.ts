#! /usr/bin/env node

import fs from 'node:fs';
import tar from 'tar';

import { simpleGit } from 'simple-git';

import getRegistry from 'helpers/get-registry';
import printMessage from 'helpers/print-message';

/**
 * Packages a module and publishes it to the repository and optionally to the trade store.
 */
const checkPathExists = (pathString: string, isDir?: boolean) => {
  // For now, just check if the README file exists
  if (!fs.existsSync(pathString)) {
    return {
      error: true,
      message: `Cannot find ${
        isDir && 'a folder called'
      } '${pathString}' in the current directory.`
    };
  }

  return {
    error: false,
    message: ''
  };
};

const publishToTradeStore = async () => {
  // TODO: Publish to trade store
  return true;
};

export const publishModule = async (updateVersion?: string) => {
  const registry = await getRegistry();
  const { name, type, version, tradeStore } = registry;

  const REGISTRYFILE = 'registry.json';
  const READMEFILE = 'README.md';
  const FILESFOLDER = 'files';

  if (!registry) {
    return printMessage(
      `No ${REGISTRYFILE} file found. Publish can only be ran in the context of a module`,
      'danger'
    );
  }

  if (!name) {
    return printMessage(
      `No name entry found in ${REGISTRYFILE}. Please add one.\r`,
      'danger'
    );
  }

  if (!type) {
    return printMessage(
      `No type entry found in ${REGISTRYFILE}. Please add one.\r`,
      'danger'
    );
  }

  if (!version && !updateVersion) {
    return printMessage(
      `No version entry found in ${REGISTRYFILE}. Please add one.\r`,
      'danger'
    );
  }

  if (!tradeStore) {
    printMessage(
      `No tradeStore entry found in ${REGISTRYFILE}.\nThis module will not be published to the Builda Trade Store (https://builda.app/trade-store).\r`,
      'info'
    );
  }

  const validateFileFolder = checkPathExists(FILESFOLDER, true);

  if (validateFileFolder.error) {
    return printMessage(validateFileFolder.message, 'danger');
  }

  const isCorrectlyPrefixed = name.startsWith(`${type}-`);

  if (!isCorrectlyPrefixed) {
    return printMessage(
      `The name entry in ${REGISTRYFILE} must be prefixed with ${type}-.\r`,
      'danger'
    );
  }

  const validateReadme = checkPathExists(READMEFILE);

  if (validateReadme.error) {
    return printMessage(validateReadme.message, 'error');
  }

  const git = simpleGit();

  if (!git.checkIsRepo()) {
    return printMessage(
      `This is not a git repository. Please initialise git and try again.\r`,
      'danger'
    );
  }

  const status = await git.status();

  if (!status.isClean()) {
    return printMessage(
      `The git repository is not clean. Please commit all changes and try again.\r`,
      'danger'
    );
  }

  printMessage('All checks passed.', 'success');

  const newVersion = updateVersion?.replace('v', '') || version;

  const newRegistry = {
    ...registry,
    version: newVersion
  };

  const newRegistryString = JSON.stringify(newRegistry, null, 2);

  fs.writeFileSync(REGISTRYFILE, newRegistryString);

  // Package the files folder into a tarball
  printMessage(`Packaging ${name}...`, 'processing');
  // If there is already a tarball, delete it
  if (fs.existsSync('files.tgz')) {
    fs.unlinkSync('files.tgz');
  }

  // Create the tarball
  await tar.create(
    {
      file: `${FILESFOLDER}.tgz`,
      gzip: true,
      cwd: FILESFOLDER
    },
    fs.readdirSync(FILESFOLDER)
  );
  printMessage('Package created', 'success');

  // Add new tarball to git
  printMessage(`Adding ${FILESFOLDER}.tgz to git...`, 'processing');
  await git.add(`${FILESFOLDER}.tgz`);
  await git.commit(`Adds updated ${FILESFOLDER}.tgz`);
  printMessage('Added to git', 'success');
  printMessage('Tagging the latest commit...', 'processing');
  // If tag already exists, throw an error
  const tagList = await git.tags();
  const tagExists =
    tagList.all.includes(newVersion) || tagList.all.includes(`v${newVersion}`);
  if (tagExists) {
    return printMessage(
      `A tag with the version number v${newVersion} already exists. Please update the version number in ${REGISTRYFILE} and try again.\r`,
      'error'
    );
  }
  // Tag the commit with the current version number
  await git.addTag(`v${newVersion}`);
  let tagString = 'tags';
  if (registry.prerelease) {
    printMessage(
      'Prerelease entry found in registry.json. Skipping latest tag...',
      'info'
    );
    tagString = 'tag';
  } else {
    // Check if the remote has a latest tag
    const remoteTags = await git.listRemote(['--tags']);
    const remoteTagExists = remoteTags.includes('refs/tags/latest');
    const localTags = await git.tags();
    const localTagExists = localTags.all.includes('latest');
    if (remoteTagExists || localTagExists) {
      // Remove the 'latest' tag
      await git.tag(['--delete', 'latest']);
      // Remove the remote 'latest' tag
      await git.push(['origin', '--delete', 'latest']);
    }
    // Tag the commit with latest
    await git.addTag('latest');
  }
  // Push the tags to the remote
  await git.pushTags('origin');
  printMessage(`${tagString} created.`, 'success');
  printMessage('Pushing changes to git...', 'processing');
  // Push the changes to git
  await git.push();
  printMessage('Changes pushed to git.', 'success');

  // Publish to trade store if 'tradeStore' is true
  if (tradeStore) {
    printMessage('Publishing to the Builda Trade Store...', 'processing');
    publishToTradeStore();
  }

  return printMessage('Module published.', 'success');
};

if (require.main === module) {
  publishModule();
}

export default publishModule;
