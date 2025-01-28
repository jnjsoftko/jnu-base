/** Github
 *
 * Description
 *   - A Class for Using Github
 *
 * Functions
 *   [X]
 *
 * Usages
 *   -
 *
 * Requirements
 *   -
 *
 * References
 *   - [create repository](https://octokit.github.io/rest.js/v19#repos-create-for-authenticated-user)
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */
// & Import AREA
// &---------------------------------------------------------------------------
// ? External Modules
import { execSync } from "child_process";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

// ? UserMade Modules
import { loadJson } from "./builtin.js";
import { sleep } from "./basic.js";

// & Variable AREA
// &---------------------------------------------------------------------------
dotenv.config(); // 실행 경로에 있는 `.env`
const settingsPath = process.env.DEV_SETTINGS ?? "C:/JnJ-soft/Developments/_Settings";

// & Function AREA
// &---------------------------------------------------------------------------
// * find github token
const findGithubAccount = (userName: string) => {
  return loadJson(`${settingsPath}/Apis/github.json`)[userName];
};

// & Class AREA
// &---------------------------------------------------------------------------
class Github {
  userName: string;
  account: any;
  octokit: Octokit;

  constructor(userName: string) {
    this.userName = userName;
    this.account = findGithubAccount(userName);
    this.octokit = new Octokit({ auth: this.account.token });
  }

  findAllRepos = () => {
    console.log(this.octokit.rest.repos);
  };

  // findAllRepos = (q) => {
  //   this.octokit.rest.repos.octokit.rest.search.repos({
  //     q,
  //   });
  // }

  createRepo = (options: any) => {
    console.log("1. CREATEREPO");
    // console.log('options', options);
    const defaults = {
      auto_init: true,
      private: false,
      // description: '',
      license_template: "MIT",
    };
    this.octokit.rest.repos.createForAuthenticatedUser({
      ...defaults,
      ...options,
    });
  };

  // createRepoLocal = (options) => {
  //   let cmd = `git clone git clone https://github.com/${this.userName}/${options.repoName}.git`;
  // }

  cloneRepo = (options: any) => {
    let cmd = `git clone https://github.com/${this.userName}/${options.name}.git`;
    // cmd += ` && cd ${options.name}`;
    console.log(cmd);
    execSync(cmd);
    // process;
  };

  changeRepo = (options: any) => {
    let cmd = `cd ${options.name} && git remote remove origin`;
    cmd += ` && git remote add origin https://github.com/${this.userName}/${options.name}`;
    console.log(cmd);
    execSync(cmd);
    // process;
  };

  setConfigRepo = (options: any) => {
    let cmd = `cd ${options.name} && git config user.name "${this.account.fullName}"`;
    cmd += ` && git config user.email "${this.account.email}"`;
    cmd += ` && git remote set-url origin https://${this.account.token}@github.com/${this.userName}/${options.name}.git`;
    console.log(cmd);
    execSync(cmd);
  };

  // * clone Repo -> set config Repo
  copyRepo = (options: any) => {
    this.cloneRepo(options);
    this.setConfigRepo(options);
  };

  // * create Remote Repo -> clone Repo -> set config Repo
  initRepo = (options: any) => {
    this.createRepo(options);
    const self = this;
    // ? Repository 생성후 잠시 대기: 필요한지, 다른 방법 없는지 확인 필요
    setTimeout(function () {
      self.cloneRepo(options);
      self.setConfigRepo(options);
    }, 5000);

    // process;
  };

  pushRepo = (options: any) => {
    const { name, description } = options;
    const { fullName, email, token } = this.account;

    // // create empty repo
    // const [auto_init, gitignore_template, license_template] = [false, null, null];
    // this.createRepo({ name, description, auto_init, gitignore_template, license_template });

    // sleep(10); // 5초 지연
    sleep(3); // 5초 지연
    // * git init
    let cmd = `git init`;
    cmd += ` && git config user.name "${fullName}"`;
    cmd += ` && git config user.email "${email}"`;
    cmd += ` && git remote add origin https://${token}@github.com/${this.userName}/${name}.git`;
    // cmd += ` && git remote set-url origin https://${token}@github.com/${userName}/${repoName}.git`;
    console.log("#### ", cmd);
    execSync(cmd);

    // * git config, add remote
    cmd = `git add . && git commit -m "Initial commit"`;
    console.log("#### ", cmd);
    execSync(cmd);

    // * push
    // cmd = `git push -u origin main`; // master -> main
    // console.log("#### ", cmd);
    // execSync(cmd);
    const branches = execSync("git branch");

    // 조건에 따라 push 명령 실행
    if (branches.includes("main")) {
      execSync("git push -u origin main");
    } else if (branches.includes("master")) {
      execSync("git push -u origin master");
    } else {
      console.log("main 또는 master 브랜치가 없습니다.");
    }
  };

  deleteRepo = (options: any) => {
    // ? TODO: Delete Local Repository
    // owner: The account owner of the repository. The name is not case sensitive.
    // repo: The name of the repository without the .git extension. The name is not case sensitive
    this.octokit.rest.repos.delete(options); // `TestRepo2`
  };
}

// & Export AREA
// &---------------------------------------------------------------------------
export {
  findGithubAccount, // func
  Github, // class
};

// & Test AREA
// &---------------------------------------------------------------------------
// const github = new Github('mooninlearn');

// github.findAllRepos();

// const options = {'repoName': 'svelte-course'}
// github.cloneRepo(options);
// github.setConfigRepo(options);