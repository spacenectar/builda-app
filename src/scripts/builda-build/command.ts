import { getConfigFile, throwError } from 'helpers';
import yargs from 'yargs';
import chalk from 'chalk';

import buildaBuild from './build';

export default () => {
  return {
    command: chalk.green('build'),
    desc: chalk.white('Build your project'),
    aliases: ['-b', '--build'],
    builder: (yargs: yargs.Argv): yargs.Argv<unknown> => {
      return yargs
        .option('prod', {
          aliases: ['p', 'production'],
          default: '',
          describe:
            'Build for production. This will minify the output and remove any debug code',
          type: 'boolean'
        })
        .option('onlyPath', {
          describe: 'If you want to build from a specific path',
          type: 'string'
        })
        .option('configPath', {
          aliases: ['c', 'config'],
          default: '',
          describe: 'The path to a config file',
          type: 'string'
        });
    },
    handler: async (argv: any) => {
      const config = await getConfigFile(argv.configPath);
      if (config) {
        return buildaBuild({
          config,
          onlyPath: argv.onlyPath,
          prod: argv.prod
        });
      }
      throwError('No config file found');
    }
  };
};