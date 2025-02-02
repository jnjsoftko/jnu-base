#!/usr/bin/env node
import yargs from "yargs";
import { saveJson, saveFile, findFiles, deleteFilesInFolder } from './builtin.js';
import { initApp, removeApp, zip, tree, unzip } from "./cli.js";
const argv = yargs.usage("Usage: -e <command> -r <required> -o <optional>").option("e", {
    alias: "exec",
    describe: "Execute Command",
    type: "string",
    demandOption: true
}).option("r", {
    alias: "requiredParameter",
    default: "",
    describe: "Required Parameter",
    type: "string"
}).option("o", {
    alias: "optionalParameter",
    default: "{}",
    describe: "Optional Parameter",
    type: "string"
}).option("s", {
    alias: "saveOption",
    default: "",
    describe: "Save file for result(return)",
    type: "string"
}).parseSync();
const options = {
    exec: argv.e,
    requiredParameter: argv.r,
    optionalParameter: argv.o,
    saveOption: argv.s
};
const requiredParameters = (requiredParameter)=>{
    const [param1 = '', param2 = ''] = requiredParameter.split(',');
    return [
        param1,
        param2
    ];
};
const optionalParameters = (optionalParameter)=>{
    return JSON.parse(optionalParameter);
};
const saveResult = (result, _saveOption, defaultOption = `options.json||json||1`)=>{
    const defaultOption2 = defaultOption.split('||').slice(1, 3).join('||');
    const saveOption = !_saveOption ? defaultOption : _saveOption.split('||').length > 1 ? _saveOption : `${_saveOption}||${defaultOption2}`;
    const [path, type, view] = saveOption.split('||');
    switch(type){
        case 'file':
            saveFile(path, result);
            if (view) {
                console.log(`${result}`);
            }
            break;
        case 'json':
            saveJson(path, result);
            if (view) {
                console.log(`${JSON.stringify(result)}`);
            }
            break;
        case 'sqlite':
            console.log(`saveSqlite: ${path}, ${result}`);
            if (view) {
                console.log(`${JSON.stringify(result)}`);
            }
            break;
        default:
            console.log(`save type is not supported: ${type}`);
    }
};
let result;
let saveOption;
switch(options.exec){
    case "init":
        result = initApp(options);
        saveResult(result, options.saveOption ?? '', `options.json||json||1`);
        break;
    case "remove":
        removeApp(options);
        break;
    case "zip":
        const [zipFolder, zipExcluded] = requiredParameters(options.requiredParameter ?? ",");
        result = zip(zipFolder, zipExcluded);
        saveResult(result, options.saveOption ?? '', `options.json||json||1`);
        break;
    case "tree":
        const treeResult = tree(options.requiredParameter ?? '');
        saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
        break;
    case "find":
        const [findFolder, findPattern] = requiredParameters(options.requiredParameter ?? ",");
        const files = findFiles(findFolder, findPattern);
        saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
        break;
    case "del":
        const [delFolder, delExcluded] = requiredParameters(options.requiredParameter ?? ",");
        result = deleteFilesInFolder(delFolder, delExcluded, true) ?? '';
        saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
        break;
    case "unzip":
        result = unzip(options.requiredParameter ?? '');
        saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
        break;
    default:
        console.log("Invalid command");
}

//# sourceMappingURL=xcli.js.map