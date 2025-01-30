#!/usr/bin/env node
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0});const o=require("./git.js"),r=require("@octokit/rest"),a=((e=require("yargs"))&&e.__esModule?e:{default:e}).default.usage("Usage: -u <url> -s <keyword>").option("e",{alias:"exec",default:"copyRepo",describe:"exec command copyRepo(clone+local config)/makeRepo(create remote+push)/removeRepo(delete remote+local)",type:"string",demandOption:!0}).option("u",{alias:"userName",default:"mooninlearn",describe:"Name of User",type:"string"}).option("n",{alias:"repoName",describe:"NameOfRepository",type:"string"}).option("d",{alias:"description",describe:"Description For Repository",type:"string"}).argv,i=(0,o.findGithubAccount)(a.userName??""),t=new r.Octokit({auth:i.token});switch(a.exec){case"initRepo":(0,o.initRepo)({name:a.repoName??"",description:a.description??""},a.userName??"",i,t);break;case"createRepo":(0,o.createRepo)(t,{name:a.repoName??"",description:a.description??""});break;case"emptyRepo":(0,o.createRepo)(t,{name:a.repoName??"",description:a.description??"",auto_init:!1,license_template:void 0});break;case"deleteRepo":(0,o.deleteRepo)(t,a.userName??"",{name:a.repoName??""});break;case"copyRepo":(0,o.copyRepo)({name:a.repoName??"",description:a.description??""},a.userName??"",i);break;case"makeRepo":(0,o.makeRepo)({name:a.repoName??"",description:a.description??""},a.userName??"",i,t);break;case"removeRepo":(0,o.removeRepo)(t,a.userName??"",{name:a.repoName??""})}