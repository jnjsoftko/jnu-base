#!/usr/bin/env node
import { 
  findGithubAccount,
  createRepo, 
  initRepo,
  deleteRepo,  
  copyRepo, 
  makeRepo,
  removeRepo
} from "./git.js";
import { Octokit } from "@octokit/rest";
import yargs from "yargs";
import { execSync } from "child_process";

// & Types AREA
// &---------------------------------------------------------------------------
interface CommandOptions {
  exec: string; // 'copyRepo' | 'makeRepo' | 'removeRepo'
  userName?: string;
  repoName?: string;
  description?: string;
}

// & Variables AREA
// &---------------------------------------------------------------------------
// * cli options
const options = yargs
  .usage("Usage: -u <url> -s <keyword>")
  .option("e", {
    alias: "exec",
    choices: ['copyRepo', 'makeRepo', 'removeRepo'] as const,
    default: "copyRepo",
    describe: "exec command copyRepo(clone+local config)/makeRepo(create remote+push)/removeRepo(delete remote+local)",
    type: "string",
    demandOption: true,
  })
  .option("u", {
    alias: "userName",
    default: "mooninlearn",
    describe: "Name of User",
    type: "string"
  })
  .option("n", {
    alias: "repoName",
    describe: "NameOfRepository",
    type: "string"
  })
  .option("d", {
    alias: "description",
    describe: "Description For Repository",
    type: "string",
  })
  .argv as unknown as CommandOptions;

// * github account setup
const account = findGithubAccount(options.userName ?? '');
const octokit = new Octokit({ auth: account.token });

// * exec
switch (options.exec) {
  case "initRepo":
    initRepo({
      name: options.repoName ?? '',
      description: options.description ?? '',
    }, options.userName ?? '', account, octokit);
    break;
  case "createRepo":
    createRepo(octokit, {
      name: options.repoName ?? '',
      description: options.description ?? '',
    });
    break;
  case "emptyRepo":
    createRepo(octokit, {
      name: options.repoName ?? '',
      description: options.description ?? '',
      auto_init: false,
      license_template: undefined,
    });
    break;
  case "deleteRepo":
    deleteRepo(octokit, options.userName ?? '', {
      name: options.repoName ?? '',
    });
    break;
  case "copyRepo":
    copyRepo({
      name: options.repoName ?? '',
      description: options.description ?? '',
    }, options.userName ?? '', account);
    break;
  case "makeRepo":
    makeRepo({
      name: options.repoName ?? '',
      description: options.description ?? '',
    }, options.userName ?? '', account, octokit);
    break;
  case "removeRepo":
    removeRepo(octokit, options.userName ?? '', {
      name: options.repoName ?? '',
    });
    break;
}

// github -u mooninlearn -n udemy-test -e makeRepo -d "test makeRepo"