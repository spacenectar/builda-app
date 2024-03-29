import { getConfig, throwError } from 'helpers';
import yargs from 'yargs';

import buildaNew from './new';

type Args = {
  name: string;
  scriptName: string;
  subString: string;
};

export default () => {
  return {
    command: 'new <scriptName>',
    desc: 'Create something new from a blueprint',
    builder: (yargs: yargs.Argv): yargs.Argv<Args> => {
      return yargs
        .positional('scriptName', {
          describe: 'The blueprint script to run',
          type: 'string',
          default: ''
        })
        .positional('name', {
          describe: 'The name of the new thing',
          type: 'string',
          default: ''
        })
        .option('subString', {
          aliases: ['s', 'sub'],
          default: '',
          describe:
            'A string matcher for the blueprint script. e.g: "%MY_STRING%:\'new string\'"',
          type: 'string'
        });
    },
    handler: async (argv: Args) => {
      const config = await getConfig();
      if (config) {
        return buildaNew({
          config,
          scriptName: argv.scriptName,
          name: argv.name
        });
      }
      throwError('No config file found');
    }
  };
};
