#!/usr/bin/env node

// & Import AREA
// &---------------------------------------------------------------------------
import { Github } from "./github.js";
import yargs from "yargs";
import { execSync } from "child_process";

// & Types AREA
// &---------------------------------------------------------------------------
interface CommandOptions {
  userName: string;
  exec: 'createRepo' | 'initRepo' | 'copyRepo' | 'emptyRepo' | 'pushRepo' | 'deleteRepo';
  repoName: string;
  description?: string;
  github?: boolean;
}

// & Variables AREA
// &---------------------------------------------------------------------------
// * cli options
const argv = yargs
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
  .option("g", {
    alias: "github",
    describe: "Use Github API",
    type: "boolean",
    default: false,
  })
  .parseSync();

const options: CommandOptions = {
  userName: argv.u as string,
  exec: argv.e as CommandOptions['exec'],
  repoName: argv.n as string,
  description: argv.d,
  github: argv.g as boolean,
};

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