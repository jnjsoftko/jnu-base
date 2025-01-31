import{execSync as e}from"child_process";import r from"path";import{saveFile as t,substituteInFile as o}from"./builtin.js";import{findGithubAccount as i}from"./git.js";let p=`${process.env.DEV_CONFIG_ROOT}/Templates`??"C:/JnJ-soft/Developments/Templates",m="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,n=r=>{let t=e(r,{encoding:"utf8"});return t?t.toString().trim():""},a=e=>{let r=[];return e.forEach(e=>r.push(n(e))),r},s={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},c=()=>"win"===m?e("cd",s).toString().trim().replace(/\\/g,"/"):e("pwd",s).toString().trim(),d=()=>"win"===m?r.dirname(e("cd",s).toString().trim().replace(/\\/g,"/")):r.dirname(e("pwd",s).toString().trim()),l=r=>{let t=i(r.userName??""),n=d(),a=c(),l="";"win"===m?e(l=`xcopy "${p}\\ts-swc-npm" "${r.repoName}\\" /E /I /H /Y`,s):e(l=`cp -r ${p}/ts-swc-npm ${r.repoName}`,s),o(`${r.repoName}/package.json`,{"{{name}}":r.repoName??"","{{author}}":`${t.fullName} <${t.email}>`,"{{description}}":r.description??""}),o(`${r.repoName}/README.md`,{"{{name}}":r.repoName??"","{{project-name}}":r.repoName??"","{{author}}":`${t.fullName} <${t.email}>`,"{{github-id}}":r.userName??"","{{description}}":r.description||"","{{parent-dir}}":n,"{{current-dir}}":a}),o(`${r.repoName}/docs/workflow.md`,{"{{name}}":r.repoName??"","{{project-name}}":r.repoName??"","{{github-id}}":r.userName??"","{{description}}":r.description||"","{{parent-dir}}":n,"{{current-dir}}":a}),console.log(l=`cd ${a}/${r.repoName} && npm install`),e(l,s),console.log(l=`cd ${a}/${r.repoName} && xgit -e makeRepo -u ${r.userName} -n ${r.repoName} -d "${r.description}"`),e(l,s)},u=r=>{e(`xgit -e deleteRemoteRepo -u ${r.userName} -n ${r.repoName}`,s),"win"===m?e(`rmdir /s /q ${r.repoName}`,s):e(`rm -rf ${r.repoName}`,s)},$=e=>{switch(e.template){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":l(e)}},N=r=>{if("win"===m){let t=r.excluded?r.excluded.split(",").map(e=>`"${e}"`).join(","):'"*/node_modules/*",".git/*"';e(`powershell -Command "Compress-Archive -Path ${r.repoName} -DestinationPath ${r.repoName}.zip -Exclude ${t}"`,s)}else{let t=r.excluded?r.excluded.split(",").map(e=>`"${e}"`).join(" "):'"*/node_modules/*" ".git/*"';e(`zip -r ${r.repoName}.zip ${r.repoName} -x ${t}`,s)}},g=r=>{if("win"===m)return"";{let o=r.excluded?`"${r.excluded.split(",").join("|")}"`:'"node_modules|dist|_backups|_drafts|types|docs"',i=`tree -I ${o} --dirsfirst -L 3`;try{console.log("Command: ",i);let r=e(i,{encoding:"utf8",stdio:"pipe"});return r&&t("tree.txt",r,{overwrite:!0,newFile:!1}),r||""}catch(e){return console.error("Error executing tree command:",e),""}}};export{p as TEMPLATES_ROOT,m as PLATFORM,n as exec,a as exe,s as execOptions,d as getParentDir,c as getCurrentDir,$ as initApp,u as removeApp,N as zip,g as tree};