#!/usr/bin/env node
var e;let o;import{Octokit as r}from"@octokit/rest";import i from"yargs";import{findGithubAccount as a,createRemoteRepo as t,initRepo as p,deleteRemoteRepo as s,pushRepo as n,copyRepo as c,makeRepo as m,removeRepo as d}from"./git.js";import{getCurrentDir as l}from"./cli.js";let N=i.usage("Usage: -u <url> -s <keyword>").option("e",{alias:"exec",default:"copyRepo",describe:"exec command copyRepo(clone+local config)/makeRepo(create remote+push)/removeRepo(delete remote+local)",type:"string",demandOption:!0}).option("u",{alias:"userName",default:"mooninlearn",describe:"Name of User",type:"string"}).option("n",{alias:"repoName",describe:"NameOfRepository",type:"string"}).option("d",{alias:"description",describe:"Description For Repository",type:"string"}).argv,u=a(N.userName??"");u.userName=N.userName??"",console.log(`#### git account: ${JSON.stringify(u)}`);let R=new r({auth:u.token}),g=(e=N.repoName??"",(o=l()).split("/").pop()!==e&&(o+=`/${e}`),o??"");switch(N.exec){case"initRepo":p(R,{name:N.repoName??"",description:N.description??""},u,g);break;case"createRemoteRepo":t(R,{name:N.repoName??"",description:N.description??""});break;case"deleteRemoteRepo":s(R,{name:N.repoName??""},u);break;case"pushRepo":n({name:N.repoName??"",description:N.description??""},u,g);break;case"copyRepo":c({name:N.repoName??"",description:N.description??"description"},u,g);break;case"makeRepo":m(R,{name:N.repoName??"",description:N.description??""},u,g);break;case"removeRepo":d(R,{name:N.repoName??""},u,g)}