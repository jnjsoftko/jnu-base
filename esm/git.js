import Path from 'path';
import { execSync } from 'child_process';
import { loadJson } from './builtin.js';
import { sleep } from './basic.js';
import { PLATFORM } from './cli.js';
const settingsPath = `${process.env.DEV_CONFIG_ROOT}/Environments` ?? 'C:/JnJ-soft/Developments/Environments';
const findGithubAccount = (userName)=>{
    return loadJson(`${settingsPath}/Apis/github.json`)[userName];
};
const findAllRepos = (octokit)=>{
    console.log(octokit.rest.repos);
};
const createRemoteRepo = (octokit, options)=>{
    console.log('#### createRemoteRepo options: ', options);
    const defaults = {
        auto_init: true,
        private: false,
        license_template: 'MIT'
    };
    return octokit.rest.repos.createForAuthenticatedUser({
        ...defaults,
        ...options
    });
};
const createRemoteRepoEmpty = (octokit, options)=>{
    console.log('#### createRemoteRepoEmpty options: ', options);
    return createRemoteRepo(octokit, {
        ...options,
        auto_init: false,
        license_template: undefined
    });
};
const deleteRemoteRepo = (octokit, options, account)=>{
    const { name } = options;
    console.log(`### deleteRemoteRepo: ${name}`);
    return octokit.rest.repos.delete({
        owner: account.userName,
        repo: name
    });
};
const setLocalConfig = (options, account, localPath)=>{
    let cmd = `cd ${localPath} && git config user.name "${account.fullName}"`;
    cmd += ` && git config user.email "${account.email}"`;
    cmd += ` && git remote set-url origin https://${account.token}@github.com/${account.userName}/${options.name}.git`;
    console.log(cmd);
    execSync(cmd);
};
const initLocalRepo = (options, account, localPath)=>{
    const { name } = options;
    const { fullName, email, token, userName } = account;
    let cmd = `cd ${localPath} && git init`;
    cmd += ` && git config user.name "${fullName}"`;
    cmd += ` && git config user.email "${email}"`;
    cmd += ` && git remote add origin https://${token}@github.com/${userName}/${name}.git`;
    cmd += ` && git add . && git commit -m "Initial commit"`;
    console.log(cmd);
    execSync(cmd);
};
const cloneRepo = (options, account, localPath)=>{
    const cmd = `cd ${Path.dirname(localPath)} && git clone https://${account.token}@github.com/${account.userName}/${options.name}.git`;
    console.log(cmd);
    execSync(cmd);
};
const initRepo = (octokit, options, account, localPath)=>{
    console.log('====GIT.TS initRepo');
    let cmd = `xgit -e createRemoteRepo -u ${account.userName} -n ${options.name}`;
    console.log(`initRepo cmd: ${cmd}`);
    execSync(cmd);
    sleep(5);
    cloneRepo(options, account, localPath);
    sleep(5);
    setLocalConfig(options, account, localPath);
};
const copyRepo = (options, account, localPath)=>{
    cloneRepo(options, account, localPath);
    sleep(10);
    setLocalConfig(options, account, localPath);
};
const pushRepo = (options, account, localPath)=>{
    execSync(`cd ${localPath}`);
    const status = execSync('git status --porcelain', {
        encoding: 'utf8'
    });
    if (status.length > 0) {
        const cmd = `git add . && git commit -m "Initial commit"`;
        console.log('#### ', cmd);
        execSync(cmd);
    }
    const branches = execSync('git branch');
    console.log(`#### pushRepo branches: ${branches}`);
    if (branches.includes('main')) {
        execSync('git push -u origin main --force');
    } else if (branches.includes('master')) {
        execSync('git push -u origin master --force');
    } else {
        console.log('main 또는 master 브랜치가 없습니다.');
    }
};
const makeRepo = (octokit, options, account, localPath)=>{
    let cmd = `xgit -e createRemoteRepo -u ${account.userName} -n ${options.name}`;
    console.log(`initRepo cmd: ${cmd}`);
    execSync(cmd);
    sleep(15);
    console.log(`=================== initLocalRepo: ${localPath}`);
    initLocalRepo(options, account, localPath);
    sleep(5);
    console.log(`=================== pushRepo: ${localPath}`);
    pushRepo(options, account, localPath);
};
const removeRepo = (octokit, options, account, localPath)=>{
    deleteRemoteRepo(octokit, options, account);
    sleep(10);
    const { name } = options;
    if (PLATFORM === 'win') {
        try {
            const cdCmd = `cd ${Path.dirname(localPath)}`;
            console.log(cdCmd);
            execSync(cdCmd);
            const rmCmd = `rmdir /s /q ${name}`;
            console.log(rmCmd);
            execSync(rmCmd);
        } catch (error) {
            console.error('Failed to remove directory:', error);
            try {
                const altCmd = `rd /s /q "${localPath}"`;
                console.log('Trying alternative command:', altCmd);
                execSync(altCmd);
            } catch (err) {
                console.error('Alternative removal also failed:', err);
            }
        }
    } else {
        const cmd = `cd ${Path.dirname(localPath)} && rm -rf ${name}`;
        console.log(cmd);
        execSync(cmd);
    }
};
export { findGithubAccount, findAllRepos, createRemoteRepo, createRemoteRepoEmpty, deleteRemoteRepo, cloneRepo, setLocalConfig, initLocalRepo, initRepo, copyRepo, pushRepo, makeRepo, removeRepo };

//# sourceMappingURL=git.js.map