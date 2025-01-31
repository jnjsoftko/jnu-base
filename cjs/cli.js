"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,r){for(var t in r)Object.defineProperty(e,t,{enumerable:!0,get:r[t]})}(exports,{PLATFORM:function(){return i},TEMPLATES_ROOT:function(){return c},exe:function(){return p},exec:function(){return s},execOptions:function(){return a},getCurrentDir:function(){return u},getParentDir:function(){return l},initApp:function(){return x},removeApp:function(){return m},tree:function(){return $},zip:function(){return f}});const r=require("child_process"),t=(e=require("path"))&&e.__esModule?e:{default:e},n=require("./builtin.js"),o=require("./git.js"),c=`${process.env.DEV_CONFIG_ROOT}/Templates`??"C:/JnJ-soft/Developments/Templates",i="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,s=e=>{let t=(0,r.execSync)(e,{encoding:"utf8"});return t?t.toString().trim():""},p=e=>{let r=[];return e.forEach(e=>r.push(s(e))),r},a={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},u=()=>"win"===i?(0,r.execSync)("cd",a).toString().trim().replace(/\\/g,"/"):(0,r.execSync)("pwd",a).toString().trim(),l=()=>"win"===i?t.default.dirname((0,r.execSync)("cd",a).toString().trim().replace(/\\/g,"/")):t.default.dirname((0,r.execSync)("pwd",a).toString().trim()),d=e=>{let t=(0,o.findGithubAccount)(e.userName??""),s=l(),p=u(),d="";d="win"===i?`xcopy "${c}\\ts-swc-npm" "${e.repoName}\\" /E /I /H /Y`:`cp -r ${c}/ts-swc-npm ${e.repoName}`,(0,r.execSync)(d,a),(0,n.substituteInFile)(`${e.repoName}/package.json`,{"{{name}}":e.repoName??"","{{author}}":`${t.fullName} <${t.email}>`,"{{description}}":e.description??""}),(0,n.substituteInFile)(`${e.repoName}/README.md`,{"{{name}}":e.repoName??"","{{project-name}}":e.repoName??"","{{author}}":`${t.fullName} <${t.email}>`,"{{github-id}}":e.userName??"","{{description}}":e.description||"","{{parent-dir}}":s,"{{current-dir}}":p}),(0,n.substituteInFile)(`${e.repoName}/docs/workflow.md`,{"{{name}}":e.repoName??"","{{project-name}}":e.repoName??"","{{github-id}}":e.userName??"","{{description}}":e.description||"","{{parent-dir}}":s,"{{current-dir}}":p}),console.log(d=`cd ${p}/${e.repoName} && npm install`),(0,r.execSync)(d,a),console.log(d=`cd ${p}/${e.repoName} && xgit -e makeRepo -u ${e.userName} -n ${e.repoName} -d "${e.description}"`),(0,r.execSync)(d,a)},m=e=>{(0,r.execSync)(`xgit -e deleteRemoteRepo -u ${e.userName} -n ${e.repoName}`,a),"win"===i?(0,r.execSync)(`rmdir /s /q ${e.repoName}`,a):(0,r.execSync)(`rm -rf ${e.repoName}`,a)},x=e=>{switch(e.template){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":d(e)}},f=e=>{if("win"===i)try{let t=`${e.repoName}_temp`;for(let n of((0,r.execSync)(`xcopy "${e.repoName}" "${t}\\" /E /I /H /Y`,a),e.excluded?e.excluded.split(","):["node_modules","package-lock.json","package.json"])){let e=`${t}/${n}`;try{n.includes("/")?(0,r.execSync)(`rmdir /s /q "${e}"`,a):(0,r.execSync)(`del /q "${e}"`,a)}catch(e){console.log(`Warning: Could not remove ${n}`)}}(0,r.execSync)(`powershell -Command "Compress-Archive -Path ${t}/* -DestinationPath ${e.repoName}.zip -Force"`,a),(0,r.execSync)(`rmdir /s /q "${t}"`,a)}catch(e){throw console.error("Error during zip operation:",e),e}else{let t=e.excluded?e.excluded.split(",").map(e=>`"${e}"`).join(" "):'"*/node_modules/*" ".git/*"';(0,r.execSync)(`zip -r ${e.repoName}.zip ${e.repoName} -x ${t}`,a)}},$=e=>{{if("win"===i){let t=e.excluded?e.excluded.split(",").join("|"):"node_modules|dist|_backups|_drafts|types|docs";try{let e=`tree /F /A | findstr /v "${t}"`;console.log("Command: ",e);let o=(0,r.execSync)(e,{encoding:"utf8",stdio:"pipe"});return o&&(0,n.saveFile)("tree.txt",o,{overwrite:!0,newFile:!1}),o||""}catch(e){return console.error("Error executing tree command:",e),""}}let t=e.excluded?`"${e.excluded.split(",").join("|")}"`:'"node_modules|dist|_backups|_drafts|types|docs"',o=`tree -I ${t} --dirsfirst -L 3`;try{console.log("Command: ",o);let e=(0,r.execSync)(o,{encoding:"utf8",stdio:"pipe"});return e&&(0,n.saveFile)("tree.txt",e,{overwrite:!0,newFile:!1}),e||""}catch(e){return console.error("Error executing tree command:",e),""}}};