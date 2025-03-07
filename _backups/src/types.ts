// & Types AREA
// &---------------------------------------------------------------------------

/**
 * @module basic
 */
export type Dict = Record<string, any>;

/**
 * @module builtin
 */
export type FileOptions = {
  encoding?: BufferEncoding;
  overwrite?: boolean;
  newFile?: boolean;
};

export type JsonOptions = {
  indent?: number;
  overwrite?: boolean;
  newFile?: boolean;
};

/**
 * @module cli
 */
export type ExecResult = string;
export type ExecResults = string[];

export interface CliOptions {
  exec: string;
  userName?: string;
  template?: string;
  repoName?: string;
  description?: string;
  github?: boolean;
  excluded?: string;
  save?: string;
}

/**
 * @module git
 */
export type GithubAccount = {
  userName: string;
  fullName: string;
  email: string;
  token: string;
};

export type RepoOptions = {
  name: string;
  userName?: string;
  description?: string;
  auto_init?: boolean;
  private?: boolean;
  license_template?: string;
};
