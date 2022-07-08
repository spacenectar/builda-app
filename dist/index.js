#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
// import helpers
const _helpers_1 = require("./helpers/index.js");
// import data
const arguments_json_1 = __importDefault(require("./data/arguments.json"));
// import scripts
const init_1 = __importDefault(require("./scripts/init"));
const generate_commands_1 = __importDefault(require("./scripts/generate-commands"));
const args = (0, helpers_1.hideBin)(process.argv);
const config = (0, _helpers_1.getConfigFile)();
const parser = (0, yargs_1.default)(args)
    .usage('Usage: $0 [options]')
    .options(arguments_json_1.default)
    .help('h')
    .version()
    .alias('h', 'help');
(0, _helpers_1.printLogo)();
const CREATE_CONFIG_QUESTION = {
    message: 'Would you like to create a .builda.yml file?',
    name: 'createConfig',
    type: 'confirm'
};
(async () => {
    const argv = await parser.argv;
    if (args.length === 0 && config) {
        // No arguments were passed but a config file exists
        (0, _helpers_1.printMessage)('No arguments provided.\r', 'danger');
        parser.showHelp();
    }
    if (args.length === 0 && !config) {
        // No arguments were passed but a config file does not exist
        return (0, _helpers_1.askQuestion)(CREATE_CONFIG_QUESTION).then(({ createConfig }) => {
            if (createConfig) {
                return (0, init_1.default)({});
            }
            (0, _helpers_1.printMessage)('Process terminated due to user selection', 'error');
            return process.exit(1);
        });
    }
    if (argv.init)
        (0, init_1.default)({});
    if (argv.migrate) {
        // The user wants to migrate an old buildcom config file
        // Go to migrate function
        return (0, _helpers_1.printMessage)('🛠 This route does not exist yet.\r', 'notice');
    }
    const commands = config ? (0, generate_commands_1.default)() : [];
    commands.forEach((command) => {
        if (argv[command]) {
            return (0, _helpers_1.printMessage)(`${command} does not exist yet.\r`, 'notice');
        }
    });
})();
