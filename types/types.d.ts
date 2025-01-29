/// <reference types="node" />
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
    userName: string;
    template: string;
    repoName: string;
    description?: string;
    github?: boolean;
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
    description?: string;
    auto_init?: boolean;
    private?: boolean;
    license_template?: string;
};
//# sourceMappingURL=types.d.ts.map