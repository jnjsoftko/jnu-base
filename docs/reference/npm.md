# NPM (Node Package Manager) 사용법

## 1. 설치 경로

### 전역 설치 경로 (-g)

1. macOS (Homebrew)
```bash
/opt/homebrew/lib/node_modules
```

2. macOS (공식 인스톨러)
```bash
/usr/local/lib/node_modules
```

3. Windows
```bash
%AppData%/npm/node_modules
```

4. Linux
```bash
/usr/lib/node_modules
```

### 전역 설치 경로 확인
```bash
npm root -g
```

### 로컬 설치 경로
- 프로젝트 디렉토리의 `node_modules` 폴더
```bash
./node_modules
```

## 2. 주요 명령어

### 패키지 설치
```bash
# 로컬 설치
npm install [패키지명]
npm i [패키지명]

# 전역 설치
npm install -g [패키지명]

# 개발 의존성으로 설치
npm install --save-dev [패키지명]
npm i -D [패키지명]

# package.json의 모든 의존성 설치
npm install
```

### 패키지 제거
```bash
# 로컬 제거
npm uninstall [패키지명]

# 전역 제거
npm uninstall -g [패키지명]
```

### 패키지 업데이트
```bash
# 단일 패키지 업데이트
npm update [패키지명]

# 모든 패키지 업데이트
npm update

# 전역 패키지 업데이트
npm update -g
```

### 패키지 정보 확인
```bash
# 설치된 패키지 목록
npm list

# 전역 설치된 패키지 목록
npm list -g

# 패키지 정보 확인
npm info [패키지명]

# 패키지 버전 확인
npm version
```

## 3. package.json

### 새 프로젝트 초기화
```bash
npm init

# 기본값으로 초기화
npm init -y
```

### 주요 필드
```json
{
  "name": "프로젝트명",
  "version": "1.0.0",
  "description": "프로젝트 설명",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "패키지명": "버전"
  },
  "devDependencies": {
    "패키지명": "버전"
  }
}
```

## 4. 스크립트 실행
```bash
# package.json의 scripts 실행
npm run [스크립트명]

# 특별 스크립트 (run 생략 가능)
npm start
npm test
npm restart
npm stop
```

## 5. 버전 관리

### 버전 표기법
- 주버전.부버전.수버전 (Major.Minor.Patch)
- 예: 1.2.3

### 버전 범위
```json
{
  "dependencies": {
    "정확한 버전": "1.2.3",
    "최소 버전": ">=1.2.3",
    "최대 버전": "<=1.2.3",
    "범위 지정": ">=1.2.3 <2.0.0",
    "틸드": "~1.2.3",  // 1.2.x
    "캐럿": "^1.2.3"   // 1.x.x
  }
}
```

## 6. npm 캐시

### 캐시 관리
```bash
# 캐시 삭제
npm cache clean --force

# 캐시 확인
npm cache verify
```

## 7. 보안

### 취약점 검사
```bash
# 보안 취약점 검사
npm audit

# 자동 수정 가능한 취약점 수정
npm audit fix
```

## 8. 배포

### 로그인
```bash
npm login
```

### 패키지 배포
```bash
# 패키지 배포
npm publish

# 특정 태그로 배포
npm publish --tag beta
```

### 배포 취소
```bash
npm unpublish [패키지명]@[버전]
```
