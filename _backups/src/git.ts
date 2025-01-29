/** Github
 * References
 *   - [create repository](https://octokit.github.io/rest.js/v19#repos-create-for-authenticated-user)
 */

// & Import AREA
// &---------------------------------------------------------------------------
// ? External Modules
import { execSync } from "child_process";
import { Octokit } from "@octokit/rest";

// ? Internal Modules
import { loadJson } from "./builtin.js";
import { sleep } from "./basic.js";

// & Types AREA
// &---------------------------------------------------------------------------
type GithubAccount = {
  userName: string;
  fullName: string;
  email: string;
  token: string;
};

type RepoOptions = {
  name: string;
  description?: string;
  auto_init?: boolean;
  private?: boolean;
  license_template?: string;
};

// & Variables AREA
// &---------------------------------------------------------------------------
const settingsPath = `${process.env.DEV_CONFIG_ROOT}/Environments` ?? "C:/JnJ-soft/Developments/Environments";

// & Functions AREA
// &---------------------------------------------------------------------------
/**
 * Github 계정 정보 조회
 * @param userName - Github 사용자명
 * @returns Github 계정 정보
 * 
 * @example
 * ```ts
 * const account = findGithubAccount('username');
 * ```
 */
const findGithubAccount = (userName: string): GithubAccount => {
  return loadJson(`${settingsPath}/Apis/github.json`)[userName];
};

/**
 * 모든 저장소 목록 조회
 */
const findAllRepos = (octokit: Octokit) => {
  console.log(octokit.rest.repos);
};

/**
 * 새 저장소 생성
 */
const createRepo = (octokit: Octokit, options: RepoOptions) => {
  const defaults = {
    auto_init: true,
    private: false,
    license_template: "MIT",
  };
  return octokit.rest.repos.createForAuthenticatedUser({
    ...defaults,
    ...options,
  });
};

/**
 * 저장소 복제
 */
