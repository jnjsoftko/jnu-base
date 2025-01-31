import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import Path from 'path';
import { sleep } from './basic.js';
import {
  composeHangul,
  makeDir,
  copyDir,
  loadJson,
  saveJson,
  loadFile,
  saveFile,
  substituteInFile,
} from './builtin.js';
import { findGithubAccount } from './git.js';
import type { ExecResult, ExecResults, CliOptions } from './types.js';

// & Variables AREA
// &---------------------------------------------------------------------------
const TEMPLATES_ROOT = `${process.env.DEV_CONFIG_ROOT}/Templates` ?? 'C:/JnJ-soft/Developments/Templates';
const PLATFORM =
  process.platform === 'win32'
    ? 'win'
    : process.platform === 'darwin'
    ? 'mac'
    : process.platform === 'linux'
    ? 'linux'
    : process.platform;

// Windows 실행 옵션에 코드페이지 변경 명령 추가
const execOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  shell:
    process.platform === 'win32'
      ? 'cmd.exe /d /s /c chcp 65001>nul &&' // UTF-8 코드페이지 설정
      : '/bin/sh',
};

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
  const result = execSync(cmd, { encoding: 'utf8' });
  return result ? result.toString().trim() : '';
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
  cmds.forEach((cmd) => results.push(exec(cmd)));
  return results;
};

/**
 * 현재 디렉토리 경로 반환
 */
const getCurrentDir = (): string => {
  switch (PLATFORM) {
    case 'win':
      return execSync('cd', execOptions).toString().trim().replace(/\\/g, '/');
    default:
      return execSync('pwd', execOptions).toString().trim();
  }
};

/**
 * 현재 디렉토리의 부모 디렉토리 경로 반환
 */
const getParentDir = (): string => {
  switch (PLATFORM) {
    case 'win':
      return Path.dirname(execSync('cd', execOptions).toString().trim().replace(/\\/g, '/'));
    default:
      return Path.dirname(execSync('pwd', execOptions).toString().trim());
  }
};

/**
 * TypeScript + SWC + NPM 프로젝트 초기화
 */
const initTsSwcNpm = (options: CliOptions) => {
  const account = findGithubAccount(options.userName ?? '');
  const parentDir = getParentDir();
  const currentDir = getCurrentDir();

  let cmd = '';

  if (PLATFORM === 'win') {
    cmd = `xcopy "${TEMPLATES_ROOT}\\ts-swc-npm" "${options.repoName}\\" /E /I /H /Y`;
    execSync(cmd, execOptions);
  } else {
    cmd = `cp -r ${TEMPLATES_ROOT}/ts-swc-npm ${options.repoName}`;
    execSync(cmd, execOptions);
  }

  substituteInFile(`${options.repoName}/package.json`, {
    '{{name}}': options.repoName ?? '',
    '{{author}}': `${account.fullName} <${account.email}>`,
    '{{description}}': options.description ?? '',
  });

  substituteInFile(`${options.repoName}/README.md`, {
    '{{name}}': options.repoName ?? '',
    '{{project-name}}': options.repoName ?? '',
    '{{author}}': `${account.fullName} <${account.email}>`,
    '{{github-id}}': options.userName ?? '',
    '{{description}}': options.description || '',
    '{{parent-dir}}': parentDir,
    '{{current-dir}}': currentDir,
  });

  substituteInFile(`${options.repoName}/docs/workflow.md`, {
    '{{name}}': options.repoName ?? '',
    '{{project-name}}': options.repoName ?? '',
    '{{github-id}}': options.userName ?? '',
    '{{description}}': options.description || '',
    '{{parent-dir}}': parentDir,
    '{{current-dir}}': currentDir,
  });

  cmd = `cd ${currentDir}/${options.repoName} && npm install`;
  console.log(cmd);
  execSync(cmd, execOptions);
  cmd = `cd ${currentDir}/${options.repoName} && xgit -e makeRepo -u ${options.userName} -n ${options.repoName} -d "${options.description}"`;
  console.log(cmd);
  execSync(cmd, execOptions);
};

/**
 * 앱 제거 (로컬 + 원격 저장소)
 */
