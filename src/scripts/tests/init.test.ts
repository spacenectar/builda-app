import fs from 'fs';

import presetAnswers from '@mocks/preset-answers';
import init from '@scripts/init';
import { ConfigFile } from '@typedefs/config-file';
import getConfigFile from '@helpers/get-config-file';

describe('init', () => {
  const CONFIG_FILE = './builda.json';
  let config = {} as ConfigFile;
  beforeAll(async () => {
    await init({ presetAnswers });
    config = await getConfigFile();
  });

  test('A config file is produced', () => {
    expect(fs.existsSync(CONFIG_FILE)).toBe(true);
  });

  test('The config file contains an appName value which reads "test"', () => {
    expect(config.name).toBe('test');
  });

  test('The config file contains an "atom" section with the correct values', () => {
    expect(config.blueprint_scripts.atom).toEqual({
      output_dir: '{{app_root}}/atoms',
      use: 'blueprint-default-ts'
    });
  });

  test('The config file contains an "component" section with the correct values', () => {
    expect(config.blueprint_scripts.component).toEqual({
      output_dir: '{{app_root}}/components',
      use: 'blueprint-default-ts'
    });
  });

  test('The config file contains a "test" section with the correct values', (done) => {
    expect(config.blueprint_scripts.test).toEqual({
      output_dir: '{{app_root}}/tests',
      use: 'blueprint-default-ts'
    });
    setTimeout(() => done(), 2000);
  });
});