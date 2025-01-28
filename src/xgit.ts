#!/usr/bin/env node
import { Github } from "./github";
import yargs from "yargs";
import { execSync } from "child_process";

// & Types AREA
// &---------------------------------------------------------------------------
interface CommandOptions {
  userName: string;
  exec: 'createRepo' | 'initRepo' | 'copyRepo' | 'emptyRepo' | 'pushRepo' | 'deleteRepo';
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
    choices: ['createRepo', 'initRepo', 'copyRepo', 'emptyRepo', 'pushRepo', 'deleteRepo'] as const,
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

// * github instance
const github = new Github(options.userName);

// * exec
switch (options.exec) {
  case "initRepo":
    github.initRepo({
      name: options.repoName,
      description: options.description,
    });
    break;
  case "createRepo":
    github.createRepo({
      name: options.repoName,
      description: options.description,
    });
    break;
  case "copyRepo":
    github.copyRepo({
      name: options.repoName,
      description: options.description,
    });
    break;
  case "emptyRepo":
    github.createRepo({
      name: options.repoName,
      description: options.description,
      auto_init: false,
      license_template: undefined,
    });
    break;
  case "pushRepo": // only push
    const { repoName, description, userName } = options;
    let cmd = `github -u ${userName} -n ${repoName} -e emptyRepo -d "${description}"`;
    console.log(cmd);
    execSync(cmd);

    github.pushRepo({
      name: options.repoName,
      description: options.description,
    });
    break;
  case "deleteRepo":
    github.deleteRepo({
      name: options.repoName,
    });
    break;
}

// github -u mooninlearn -n udemy-test -e pushRepo -d "test pushRepo"