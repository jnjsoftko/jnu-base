#!/usr/bin/env node
"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0});const o=require("@octokit/rest"),r=(e=require("yargs"))&&e.__esModule?e:{default:e},t=require("./git.js"),i=require("./cli.js"),a=r.default.usage("Usage: -u <url> -s <keyword>").option("e",{alias:"exec",default:"copyRepo",describe:"exec command copyRepo(clone+local config)/makeRepo(create remote+push)/removeRepo(delete remote+local)",type:"string",demandOption:!0}).option("u",{alias:"userName",default:"mooninlearn",describe:"Name of User",type:"string"}).option("n",{alias:"repoName",describe:"NameOfRepository",type:"string"}).option("d",{alias:"description",describe:"Description For Repository",type:"string"}).argv,p=(0,t.findGithubAccount)(a.userName??""),s=new o.Octokit({auth:p.token}),n=`${(0,i.getCurrentDir)()}/${a.repoName??""}`;switch(a.exec){case"initRepo":(0,t.initRepo)(s,{name:a.repoName??"",description:a.description??""},p,n);break;case"createRemoteRepo":(0,t.createRemoteRepo)(s,{name:a.repoName??"",description:a.description??""});break;case"deleteRemoteRepo":(0,t.deleteRemoteRepo)(s,{name:a.repoName??""},p);break;case"copyRepo":(0,t.copyRepo)({name:a.repoName??"",description:a.description??"description"},p,n);break;case"makeRepo":(0,t.makeRepo)(s,{name:a.repoName??"",description:a.description??""},p,n);break;case"removeRepo":(0,t.removeRepo)(s,{name:a.repoName??""},p,n)}