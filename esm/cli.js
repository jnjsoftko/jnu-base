import{execSync as e}from"child_process";import r from"path";import{saveFile as o,substituteInFile as t}from"./builtin.js";import{findGithubAccount as i}from"./git.js";let p=`${process.env.DEV_CONFIG_ROOT}/Templates`??"C:/JnJ-soft/Developments/Templates",n="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,m=r=>{let o=e(r,{encoding:"utf8"});return o?o.toString().trim():""},s=e=>{let r=[];return e.forEach(e=>r.push(m(e))),r},a={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},l=()=>"win"===n?e("cd",a).toString().trim().replace(/\\/g,"/"):e("pwd",a).toString().trim(),c=()=>"win"===n?r.dirname(e("cd",a).toString().trim().replace(/\\/g,"/")):r.dirname(e("pwd",a).toString().trim()),d=r=>{let o=i(r.userName??""),m=c(),s=l();if("win"===n)console.log("win");else{let i=`cp -r ${p}/ts-swc-npm ${r.repoName}`;e(i,a),t(`${r.repoName}/package.json`,{"{{name}}":r.repoName??"","{{author}}":`${o.fullName} <${o.email}>`,"{{description}}":r.description??""}),t(`${r.repoName}/README.md`,{"{{name}}":r.repoName??"","{{project-name}}":r.repoName??"","{{author}}":`${o.fullName} <${o.email}>`,"{{github-id}}":r.userName??"","{{description}}":r.description||"","{{parent-dir}}":m,"{{current-dir}}":s}),t(`${r.repoName}/docs/workflow.md`,{"{{name}}":r.repoName??"","{{project-name}}":r.repoName??"","{{github-id}}":r.userName??"","{{description}}":r.description||"","{{parent-dir}}":m,"{{current-dir}}":s}),console.log(i=`cd ${s}/${r.repoName} && npm install`),e(i,a),console.log(i=`cd ${s}/${r.repoName} && github -e makeRepo -u ${r.userName} -n ${r.repoName} -d "${r.description}"`),e(i,a)}},u=r=>{e(`github -e deleteRepo -u ${r.userName} -n ${r.repoName}`,a),e(`rm -rf ${r.repoName}`,a)},$=e=>{switch(e.template){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":d(e)}},N=r=>{if("win"===n){let o=r.excluded?r.excluded.split(",").map(e=>`"${e}"`).join(","):'"*/node_modules/*",".git/*"';e(`powershell -Command "Compress-Archive -Path ${r.repoName} -DestinationPath ${r.repoName}.zip -Exclude ${o}"`,a)}else{let o=r.excluded?r.excluded.split(",").map(e=>`"${e}"`).join(" "):'"*/node_modules/*" ".git/*"';e(`zip -r ${r.repoName}.zip ${r.repoName} -x ${o}`,a)}},g=r=>{if("win"===n)return"";{let t=r.excluded?`"${r.excluded.split(",").join("|")}"`:'"node_modules|dist|_backups|_drafts|types|docs"',i=`tree -I ${t} --dirsfirst -L 3`;try{console.log("Command: ",i);let r=e(i,{encoding:"utf8",stdio:"pipe"});return r&&o("tree.txt",r,{overwrite:!0,newFile:!1}),r||""}catch(e){return console.error("Error executing tree command:",e),""}}};export{p as TEMPLATES_ROOT,n as PLATFORM,m as exec,s as exe,a as execOptions,c as getParentDir,$ as initApp,u as removeApp,N as zip,g as tree};