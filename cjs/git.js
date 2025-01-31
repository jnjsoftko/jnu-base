"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,o){for(var t in o)Object.defineProperty(e,t,{enumerable:!0,get:o[t]})}(exports,{cloneRepo:function(){return f},copyRepo:function(){return $},createRemoteRepo:function(){return u},createRemoteRepoEmpty:function(){return p},deleteRemoteRepo:function(){return a},findAllRepos:function(){return l},findGithubAccount:function(){return s},initLocalRepo:function(){return g},initRepo:function(){return R},makeRepo:function(){return h},pushRepo:function(){return d},removeRepo:function(){return y},setLocalConfig:function(){return m}});const o=(e=require("path"))&&e.__esModule?e:{default:e},t=require("child_process"),n=require("./builtin.js"),i=require("./basic.js"),r=require("./cli.js"),c=`${process.env.DEV_CONFIG_ROOT}/Environments`??"C:/JnJ-soft/Developments/Environments",s=e=>(0,n.loadJson)(`${c}/Apis/github.json`)[e],l=e=>{console.log(e.rest.repos)},u=(e,o)=>(console.log("#### createRemoteRepo options: ",o),e.rest.repos.createForAuthenticatedUser({auto_init:!0,private:!1,license_template:"MIT",...o})),p=(e,o)=>(console.log("#### createRemoteRepoEmpty options: ",o),u(e,{...o,auto_init:!1,license_template:void 0})),a=(e,o,t)=>{let{name:n}=o;return e.rest.repos.delete({owner:t.userName,repo:n})},m=(e,o,n)=>{let i=`cd ${n} && git config user.name "${o.fullName}"`;console.log(i+=` && git config user.email "${o.email}" && git remote set-url origin https://${o.token}@github.com/${o.userName}/${e.name}.git`),(0,t.execSync)(i)},g=(e,o,n)=>{let{name:i}=e,{fullName:r,email:c,token:s,userName:l}=o,u=`cd ${n} && git init`;console.log(u+=` && git config user.name "${r}" && git config user.email "${c}" && git remote set-url origin https://${o.token}@github.com/${o.userName}/${e.name}.git && git add . && git commit -m "Initial commit"`),(0,t.execSync)(u)},f=(e,n,i)=>{let r=`cd ${o.default.dirname(i)} && git clone https://${n.token}@github.com/${n.userName}/${e.name}.git`;console.log(r),(0,t.execSync)(r)},R=(e,o,n,r)=>{console.log("====GIT.TS initRepo");let c=`xgit -e createRemoteRepo -u ${n.userName} -n ${o.name}`;console.log(`initRepo cmd: ${c}`),(0,t.execSync)(c),(0,i.sleep)(5),f(o,n,r),(0,i.sleep)(5),m(o,n,r)},$=(e,o,t)=>{f(e,o,t),(0,i.sleep)(10),m(e,o,t)},d=(e,o,n)=>{(0,t.execSync)(`cd ${n}`);let i=(0,t.execSync)("git branch");console.log(`#### pushRepo branches: ${i}`),i.includes("main")?(0,t.execSync)("git push -u origin main"):i.includes("master")?(0,t.execSync)("git push -u origin master"):console.log("main 또는 master 브랜치가 없습니다.")},h=(e,o,t,n)=>{console.log(`=================== createRemoteRepoEmpty: ${n}`),p(e,o),(0,i.sleep)(5),console.log(`=================== initLocalRepo: ${n}`),g(o,t,n),(0,i.sleep)(3),console.log(`=================== pushRepo: ${n}`),d(o,t,n)},y=(e,n,i,c)=>{a(e,n,i);let{name:s}=n;if((0,t.execSync)(`cd ${o.default.dirname(c)}`),"win"===r.PLATFORM){let e=`rmdir /s /q ${s}`;console.log(e),(0,t.execSync)(e)}else{let e=`rm -rf ${s}`;console.log(e),(0,t.execSync)(e)}};