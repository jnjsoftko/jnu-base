#!/bin/bash

# README.md에서 frontmatter 값을 추출 (개선된 방식)
NAME=$(sed -n '/^- name:/p' README.md | cut -d'"' -f2)
DESCRIPTION=$(sed -n '/^- description:/p' README.md | cut -d'"' -f2)
AUTHOR=$(sed -n '/^- author:/p' README.md | cut -d'"' -f2)

# 추출된 값 확인
if [ -z "$NAME" ] || [ -z "$DESCRIPTION" ] || [ -z "$AUTHOR" ]; then
    echo "Error: Failed to extract values from README.md"
    exit 1
fi

# package.json 업데이트
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/{{name}}/$NAME/g" package.json
    sed -i '' "s/{{description}}/$DESCRIPTION/g" package.json
    sed -i '' "s/{{author}}/$AUTHOR/g" package.json
else
    # Linux
    sed -i "s/{{name}}/$NAME/g" package.json
    sed -i "s/{{description}}/$DESCRIPTION/g" package.json
    sed -i "s/{{author}}/$AUTHOR/g" package.json
fi

# README.md의 install 섹션도 업데이트
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/{{name}}/$NAME/g" README.md
else
    # Linux
    sed -i "s/{{name}}/$NAME/g" README.md
fi

echo "Installation completed!"
echo "Name: $NAME"
echo "Description: $DESCRIPTION"
echo "Author: $AUTHOR"
