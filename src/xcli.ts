#!/usr/bin/env node
// & IMPORT
//&============================================================================
import yargs from "yargs";
import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import Path from "path";
import { sleep } from "./basic.js"
import { makeDir, copyDir, loadJson, saveJson, loadFile, saveFile, findFiles, deleteFilesInFolder, substituteInFile } from './builtin.js'
import { findGithubAccount } from "./git.js";
import { TEMPLATES_ROOT, PLATFORM, execOptions, initApp, removeApp, zip, tree, unzip } from "./cli.js";
import type { CliOptions } from './types.js';


// & CONSTS / VARIABLES
//&============================================================================

// * cli options
// --no-github
const argv = yargs
  .usage("Usage: -e <command> -r <required> -o <optional>")
  .option("e", {
    alias: "exec",
    describe: "Execute Command",
    type: "string",
    demandOption: true,
  })
  .option("r", {
    alias: "requiredParameter",
    default: "",
    describe: "Required Parameter",
    type: "string",
  })
  .option("o", {
    // - template: (node-simple|python|go|flutter|)
    alias: "optionalParameter",
    default: "{}",
    describe: "Optional Parameter",
    type: "string",
  })
  .option("s", {
    alias: "saveOption",
    default: "",
    describe: "Save file for result(return)",
    type: "string",
  })
  .parseSync();

const options: CliOptions = {
  exec: argv.e as string,
  requiredParameter: argv.r as string,
  optionalParameter: argv.o as string,
  saveOption: argv.s as string
};

// & SUB FUNCTIONS
//&============================================================================
const requiredParameters = (requiredParameter: string): [string, string] => {
  const [param1 = '', param2 = ''] = requiredParameter.split(',');
  return [param1, param2];
}

const optionalParameters = (optionalParameter: string) => {
  return JSON.parse(optionalParameter);
}

const saveResult = (result: any, _saveOption: string, defaultOption: string=`options.json||json||1`) => {
  // * saveOption: ("path,type")
  const defaultOption2 = defaultOption.split('||').slice(1, 3).join('||');
  const saveOption = !_saveOption ? defaultOption : _saveOption.split('||').length > 1 ? _saveOption : `${_saveOption}||${defaultOption2}`;

  console.log(`@@@saveOption: ${saveOption}`);

  const [path, type, view] = saveOption.split('||');
  switch (type) {
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
      // saveSqlite(path, result);
      if (view) {
        console.log(`${JSON.stringify(result)}`);
      }
      break;
    default:
      console.log(`save type is not supported: ${type}`);
  }
}

// & MAIN FUNCTIONS
//&============================================================================
let result: any;
let saveOption: string;

// * exec
switch (options.exec) {
  case "init":  // 프로젝트 초기화
    result = initApp(options); // ex) xcli -e init -t "node-simple" -n "video-stream-app" -u "jnjsoftko" -d "video stream app"
    saveResult(result, options.saveOption ?? '', `options.json||json||1`);
    break;
  case "remove": // 프로젝트 삭제
    removeApp(options); // ex) xcli -e remove -n "video-stream-app" -u "jnjsoftko"
    break;
  case "zip": // 폴더 압축
    const [zipFolder, zipExcluded] = requiredParameters(options.requiredParameter ?? ",");
    result = zip(zipFolder, zipExcluded);  // ex) xcli -e zip -n "video-stream-app" -x "node_modules/,package-lock.json,.next/"
    saveResult(result, options.saveOption ?? '', `options.json||json||1`);
    break;
  case "tree": // 폴더 트리
    const treeResult = tree(options.requiredParameter ?? ''); // ex) xcli -e tree -n "video-stream-app"
    saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
    break;
  case "find": // 폴더 내에 있는 파일 찾기, xcli -e find -n "." -d "*.js"
  const [findFolder, findPattern] = requiredParameters(options.requiredParameter ?? ",");
    const files = findFiles(findFolder, findPattern);  // ex) xcli -e find -n "video-stream-app" -p "*.js"
    saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
    break;
  case "del": // 폴더 삭제
    const [delFolder, delExcluded] = requiredParameters(options.requiredParameter ?? ",");
    result = deleteFilesInFolder(delFolder, delExcluded, true) ?? '';  // ex) xcli -e del -n "/Users/moon/JnJ-soft/Projects/internal/video-stream-app" -d "node_modules/,package-lock.json,.next/"
    saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
    break;
  case "unzip": // 폴더 내에 있는 모든 압축 파일 해제(zip 파일 이름의 폴더에 압축 해제)
    const [unzipFolder, unzipExcluded] = requiredParameters(options.requiredParameter ?? ",");
    result = unzip(unzipFolder, unzipExcluded);  // ex) xcli -e unzip -n "video-stream-app"
    saveResult(result, options.saveOption ?? '', `result.txt||file||1`);
    break;
  default:
    console.log("Invalid command");
}

