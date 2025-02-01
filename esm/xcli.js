#!/usr/bin/env node
import yargs from "yargs";
import { findFiles, deleteFilesInFolder } from './builtin.js';
import { initApp, removeApp, zip, tree, unzip } from "./cli.js";
const argv = yargs.usage("Usage: -e <command> -u <userName> -t <template> -n <repoName> -d <description> -g").option("e", {
    alias: "exec",
    describe: "Execute Command",
    type: "string",
    demandOption: true
}).option("u", {
    alias: "userName",
    default: "mooninlearn",
    describe: "Name of User",
    type: "string"
}).option("t", {
    alias: "template",
    default: "node",
    describe: "developemnt template(language)",
    type: "string"
}).option("n", {
    alias: "repoName",
    describe: "Repository Name(Project Name)",
    type: "string"
}).option("d", {
    alias: "description",
    describe: "ProjectDescription",
    type: "string"
}).option("g", {
    alias: "github",
    default: true,
    describe: "Use Github Repository (--no-github: false)",
    type: "boolean"
}).option("x", {
    alias: "excluded",
    default: "node_modules/,package-lock.json,package.json",
    describe: "Excluded file/folder types For zip",
    type: "string"
}).parseSync();
const options = {
    exec: argv.e,
    userName: argv.u,
    template: argv.t,
    repoName: argv.n,
    description: argv.d,
    github: argv.g,
    excluded: argv.x
};
switch(options.exec){
    case "init":
        initApp(options);
        break;
    case "remove":
        removeApp(options);
        break;
    case "zip":
        zip(options);
        break;
    case "tree":
        tree(options);
        break;
    case "del":
        deleteFilesInFolder(options.repoName ?? '', options.description ?? options.excluded ?? '', true);
        break;
    case "unzip":
        unzip(options.repoName ?? '');
        break;
    case "find":
        const files = findFiles(options.repoName ?? '', options.description ?? '');
        console.log(`files: ${JSON.stringify(files)}`);
        break;
    default:
        console.log("Invalid command");
}

//# sourceMappingURL=xcli.js.map