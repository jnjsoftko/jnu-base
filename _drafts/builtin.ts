// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules
import * as fs from 'fs';
import Path from 'path';

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
const composeHangul = (str: string) => {
  return str.normalize('NFKC');
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
  }: {
    encoding?: BufferEncoding,
    overwrite?: boolean,
    newFile?: boolean
  } = {}
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
const saveJson = (path: string, data = {}, {
  indent = 2,
  overwrite = true,
  newFile = false
}: {
  indent?: number,
  overwrite?: boolean,
  newFile?: boolean
} = {}) => {
  saveFile(setPath(path), JSON.stringify(data, null, indent), { overwrite, newFile });
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

// & Export AREA
// &---------------------------------------------------------------------------
export {
  slashedFolder, //
  setPath, // 상대경로->절대경로(실행 폴더 기준) './dir1/dir2' =>
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
};

// & Test AREA
// &---------------------------------------------------------------------------
// const slashedFolder = (folderName: string) => {
//   folderName = folderName.replaceAll("\\", "/");
//   return folderName.endsWith("/") ? folderName.slice(0, -1) : folderName;
// };

// // console.log(slashedFolder("C:\\JnJ-soft\\Playground\\chrome-ts\\node_modules/"));

// const folderName = "C:\\JnJ-soft\\Playground\\chrome-ts\\node_modules";
// console.log(folderName.replaceAll("\\", "/"));

// const folders = findFolders("C:\\JnJ-soft\\Playground\\chrome-ts");
// console.log(folders);

// // saveFile('test.txt', 'Hello, World!');
// saveJson('test.json', { a: 1, b: 2 });
// console.log(exist('./test.json'));

// console.log(findFiles('./', 'map'));
// console.log(findFolders('../', 'blog'));
