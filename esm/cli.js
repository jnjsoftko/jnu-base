import { execSync } from 'child_process';
import Path from 'path';
import { saveFile, substituteInFile } from './builtin.js';
import { findGithubAccount } from './git.js';
const TEMPLATES_ROOT = `${process.env.DEV_CONFIG_ROOT}/Templates` ?? 'C:/JnJ-soft/Developments/Templates';
const PLATFORM = process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'mac' : process.platform === 'linux' ? 'linux' : process.platform;
const execOptions = {
    encoding: 'utf8',
    shell: process.platform === 'win32' ? 'cmd.exe /d /s /c chcp 65001>nul &&' : '/bin/sh'
};
const exec = (cmd)=>{
    const result = execSync(cmd, {
        encoding: 'utf8'
    });
    return result ? result.toString().trim() : '';
};
const exe = (cmds)=>{
    const results = [];
    cmds.forEach((cmd)=>results.push(exec(cmd)));
    return results;
};
const getCurrentDir = ()=>{
    switch(PLATFORM){
        case 'win':
            return execSync('cd', execOptions).toString().trim().replace(/\\/g, '/');
        default:
            return execSync('pwd', execOptions).toString().trim();
    }
};
const getParentDir = ()=>{
    switch(PLATFORM){
        case 'win':
            return Path.dirname(execSync('cd', execOptions).toString().trim().replace(/\\/g, '/'));
        default:
            return Path.dirname(execSync('pwd', execOptions).toString().trim());
    }
};
const initTsSwcNpm = (options)=>{
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
        "{{description}}": options.description ?? ''
    });
    substituteInFile(`${options.repoName}/README.md`, {
        '{{name}}': options.repoName ?? '',
        '{{project-name}}': options.repoName ?? '',
        '{{author}}': `${account.fullName} <${account.email}>`,
        '{{github-id}}': options.userName ?? '',
        "{{description}}": options.description || '',
        '{{parent-dir}}': parentDir,
        '{{current-dir}}': currentDir
    });
    substituteInFile(`${options.repoName}/docs/workflow.md`, {
        '{{name}}': options.repoName ?? '',
        '{{project-name}}': options.repoName ?? '',
        '{{github-id}}': options.userName ?? '',
        "{{description}}": options.description || '',
        '{{parent-dir}}': parentDir,
        '{{current-dir}}': currentDir
    });
    cmd = `cd ${currentDir}/${options.repoName} && npm install`;
    console.log(cmd);
    execSync(cmd, execOptions);
    cmd = `cd ${currentDir}/${options.repoName} && xgit -e makeRepo -u ${options.userName} -n ${options.repoName} -d "${options.description}"`;
    console.log(cmd);
    execSync(cmd, execOptions);
};
const removeApp = (options)=>{
    execSync(`xgit -e deleteRemoteRepo -u ${options.userName} -n ${options.repoName}`, execOptions);
    if (PLATFORM === 'win') {
        execSync(`rmdir /s /q ${options.repoName}`, execOptions);
    } else {
        execSync(`rm -rf ${options.repoName}`, execOptions);
    }
};
const initApp = (options)=>{
    switch(options.template){
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
const zip = (options)=>{
    switch(PLATFORM){
        case 'win':
            try {
                const tempDir = `${options.repoName}_temp`;
                execSync(`xcopy "${options.repoName}" "${tempDir}\\" /E /I /H /Y`, execOptions);
                const excludedItems = options.excluded ? options.excluded.split(',') : [
                    'node_modules',
                    'package-lock.json',
                    'package.json'
                ];
                for (const item of excludedItems){
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
                execSync(`powershell -Command "Compress-Archive -Path ${tempDir}/* -DestinationPath ${options.repoName}.zip -Force"`, execOptions);
                execSync(`rmdir /s /q "${tempDir}"`, execOptions);
            } catch (error) {
                console.error('Error during zip operation:', error);
                throw error;
            }
            break;
        default:
            const excluded = options.excluded ? options.excluded.split(',').map((item)=>`"${item}"`).join(' ') : '"*/node_modules/*" ".git/*"';
            execSync(`zip -r ${options.repoName}.zip ${options.repoName} -x ${excluded}`, execOptions);
            break;
    }
};
const tree = (options)=>{
    switch(PLATFORM){
        case 'win':
            const excludedWin = options.excluded ? options.excluded.split(',').join('|') : 'node_modules|dist|_backups|_drafts|types|docs';
            try {
                const cmd = `powershell -Command "& {
          $OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8;
          tree /F /A | Select-String -NotMatch '${excludedWin}'
        }"`;
                console.log('Command: ', cmd);
                const result = execSync(cmd, {
                    encoding: 'utf8',
                    stdio: 'pipe'
                });
                if (result) {
                    saveFile('tree.txt', result, {
                        overwrite: true,
                        newFile: false
                    });
                }
                return result || '';
            } catch (error) {
                console.error('Error executing tree command:', error);
                return '';
            }
        default:
            const excluded = options.excluded ? `"${options.excluded.split(',').join('|')}"` : '"node_modules|dist|_backups|_drafts|types|docs"';
            const cmd = `tree -I ${excluded} --dirsfirst -L 3`;
            try {
                console.log('Command: ', cmd);
                const result = execSync(cmd, {
                    encoding: 'utf8',
                    stdio: 'pipe'
                });
                if (result) {
                    saveFile('tree.txt', result, {
                        overwrite: true,
                        newFile: false
                    });
                }
                return result || '';
            } catch (error) {
                console.error('Error executing tree command:', error);
                return '';
            }
    }
};
export { TEMPLATES_ROOT, PLATFORM, exec, exe, execOptions, getParentDir, getCurrentDir, initApp, removeApp, zip, tree };

//# sourceMappingURL=cli.js.map