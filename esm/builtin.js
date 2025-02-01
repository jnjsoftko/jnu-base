import * as fs from 'fs';
import Path from 'path';
const removeBOM = (str)=>{
    return str.replace(/^\uFEFF/gm, '').replace(/^\u00BB\u00BF/gm, '').replace(/\r\n/g, '\n');
};
const slashedFolder = (folderName)=>{
    folderName = folderName.replace(/\\/g, '/');
    return folderName.endsWith('/') ? folderName.slice(0, -1) : folderName;
};
const setPath = (path)=>{
    if (path.startsWith('.')) {
        path = Path.join(process.cwd(), path);
    }
    return slashedFolder(path);
};
const composeHangul = (str)=>{
    if (!str) return '';
    return str.toString().normalize('NFKC');
};
const sanitizePath = (str)=>{
    if (!str) return '';
    str = composeHangul(str);
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
    const invalidDots = /(^\.+|\.+$)/g;
    const multipleSpaces = /\s+/g;
    return str.replace(invalidChars, '').replace(invalidDots, '').replace(multipleSpaces, ' ').trim();
};
const sanitizeName = (name)=>{
    if (!name) return '';
    name = composeHangul(name);
    return name.replace(/\[/g, '(').replace(/\]/g, ')').replace(/[^\uAC00-\uD7A3a-zA-Z0-9_\(\)\<\>,\s]/g, '').replace(/\s+/g, ' ').trim();
};
const loadFile = (path, encoding = 'utf8')=>{
    try {
        return removeBOM(fs.readFileSync(setPath(path), {
            encoding
        }));
    } catch  {
        return '';
    }
};
const loadJson = (path, encoding = 'utf8')=>{
    try {
        return JSON.parse(removeBOM(fs.readFileSync(setPath(path), {
            encoding
        })));
    } catch  {
        return {};
    }
};
const saveFile = (path, data = '', { encoding = 'utf-8', overwrite = true, newFile = true } = {})=>{
    path = setPath(path);
    if (newFile && fs.existsSync(path)) {
        const dir = Path.dirname(path);
        const ext = Path.extname(path);
        const baseName = Path.basename(path, ext);
        let counter = 1;
        while(fs.existsSync(path)){
            path = Path.join(dir, `${baseName}(${counter})${ext}`);
            counter++;
        }
    }
    fs.mkdirSync(Path.dirname(path), {
        recursive: true
    });
    overwrite ? fs.writeFileSync(path, data, encoding) : fs.appendFileSync(path, data, encoding);
};
const saveJson = (path, data = {}, { indent = 2, overwrite = true, newFile = false } = {})=>{
    saveFile(setPath(path), JSON.stringify(data, null, indent), {
        overwrite,
        newFile
    });
};
const makeDir = (path)=>{
    fs.mkdirSync(setPath(path), {
        recursive: true
    });
};
const copyDir = (srcDir, dstDir, recursive = true)=>{
    fs.cpSync(setPath(srcDir), setPath(dstDir), {
        recursive
    });
};
const findFiles = (folder, pattern = '', arrayOfFiles = [])=>{
    if (!fs.existsSync(folder)) return [];
    const files = fs.readdirSync(folder);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(folder + '/' + file).isDirectory()) {
            arrayOfFiles = findFiles(folder + '/' + file, pattern, arrayOfFiles);
        } else {
            const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern.replace(/\*/g, '.*'));
            if (regex.test(file)) {
                arrayOfFiles.push(Path.join(folder, '/', file));
            }
        }
    });
    return arrayOfFiles;
};
function findFolders(basePath, pattern = '') {
    const matchedFolders = [];
    for (const entry of fs.readdirSync(basePath)){
        const fullPath = Path.join(basePath, entry);
        const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern.replace(/\*/g, '.*'));
        if (fs.statSync(fullPath).isDirectory() && regex.test(entry)) {
            matchedFolders.push(slashedFolder(fullPath));
        }
    }
    return matchedFolders;
}
const existsFolder = (folder)=>fs.existsSync(folder);
const existsFile = (file)=>fs.existsSync(file);
const exists = (path)=>fs.existsSync(path);
const moveFile = (srcFolderName, dstFolderName, srcFileName, dstFileName)=>{
    srcFolderName = slashedFolder(srcFolderName);
    dstFolderName = slashedFolder(dstFolderName);
    fs.rename(`${srcFolderName}/${srcFileName}`, `${dstFolderName}/${dstFileName}`, (err)=>console.log(err));
};
const moveFiles = (srcFolderName, dstFolderName, srcFileNames, dstFileNames)=>{
    srcFolderName = slashedFolder(srcFolderName);
    dstFolderName = slashedFolder(dstFolderName);
    !fs.existsSync(dstFolderName) && fs.mkdirSync(dstFolderName, {
        recursive: true
    });
    for(let i = 0; i < srcFileNames.length; i++){
        const srcFileName = srcFileNames[i];
        const dstFileName = dstFileNames[i];
        fs.rename(`${srcFolderName}/${srcFileName}`, `${dstFolderName}/${dstFileName}`, (err)=>console.log(err));
    }
};
const renameFilesInFolder = (folder, filterCb, mapCb)=>{
    folder = `${process.env.DIR_ROOT}/${folder}`;
    filterCb = (name)=>name.endsWith('.ts');
    mapCb = (name)=>`${folder}/${name}`;
    return fs.readdirSync(folder).filter((name)=>filterCb(name)).map((name)=>mapCb(name));
};
const deleteFilesInFolder = (folderPath, pattern = 'node_modules/,.git/.DS_Store', recursive = true)=>{
    try {
        if (!fs.existsSync(folderPath)) {
            return;
        }
        const patterns = pattern.split(',').map((p)=>{
            if (p.endsWith('/')) return p;
            if (p.includes('*')) {
                return new RegExp('^' + p.replace(/\*/g, '.*') + '$');
            }
            return p;
        });
        const files = fs.readdirSync(folderPath);
        for (const file of files){
            try {
                const filePath = Path.join(folderPath, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory() && recursive) {
                    const isMatchDir = patterns.some((p)=>typeof p === 'string' && p.endsWith('/') && file + '/' === p);
                    if (isMatchDir) {
                        fs.rmSync(filePath, {
                            recursive: true,
                            force: true
                        });
                    } else {
                        deleteFilesInFolder(filePath, pattern, recursive);
                    }
                } else if (stat.isFile()) {
                    const isMatchFile = patterns.some((p)=>{
                        if (p instanceof RegExp) {
                            return p.test(file);
                        }
                        return file === p;
                    });
                    if (isMatchFile) {
                        fs.unlinkSync(filePath);
                    }
                }
            } catch (err) {
                console.error(`Error processing ${file}: ${err.message}`);
                continue;
            }
        }
    } catch (err) {
        console.error(`Error processing folder ${folderPath}: ${err.message}`);
    }
};
const substituteInFile = (filePath, replacements)=>{
    let content = loadFile(filePath);
    for (const [key, value] of Object.entries(replacements)){
        content = content.replace(new RegExp(key, 'g'), value);
    }
    saveFile(filePath, content, {
        overwrite: true,
        newFile: false
    });
};
export { slashedFolder, composeHangul, setPath, sanitizeName, loadFile, loadJson, saveFile, saveJson, makeDir, copyDir, findFiles, findFolders, existsFolder, existsFile, exists, moveFile, moveFiles, renameFilesInFolder, deleteFilesInFolder, substituteInFile };

//# sourceMappingURL=builtin.js.map