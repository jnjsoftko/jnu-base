#!/usr/bin/env node
import{findGithubAccount as e,createRepo as o,initRepo as a,copyRepo as i,makeRepo as r,deleteRepo as p}from"./git";import{Octokit as t}from"@octokit/rest";import s from"yargs";let n=s.usage("Usage: -u <url> -s <keyword>").option("u",{alias:"userName",default:"mooninlearn",describe:"Name of User",type:"string",demandOption:!0}).option("e",{alias:"exec",choices:["copyRepo","makeRepo","removeRepo"],default:"copyRepo",describe:"exec command copyRepo(clone+local config)/makeRepo(create remote+push)/removeRepo(delete remote+local)",type:"string",demandOption:!0}).option("n",{alias:"repoName",describe:"NameOfRepository",type:"string",demandOption:!0}).option("d",{alias:"description",describe:"Description For Repository",type:"string"}).argv,m=e(n.userName),c=new t({auth:m.token});switch(n.exec){case"initRepo":a({name:n.repoName,description:n.description},n.userName,m,c);break;case"createRepo":o(c,{name:n.repoName,description:n.description});break;case"copyRepo":i({name:n.repoName,description:n.description},n.userName,m);break;case"emptyRepo":o(c,{name:n.repoName,description:n.description,auto_init:!1,license_template:void 0});break;case"makeRepo":r({name:n.repoName,description:n.description},n.userName,m,c);break;case"deleteRepo":p(c,n.userName,{name:n.repoName})}