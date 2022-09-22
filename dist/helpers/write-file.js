"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const string_functions_1 = __importDefault(require("./string-functions"));
const prettier_1 = __importDefault(require("prettier"));
const writeFile = ({ file, rename, content, output_dir, substitute, name }) => {
    const fileName = file === null || file === void 0 ? void 0 : file.split('/').pop();
    // get the file contents
    const fileContent = file ? fs_1.default.readFileSync(path_1.default.resolve(file), 'utf8') : '';
    // replace the each placeholder with the correctly formatted name
    let newContent = content || fileContent;
    if (name) {
        newContent = fileContent
            .replace(/%KEBAB_CASE%/g, (0, string_functions_1.default)(name, 'kebabCase'))
            .replace(/%CAMEL_CASE%/g, (0, string_functions_1.default)(name, 'camelCase'))
            .replace(/%SNAKE_CASE%/g, (0, string_functions_1.default)(name, 'snakeCase'))
            .replace(/%PASCAL_CASE%/g, (0, string_functions_1.default)(name, 'pascalCase'))
            .replace(/%SENTENCE_CASE%/g, (0, string_functions_1.default)(name, 'sentenceCase'));
    }
    // Replace custom substitutions
    if (substitute && substitute.length > 0) {
        substitute.forEach((sub) => {
            const needle = `${sub.replace.toUpperCase()}`;
            const regex = new RegExp(needle, 'g');
            newContent = newContent.replace(regex, sub.with);
        });
    }
    newContent = file
        ? prettier_1.default.format(newContent, {
            filepath: path_1.default.resolve(file)
        })
        : newContent;
    // write the new file contents to the output directory
    if (newContent) {
        return fs_1.default.writeFileSync(`${output_dir}/${rename || fileName}`, newContent);
    }
    throw new Error(`Could not write file ${rename || fileName}`);
};
exports.writeFile = writeFile;
exports.default = exports.writeFile;