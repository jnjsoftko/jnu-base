/** Github
 * References
 *   - [create repository](https://octokit.github.io/rest.js/v19#repos-create-for-authenticated-user)
 */

// & Import AREA
// &---------------------------------------------------------------------------
import Path from 'path';

// ? External Modules
import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';

// ? Internal Modules
import { loadJson } from './builtin.js';
import { sleep } from './basic.js';
import { PLATFORM } from './cli.js';

// & Types AREA
// &---------------------------------------------------------------------------
import type { GithubAccount, RepoOptions } from './types.js';

// & Variables AREA
// &---------------------------------------------------------------------------
const settingsPath = `${process.env.DEV_CONFIG_ROOT}/Environments` ?? 'C:/JnJ-soft/Developments/Environments';

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
const createRemoteRepo = (octokit: Octokit, options: RepoOptions) => {
  console.log('#### createRemoteRepo options: ', options);
  const defaults = {
    auto_init: true,
    private: false,
    license_template: 'MIT',
  };
  return octokit.rest.repos.createForAuthenticatedUser({
    ...defaults,
    ...options,
  });
};

/**
 * 빈 저장소 생성
 */
const createRemoteRepoEmpty = (octokit: Octokit, options: RepoOptions) => {
  console.log('#### createRemoteRepoEmpty options: ', options);
  return createRemoteRepo(octokit, {
    ...options,
    auto_init: false,
    license_template: undefined,
  });
};

/**
 * 저장소 삭제
 */
const deleteRemoteRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount) => {
  const { name } = options;
  return octokit.rest.repos.delete({
    owner: account.userName,
    repo: name,
  });
};

/**
 * Git 설정 변경
 */
const setLocalConfig = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  let cmd = `cd ${localPath} && git config user.name "${account.fullName}"`;
  cmd += ` && git config user.email "${account.email}"`;
  cmd += ` && git remote set-url origin https://${account.token}@github.com/${account.userName}/${options.name}.git`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * 로컬 저장소 초기화
 */
const initLocalRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  const { name } = options;
  const { fullName, email, token, userName } = account;

  let cmd = `cd ${localPath} && git init`;
  cmd += ` && git config user.name "${fullName}"`;
  cmd += ` && git config user.email "${email}"`;
  // cmd += ` && git remote add origin https://${token}@github.com/${userName}/${name}.git`;
  cmd += ` && git remote set-url origin https://${account.token}@github.com/${account.userName}/${options.name}.git`;
  cmd += ` && git add . && git commit -m "Initial commit"`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * 저장소 복제
 */
const cloneRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  const cmd = `cd ${Path.dirname(localPath)} && git clone https://${account.token}@github.com/${account.userName}/${
    options.name
  }.git`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * 저장소 초기화 (생성, 복제, 설정)
 */
const initRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  console.log('====GIT.TS initRepo');
  setTimeout(function () {
    createRemoteRepo(octokit, options);
    setLocalConfig(options, account, localPath);
  }, 5000);
  sleep(5);
  cloneRepo(options, account, localPath);
};

/**
 * 저장소 복제 및 설정
 */
const copyRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  cloneRepo(options, account, localPath);
  sleep(10);
  setLocalConfig(options, account, localPath);
};

/**
 * 저장소에 변경사항 푸시
 */
const pushRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  execSync(`cd ${localPath}`);
  const branches = execSync('git branch');
  console.log(`#### pushRepo branches: ${branches}`);
  if (branches.includes('main')) {
    // execSync(`git push https://${account.token}@github.com/${account.userName}/${options.name}.git main`);
    execSync('git push -u origin main');
  } else if (branches.includes('master')) {
    execSync('git push -u origin master');
  } else {
    console.log('main 또는 master 브랜치가 없습니다.');
  }
};

/**
 * 새 저장소 생성 및 초기 커밋
 */
const makeRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  // 빈 저장소 생성
  console.log(`=================== createRemoteRepoEmpty: ${localPath}`);
  createRemoteRepoEmpty(octokit, options);
  // createRemoteRepo(octokit, options);
  sleep(5);
  // 로컬 저장소 초기화
  console.log(`=================== initLocalRepo: ${localPath}`);
  initLocalRepo(options, account, localPath);
  sleep(3);
  // 로컬 저장소 디렉토리로 이동
  // execSync(`cd ${localPath}`);
  // 초기 커밋 및 푸시
  console.log(`=================== pushRepo: ${localPath}`);
  pushRepo(options, account, localPath);
};

/**
 * 로컬 + 원격 저장소 삭제
 * @param options - 저장소 옵션
 */
const removeRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  deleteRemoteRepo(octokit, options, account);
  const { name } = options;
  // 로컬 저장소 부모 디렉토리로 이동
  execSync(`cd ${Path.dirname(localPath)}`);

  if (PLATFORM === 'win') {
    const cmd = `rmdir /s /q ${name}`;
    console.log(cmd);
    execSync(cmd);
  } else {
    const cmd = `rm -rf ${name}`;
    console.log(cmd);
    execSync(cmd);
  }
};

// & Export AREA
// &---------------------------------------------------------------------------
export {
  findGithubAccount,
  findAllRepos,
  createRemoteRepo,
  createRemoteRepoEmpty,
  deleteRemoteRepo,
  cloneRepo,
  setLocalConfig,
  initLocalRepo,
  initRepo,
  copyRepo,
  pushRepo,
  makeRepo,
  removeRepo,
};
