/// <reference types="node" />
import { ExecSyncOptionsWithStringEncoding } from 'child_process';
import type { ExecResult, ExecResults, CliOptions } from './types.js';
declare const TEMPLATES_ROOT: string;
declare const PLATFORM: string;
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
declare const exec: (cmd: string) => ExecResult;
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
declare const exe: (cmds: string[]) => ExecResults;
declare const execOptions: ExecSyncOptionsWithStringEncoding;
/**
 * 현재 디렉토리 경로 반환
 */
declare const getCurrentDir: () => string;
/**
 * 현재 디렉토리의 부모 디렉토리 경로 반환
 */
declare const getParentDir: () => string;
/**
 * 앱 제거 (로컬 + 원격 저장소)
 */
declare const removeApp: (options: CliOptions) => void;
/**
 * 템플릿 기반 앱 초기화
 */
declare const initApp: (options: CliOptions) => void;
/**
 * 로컬 프로젝트 압축
 *
 */
declare const zip: (options: CliOptions) => void;
/**
 * 프로젝트 구조 분석
 */
declare const tree: (options: CliOptions) => string;
export { TEMPLATES_ROOT, PLATFORM, exec, exe, execOptions, getParentDir, getCurrentDir, initApp, removeApp, zip, tree };
//# sourceMappingURL=cli.d.ts.map