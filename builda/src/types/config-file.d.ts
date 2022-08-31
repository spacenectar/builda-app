import { ScaffoldScriptContents } from './scaffold-script-config';
import { RunScriptConfig } from './run-script-config';
import { ModuleConfig } from './module-config';

export interface ConfigFile {
  name: string;
  watched_folders: string[];
  scaffold_scripts: {
    [key: string]: ScaffoldScriptContents;
  };
  run_scripts: RunScriptConfig;
  prefabs: ModuleConfig;
  scaffolds: ModuleConfig;
}
