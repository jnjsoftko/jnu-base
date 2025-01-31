#!/usr/bin/env node
import { Octokit } from '@octokit/rest';
import yargs from 'yargs';
import { findGithubAccount, createRemoteRepo, createRemoteRepoEmpty, setLocalConfig, cloneRepo, initLocalRepo, deleteRemoteRepo, initRepo, copyRepo, pushRepo, makeRepo, removeRepo } from './git.js';
import { getCurrentDir } from './cli.js';
const options = yargs.usage('Usage: -u <url> -s <keyword>').option('e', {
    alias: 'exec',
    default: 'copyRepo',
    describe: 'exec command copyRepo(clone+local config)/makeRepo(create remote+push)/removeRepo(delete remote+local)',
    type: 'string',
    demandOption: true
}).option('u', {
    alias: 'userName',
    default: 'mooninlearn',
    describe: 'Name of User',
    type: 'string'
}).option('n', {
    alias: 'repoName',
    describe: 'NameOfRepository',
    type: 'string'
}).option('d', {
    alias: "description",
    describe: "Description For Repository",
    type: 'string'
}).argv;
function getLocalPath(repoName) {
    let localPath = getCurrentDir();
    const lastSlug = localPath.split('/').pop();
    if (lastSlug !== repoName) {
        localPath += `/${repoName}`;
    }
    return localPath;
}
const account = findGithubAccount(options.userName ?? '');
account.userName = options.userName ?? '';
console.log(`#### git account: ${JSON.stringify(account)}`);
const octokit = new Octokit({
    auth: account.token
});
const localPath = getLocalPath(options.repoName ?? '') ?? '';
switch(options.exec){
    case 'createRemoteRepo':
        createRemoteRepo(octokit, {
            name: options.repoName ?? '',
            description: options.description ?? ''
        });
        break;
    case 'createRemoteRepoEmpty':
        createRemoteRepoEmpty(octokit, {
            name: options.repoName ?? '',
            description: options.description ?? ''
        });
        break;
    case 'deleteRemoteRepo':
        deleteRemoteRepo(octokit, {
            name: options.repoName ?? ''
        }, account);
        break;
    case 'setLocalConfig':
        setLocalConfig({
            name: options.repoName ?? '',
            description: options.description ?? ''
        }, account, localPath);
        break;
    case 'cloneRepo':
        cloneRepo({
            name: options.repoName ?? '',
            description: options.description ?? ''
        }, account, localPath);
        break;
    case 'initLocalRepo':
        initLocalRepo({
            name: options.repoName ?? '',
            description: options.description ?? ''
        }, account, localPath);
        break;
    case 'initRepo':
        console.log('====initRepo');
        initRepo(octokit, {
            name: options.repoName ?? '',
            description: options.description ?? ''
        }, account, localPath);
        break;
    case 'pushRepo':
        pushRepo({
            name: options.repoName ?? '',
            description: options.description ?? ''
        }, account, localPath);
        break;
    case 'copyRepo':
        copyRepo({
            name: options.repoName ?? '',
            description: options.description ?? "description"
        }, account, localPath);
        break;
    case 'makeRepo':
        makeRepo(octokit, {
            name: options.repoName ?? '',
            description: options.description ?? ''
        }, account, localPath);
        break;
    case 'removeRepo':
        removeRepo(octokit, {
            name: options.repoName ?? ''
        }, account, localPath);
        break;
}

//# sourceMappingURL=xgit.js.map