import { Octokit } from '@octokit/rest';
import { initRepo, findGithubAccount } from './git.js';
import { getCurrentDir } from './cli.js';

// * temp Function
function getLocalPath(repoName: string) {
  let localPath = getCurrentDir();
  const lastSlug = localPath.split('/').pop();
  if (lastSlug !== repoName) {
    localPath += `/${repoName}`;
  }
  return localPath;
}

const userName = 'jnjsoftweb';
const options = {
  name: 'jnu-doc4',
};

// * github account setup
const account = findGithubAccount(userName ?? '');
account.userName = userName ?? '';
console.log(`#### git account: ${JSON.stringify(account)}`);
const octokit = new Octokit({ auth: account.token });
const localPath = getLocalPath(options.name ?? '') ?? '';

initRepo(octokit, options, account, localPath);
