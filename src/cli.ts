import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import Path from "path";
import { sleep } from './basic';
import { makeDir, copyDir, loadJson, saveJson, loadFile, saveFile, substituteInFile } from './builtin';
import { findGithubAccount } from "./git";
import type { ExecResult, ExecResults, CliOptions } from './types';

// & Types AREA
// &---------------------------------------------------------------------------

// & Variables AREA
// &---------------------------------------------------------------------------
const TEMPLATES_ROOT = `${process.env.DEV_CONFIG_ROOT}/Templates` ?? "C:/JnJ-soft/Developments/Templates";
const PLATFORM = process.platform === 'win32' ? 'win' : 
                process.platform === 'darwin' ? 'mac' : 
                process.platform === 'linux' ? 'linux' : 
                process.platform;

// & Functions AREA
// &---------------------------------------------------------------------------

// * Command Execution Functions
/**
 * 단일 명령어 실행
 * @param cmd 실행할 명령어
 * @returns 명령어 실행 결과
 * 
 * @example
 * ```ts
 * exec('ls -la') // 디렉토리 목록 출력
 * exec('echo "Hello"') // 'Hello'
 * exec('pwd') // 현재 작업 디렉토리 경로
 * ```
 */
const exec = (cmd: string): ExecResult => {
    return execSync(cmd, { encoding: 'utf8' }).toString().trim();
};

/**
 * 여러 명령어 순차 실행
 * @param cmds 실행할 명령어 배열
 * @returns 각 명령어의 실행 결과 배열
 * 
 * @example
 * ```ts
 * exe(['pwd', 'ls -la']) // [현재 경로, 디렉토리 목록]
 * exe(['echo "Hello"', 'echo "World"']) // ['Hello', 'World']
 * ```
 */
const exe = (cmds: string[]): ExecResults => {
    const results: string[] = [];
    cmds.forEach(cmd => results.push(exec(cmd)));
    return results;
};

const execOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh'
};

/**
 * 현재 디렉토리의 부모 디렉토리 경로 반환
 */
const getParentDir = (): string => {
  return Path.dirname(execSync('pwd', execOptions).toString().trim());
};

/**
 * TypeScript + SWC + NPM 프로젝트 초기화
 */
const initTsSwcNpm = (options: CliOptions) => {
  const account = findGithubAccount(options.userName);
  const parentDir = getParentDir();

  switch (PLATFORM) {
    case "win":
      console.log("win");
      break;
    default:
      execSync(`cp -r ${TEMPLATES_ROOT}/ts-swc-npm ${options.repoName}`, execOptions);

      substituteInFile(`${options.repoName}/package.json`, {
        "{{name}}": options.repoName,
        "{{author}}": `${account.fullName} <${account.email}>`, 
        "{{description}}": options.description || "",
      });

      substituteInFile(`${options.repoName}/README.md`, {
        "{{name}}": options.repoName,
        "{{author}}": `${account.fullName} <${account.email}>`, 
        "{{github-id}}": options.userName,
        "{{description}}": options.description || "",
        "{{parent-dir}}": parentDir,
      });

      execSync(`cd ${options.repoName} && npm install`, execOptions);
      execSync(`github -e pushRepo -u ${options.userName} -n ${options.repoName} -d "${options.description}"`, execOptions);
      break;
  }
};

/**
 * 앱 제거 (로컬 + 원격 저장소)
 */
const removeApp = (options: CliOptions) => {
  execSync(`github -e deleteRepo -u ${options.userName} -n ${options.repoName}`, execOptions);
  execSync(`rm -rf ${options.repoName}`, execOptions);
};

/**
 * 템플릿 기반 앱 초기화
 */
const initApp = (options: CliOptions) => {
  switch (options.template) {
    case "node-simple":
      break;
    case "ts-swc-npm":
      initTsSwcNpm(options);
      break;
    case "python-pipenv":
      break;
    case "flutter":
      break;
  }
};

// & Export AREA
// &---------------------------------------------------------------------------
export { 
  TEMPLATES_ROOT,
  PLATFORM,
  exec, 
  exe,
  execOptions,
  getParentDir,
  initApp,
  removeApp
};

// & Test AREA
// &---------------------------------------------------------------------------
// console.log(exec("dir /w"));
// console.log(exec("powershell -Command \"Get-ChildItem | Format-Wide\""));