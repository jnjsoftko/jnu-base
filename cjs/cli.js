"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,r){for(var t in r)Object.defineProperty(e,t,{enumerable:!0,get:r[t]})}(exports,{PLATFORM:function(){return c},TEMPLATES_ROOT:function(){return o},exe:function(){return p},exec:function(){return s},execOptions:function(){return u},getParentDir:function(){return a},initApp:function(){return d},removeApp:function(){return l},tree:function(){return x},zip:function(){return f}});const r=require("child_process"),t=(e=require("path"))&&e.__esModule?e:{default:e},n=require("./builtin.js"),i=require("./git.js"),o=`${process.env.DEV_CONFIG_ROOT}/Templates`??"C:/JnJ-soft/Developments/Templates",c="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,s=e=>{let t=(0,r.execSync)(e,{encoding:"utf8"});return t?t.toString().trim():""},p=e=>{let r=[];return e.forEach(e=>r.push(s(e))),r},u={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},a=()=>"win"===c?t.default.dirname((0,r.execSync)("cd",u).toString().trim().replace(/\\/g,"/")):t.default.dirname((0,r.execSync)("pwd",u).toString().trim()),m=e=>{let t=(0,i.findGithubAccount)(e.userName??""),s=a();"win"===c?console.log("win"):((0,r.execSync)(`cp -r ${o}/ts-swc-npm ${e.repoName}`,u),(0,n.substituteInFile)(`${e.repoName}/package.json`,{"{{name}}":e.repoName??"","{{author}}":`${t.fullName} <${t.email}>`,"{{description}}":e.description??""}),(0,n.substituteInFile)(`${e.repoName}/README.md`,{"{{name}}":e.repoName??"","{{project-name}}":e.repoName??"","{{author}}":`${t.fullName} <${t.email}>`,"{{github-id}}":e.userName??"","{{description}}":e.description||"","{{parent-dir}}":s}),(0,n.substituteInFile)(`${e.repoName}/docs/workflow.md`,{"{{name}}":e.repoName??"","{{project-name}}":e.repoName??"","{{github-id}}":e.userName??"","{{description}}":e.description||"","{{parent-dir}}":s}),(0,r.execSync)(`cd ${e.repoName} && npm install`,u),(0,r.execSync)(`github -e makeRepo -u ${e.userName} -n ${e.repoName} -d "${e.description}"`,u))},l=e=>{(0,r.execSync)(`github -e deleteRepo -u ${e.userName} -n ${e.repoName}`,u),(0,r.execSync)(`rm -rf ${e.repoName}`,u)},d=e=>{switch(e.template){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":m(e)}},f=e=>{if("win"===c){let t=e.excluded?e.excluded.split(",").map(e=>`"${e}"`).join(","):'"*/node_modules/*",".git/*"';(0,r.execSync)(`powershell -Command "Compress-Archive -Path ${e.repoName} -DestinationPath ${e.repoName}.zip -Exclude ${t}"`,u)}else{let t=e.excluded?e.excluded.split(",").map(e=>`"${e}"`).join(" "):'"*/node_modules/*" ".git/*"';(0,r.execSync)(`zip -r ${e.repoName}.zip ${e.repoName} -x ${t}`,u)}},x=e=>{if("win"===c)return"";{let t=e.excluded?`"${e.excluded.split(",").join("|")}"`:'"node_modules|dist|_backups|_drafts|types|docs"',i=`tree -I ${t} --dirsfirst -L 3`;try{console.log("Command: ",i);let e=(0,r.execSync)(i,{encoding:"utf8",stdio:"pipe"});return e&&(0,n.saveFile)("tree.txt",e,{overwrite:!0,newFile:!1}),e||""}catch(e){return console.error("Error executing tree command:",e),""}}};