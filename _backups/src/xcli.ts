#!/usr/bin/env node
// & IMPORT
//&============================================================================
import yargs from "yargs";
import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import Path from "path";
import { sleep } from "./basic.js"
import { makeDir, copyDir, loadJson, saveJson, loadFile, saveFile, findFiles, deleteFilesInFolder, substituteInFile } from './builtin.js'
import { findGithubAccount } from "./git.js";
import { TEMPLATES_ROOT, PLATFORM, execOptions, initApp, removeApp, zip, tree, del, unzip } from "./cli.js";
import type { CliOptions } from './types.js';

// & Types AREA
//&============================================================================
interface CommandOptions {
  exec?: string;
  userName?: string;
  template?: string;
  repoName?: string;
  description?: string;
  github?: boolean;
  excluded?: string;
  save?: string;
}

// & CONSTS / VARIABLES
//&============================================================================

// * cli options
// --no-github
const argv = yargs
  .usage("Usage: -e <command> -u <userName> -t <template> -n <repoName> -d <description> -g")
  .option("e", {
    alias: "exec",
    describe: "Execute Command",
    type: "string",
    demandOption: true,
  })
  .option("u", {
    alias: "userName",
    default: "mooninlearn",
    describe: "Name of User",
    type: "string",
  })
  .option("t", {
    // - template: (node-simple|python|go|flutter|)
    alias: "template",
    default: "node",
    describe: "developemnt template(language)",
    type: "string",
  })
  .option("n", {
    alias: "repoName",
    describe: "Repository Name(Project Name)", // project name
    type: "string",
  })
  .option("d", {
    alias: "description",
    describe: "ProjectDescription",
    type: "string",
  })
  .option("g", {
    alias: "github",
    default: true,
    describe: "Use Github Repository (--no-github: false)",
    type: "boolean",
  })
  .option("x", {
    alias: "excluded",
    default: "node_modules/,package-lock.json,package.json",
    describe: "Excluded file/folder types For zip",
    type: "string",
  })
  .option("s", {
    alias: "save",
    default: "",
    describe: "Save file for result(return)",
    type: "string",
  })
  .parseSync();

const options: CliOptions = {
  exec: argv.e as string,
  userName: argv.u as string,
  template: argv.t as string,
  repoName: argv.n as string,
  description: argv.d,
  github: argv.g as boolean,
  excluded: argv.x as string,
  save: argv.s as string,
};

// & FUNCTIONS
//&============================================================================

// 결과값을 저장할 변수 선언
let result: string = '';

// * exec
switch (options.exec) {
  case "init":  // 프로젝트 초기화
    initApp(options); // ex) xcli -e init -t "node-simple" -n "video-stream-app" -u "jnjsoftko" -d "video stream app"
    if (options.save) {
      console.log(`###inited Folder,File: ${options.save}`);
      saveFile(options.save, result);
    }
    console.log(`inited Folder,File: ${result}`);
    break;
  case "remove": // 프로젝트 삭제
    removeApp(options); // ex) xcli -e remove -n "video-stream-app" -u "jnjsoftko"
    break;
  case "zip": // 폴더 압축
    zip(options);  // ex) xcli -e zip -n "video-stream-app" -x "node_modules/,package-lock.json,.next/"
    break;
  case "tree": // 폴더 트리
    result = tree(options); // ex) xcli -e tree -n "video-stream-app"
    break;
  case "find": // 폴더 내에 있는 파일 찾기, xcli -e find -n "." -d "*.js"
    const files = findFiles(options.repoName ?? '', options.description ?? '');  // ex) xcli -e find -n "video-stream-app" -p "*.js"
    if (options.save) {
      console.log(`###save File: ${options.save}`);
      saveFile(options.save, files.join('\n'));
    }
    console.log(JSON.stringify(files));
    break;
  case "del": // 폴더 삭제
    result = deleteFilesInFolder(options.repoName ?? '', options.description ?? options.excluded ?? '', true) ?? '';  // ex) xcli -e del -n "/Users/moon/JnJ-soft/Projects/internal/video-stream-app" -d "node_modules/,package-lock.json,.next/"
    if (options.save) {
      console.log(`###deleted Folder,File: ${options.save}`);
      saveFile(options.save, result);
    }
    console.log(`deleted Folder,File: ${result}`);
    break;
  case "unzip": // 폴더 내에 있는 모든 압축 파일 해제(zip 파일 이름의 폴더에 압축 해제)
    result = unzip(options.repoName ?? '');  // ex) xcli -e unzip -n "video-stream-app"
    if (options.save) {
      console.log(`###unziped Folder,File: ${options.save}`);
      saveFile(options.save, result);
    }
    console.log(`unziped Folder,File: ${result}`);
    break;
  default:
    console.log("Invalid command");
}

