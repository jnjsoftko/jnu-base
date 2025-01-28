#!/usr/bin/env node
import e from"yargs";import{execSync as t}from"child_process";import i from"path";import{sleep as o}from"./basic";import{copyDir as s,loadJson as n,saveJson as r,loadFile as a,saveFile as p}from"./builtin";import{findGithubAccount as l}from"./github";import c from"dotenv";c.config();let g=process.env.ENV_TEMPLATES_PATH??"C:/JnJ-soft/Developments/_Templates",m=e.usage("Usage: -u <url> -s <keyword>").option("u",{alias:"userName",default:"mooninlearn",describe:"Name of User",type:"string",demandOption:!0}).option("l",{alias:"lang",default:"node",describe:"developemnt language",type:"string"}).option("n",{alias:"repoName",describe:"NameOfRepository",type:"string",demandOption:!0}).option("d",{alias:"description",describe:"Description For Repository",type:"string"}).option("g",{alias:"github",default:!0,describe:"Use Github Repository",type:"boolean"}).option("t",{alias:"template",default:"none-basic-ts",describe:"App Template",type:"string"}).parseSync(),d={userName:m.u,lang:m.l,repoName:m.n,description:m.d,github:m.g,template:m.t},u=(e,t,i)=>i={...i,repository:{type:"git",url:`git+https://${e}@github.com/${e}/${t}.git`},bugs:{url:`https://github.com/${e}/${t}/issues`},homepage:`https://github.com/${e}/${t}#readme`},f={encoding:"utf8",shell:"win32"===process.platform?"cmd.exe":"/bin/sh"};switch(d.github&&(console.log("## init github"),(e=>{let{userName:i,repoName:o,description:s}=e;t(`github -u ${i} -e initRepo -n ${o} -d "${s}"`)})(d),o(1)),d.lang.toUpperCase()){case"NODE":(e=>{let{userName:o,repoName:a,description:p,template:c,github:m}=e,{fullName:d,email:$,token:h}=l(o),b=i.join(g,`node/${c}`),y=i.join(process.cwd(),`${a}`);s(b,y);let j=i.join(process.cwd(),`${a}/package.json`),_=n(j);if(_={..._,name:a,version:"0.0.1",description:p,author:`${d} <${$}>`},m&&(_=u(o,a,_)),r(j,_),t((process.platform,`cd "${y}" && npm install`),f),c.includes("-figma-")){let e=i.join(process.cwd(),`${a}/dist/manifest.json`),t=n(e);r(e,t={...t,name:a,id:`1${(e=>{let t="";for(let e=0;e<17;e++)t+=Math.floor(10*Math.random());return t})(0)}`})}let N=(process.platform,`git init && git config user.name "${d}" && git config user.email "${$}" && git remote add origin https://${h}@github.com/${o}/${a}.git`);console.log("#### ",N),t(N,f);let w='git add . && git commit -m "Initial commit"';console.log("#### ",w),t(w,f);let O=t("git branch",f);O.includes("main")?t("git push -u origin main",f):O.includes("master")?t("git push -u origin master",f):console.log("main 또는 master 브랜치가 없습니다.")})(d);break;case"PYTHON":(e=>{let{userName:o,repoName:n,description:r,template:c,github:m}=e,{fullName:d,email:u}=l(o);s(i.join(g,`python/${c}`),i.join(process.cwd(),`${n}`));let f=i.join(process.cwd(),`${n}/setup.cfg`),$={" ":"_0_","<":"_1_",">":"_2_"},h=[];for(let[e,t]of Object.entries({name:n,description:r,author:`${d} <${u}>`})){for(let[e,i]of Object.entries($))"string"==typeof t&&(t=t.replace(RegExp(e,"g"),i));"string"==typeof t&&h.push(`'${e}':'${t}'`)}let b="{"+h.join(",")+"}";t(`config.exe -a update_cfg -s ${f} -D ${b}`);let y=a(f);for(let[e,t]of Object.entries($))y=y.replace(RegExp(t,"g"),e);p(f,y)})(d)}