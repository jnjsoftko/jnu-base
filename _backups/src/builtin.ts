// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules
import * as fs from 'fs';
import Path from 'path';
import type { FileOptions, JsonOptions } from './types.js';


// & Functions AREA
// &---------------------------------------------------------------------------
// * File System
/**
 * remove BOM(Byte Order Mark, `U+FEFF`)
 */
const removeBOM = (str: string) => {
  return str
    .replace(/^\uFEFF/gm, '')
    .replace(/^\u00BB\u00BF/gm, '')
    .replace(/\r\n/g, '\n');
};

/**
 * 폴더이름에 포함된 "\\" => "/"
 */
const slashedFolder = (folderName: string) => {
  folderName = folderName.replace(/\\/g, '/');
  return folderName.endsWith('/') ? folderName.slice(0, -1) : folderName;
};

/**
 * set Path(실행 경로 기준)
 */
const setPath = (path: string) => {
  if (path.startsWith('.')) {
    path = Path.join(process.cwd(), path);
  }
  return slashedFolder(path);
};

/**
 * 한글 조합형 -> 완성형
 */
const composeHangul = (str: string | Buffer | undefined): string => {
  if (!str) return '';
  return str.toString().normalize('NFKC');
};

/**
 * 파일/폴더명으로 사용할 수 없는 문자 제거
 */
const sanitizePath = (str: string) => {
  if (!str) return '';
  str = composeHangul(str);

  // 윈도우에서 파일/폴더명으로 사용할 수 없는 문자 제거
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
  // 마침표(.)로 시작하거나 끝나는 경우 제거
  const invalidDots = /(^\.+|\.+$)/g;
  // 연속된 공백을 하나의 공백으로 변환
  const multipleSpaces = /\s+/g;

  return str
    .replace(invalidChars, '') // 사용할 수 없는 문자 제거
    .replace(invalidDots, '') // 시작/끝 마침표 제거
    .replace(multipleSpaces, ' ') // 연속된 공백을 하나로
    .trim(); // 앞뒤 공백 제거
};

/**
 * 파일명으로 사용가능하도록 문자열 변경
 */
const sanitizeName = (name: string) => {
  if (!name) return '';
  name = composeHangul(name);
  return name
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/[^\uAC00-\uD7A3a-zA-Z0-9_\(\)\<\>,\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Load data(string) from file with charset(encoding)
 */
const loadFile = (path: string, encoding: BufferEncoding = 'utf8') => {
  try {
    return removeBOM(fs.readFileSync(setPath(path), { encoding }));
  } catch {
    return '';
  }
};

/**
 * Load data(json) from file with charset(encoding)
 */
const loadJson = (path: string, encoding: BufferEncoding = 'utf8') => {
  try {
    return JSON.parse(removeBOM(fs.readFileSync(setPath(path), { encoding })));
  } catch {
    return {};
  }
};

/**
 * Save data to file with charset(encoding), create Folder if not exist
 * @remarks
 * if overwrite is false, append data to file
 */
const saveFile = (
  path: string,
  data: any = '',
  {
    encoding = 'utf-8',
    overwrite = true,
    newFile = true
  }: FileOptions = {}
) => {
  path = setPath(path);

  if (newFile && fs.existsSync(path)) {
    const dir = Path.dirname(path);
    const ext = Path.extname(path);
    const baseName = Path.basename(path, ext);
    let counter = 1;

    while (fs.existsSync(path)) {
      path = Path.join(dir, `${baseName}(${counter})${ext}`);
      counter++;
    }
  }

  fs.mkdirSync(Path.dirname(path), { recursive: true });
  overwrite
    ? fs.writeFileSync(path, data, encoding)
    : fs.appendFileSync(path, data, encoding);
};

/**
 * Save object(dict) to file with charset(encoding), create Folder if not exist
 * @remarks
 * # TODO : add `append` func
 */
const saveJson = (
  path: string,
  data = {},
  {
    indent = 2,
    overwrite = true,
    newFile = false
  }: JsonOptions = {}
) => {
  saveFile(
    setPath(path),
    JSON.stringify(data, null, indent),
    { overwrite, newFile }
  );
};

/**
 * make directory if path not exist
 */
const makeDir = (path: string) => {
  fs.mkdirSync(setPath(path), { recursive: true });
};

/**
 * copy fies in srcDir to dstDir recursively
 */
const copyDir = (srcDir: string, dstDir: string, recursive = true) => {
  fs.cpSync(setPath(srcDir), setPath(dstDir), { recursive });
};


/**
 * find All Files In Folder(Recursively) By Pattern
 * @param folder
 * @param  arrayOfFiles
 * @param pattern
 */
const findFiles = (
  folder: string,
  pattern: string | RegExp = '',
  arrayOfFiles: string[] = []
) => {
  if (!fs.existsSync(folder)) return [];
  const files = fs.readdirSync(folder);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(folder + '/' + file).isDirectory()) {
      arrayOfFiles = findFiles(folder + '/' + file, pattern, arrayOfFiles);
    } else {
      const regex = pattern instanceof RegExp
        ? pattern
        : new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(file)) {
        arrayOfFiles.push(Path.join(folder, '/', file));
      }
    }
  });

  return arrayOfFiles;
};

