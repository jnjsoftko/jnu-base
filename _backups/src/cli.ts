import { execSync } from "child_process";

// & Types AREA
// &---------------------------------------------------------------------------
type ExecResult = string;
type ExecResults = string[];

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

// & Export AREA
// &---------------------------------------------------------------------------
export { exec, exe };

// & Test AREA
// &---------------------------------------------------------------------------
// console.log(exec("dir /w"));
// console.log(exec("powershell -Command \"Get-ChildItem | Format-Wide\""));