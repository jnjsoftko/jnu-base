"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,t){for(var o in t)Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}(exports,{cloneRepo:function(){return d},copyRepo:function(){return $},createRemoteRepo:function(){return u},createRemoteRepoEmpty:function(){return a},deleteRemoteRepo:function(){return m},findAllRepos:function(){return s},findGithubAccount:function(){return l},initLocalRepo:function(){return g},initRepo:function(){return f},makeRepo:function(){return h},pushRepo:function(){return R},removeRepo:function(){return y},setLocalConfig:function(){return p}});const t=(e=require("path"))&&e.__esModule?e:{default:e},o=require("child_process"),n=require("./builtin.js"),i=require("./basic.js"),c=require("./cli.js"),r=`${process.env.DEV_CONFIG_ROOT}/Environments`??"C:/JnJ-soft/Developments/Environments",l=e=>(0,n.loadJson)(`${r}/Apis/github.json`)[e],s=e=>{console.log(e.rest.repos)},u=(e,t)=>(console.log("#### createRemoteRepo options: ",t),e.rest.repos.createForAuthenticatedUser({auto_init:!0,private:!1,license_template:"MIT",...t})),a=(e,t)=>(console.log("#### createRemoteRepoEmpty options: ",t),u(e,{...t,auto_init:!1,license_template:void 0})),m=(e,t,o)=>{let{name:n}=t;return e.rest.repos.delete({owner:o.userName,repo:n})},p=(e,t,n)=>{let i=`cd ${n} && git config user.name "${t.fullName}"`;console.log(i+=` && git config user.email "${t.email}" && git remote set-url origin https://${t.token}@github.com/${t.userName}/${e.name}.git`),(0,o.execSync)(i)},g=(e,t,n)=>{let{name:i}=e,{fullName:c,email:r,token:l,userName:s}=t,u=`cd ${n} && git init`;console.log(u+=` && git config user.name "${c}" && git config user.email "${r}" && git remote add origin https://${l}@github.com/${s}/${i}.git && git add . && git commit -m "Initial commit"`),(0,o.execSync)(u)},d=(e,n,i)=>{let c=`cd ${t.default.dirname(i)} && git clone https://${n.token}@github.com/${n.userName}/${e.name}.git`;console.log(c),(0,o.execSync)(c)},f=(e,t,n,c)=>{console.log("====GIT.TS initRepo");let r=`xgit -e createRemoteRepo -u ${n.userName} -n ${t.name}`;console.log(`initRepo cmd: ${r}`),(0,o.execSync)(r),(0,i.sleep)(5),d(t,n,c),(0,i.sleep)(5),p(t,n,c)},$=(e,t,o)=>{d(e,t,o),(0,i.sleep)(10),p(e,t,o)},R=(e,t,n)=>{if((0,o.execSync)(`cd ${n}`),(0,o.execSync)("git status --porcelain",{encoding:"utf8"}).length>0){let e='git add . && git commit -m "Initial commit"';console.log("#### ",e),(0,o.execSync)(e)}let i=(0,o.execSync)("git branch");console.log(`#### pushRepo branches: ${i}`),i.includes("main")?(0,o.execSync)("git push -u origin main --force"):i.includes("master")?(0,o.execSync)("git push -u origin master --force"):console.log("main 또는 master 브랜치가 없습니다.")},h=(e,t,n,c)=>{let r=`xgit -e createRemoteRepo -u ${n.userName} -n ${t.name}`;console.log(`initRepo cmd: ${r}`),(0,o.execSync)(r),(0,i.sleep)(15),console.log(`=================== initLocalRepo: ${c}`),g(t,n,c),(0,i.sleep)(5),console.log(`=================== pushRepo: ${c}`),R(t,n,c)},y=(e,n,i,r)=>{m(e,n,i);let{name:l}=n;if("win"===c.PLATFORM){let e=`cd ${t.default.dirname(r)} && rmdir /s /q ${l}`;console.log(e),(0,o.execSync)(e)}else{let e=`cd ${t.default.dirname(r)} && rm -rf ${l}`;console.log(e),(0,o.execSync)(e)}};