// base_path의 하위 폴더 중에 이름에 pattern을 포함하는 폴더
function findFolders(basePath: string, pattern: string | RegExp = ''): string[] {
  const matchedFolders: string[] = [];

  for (const entry of fs.readdirSync(basePath)) {
    const fullPath = Path.join(basePath, entry);
    const regex = pattern instanceof RegExp
      ? pattern
      : new RegExp(pattern.replace(/\*/g, '.*'));

    if (fs.statSync(fullPath).isDirectory() && regex.test(entry)) {
      matchedFolders.push(slashedFolder(fullPath));
    }
  }
  return matchedFolders;
}

/**
 * exists Folder(폴더 존재여부)
 */
const existsFolder = (folder: string) => fs.existsSync(folder);


/**
 * exists Folder(폴더 존재여부)
 */
const existsFile = (file: string) => fs.existsSync(file);

/**
 * exists Folder(폴더 존재여부)
 */
const exists = (path: string) => fs.existsSync(path);

/**
 * moveFile
 */
const moveFile = (
  srcFolderName: string,
  dstFolderName: string,
  srcFileName: string,
  dstFileName: string
) => {
  srcFolderName = slashedFolder(srcFolderName);
  dstFolderName = slashedFolder(dstFolderName);

  fs.rename(
    `${srcFolderName}/${srcFileName}`,
    `${dstFolderName}/${dstFileName}`,
    (err) => console.log(err)
  );
};

/**
 * moveFiles
 */
const moveFiles = (
  srcFolderName: string,
  dstFolderName: string,
  srcFileNames: string[],
  dstFileNames: string[]
) => {
  srcFolderName = slashedFolder(srcFolderName);
  dstFolderName = slashedFolder(dstFolderName);

  !fs.existsSync(dstFolderName) &&
    fs.mkdirSync(dstFolderName, { recursive: true });
  for (let i = 0; i < srcFileNames.length; i++) {
    const srcFileName = srcFileNames[i];
    const dstFileName = dstFileNames[i];
    fs.rename(
      `${srcFolderName}/${srcFileName}`,
      `${dstFolderName}/${dstFileName}`,
      (err) => console.log(err)
    );
  }
};

/**
 * rename Files In Folder
 * @param folder
 * @param  filterCb
 * @param  mapCb
 */
const renameFilesInFolder = (
  folder: string,
  filterCb: Function,
  mapCb: Function
) => {
  folder = `${process.env.DIR_ROOT}/${folder}`;
  filterCb = (name: string) => name.endsWith('.ts');
  mapCb = (name: string) => `${folder}/${name}`;
  return fs
    .readdirSync(folder)
    .filter((name) => filterCb(name))
    .map((name) => mapCb(name));
};

/*
 * 해당 폴더의 하위 디렉토리(recursive)에 있는 폴더, 파일 삭제
 */
const deleteFilesInFolder = (folderPath: string, pattern: string = 'node_modules/,.git/.DS_Store', recursive = true) => {
  try {
    // 폴더가 존재하지 않으면 종료
    if (!fs.existsSync(folderPath)) {
      return;
    }

    // 패턴을 배열로 변환하고 정규식으로 변환
    const patterns = pattern.split(',').map((p) => {
      // 디렉토리는 그대로 문자열 비교
      if (p.endsWith('/')) return p;
      // 와일드카드가 있는 경우 정규식으로 변환
      if (p.includes('*')) {
        return new RegExp('^' + p.replace(/\*/g, '.*') + '$');
      }
      // 일반 파일은 그대로 문자열 비교
      return p;
    });

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      try {
        const filePath = Path.join(folderPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && recursive) {
          // 디렉토리인 경우
          const isMatchDir = patterns.some((p) => typeof p === 'string' && p.endsWith('/') && file + '/' === p);
          if (isMatchDir) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            deleteFilesInFolder(filePath, pattern, recursive);
          }
        } else if (stat.isFile()) {
          // 파일인 경우
          const isMatchFile = patterns.some((p) => {
            if (p instanceof RegExp) {
              return p.test(file);
            }
            return file === p;
          });
          if (isMatchFile) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (err: any) {
        console.error(`Error processing ${file}: ${err.message}`);
        continue;
      }
    }
    return pattern
  } catch (err: any) {
    console.error(`Error processing folder ${folderPath}: ${err.message}`);
    return "";
  }
};

/**
 * substitute in file
 * @param filePath
 * @param replacements {k1: v1, k2: v2, ...} ("search" -> "replace")
 */
const substituteInFile = (filePath: string, replacements: Record<string, string>) => {
  let content = loadFile(filePath);
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), value);
  }
  saveFile(filePath, content, { overwrite: true, newFile: false });
}


// & Export AREA
// &---------------------------------------------------------------------------
export {
  slashedFolder, //
  composeHangul,
  setPath, // 상대경로->절대경로(실행 폴더 기준) './dir1/dir2' =>
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
  moveFile,
  moveFiles,
  renameFilesInFolder,
  deleteFilesInFolder,
  substituteInFile
};
