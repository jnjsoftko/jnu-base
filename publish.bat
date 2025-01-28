REM [syntax] publish patch|minor|major
REM default: patch

IF "%~1"=="" (
  SET mode=patch
) ELSE (
  SET mode=%1
)
@REM yarn clean:win && yarn build && npm version %mode% && npm publish
yarn build && npm version %mode% && npm publish