const cloneRepo = (userName: string, options: RepoOptions) => {
  const cmd = `git clone https://github.com/${userName}/${options.name}.git`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * Git 설정 변경
 */
const setConfigRepo = (options: RepoOptions, account: GithubAccount) => {
  let cmd = `cd ${options.name} && git config user.name "${account.fullName}"`;
  cmd += ` && git config user.email "${account.email}"`;
  cmd += ` && git remote set-url origin https://${account.token}@github.com/${account.userName}/${options.name}.git`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * 저장소 복제 및 설정
 */
const copyRepo = (options: RepoOptions, userName: string, account: GithubAccount) => {
  cloneRepo(userName, options);
  setConfigRepo(options, account);
};

/**
 * 저장소 초기화 (생성, 복제, 설정)
 */
const initRepo = async (options: RepoOptions, userName: string, account: GithubAccount, octokit: Octokit) => {
  await createRepo(octokit, options);
  await sleep(5000);
  cloneRepo(userName, options);
  setConfigRepo(options, account);
};

/**
 * 저장소에 변경사항 푸시
 */
const pushRepo = (options: RepoOptions, account: GithubAccount) => {
  const { name } = options;
  const { fullName, email, token, userName } = account;

  sleep(3);

  let cmd = `git init`;
  cmd += ` && git config user.name "${fullName}"`;
  cmd += ` && git config user.email "${email}"`;
  cmd += ` && git remote add origin https://${token}@github.com/${userName}/${name}.git`;
  console.log(cmd);
  execSync(cmd);

  cmd = `git add . && git commit -m "Initial commit"`;
  console.log(cmd);
  execSync(cmd);

  const branches = execSync("git branch");
  if (branches.includes("main")) {
    execSync("git push -u origin main");
  } else if (branches.includes("master")) {
    execSync("git push -u origin master");
  } else {
    console.log("main 또는 master 브랜치가 없습니다.");
  }
};

/**
 * 저장소 삭제
 */
const deleteRepo = (octokit: Octokit, userName: string, options: RepoOptions) => {
  const { name } = options;
  return octokit.rest.repos.delete({
    owner: userName,
    repo: name
  });
};

/**
 * 빈 저장소 생성
 */
const emptyRepo = (octokit: Octokit, options: RepoOptions) => {
  return createRepo(octokit, {
    ...options,
    auto_init: false,
    license_template: undefined,
  });
};

/**
 * 새 저장소 생성 및 초기 커밋
 */
const makeRepo = async (options: RepoOptions, userName: string, account: GithubAccount, octokit: Octokit) => {
  // 빈 저장소 생성
  await emptyRepo(octokit, options);
  await sleep(3);
  
  // 초기 커밋 및 푸시
  pushRepo(options, account);
};

/**
 * 로컬 + 원격 저장소 삭제
 * @param options - 저장소 옵션
 */
const removeRepo = (octokit: Octokit, userName: string, options: RepoOptions) => {
  deleteRepo(octokit, userName, options);
  const { name } = options;
  const cmd = `rm -rf ${name}`;
  console.log(cmd);
  execSync(cmd);
};

// & Classes AREA
// &---------------------------------------------------------------------------
/**
 * Github API 작업을 위한 클래스
 */
class Github {
  userName: string;
  account: GithubAccount;
  octokit: Octokit;

  constructor(userName: string) {
    this.userName = userName;
    this.account = findGithubAccount(userName);
    this.octokit = new Octokit({ auth: this.account.token });
  }

  /**
   * 모든 저장소 목록 조회
   */
  findAllRepos = () => {
    console.log(this.octokit.rest.repos);
  };

  /**
   * 새 저장소 생성
   * @param options - 저장소 생성 옵션
   */
  createRepo = (options: RepoOptions) => {
    const defaults = {
      auto_init: true,
      private: false,
      license_template: "MIT",
    };
    this.octokit.rest.repos.createForAuthenticatedUser({
      ...defaults,
      ...options,
    });
  };

  /**
   * 저장소 복제
   * @param options - 저장소 옵션
   */
  cloneRepo = (options: RepoOptions) => {
    const cmd = `git clone https://github.com/${this.userName}/${options.name}.git`;
    console.log(cmd);
    execSync(cmd);
  };

  /**
   * 저장소 원격 주소 변경
   * @param options - 저장소 옵션
   */
  changeRepo = (options: RepoOptions) => {
    let cmd = `cd ${options.name} && git remote remove origin`;
    cmd += ` && git remote add origin https://github.com/${this.userName}/${options.name}`;
    console.log(cmd);
    execSync(cmd);
  };

  /**
   * Git 설정 변경
   * @param options - 저장소 옵션
   */
  setConfigRepo = (options: RepoOptions) => {
    let cmd = `cd ${options.name} && git config user.name "${this.account.fullName}"`;
    cmd += ` && git config user.email "${this.account.email}"`;
    cmd += ` && git remote set-url origin https://${this.account.token}@github.com/${this.userName}/${options.name}.git`;
    console.log(cmd);
    execSync(cmd);
  };

  /**
   * 저장소 복제 및 설정
   * @param options - 저장소 옵션
   */
  copyRepo = (options: RepoOptions) => {
    this.cloneRepo(options);
    this.setConfigRepo(options);
  };

  /**
   * 저장소 초기화 (생성, 복제, 설정)
   * @param options - 저장소 옵션
   */
  initRepo = (options: RepoOptions) => {
    this.createRepo(options);
    const self = this;
    setTimeout(() => {
      self.cloneRepo(options);
      self.setConfigRepo(options);
    }, 5000);
  };

  /**
   * 저장소에 변경사항 푸시
   * @param options - 저장소 옵션
   */
  pushRepo = (options: RepoOptions) => {
    const { name } = options;
    const { fullName, email, token } = this.account;

    sleep(3);

    let cmd = `git init`;
    cmd += ` && git config user.name "${fullName}"`;
    cmd += ` && git config user.email "${email}"`;
    cmd += ` && git remote add origin https://${token}@github.com/${this.userName}/${name}.git`;
    console.log(cmd);
    execSync(cmd);

    cmd = `git add . && git commit -m "Initial commit"`;
    console.log(cmd);
    execSync(cmd);

    const branches = execSync("git branch");
    if (branches.includes("main")) {
      execSync("git push -u origin main");
    } else if (branches.includes("master")) {
      execSync("git push -u origin master");
    } else {
      console.log("main 또는 master 브랜치가 없습니다.");
    }
  };

  /**
   * 원격 저장소 삭제
   * @param options - 저장소 옵션
   */
  deleteRepo = (options: RepoOptions) => {
    const { name } = options;
    this.octokit.rest.repos.delete({
      owner: this.userName,
      repo: name
    });
  };

}

// & Export AREA
// &---------------------------------------------------------------------------
export {
  findGithubAccount,
  findAllRepos,
  createRepo,
  cloneRepo,
  setConfigRepo,
  copyRepo,
  initRepo,
  pushRepo,
  deleteRepo,
  makeRepo,
  emptyRepo,
  removeRepo,
  Github
};

// & Test AREA
// &---------------------------------------------------------------------------
// const github = new Github('mooninlearn');

// github.findAllRepos();

// const options = {'repoName': 'svelte-course'}
// github.cloneRepo(options);
// github.setConfigRepo(options);