1. 프로젝트 생성/설정

## 템플릿 복사

source: "{{template-path}}/ts-swc-npm"
destination: "{{parent-path}}/{{project-name}}"

source:"/Users/moon/JnJ-soft/Projects/@utils/_templates/ts-swc-npm"
destination: "/Users/moon/JnJ-soft/Projects/@utils/node-utils/{{project-name}}"

## macos / linux
```sh
# 템플릿 복사
$ cp -r /Users/moon/JnJ-soft/Projects/@utils/_templates/ts-swc-npm/ /Users/moon/JnJ-soft/Projects/@utils/node-utils/{{project-name}}
# $ cp -r /Users/moon/JnJ-soft/Projects/@utils/_templates/ts-swc-npm/ /Users/moon/JnJ-soft/Projects/@utils/node-utils/jnu-base
$ cd /Users/moon/JnJ-soft/Projects/@utils/node-utils/jnu-base
$ ./install.sh
```

## 프로젝트 설치

### `README.md` 수정

```markdown:README.md
---
- name: "jnu-base"  // 프로젝트 이름
- description: "Jnjsoft Nodejs Utility Library for Base Functions in Typescript"  // 프로젝트 설명
- author: "jnjsoftko(Jnj Soft Ko) <jnjsoft.ko@gmail.com>"  // 저자
- github-id: "jnjsoftko"  // github 아이디
- npm-id: "jnjsoftko"  // npm 아이디
---
```

## install 실행

```sh:install.sh, install.bat
# windows
./install.bat
npm install

# macos / linux
./install.sh
npm install
```

## github 연동

```sh
# github remote repository 생성 & push
github -e pushRepo -n jnu-base -u jnjsoftko -d "Jnjsoft Nodejs Utility Library for Base Functions in Typescript"
```

## npmjs publish
- build && git commit, push && npm publish

### macos / linux

```sh
./publish.sh
```

#### windows

```sh
./publish.bat
```

### cursor.ai 용 문서 수정

#### `.cursorrules` 수정
```yaml:.cursorrules
```

#### nodepads 용 파일 생성

```md:docs/cursor/requirements.md
```

#### nodepads 등록


## 2. 프로젝트 개발

### composer 사용

> 

## 3. 버전 관리
### github


### npmjs

https://www.npmjs.com/
