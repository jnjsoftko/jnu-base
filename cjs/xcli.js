#!/usr/bin/env node
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0});const i=(e=require("yargs"))&&e.__esModule?e:{default:e},a=require("./builtin.js"),s=require("./cli.js"),t=i.default.usage("Usage: -e <command> -u <userName> -t <template> -n <repoName> -d <description> -g").option("e",{alias:"exec",describe:"Execute Command",type:"string",demandOption:!0}).option("u",{alias:"userName",default:"mooninlearn",describe:"Name of User",type:"string"}).option("t",{alias:"template",default:"node",describe:"developemnt template(language)",type:"string"}).option("n",{alias:"repoName",describe:"Repository Name(Project Name)",type:"string"}).option("d",{alias:"description",describe:"ProjectDescription",type:"string"}).option("g",{alias:"github",default:!0,describe:"Use Github Repository (--no-github: false)",type:"boolean"}).option("x",{alias:"excluded",default:"node_modules/,package-lock.json,package.json",describe:"Excluded file/folder types For zip",type:"string"}).option("s",{alias:"save",default:"",describe:"Save file for result(return)",type:"string"}).parseSync(),o={exec:t.e,userName:t.u,template:t.t,repoName:t.n,description:t.d,github:t.g,excluded:t.x};switch(o.exec){case"init":(0,s.initApp)(o);break;case"remove":(0,s.removeApp)(o);break;case"zip":(0,s.zip)(o);break;case"tree":(0,s.tree)(o);break;case"find":let r=(0,a.findFiles)(o.repoName??"",o.description??"");console.log(`@@@save: ${o.save}`),o.save&&(console.log(`###save File: ${o.save}`),(0,a.saveFile)(o.save,JSON.stringify(r))),console.log(`${JSON.stringify(r)}`);case"del":(0,a.deleteFilesInFolder)(o.repoName??"",o.description??o.excluded??"",!0);break;case"unzip":(0,s.unzip)(o.repoName??"");break;default:console.log("Invalid command")}