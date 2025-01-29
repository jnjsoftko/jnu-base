#!/usr/bin/env node
// & IMPORT
//&============================================================================
import yargs from "yargs";
import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import Path from "path";
import { sleep } from './basic'
import { makeDir, copyDir, loadJson, saveJson, loadFile, saveFile } from './builtin'
import { Github, findGithubAccount } from "./github";
import dotenv from "dotenv";

// & Types AREA
//&============================================================================
interface CommandOptions {
  userName: string;
  lang: string;
  repoName: string;
  description?: string;
  github: boolean;
  template: string;
}

// & CONSTS / VARIABLES
//&============================================================================
const templatesPath = `${process.env.DEV_CONFIG_ROOT}/Templates` ?? "C:/JnJ-soft/Developments/Templates";

// * cli options
const argv = yargs
  .usage("Usage: -u <url> -s <keyword>")
  .option("u", {
    alias: "userName",
    default: "mooninlearn",
    describe: "Name of User",
    type: "string",
    demandOption: true,
  })
  .option("l", {
    // - lang: language(node|python|go|flutter|)
    alias: "lang",
    default: "node",
    describe: "developemnt language",
    type: "string",
  })
  .option("n", {
    alias: "repoName",
    describe: "NameOfRepository",
    type: "string",
    demandOption: true,
  })
  .option("d", {
    alias: "description",
    describe: "Description For Repository",
    type: "string",
  })
  .option("g", {
    alias: "github",
    default: true,
    describe: "Use Github Repository",
    type: "boolean",
  })
  .option("t", {
    alias: "template",
    default: "none-basic-ts",
    describe: "App Template",
    type: "string",
  })
  .parseSync();

const options: CommandOptions = {
  userName: argv.u as string,
  lang: argv.l as string,
  repoName: argv.n as string,
  description: argv.d,
  github: argv.g as boolean,
  template: argv.t as string,
};

// & FUNCTIONS
//&============================================================================
/**
 * Init github
 * @param options
 *  - userName: github user name
 *  - repoName: repository name
 *  - description: project(repository) description
 *
 * @example
 * initGithub({userName: '', repoName: ''})
 */
const initGithub = (options: CommandOptions) => {
  const { userName, repoName, description } = options;
  const cmd = `github -u ${userName} -e initRepo -n ${repoName} -d "${description}"`;
  execSync(cmd);
};

/**
 * Upadte package.json
 * @param userName: github user name
 * @param repoName: repository name
 * @param json: loadJson(`package.json`)
 *
 * @example
 * updatePackageJsonForGithub(userName: '', repoName: '', json: loadJson(`package.json`))
 */
const updatePackageJsonForGithub = (userName: string, repoName: string, json: any) => {
  json = {
    ...json,
    ...{
      repository: {
        type: "git",
        url: `git+https://${userName}@github.com/${userName}/${repoName}.git`,
      },
      bugs: {
        url: `https://github.com/${userName}/${repoName}/issues`,
      },
      homepage: `https://github.com/${userName}/${repoName}#readme`,
    },
  };
  return json;
};

const execOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh'
};

/**
 * Init Nodejs
 * @param options
 *  - userName: github user name
 *  - repoName: repository name
 *  - description: project(repository) description
 *
 * @example
 * initGithub({userName: '', repoName: ''})
 */
