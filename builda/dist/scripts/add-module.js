"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addModule = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
// Import helpers
const _helpers_1 = require("../helpers/index.js");
// Import data
const globals_1 = __importDefault(require("../data/globals"));
// Import ignorefile
const ignore_file_json_1 = __importDefault(require("../data/ignore-file.json"));
const string_functions_1 = __importDefault(require("../helpers/string-functions"));
// Ignore these files
const ignoreFiles = ignore_file_json_1.default.ignore;
const addLocalModule = async (modulePath) => {
    // get the registry data
    const registry = await (0, _helpers_1.getRegistry)(modulePath);
    // get the directory contents
    const files = fs_1.default.readdirSync(modulePath);
    // filter out the ignore files
    const filteredFiles = files.filter((file) => !ignoreFiles.includes(file));
    // write the files to the output directory
    filteredFiles.forEach(async (file) => {
        const srcPath = `${modulePath}/${file}`;
        const outputPath = `${globals_1.default.buildaDir}/modules/${registry.type}s/${registry.name}`;
        await (0, _helpers_1.createDir)(outputPath).then(() => {
            fs_1.default.copyFileSync(srcPath, `${outputPath}/${file}`);
        });
    });
    return registry;
};
const addRemoteModule = async (modulePath) => {
    // get the directory contents
    const registry = await (0, _helpers_1.getRegistry)(modulePath);
    const files = [...registry.files, 'registry.json'];
    files
        .filter((file) => !ignoreFiles.includes(file))
        .forEach(async (file) => {
        // Download the file
        await axios_1.default
            .get(`${modulePath}/files/${file}`)
            .then((response) => {
            const content = file === 'registry.json'
                ? JSON.stringify(response.data, null, 2)
                : response.data.toString();
            const fileObject = {
                name: file,
                content
            };
            const outputPath = `${globals_1.default.buildaDir}/modules/${registry.type}s/${registry.name}`;
            return (0, _helpers_1.createDir)(outputPath).then(() => {
                return fs_1.default.writeFileSync(`${outputPath}/${fileObject.name}`, fileObject.content);
            });
        })
            .catch((error) => {
            (0, _helpers_1.throwError)(error);
        });
    });
    return registry;
};
const addModule = async ({ config, path }) => {
    let module = {};
    if (config) {
        // Check the module directory exists and create it if it doesn't
        const moduleDirPath = `${globals_1.default.buildaDir}/modules`;
        await (0, _helpers_1.createDir)(moduleDirPath);
        const moduleType = (0, _helpers_1.detectPathType)(path);
        if (moduleType === 'local') {
            module = await addLocalModule(path);
        }
        if (moduleType === 'remote') {
            module = await addRemoteModule((0, _helpers_1.convertRegistryPathToUrl)(path, config));
        }
        if (moduleType === 'custom') {
            module = await addRemoteModule((0, _helpers_1.convertRegistryPathToUrl)(path, config));
        }
        if (module === null || module === void 0 ? void 0 : module.name) {
            const type = module.type;
            const name = module.name;
            const version = module.version;
            // User has never installed any modules.
            if (!config.scaffold_scripts) {
                config.scaffold_scripts = {};
            }
            if (type === 'scaffold') {
                // User has never installed any scaffolds.
                if (!(config === null || config === void 0 ? void 0 : config.scaffolds)) {
                    config.scaffolds = {};
                }
            }
            if (type === 'prefab') {
                // User has never installed any prefabs.
                if (!(config === null || config === void 0 ? void 0 : config.prefabs)) {
                    config.prefabs = {};
                }
            }
            // Write the config file
            fs_1.default.writeFile(globals_1.default.configFileName, JSON.stringify(config, null, 2), (err) => {
                if (err) {
                    (0, _helpers_1.throwError)(err.message);
                }
                (0, _helpers_1.printMessage)(`${(0, string_functions_1.default)(type, 'pascal')}: ${name}@${version} installed`, 'success');
            });
            return {
                module,
                config
            };
        }
        return (0, _helpers_1.throwError)('Something went wrong');
    }
    return (0, _helpers_1.throwError)('No config file found');
};
exports.addModule = addModule;
exports.default = exports.addModule;
