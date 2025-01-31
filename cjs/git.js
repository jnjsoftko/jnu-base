"use strict";var e;Object.defineProperty(exports,"__esModule",{value:!0}),!function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(exports,{cloneRepo:function(){return f},copyRepo:function(){return d},createRemoteRepo:function(){return l},createRemoteRepoEmpty:function(){return a},deleteRemoteRepo:function(){return p},findAllRepos:function(){return u},findGithubAccount:function(){return s},initRepo:function(){return $},makeRepo:function(){return h},pushRepo:function(){return R},removeRepo:function(){return y},setLocalConfig:function(){return m}});const t=(e=require("path"))&&e.__esModule?e:{default:e},n=require("child_process"),o=require("./builtin.js"),i=require("./basic.js"),r=require("./cli.js"),c=`${process.env.DEV_CONFIG_ROOT}/Environments`??"C:/JnJ-soft/Developments/Environments",s=e=>(0,o.loadJson)(`${c}/Apis/github.json`)[e],u=e=>{console.log(e.rest.repos)},l=(e,t)=>e.rest.repos.createForAuthenticatedUser({auto_init:!0,private:!1,license_template:"MIT",...t}),a=(e,t)=>l(e,{...t,auto_init:!1,license_template:void 0}),p=(e,t,n)=>{let{name:o}=t;return e.rest.repos.delete({owner:n.userName,repo:o})},m=(e,t,o)=>{let i=`cd ${o} && git config user.name "${t.fullName}"`;console.log(i+=` && git config user.email "${t.email}" && git remote set-url origin https://${t.token}@github.com/${t.userName}/${e.name}.git`),(0,n.execSync)(i)},g=(e,t,o)=>{let{name:i}=e,{fullName:r,email:c,token:s,userName:u}=t,l=`cd ${o} && git init`;console.log(l+=` && git config user.name "${r}" && git config user.email "${c}" && git remote add origin https://${s}@github.com/${u}/${i}.git`),(0,n.execSync)(l)},f=(e,o,i)=>{let r=`cd ${t.default.dirname(i)} && git clone https://github.com/${o.userName}/${e.name}.git`;console.log(r),(0,n.execSync)(r)},d=(e,t,n)=>{f(e,t,n),m(e,t,n)},$=(e,t,n,o)=>{l(e,t),(0,i.sleep)(5e3),f(t,n,o),m(t,n,o)},R=(e,t,o)=>{(0,n.execSync)(`cd ${o}`);let i=(0,n.execSync)("git branch");console.log(`#### pushRepo branches: ${i}`),i.includes("main")?(0,n.execSync)("git push -u origin main"):i.includes("master")?(0,n.execSync)("git push -u origin master"):console.log("main 또는 master 브랜치가 없습니다.")},h=(e,t,n,o)=>{console.log(`=================== createRemoteRepoEmpty: ${o}`),l(e,t),(0,i.sleep)(5),console.log(`=================== initLocalRepo: ${o}`),g(t,n,o),(0,i.sleep)(3),console.log(`=================== pushRepo: ${o}`),R(t,n,o)},y=(e,o,i,c)=>{p(e,o,i);let{name:s}=o;if((0,n.execSync)(`cd ${t.default.dirname(c)}`),"win"===r.PLATFORM){let e=`rmdir /s /q ${s}`;console.log(e),(0,n.execSync)(e)}else{let e=`rm -rf ${s}`;console.log(e),(0,n.execSync)(e)}};