const initNode = (options: CommandOptions) => {
  const { userName, repoName, description, template, github } = options;
  const { fullName, email, token } = findGithubAccount(userName);

  // * template 폴더 복사
  const srcDir = Path.join(templatesPath!, `node/${template}`);
  const dstDir = Path.join(process.cwd(), `${repoName}`);

  copyDir(srcDir, dstDir);

  //* package.json 업데이트
  const path = Path.join(process.cwd(), `${repoName}/package.json`);
  let json = loadJson(path);
  json = {
    ...json,
    ...{
      name: repoName,
      version: "0.0.1",
      description: description,
      author: `${fullName} <${email}>`,
    },
  }; // version, description, main, author 업데이트

  // * github
  if (github) {
    json = updatePackageJsonForGithub(userName, repoName, json);
  }

  // ** package.json 저장
  saveJson(path, json);

  // * npm install
  const npmInstallCmd = process.platform === 'win32'
    ? `cd "${dstDir}" && npm install`
    : `cd "${dstDir}" && npm install`;
  execSync(npmInstallCmd, execOptions);

  // * figma
  // * typescript 인 경우
  const generateRandomCode = (n: number): string => {
    let str = "";
    for (let i = 0; i < n; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  };

  if (template.includes("-figma-")) {
    const path = Path.join(process.cwd(), `${repoName}/dist/manifest.json`);
    let json = loadJson(path);
    json = {
      ...json,
      ...{
        name: repoName,
        id: `1${generateRandomCode(17)}`,
      },
    };
    saveJson(path, json);
  }

  // * git 명령어
  const gitCmd = process.platform === 'win32'
    ? `git init && git config user.name "${fullName}" && git config user.email "${email}" && git remote add origin https://${token}@github.com/${userName}/${repoName}.git`
    : `git init && git config user.name "${fullName}" && git config user.email "${email}" && git remote add origin https://${token}@github.com/${userName}/${repoName}.git`;
  console.log("#### ", gitCmd);
  execSync(gitCmd, execOptions);

  // * git commit
  const commitCmd = `git add . && git commit -m "Initial commit"`;
  console.log("#### ", commitCmd);
  execSync(commitCmd, execOptions);

  // * git push
  const branches = execSync("git branch", execOptions);
  if (branches.includes("main")) {
    execSync("git push -u origin main", execOptions);
  } else if (branches.includes("master")) {
    execSync("git push -u origin master", execOptions);
  } else {
    console.log("main 또는 master 브랜치가 없습니다.");
  }
};

/**
 * Init Python
 * @param options
 *  - userName: github user name
 *  - repoName: repository name
 *  - description: project(repository) description
 *
 * @example
 * initGithub({userName: '', repoName: ''})
 */
const initPython = (options: CommandOptions) => {
  const { userName, repoName, description, template, github } = options;
  const { fullName, email } = findGithubAccount(userName);

  // * template 폴더 복사
  const srcDir = Path.join(templatesPath!, `python/${template}`);
  const dstDir = Path.join(process.cwd(), `${repoName}`);

  copyDir(srcDir, dstDir);

  //* setup.cfg 업데이트
  const path = Path.join(process.cwd(), `${repoName}/setup.cfg`);
  const data = { name: repoName, description: description, author: `${fullName} <${email}>` };

  const replacements = { " ": "_0_", "<": "_1_", ">": "_2_" }; // ? Error 유발 문자 치환

  const _datas: string[] = [];
  for (let [key, val] of Object.entries(data)) {
    // * 치환(제한 문자 Error)
    for (let [k, v] of Object.entries(replacements)) {
      if (typeof val === 'string') {
        val = val.replace(new RegExp(k, 'g'), v);
      }
    }
    if (typeof val === 'string') {
      _datas.push(`'${key}':'${val}'`);
    }
  }
  const _data = "{" + _datas.join(",") + "}";
  execSync(`config.exe -a update_cfg -s ${path} -D ${_data}`);

  // 역치환
  let str = loadFile(path);
  for (let [k, v] of Object.entries(replacements)) {
    str = str.replace(new RegExp(v, 'g'), k);
  }
  saveFile(path, str);
};

// & MAIN
//&============================================================================

// ** Init app
//-----------------------------------------------------------------------------
// * init github
if (options.github) {
  console.log("## init github");
  initGithub(options);
  sleep(1); // TODO: 필요한지 확인
}

// * init app
switch (options.lang.toUpperCase()) {
  case "NODE":
    initNode(options);
    break;
  case "PYTHON":
    initPython(options);
    break;
}
