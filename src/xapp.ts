#!/usr/bin/env node
// & IMPORT
//&============================================================================
import yargs from "yargs";
import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import Path from "path";
import { sleep } from './basic'
import { makeDir, copyDir, loadJson, saveJson, loadFile, saveFile, substituteInFile } from './builtin'
import { Github, findGithubAccount } from "./github";
import dotenv from "dotenv";

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
const TEMPLATES_ROOT = `${process.env.DEV_CONFIG_ROOT}/Templates` ?? "C:/JnJ-soft/Developments/Templates";
const PLATFORM = process.platform === 'win32' ? 'win' : 
                process.platform === 'darwin' ? 'mac' : 
                process.platform === 'linux' ? 'linux' : 
                process.platform;

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

const options: CommandOptions = {
  exec: argv.e as string,
  userName: argv.u as string,
  template: argv.t as string,
  repoName: argv.n as string,
  description: argv.d,
  github: argv.g as boolean
};

// & FUNCTIONS
//&============================================================================
const execOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh'
};

// & MAIN
//&============================================================================
const account = findGithubAccount(options.userName);

const initTsSwcNpm = (account) => {
  switch (PLATFORM) {
    case "win":
      console.log("win");
      break;
    default:
      execSync(`cp -r ${TEMPLATES_ROOT}/ts-swc-npm ${options.repoName}`, execOptions);
      const currentDir = execSync('pwd', execOptions).toString().trim();
      const parentDir = Path.dirname(currentDir);

      substituteInFile(`${options.repoName}/package.json`, {
        "{{name}}": options.repoName,
        "{{author}}": `${account.fullName} <${account.email}>`, 
        "{{description}}": options.description || "",
      });

      substituteInFile(`${options.repoName}/README.md`, {
        "{{name}}": options.repoName,
        "{{author}}": `${account.fullName} <${account.email}>`, 
        "{{github-id}}": account.userName,
        "{{description}}": options.description || "",
        "{{parent-dir}}": parentDir,
      });
      execSync(`cd ${options.repoName} && npm install`, execOptions);
      break;
  }
}

// * exec
switch (options.exec) {
  case "init":
    switch (options.template) {
      case "node-simple":
        break;
      case "ts-swc-npm":
        initTsSwcNpm(account)
        break;
      case "python-pipenv":
        break;
      case "flutter":
        break;
    };
    break;
  default:
    console.log("Invalid command");
}

