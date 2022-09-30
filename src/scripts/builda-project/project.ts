import axios from 'axios';
import execa from 'execa';
import inquirer from 'inquirer';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import globals from 'data/globals';
import {
  addLocalModule,
  addRemoteModule,
  convertRegistryPathToUrl,
  copyDir,
  createDir,
  detectPathType,
  loopAndRewriteFiles,
  printMessage,
  throwError,
  writeFile,
  changeCase,
  newProjectQuestions,
  prefabQuestions,
  showHelp
} from 'helpers';

import ModuleRegistry from 'types/module-registry';
import { TFlatObject } from 'types/flat-object';

export type TGenerateProject = {
  appName?: string;
  pathName?: string;
  packageManager?: string;
  autoInstall?: boolean;
};

/**
 * Generate a new project from a prefab
 * @param { TGenerateProject }
 */
export default async ({
  appName,
  pathName,
  packageManager
}: TGenerateProject) => {
  const { buildaDir, websiteUrl, configFileName, buildaReadmeFileName } =
    globals;

  const defaultRequiredFiles = [
    buildaDir,
    `${buildaDir}/${configFileName}`,
    'package.json',
    'README.md'
  ];

  let answers = {} as TFlatObject;

  const { usePrefab } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'usePrefab',
      message: `Do you want to set the project up using a prefab?`,
      default: true
    }
  ]);

  if (usePrefab) {
    const prefabAnswers = await prefabQuestions(answers);
    answers.prefab = prefabAnswers.prefabUrl || prefabAnswers.prefabList;
  } else {
    showHelp(
      'You can set up a project from scratch by answering a few questions about your project.\r\n\n' +
        `If you are unsure about any of these, you can always change them later by editing the ${configFileName} file.`
    );
  }

  if (answers.prefab) {
    showHelp(
      'Great! That prefab is ready to install!\n\nFirst things first though, we need a few more details, to get you set up.',
      'success'
    );
  }

  const newProjectAnswers = await newProjectQuestions();

  answers = { ...answers, ...newProjectAnswers };
  const name = (appName || answers.appName) as string;
  const prefabPath = (pathName || answers.prefab) as string;
  const packageManagerType =
    packageManager || (answers.yarnOrNpm as string) || 'npm';
  const rootDir = (answers.appRoot as string) || process.cwd();

  await createDir(name);

  // Change directory to the new app
  process.chdir(name);

  // check if the root directory is empty
  const workingDir = path.join(rootDir, buildaDir, 'export');
  const prefabDir = path.join(rootDir, buildaDir, 'modules', 'prefab');

  if (fs.readdirSync(rootDir).length !== 0) {
    throwError(
      `The directory: '${rootDir}' already exists. It is not recommended to install a prefab into an existing project.`
    );
  }

  await createDir(workingDir);

  // The directory is empty, so we can continue
  let module = {} as ModuleRegistry;

  if (detectPathType(prefabPath) === 'remote') {
    const registry = convertRegistryPathToUrl({
      registryPath: prefabPath
    }).url;
    if (!registry) {
      throwError('No registry found');
    }
    module = await addRemoteModule(registry, rootDir);
  } else {
    module = await addLocalModule(prefabPath, rootDir);
  }

  if (!module?.name) {
    throwError('No prefab found');
  }

  const prefabName = module.name;
  const version = module.version;
  const substitutions = module.substitute || [];

  const extraRootfiles =
    module.filesInRoot
      ?.filter((file) => {
        if (!file.rewrite) {
          return file;
        }
        return false;
      })
      .map((f) => f.path) || [];

  const extraRootfilesToRewrite =
    module.filesInRoot?.filter((file) => {
      if (file.rewrite) {
        return file;
      }
      return false;
    }) || [];

  const requiredFiles = [...defaultRequiredFiles, ...(extraRootfiles || [])];
  printMessage(`Installed ${prefabName}@${version}`, 'success');

  printMessage('Creating export path...', 'processing');

  // Copy the prefab files to the export directory
  copyDir(prefabDir, workingDir);

  printMessage('Export path created', 'success');

  printMessage('Copying required files to application...', 'copying');

  const substitute = [
    ...substitutions,
    {
      replace: '%APP_NAME%',
      with: changeCase(name, 'kebabCase')
    },
    {
      replace: '%APP_ROOT%',
      with: './'
    },
    {
      replace: '%PACKAGE_MANAGER%',
      with: packageManagerType
    }
  ];

  // Copy all required files
  await loopAndRewriteFiles({ name, paths: requiredFiles, substitute });
  const buildaPath = path.join(workingDir, buildaDir);
  const buildaConfigPath = path.resolve(buildaPath, configFileName);

  // If there are extra files which need to be rewritten, do that now
  if (extraRootfilesToRewrite.length > 0) {
    const paths = extraRootfilesToRewrite.map((f) => f.path);
    const extraSubstitutions = extraRootfilesToRewrite
      .map((f) => f.substitutions)
      .flat()
      .concat(substitutions);

    await loopAndRewriteFiles({
      name,
      paths,
      substitute: extraSubstitutions
    });
  }

  // Copy config.json from working builda directory to root directory
  if (fs.existsSync(buildaConfigPath)) {
    fs.copyFileSync(buildaConfigPath, path.join(rootDir, configFileName));
  }

  // Create a new package.json file in the root directory with updated scripts
  const packageJsonFile = fs.readFileSync(
    path.resolve(workingDir, 'package.json'),
    {
      encoding: 'utf8'
    }
  );
  const packageJson = JSON.parse(packageJsonFile);

  const scripts = packageJson.scripts as Record<string, string>;
  const buildaScripts = {} as Record<string, string>;

  Object.entries(scripts).forEach(([key, value]) => {
    if (
      value.startsWith('builda') ||
      value.startsWith('run-s') ||
      value.startsWith('run-p') ||
      value.startsWith('npm-run-all') ||
      value.startsWith('concurrently')
    ) {
      // We don't want to replace `builda`, `npm-run-all` or `concurrently` scripts, so we just copy them over
      // TODO: Add docs to show that builda scripts should not be used in conjunction with other scripts
      // add a suggestion to put the builda script in its own script and call that script from the other
      // script using one of the supported methods
      /**
       * e.g.
       * {
       *   "watch": "builda --watch",
       *   "dev": "run-p watch other-script"
       * }
       */
      buildaScripts[key] = value;
    } else {
      buildaScripts[key] = `builda -x ${key}`;
    }
  });

  const newPackageJson = {
    ...packageJson,
    scripts: buildaScripts
  };

  fs.writeFileSync(
    path.join(rootDir, 'package.json'),
    JSON.stringify(newPackageJson, null, 2)
  );

  // Add the default prefab readme to the root directory
  const prefabReadmeUrl = `${websiteUrl}/assets/prefab-getting-started.md`;

  const readmeSubs = [
    {
      replace: '%PREFAB_NAME%',
      with: prefabName
    },
    {
      replace: '%PREFAB_URL%',
      with: module.url
    },
    {
      replace: '%PREFAB_VERSION%',
      with: version
    }
  ];

  // Download the prefab readme and add it to the root directory
  // If the download fails, we just ignore it and continue with a warning message
  await axios
    .get(prefabReadmeUrl, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        writeFile({
          content: res.data,
          rename: buildaReadmeFileName,
          outputDir: rootDir,
          substitute: readmeSubs
        });
      }
    })
    .catch((err) => {
      console.log(err);
      printMessage(
        `Could not download the getting started file. Visit ${websiteUrl}/docs/getting-started#prefab for assistance`,
        'warning'
      );
    });

  // Delete the .builda directory from the export directory
  if (fs.existsSync(buildaPath)) {
    fs.rmSync(buildaPath, { recursive: true });
  }

  // Install any blueprint dependencies
  if (module.blueprints) {
    printMessage('Installing prefab blueprints...', 'installing');
    const blueprintPromises = [];
    // Convert the blueprints to an array
    const blueprints = Object.keys(module.blueprints);
    for (const blueprint of blueprints) {
      const bp = module.blueprints[blueprint];
      printMessage(`installing ${blueprint}`, 'processing');
      const blueprintDest = path.join(
        rootDir,
        buildaDir,
        'modules',
        'blueprints'
      );
      createDir(blueprintDest);
      if (bp.location === 'prefab') {
        // Copy the 'blueprints' folder from the prefab to the .builda folder
        const blueprintSrc = path.join(
          prefabDir,
          buildaDir,
          'modules',
          'blueprints',
          blueprint
        );

        if (fs.existsSync(blueprintSrc)) {
          copyDir(blueprintSrc, path.join(blueprintDest, blueprint));
        }
      } else {
        // Install the blueprint from the registry
        const bluePrintType = detectPathType(bp.location);
        blueprintPromises.push(
          new Promise((resolve) => {
            if (bluePrintType === 'local') {
              addLocalModule(bp.location, rootDir);
            }
            if (bluePrintType === 'remote') {
              const registry = convertRegistryPathToUrl({
                registryPath: bp.location
              }).url;
              if (!registry) {
                throwError('No registry found');
              }

              addRemoteModule(registry, rootDir);
            }
            resolve(blueprint);
          })
        );
      }
      printMessage(`${blueprint} installed`, 'success');
    }

    await Promise.all(blueprintPromises);
  }
  printMessage('All files copied to application.', 'success');

  if (answers.autoInstall) {
    printMessage('Installing dependencies...', 'config');

    // Run package manager install
    if (fs.existsSync(path.resolve(workingDir, 'package.json'))) {
      printMessage(`Running ${packageManagerType} install`, 'processing');
      try {
        const childProcess = execa(packageManagerType, ['install'], {
          cwd: rootDir,
          all: true,
          stdio: 'inherit'
        });
        childProcess?.all?.pipe(process.stdout);
        await childProcess;
        printMessage('All dependencies installed.', 'success');
      } catch (error) {
        printMessage(
          `Failed to run. Please try running '${packageManagerType} install' manually.`,
          'error'
        );
        //TODO : Add this documentation
        printMessage(
          `For more information about how to use your application, visit: ${websiteUrl}/docs/getting-started`,
          'primary'
        );
      }
    } else {
      printMessage('No package.json found. Skipping install.', 'notice');
    }
  } else {
    printMessage(
      `Dependencies have not been installed. To install dependencies, run: '${packageManagerType} install'`,
      'notice'
    );
  }
  execa('cd', [name]);
  printMessage(`Your application, "${name}" has been initialised!`, 'success');
  printMessage(
    `For more information about how to use your application, visit: ${websiteUrl}/docs/getting-started`,
    'primary'
  );
};
