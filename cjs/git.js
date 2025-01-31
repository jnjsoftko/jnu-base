"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(exports,{cloneRepo:function(){return g},copyRepo:function(){return f},createRemoteRepo:function(){return s},createRemoteRepoEmpty:function(){return a},deleteRemoteRepo:function(){return l},findAllRepos:function(){return u},findGithubAccount:function(){return c},initRepo:function(){return d},makeRepo:function(){return y},pushRepo:function(){return $},removeRepo:function(){return h},setLocalConfig:function(){return m}});const t=(e=require("path"))&&e.__esModule?e:{default:e},n=require("child_process"),o=require("./builtin.js"),i=require("./basic.js"),r=`${process.env.DEV_CONFIG_ROOT}/Environments`??"C:/JnJ-soft/Developments/Environments",c=e=>(0,o.loadJson)(`${r}/Apis/github.json`)[e],u=e=>{console.log(e.rest.repos)},s=(e,t)=>e.rest.repos.createForAuthenticatedUser({auto_init:!0,private:!1,license_template:"MIT",...t}),a=(e,t)=>s(e,{...t,auto_init:!1,license_template:void 0}),l=(e,t,n)=>{let{name:o}=t;return e.rest.repos.delete({owner:n.userName,repo:o})},m=(e,t,o)=>{let i=`cd ${o} && git config user.name "${t.fullName}"`;console.log(i+=` && git config user.email "${t.email}" && git remote set-url origin https://${t.token}@github.com/${t.userName}/${e.name}.git`),(0,n.execSync)(i)},p=(e,t,o)=>{let{name:i}=e,{fullName:r,email:c,token:u,userName:s}=t,a=`cd ${o} && git init`;console.log(a+=` && git config user.name "${r}" && git config user.email "${c}" && git remote add origin https://${u}@github.com/${s}/${i}.git`),(0,n.execSync)(a)},g=(e,o,i)=>{let r=`cd ${t.default.dirname(i)} && git clone https://github.com/${o.userName}/${e.name}.git`;console.log(r),(0,n.execSync)(r)},f=(e,t,n)=>{g(e,t,n),m(e,t,n)},d=async(e,t,n,o)=>{await s(e,t),await (0,i.sleep)(5e3),g(t,n,o),m(t,n,o)},$=(e,t,o)=>{(0,n.execSync)(`cd ${o}`);let i=(0,n.execSync)("git branch");i.includes("main")?(0,n.execSync)("git push -u origin main"):i.includes("master")?(0,n.execSync)("git push -u origin master"):console.log("main 또는 master 브랜치가 없습니다.")},y=async(e,t,o,r)=>{await a(e,t),await (0,i.sleep)(2),p(t,o,r),await (0,i.sleep)(1),(0,n.execSync)(`cd ${r}`),$(t,o,r)},h=(e,o,i,r)=>{l(e,o,i);let{name:c}=o;(0,n.execSync)(`cd ${t.default.dirname(r)}`);let u=`rm -rf ${c}`;console.log(u),(0,n.execSync)(u)};