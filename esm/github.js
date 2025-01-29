function t(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}import{execSync as e}from"child_process";import{Octokit as i}from"@octokit/rest";import{loadJson as o}from"./builtin.js";import{sleep as s}from"./basic.js";let n=`${process.env.DEV_CONFIG_ROOT}/Environments`??"C:/JnJ-soft/Developments/Environments",c=t=>o(`${n}/Apis/github.json`)[t];class r{constructor(o){t(this,"userName",void 0),t(this,"account",void 0),t(this,"octokit",void 0),t(this,"findAllRepos",()=>{console.log(this.octokit.rest.repos)}),t(this,"createRepo",t=>{this.octokit.rest.repos.createForAuthenticatedUser({auto_init:!0,private:!1,license_template:"MIT",...t})}),t(this,"cloneRepo",t=>{let i=`git clone https://github.com/${this.userName}/${t.name}.git`;console.log(i),e(i)}),t(this,"changeRepo",t=>{let i=`cd ${t.name} && git remote remove origin`;console.log(i+=` && git remote add origin https://github.com/${this.userName}/${t.name}`),e(i)}),t(this,"setConfigRepo",t=>{let i=`cd ${t.name} && git config user.name "${this.account.fullName}"`;console.log(i+=` && git config user.email "${this.account.email}" && git remote set-url origin https://${this.account.token}@github.com/${this.userName}/${t.name}.git`),e(i)}),t(this,"copyRepo",t=>{this.cloneRepo(t),this.setConfigRepo(t)}),t(this,"initRepo",t=>{this.createRepo(t);let e=this;setTimeout(()=>{e.cloneRepo(t),e.setConfigRepo(t)},5e3)}),t(this,"pushRepo",t=>{let{name:i}=t,{fullName:o,email:n,token:c}=this.account;s(3);let r="git init";console.log(r+=` && git config user.name "${o}" && git config user.email "${n}" && git remote add origin https://${c}@github.com/${this.userName}/${i}.git`),e(r),console.log(r='git add . && git commit -m "Initial commit"'),e(r);let m=e("git branch");m.includes("main")?e("git push -u origin main"):m.includes("master")?e("git push -u origin master"):console.log("main 또는 master 브랜치가 없습니다.")}),t(this,"deleteRepo",t=>{let{name:e}=t;this.octokit.rest.repos.delete({owner:this.userName,repo:e})}),this.userName=o,this.account=c(o),this.octokit=new i({auth:this.account.token})}}export{c as findGithubAccount,r as Github};