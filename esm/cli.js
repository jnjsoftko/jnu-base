import{execSync as e}from"child_process";import r from"path";import{substituteInFile as p}from"./builtin";import{findGithubAccount as o}from"./git";let t=`${process.env.DEV_CONFIG_ROOT}/Templates`??"C:/JnJ-soft/Developments/Templates",i="win32"===process.platform?"win":"darwin"===process.platform?"mac":"linux"===process.platform?"linux":process.platform,m=r=>e(r,{encoding:"utf8"}).toString().trim(),s=e=>{let r=[];return e.forEach(e=>r.push(m(e))),r},a={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"},n=()=>r.dirname(e("pwd",a).toString().trim()),c=r=>{let m=o(r.userName),s=n();"win"===i?console.log("win"):(e(`cp -r ${t}/ts-swc-npm ${r.repoName}`,a),p(`${r.repoName}/package.json`,{"{{name}}":r.repoName,"{{author}}":`${m.fullName} <${m.email}>`,"{{description}}":r.description||""}),p(`${r.repoName}/README.md`,{"{{name}}":r.repoName,"{{author}}":`${m.fullName} <${m.email}>`,"{{github-id}}":r.userName,"{{description}}":r.description||"","{{parent-dir}}":s}),e(`cd ${r.repoName} && npm install`,a),e(`github -e pushRepo -u ${r.userName} -n ${r.repoName} -d "${r.description}"`,a))},l=r=>{e(`github -e deleteRepo -u ${r.userName} -n ${r.repoName}`,a),e(`rm -rf ${r.repoName}`,a)},u=e=>{switch(e.template){case"node-simple":case"python-pipenv":break;case"ts-swc-npm":c(e)}};export{t as TEMPLATES_ROOT,i as PLATFORM,m as exec,s as exe,a as execOptions,n as getParentDir,u as initApp,l as removeApp};