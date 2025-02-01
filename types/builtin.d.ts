/// <reference types="node" />
/// <reference types="node" />
import type { FileOptions, JsonOptions } from './types.js';
/**
 * 폴더이름에 포함된 "\\" => "/"
 */
declare const slashedFolder: (folderName: string) => string;
/**
 * set Path(실행 경로 기준)
 */
declare const setPath: (path: string) => string;
/**
 * 한글 조합형 -> 완성형
 */
declare const composeHangul: (str: string | Buffer | undefined) => string;
/**
 * 파일명으로 사용가능하도록 문자열 변경
 */
declare const sanitizeName: (name: string) => string;
/**
 * Load data(string) from file with charset(encoding)
 */
declare const loadFile: (path: string, encoding?: BufferEncoding) => string;
/**
 * Load data(json) from file with charset(encoding)
 */
declare const loadJson: (path: string, encoding?: BufferEncoding) => any;
/**
 * Save data to file with charset(encoding), create Folder if not exist
 * @remarks
 * if overwrite is false, append data to file
 */
declare const saveFile: (path: string, data?: any, { encoding, overwrite, newFile }?: FileOptions) => void;
/**
 * Save object(dict) to file with charset(encoding), create Folder if not exist
 * @remarks
 * # TODO : add `append` func
 */
declare const saveJson: (path: string, data?: {}, { indent, overwrite, newFile }?: JsonOptions) => void;
/**
 * make directory if path not exist
 */
declare const makeDir: (path: string) => void;
/**
 * copy fies in srcDir to dstDir recursively
 */
declare const copyDir: (srcDir: string, dstDir: string, recursive?: boolean) => void;
/**
 * find All Files In Folder(Recursively) By Pattern
 * @param folder
 * @param  arrayOfFiles
 * @param pattern
 */
declare const findFiles: (folder: string, pattern?: string | RegExp, arrayOfFiles?: string[]) => string[];
declare function findFolders(basePath: string, pattern?: string | RegExp): string[];
/**
 * exists Folder(폴더 존재여부)
 */
declare const existsFolder: (folder: string) => boolean;
/**
 * exists Folder(폴더 존재여부)
 */
declare const existsFile: (file: string) => boolean;
/**
 * exists Folder(폴더 존재여부)
 */
declare const exists: (path: string) => boolean;
/**
 * moveFile
 */
declare const moveFile: (srcFolderName: string, dstFolderName: string, srcFileName: string, dstFileName: string) => void;
/**
 * moveFiles
 */
declare const moveFiles: (srcFolderName: string, dstFolderName: string, srcFileNames: string[], dstFileNames: string[]) => void;
/**
 * rename Files In Folder
 * @param folder
 * @param  filterCb
 * @param  mapCb
 */
declare const renameFilesInFolder: (folder: string, filterCb: Function, mapCb: Function) => any[];
declare const deleteFilesInFolder: (folderPath: string, pattern?: string, recursive?: boolean) => string | undefined;
/**
 * substitute in file
 * @param filePath
 * @param replacements {k1: v1, k2: v2, ...} ("search" -> "replace")
 */
declare const substituteInFile: (filePath: string, replacements: Record<string, string>) => void;
export { slashedFolder, //
composeHangul, setPath, // 상대경로->절대경로(실행 폴더 기준) './dir1/dir2' =>
sanitizeName, // 파일명으로 사용가능하도록 문자열 변경
loadFile, //
loadJson, //
saveFile, //
saveJson, //
makeDir, //
copyDir, // 폴더 복사(recursive)
findFiles, // 파일 목록
findFolders, // 하위 folder 목록
existsFolder, // 폴더 존재여부
existsFile, // 파일 존재여부
exists, // 존재여부
moveFile, moveFiles, renameFilesInFolder, deleteFilesInFolder, substituteInFile };
//# sourceMappingURL=builtin.d.ts.map