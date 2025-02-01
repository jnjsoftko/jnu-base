import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

/**
 * 폴더 내 파일들의 정보를 수집
 */
const getFileInfos = (folderPath) => {
  const files = [];

  const readDir = (dir) => {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDir(fullPath); // 재귀적으로 하위 디렉토리 탐색
      } else {
        const fileBuffer = fs.readFileSync(fullPath);
        const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');

        files.push({
          path: fullPath,
          hash: hash,
          size: stat.size,
          modTime: stat.mtime,
        });
      }
    }
  };

  readDir(folderPath);
  return files;
};

/**
 * 중복 파일 정리
 * @param srcFolder 원본 폴더 경로
 * @param dstFolder 대상 폴더 경로 (중복 검사할 폴더)
 */
const cleanup = (srcFolder, dstFolder) => {
  try {
    // 경로 정규화 및 검증
    srcFolder = path.normalize(srcFolder.trim());
    dstFolder = path.normalize(dstFolder.trim());

    // 경로 존재 여부 확인
    if (!fs.existsSync(srcFolder)) {
      throw new Error(`Source folder does not exist: ${srcFolder}`);
    }
    if (!fs.existsSync(dstFolder)) {
      throw new Error(`Destination folder does not exist: ${dstFolder}`);
    }

    // 1. 각 폴더의 파일 정보 수집
    console.log('Collecting file information...');
    console.log(`Source folder: ${srcFolder}`);
    console.log(`Destination folder: ${dstFolder}`);

    const srcFiles = getFileInfos(srcFolder);
    const dstFiles = getFileInfos(dstFolder);

    // 2. 해시값으로 중복 파일 찾기
    const duplicates = [];

    for (const dstFile of dstFiles) {
      const duplicate = srcFiles.find((srcFile) => srcFile.hash === dstFile.hash && srcFile.size === dstFile.size);

      if (duplicate) {
        duplicates.push(dstFile.path);
      }
    }

    // 3. 중복 파일 처리
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate files`);

      // 중복 파일 목록 저장
      const logPath = path.join(dstFolder, 'duplicates.log');
      fs.writeFileSync(logPath, duplicates.join('\n'));

      // 중복 파일 삭제 또는 이동
      for (const file of duplicates) {
        const backupPath = path.join(dstFolder, '_duplicates', path.relative(dstFolder, file));

        // 백업 디렉토리 생성
        fs.mkdirSync(path.dirname(backupPath), { recursive: true });

        // 파일 이동
        fs.renameSync(file, backupPath);
      }

      console.log(`Moved ${duplicates.length} files to _duplicates folder`);
      console.log(`Check duplicates.log for details`);
    } else {
      console.log('No duplicate files found');
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
};

// 테스트 실행
cleanup('D:/_test/src1', 'D:/_test/dst1'); // 공백 제거
