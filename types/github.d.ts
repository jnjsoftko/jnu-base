/** Github
 * References
 *   - [create repository](https://octokit.github.io/rest.js/v19#repos-create-for-authenticated-user)
 */
import { Octokit } from "@octokit/rest";
type GithubAccount = {
    userName: string;
    fullName: string;
    email: string;
    token: string;
};
type RepoOptions = {
    name: string;
    description?: string;
    auto_init?: boolean;
    private?: boolean;
    license_template?: string;
};
/**
 * Github 계정 정보 조회
 * @param userName - Github 사용자명
 * @returns Github 계정 정보
 *
 * @example
 * ```ts
 * const account = findGithubAccount('username');
 * ```
 */
declare const findGithubAccount: (userName: string) => GithubAccount;
/**
 * Github API 작업을 위한 클래스
 */
declare class Github {
    userName: string;
    account: GithubAccount;
    octokit: Octokit;
    constructor(userName: string);
    /**
     * 모든 저장소 목록 조회
     */
    findAllRepos: () => void;
    /**
     * 새 저장소 생성
     * @param options - 저장소 생성 옵션
     */
    createRepo: (options: RepoOptions) => void;
    /**
     * 저장소 복제
     * @param options - 저장소 옵션
     */
    cloneRepo: (options: RepoOptions) => void;
    /**
     * 저장소 원격 주소 변경
     * @param options - 저장소 옵션
     */
    changeRepo: (options: RepoOptions) => void;
    /**
     * Git 설정 변경
     * @param options - 저장소 옵션
     */
    setConfigRepo: (options: RepoOptions) => void;
    /**
     * 저장소 복제 및 설정
     * @param options - 저장소 옵션
     */
    copyRepo: (options: RepoOptions) => void;
    /**
     * 저장소 초기화 (생성, 복제, 설정)
     * @param options - 저장소 옵션
     */
    initRepo: (options: RepoOptions) => void;
    /**
     * 저장소에 변경사항 푸시
     * @param options - 저장소 옵션
     */
    pushRepo: (options: RepoOptions) => void;
    /**
     * 저장소 삭제
     * @param options - 저장소 옵션
     */
    deleteRepo: (options: RepoOptions) => void;
}
export { findGithubAccount, Github };
//# sourceMappingURL=github.d.ts.map