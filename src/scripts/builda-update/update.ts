import fs from 'node:fs';
import path from 'node:path';

// Import globals
import globals from 'data/globals';

// Import scripts
import { getConfig, printMessage, throwError } from 'helpers';

import { buildaInstall } from 'scripts/builda-install';

export type InstallModulesResponse = {
  config: ConfigFile;
};

export default async () => {
  // Install any builda modules defined in the config
  const config = getConfig();
  const { prefab } = config;
  const { buildaDir } = globals;
  const buildaDirPath = path.join(process.cwd(), buildaDir);

  // Check the builda directory exists and delete it if it does
  if (fs.existsSync(buildaDirPath)) {
    fs.rmSync(buildaDirPath, { recursive: true });
  } else {
    if (!prefab) {
      throwError(
        'No prefab found in config (perhaps you meant to run "builda init" or "builda project" instead?)'
      );
    } else {
      printMessage(
        'Prefab config found but no .builda directory found.',
        'warning'
      );
      printMessage('Running "builda install" instead', 'info');
      return buildaInstall();
    }
  }

  // Run the install script (passing true to indicate that this is an update)
  return buildaInstall(true);
};
