#!/usr/bin/env node
import { 
  findGithubAccount,
  createRepo, 
  initRepo, 
  copyRepo, 
  makeRepo,
  deleteRepo 
} from "./git";
import { Octokit } from "@octokit/rest";
import yargs from "yargs";
import { execSync } from "child_process";

// & Types AREA
// &---------------------------------------------------------------------------
interface CommandOptions {
  userName: string;
  exec: 'createRepo' | 'initRepo' | 'copyRepo' | 'emptyRepo' | 'makeRepo' | 'deleteRepo';
  repoName: string;
  description?: string;
}

// & Variables AREA
// &---------------------------------------------------------------------------
// * cli options
const options = yargs
  .usage("Usage: -u <url> -s <keyword>")
  .option("u", {
    alias: "userName",
    default: "mooninlearn",
    describe: "Name of User",
    type: "string",
    demandOption: true,
  })
  .option("e", {
    alias: "exec",
    choices: ['createRepo', 'initRepo', 'copyRepo', 'emptyRepo', 'pushRepo', 'deleteRepo', 'makeRepo'] as const,
    default: "createRepo",
    describe: "exec command createRepo/inintRepo(create+clone+config)/copyRepo(clone+config)/deleteRepo",
    type: "string",
    demandOption: true,
  })
  .option("n", {
    alias: "repoName",
    describe: "NameOfRepository",
    type: "string",
    demandOption: true,
  })
  .option("d", {
    alias: "description",
    describe: "Description For Repository",
    type: "string",
  })
  .argv as unknown as CommandOptions;

// * github account setup
const account = findGithubAccount(options.userName);
const octokit = new Octokit({ auth: account.token });

// * exec
switch (options.exec) {
  case "initRepo":
    initRepo({
      name: options.repoName,
      description: options.description,
    }, options.userName, account, octokit);
    break;
  case "createRepo":
    createRepo(octokit, {
      name: options.repoName,
      description: options.description,
    });
    break;
  case "copyRepo":
    copyRepo({
      name: options.repoName,
      description: options.description,
    }, options.userName, account);
    break;
  case "emptyRepo":
    createRepo(octokit, {
      name: options.repoName,
      description: options.description,
      auto_init: false,
      license_template: undefined,
    });
    break;
  case "makeRepo":
    makeRepo({
      name: options.repoName,
      description: options.description,
    }, options.userName, account, octokit);
    break;
  case "deleteRepo":
    deleteRepo(octokit, options.userName, {
      name: options.repoName,
    });
    break;
}

// github -u mooninlearn -n udemy-test -e makeRepo -d "test makeRepo"