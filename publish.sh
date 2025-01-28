# [syntax] ./publish.sh patch|minor|major
# default: patch

mode=${1:-patch}

# 1. 빌드
yarn clean:mac && yarn build && \

# 2. npm 버전 업데이트
npm version $mode && \

# 3. git 변경사항 커밋 및 푸시
git add . && \
git commit -m "chore: build for publish" && \
git push --follow-tags && \

# 4. npm 배포
npm publish