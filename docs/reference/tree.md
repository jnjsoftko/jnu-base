# Tree 명령어 사용법 참고

## 기본 문법
```bash
tree [옵션] [디렉토리 경로]
```

## 주요 옵션
- `-a`: 숨김 파일 포함
- `-d`: 디렉토리만 표시
- `-L n`: n 레벨까지만 표시 (n은 숫자)
- `-I pattern`: 패턴과 일치하는 파일/폴더 제외
- `-P pattern`: 패턴과 일치하는 파일/폴더만 표시
- `-F`: 파일 타입 표시 (`/`=디렉토리, `*`=실행파일)
- `--dirsfirst`: 디렉토리를 먼저 표시
- `-f`: 전체 경로 표시
- `-s`: 파일 크기 표시
- `-h`: 파일 크기를 사람이 읽기 쉬운 형태로 표시

## 실제 사용 예시

### 1. 기본 프로젝트 구조 보기
```bash
tree .
```

### 2. node_modules 제외하고 보기
```bash
tree -I "node_modules"
```

### 3. 여러 패턴 제외하고 보기
```bash
tree -I "node_modules|dist|.git|*.pyc"
```

### 4. 디렉토리만 2레벨까지 보기
```bash
tree -d -L 2
```

### 5. 숨김 파일 포함하여 보기
```bash
tree -a
```

### 6. 파일 크기와 함께 보기
```bash
tree -sh
```

### 7. 특정 확장자만 보기
```bash
tree -P "*.js|*.ts"
```

### 8. 프로젝트 구조를 마크다운 형식으로 저장
```bash
tree -I "node_modules" > structure.md
```

## 실용적인 조합 예시

### 1. 개발 프로젝트 구조 분석
```bash
tree -I "node_modules|dist|coverage|.git" --dirsfirst -L 3
```

### 2. 문서 프로젝트 구조 분석
```bash
tree -P "*.md|*.pdf|*.doc*" --dirsfirst
```

### 3. 소스 코드 구조 분석
```bash
tree -I "node_modules|dist|.git" -P "*.ts|*.js|*.json" --dirsfirst
```

### 4. 상세 정보 포함 구조 분석
```bash
tree -I "node_modules" -hash --dirsfirst
```

## 주의사항
1. Windows에서는 기본으로 tree 명령이 제한적이므로, Git Bash나 Windows Terminal에서 사용하는 것을 권장합니다
2. macOS에서는 `brew install tree` 명령으로 설치가 필요할 수 있습니다
3. 패턴 매칭에서 `|`를 사용할 때는 따옴표로 감싸야 합니다
4. 큰 프로젝트에서는 적절한 제외 패턴과 깊이 제한을 사용하는 것이 좋습니다

## 출력 예시
```
.
├── src/
│   ├── components/
│   │   ├── Header.ts
│   │   └── Footer.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── index.ts
├── docs/
│   ├── api/
│   └── guide/
├── package.json
└── README.md
```
````
