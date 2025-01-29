#!/usr/bin/env node
// & IMPORT
//&============================================================================
import yargs from "yargs";
import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import Path from "path";
import { sleep } from './basic'
import { makeDir, copyDir, loadJson, saveJson, loadFile, saveFile, substituteInFile } from './builtin'
import { findGithubAccount } from "./git";
import { TEMPLATES_ROOT, PLATFORM, execOptions, initApp, removeApp } from "./cli";
import type { CliOptions } from './types';

// & Types AREA
//&============================================================================
interface CommandOptions {
  exec: string;
  userName: string;
  template: string;
  repoName: string;
  description?: string;
  github?: boolean;
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
    demandOption: true,
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
    describe: "NameOfRepository", // project name
    type: "string",
    demandOption: true,
  })
  .option("d", {
    alias: "description",
    describe: "Description For Repository",
    type: "string",
  })
  .option("g", {
    alias: "github",
    default: true,
    describe: "Use Github Repository",
    type: "boolean",
  })
  .parseSync();

const options: CliOptions = {
  exec: argv.e as string,
  userName: argv.u as string,
  template: argv.t as string,
  repoName: argv.n as string,
  description: argv.d,
  github: argv.g as boolean
};

// & FUNCTIONS
//&============================================================================


// * exec
switch (options.exec) {
  case "init":
    initApp(options);
    break;
  case "remove":
    removeApp(options);
    break;
  default:
    console.log("Invalid command");
}

