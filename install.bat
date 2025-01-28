@echo off
setlocal EnableDelayedExpansion

:: README.md에서 frontmatter 값 추출 (개선된 방식)
for /f "tokens=2 delims=^"" %%a in ('findstr "^- name:" README.md') do (
    set "NAME=%%a"
)

for /f "tokens=2 delims=^"" %%a in ('findstr "^- description:" README.md') do (
    set "DESCRIPTION=%%a"
)

for /f "tokens=2 delims=^"" %%a in ('findstr "^- author:" README.md') do (
    set "AUTHOR=%%a"
)

:: 값이 제대로 추출되었는지 확인
if "!NAME!"=="" (
    echo Error: Failed to extract name from README.md
    exit /b 1
)
if "!DESCRIPTION!"=="" (
    echo Error: Failed to extract description from README.md
    exit /b 1
)
if "!AUTHOR!"=="" (
    echo Error: Failed to extract author from README.md
    exit /b 1
)

:: 임시 파일 생성 및 package.json 업데이트
type package.json | (
    for /f "delims=" %%i in ('type package.json') do (
        set "line=%%i"
        set "line=!line:{{name}}=%NAME%!"
        set "line=!line:{{description}}=%DESCRIPTION%!"
        set "line=!line:{{author}}=%AUTHOR%!"
        echo !line!
    )
) > package.json.tmp
move /y package.json.tmp package.json

:: README.md 업데이트
type README.md | (
    for /f "delims=" %%i in ('type README.md') do (
        set "line=%%i"
        set "line=!line:{{name}}=%NAME%!"
        echo !line!
    )
) > README.md.tmp
move /y README.md.tmp README.md

echo Installation completed!
echo Name: !NAME!
echo Description: !DESCRIPTION!
echo Author: !AUTHOR!

endlocal
