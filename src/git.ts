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
import type { GithubAccount, RepoOptions } from './types.js';

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
  options.userName = userName;
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
  removeRepo
};