const removeApp = (options: CliOptions) => {
  execSync(`xgit -e deleteRemoteRepo -u ${options.userName} -n ${options.repoName}`, execOptions);
  if (PLATFORM === 'win') {
    execSync(`rmdir /s /q ${options.repoName}`, execOptions);
  } else {
    execSync(`rm -rf ${options.repoName}`, execOptions);
  }
};

/**
 * 템플릿 기반 앱 초기화
 */
const initApp = (options: CliOptions) => {
  switch (options.template) {
    case 'node-simple':
      break;
    case 'ts-swc-npm':
      initTsSwcNpm(options);
      break;
    case 'python-pipenv':
      break;
    case 'flutter':
      break;
  }
};

/**
 * 로컬 프로젝트 압축
 */
const zip = (options: CliOptions) => {
  switch (PLATFORM) {
    case 'win':
      try {
        // 1. 임시 디렉토리 생성
        const tempDir = `${options.repoName}_temp`;
        execSync(`xcopy "${options.repoName}" "${tempDir}\\" /E /I /H /Y`, execOptions);

        // 2. 제외할 파일/폴더 삭제
        const excludedItems = options.excluded
          ? options.excluded.split(',')
          : ['node_modules', 'package-lock.json', 'package.json'];

        for (const item of excludedItems) {
          const itemPath = `${tempDir}/${item}`;
          try {
            if (item.includes('/')) {
              execSync(`rmdir /s /q "${itemPath}"`, execOptions);
            } else {
              execSync(`del /q "${itemPath}"`, execOptions);
            }
          } catch (err) {
            console.log(`Warning: Could not remove ${item}`);
          }
        }

        // 3. 압축
        execSync(
          `powershell -Command "Compress-Archive -Path ${tempDir}/* -DestinationPath ${options.repoName}.zip -Force"`,
          execOptions
        );

        // 4. 임시 디렉토리 삭제
        execSync(`rmdir /s /q "${tempDir}"`, execOptions);
      } catch (error) {
        console.error('Error during zip operation:', error);
        throw error;
      }
      break;

    default:
      const excluded = options.excluded
        ? options.excluded
            .split(',')
            .map((item) => `"${item}"`)
            .join(' ')
        : '"*/node_modules/*" ".git/*"';
      execSync(`zip -r ${options.repoName}.zip ${options.repoName} -x ${excluded}`, execOptions);
      break;
  }
};

/**
 * 프로젝트 구조 분석
 */
const tree = (options: CliOptions): string => {
  switch (PLATFORM) {
    case 'win':
      const excludedWin = options.excluded
        ? options.excluded.split(',').join('|')
        : 'node_modules|dist|_backups|_drafts|types|docs';

      try {
        // PowerShell 실행 정책 우회 및 단순화된 명령어
        const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8; tree /F /A | Select-String -NotMatch '${excludedWin}'"`;
        console.log('Command: ', cmd);

        const result = execSync(cmd, {
          encoding: 'utf8',
          stdio: 'pipe',
        });

        if (result) {
          saveFile('tree.txt', result, { overwrite: true, newFile: false });
        }

        return result || '';
      } catch (error) {
        console.error('Error executing tree command:', error);
        return '';
      }

    default:
      const excluded = options.excluded
        ? `"${options.excluded.split(',').join('|')}"`
        : '"node_modules|dist|_backups|_drafts|types|docs"';

      const cmd = `tree -I ${excluded} --dirsfirst -L 3`;
      try {
        console.log('Command: ', cmd);
        const result = execSync(cmd, {
          encoding: 'utf8',
          stdio: 'pipe',
        });

        if (result) {
          saveFile('tree.txt', result, { overwrite: true, newFile: false });
        }

        return result || '';
      } catch (error) {
        console.error('Error executing tree command:', error);
        return '';
      }
  }
};

// & Export AREA
// &---------------------------------------------------------------------------
export { TEMPLATES_ROOT, PLATFORM, exec, exe, execOptions, getParentDir, getCurrentDir, initApp, removeApp, zip, tree };

// & Test AREA
// &---------------------------------------------------------------------------
// console.log(exec("dir /w"));
// console.log(exec("powershell -Command \"Get-ChildItem | Format-Wide\""));
