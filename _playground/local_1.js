import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

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
 * 파일 DB 초기화
 */
const initFileDB = async () => {
  // DB 파일 저장 경로 설정
  const dbPath = path.join(process.cwd(), 'files.db');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    -- 파일 테이블
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      hash TEXT NOT NULL,
      size INTEGER NOT NULL,
      modTime TEXT NOT NULL,
      folder TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      mimeType TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 태그 테이블
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 파일-태그 관계 테이블
    CREATE TABLE IF NOT EXISTS file_tags (
      fileId INTEGER,
      tagId INTEGER,
      source TEXT DEFAULT 'manual',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (fileId, tagId),
      FOREIGN KEY (fileId) REFERENCES files(id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
    );

    -- 인덱스
    CREATE INDEX IF NOT EXISTS idx_hash ON files(hash);
    CREATE INDEX IF NOT EXISTS idx_path ON files(path);
    CREATE INDEX IF NOT EXISTS idx_mime ON files(mimeType);
    CREATE INDEX IF NOT EXISTS idx_tags ON tags(name);
  `);

  return db;
};

/**
 * 파일 타입 감지
 */
const detectMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * 자동 태그 생성
 */
const generateAutoTags = async (db, fileRecord) => {
  const tags = new Set();

  // 1. 파일 타입 기반 태그
  tags.add(fileRecord.mimeType.split('/')[0]);

  // 2. 파일 크기 기반 태그
  if (fileRecord.size > 1024 * 1024 * 100) tags.add('large-file');
  if (fileRecord.size < 1024 * 10) tags.add('small-file');

  // 3. 파일명 기반 태그
  const fileName = path.basename(fileRecord.path).toLowerCase();
  if (fileName.includes('screenshot')) tags.add('screenshot');
  if (fileName.includes('backup')) tags.add('backup');

  // 4. 날짜 기반 태그
  const fileDate = new Date(fileRecord.modTime);
  tags.add(`year-${fileDate.getFullYear()}`);

  return Array.from(tags);
};

/**
 * 태그 저장
 */
const saveTags = async (db, fileId, tags, source = 'auto') => {
  for (const tag of tags) {
    await db.run(`INSERT OR IGNORE INTO tags (name) VALUES (?)`, [tag]);
    const { id: tagId } = await db.get(`SELECT id FROM tags WHERE name = ?`, [tag]);
    await db.run(`INSERT OR IGNORE INTO file_tags (fileId, tagId, source) VALUES (?, ?, ?)`, [fileId, tagId, source]);
  }
};

/**
 * 태그로 파일 검색
 */
const findFilesByTags = async (db, tags) => {
  const placeholders = tags.map(() => '?').join(',');
  return await db.all(
    `
    SELECT DISTINCT f.*
    FROM files f
    JOIN file_tags ft ON f.id = ft.fileId
    JOIN tags t ON ft.tagId = t.id
    WHERE t.name IN (${placeholders})
    AND f.status = 'active'
  `,
    tags
  );
};

/**
 * 파일 정보 저장 (태그 포함)
 */
const saveFileInfo = async (db, fileInfo, folder) => {
  const record = {
    path: fileInfo.path,
    hash: fileInfo.hash,
    size: fileInfo.size,
    modTime: fileInfo.modTime.toISOString(),
    folder: folder,
    status: 'active',
    mimeType: detectMimeType(fileInfo.path),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.run(
    `INSERT INTO files (path, hash, size, modTime, folder, status, mimeType)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     RETURNING id`,
    [record.path, record.hash, record.size, record.modTime, record.folder, record.status, record.mimeType]
  );

  const autoTags = await generateAutoTags(db, record);
  await saveTags(db, result.lastID, autoTags, 'auto');
};

/**
 * 중복 파일 검사 (DB 활용)
 */
const findDuplicates = async (db, folder) => {
  return await db.all(
    `
    SELECT f1.path, f1.hash, f1.size
    FROM files f1
    JOIN files f2 ON f1.hash = f2.hash AND f1.size = f2.size
    WHERE f1.folder = ? AND f2.folder != f1.folder
    AND f1.status = 'active' AND f2.status = 'active'
  `,
    [folder]
  );
};

/**
 * 중복 파일 상태 업데이트
 */
const updateFileStatus = async (db, path, status) => {
  await db.run(
    `
    UPDATE files 
    SET status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE path = ?
  `,
    [status, path]
  );
};

/**
 * 중복 파일 정리 (DB 활용)
 */
const cleanup = async (srcFolder, dstFolder) => {
  try {
    srcFolder = path.normalize(srcFolder.trim());
    dstFolder = path.normalize(dstFolder.trim());

    if (!fs.existsSync(srcFolder)) {
      throw new Error(`Source folder does not exist: ${srcFolder}`);
    }
    if (!fs.existsSync(dstFolder)) {
      throw new Error(`Destination folder does not exist: ${dstFolder}`);
    }

    const db = await initFileDB();

    console.log('Collecting and saving file information...');
    const srcFiles = getFileInfos(srcFolder);
    const dstFiles = getFileInfos(dstFolder);

    for (const file of srcFiles) {
      await saveFileInfo(db, file, srcFolder);
    }
    for (const file of dstFiles) {
      await saveFileInfo(db, file, dstFolder);
    }

    console.log('Finding duplicates...');
    const duplicates = await findDuplicates(db, dstFolder);

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate files`);

      const logPath = path.join(dstFolder, 'duplicates.log');
      fs.writeFileSync(logPath, duplicates.map((d) => d.path).join('\n'));

      // 중복 파일 처리
      let movedCount = 0;
      const errors = [];

      for (const file of duplicates) {
        try {
          // 상대 경로 계산 및 백업 경로 생성
          const relativePath = path.relative(dstFolder, file.path);
          const backupPath = path.join(dstFolder, '_duplicates', relativePath);
          const backupDir = path.dirname(backupPath);

          // 원본 파일이 존재하는지 확인
          if (!fs.existsSync(file.path)) {
            console.log(`Original file not found: ${file.path}`);
            continue;
          }

          // 백업 디렉토리 생성
          fs.mkdirSync(backupDir, { recursive: true });

          // 파일 이동
          fs.renameSync(file.path, backupPath);
          await updateFileStatus(db, file.path, 'duplicate');
          movedCount++;
        } catch (err) {
          errors.push({
            file: file.path,
            error: err.message,
          });
          console.error(`Failed to move file: ${file.path}`);
          console.error(`Error: ${err.message}`);
        }
      }

      // 결과 출력
      console.log(`\nResults:`);
      console.log(`- Moved ${movedCount} of ${duplicates.length} files to _duplicates folder`);
      if (errors.length > 0) {
        console.log(`- Failed to move ${errors.length} files`);
        console.log('\nErrors:');
        errors.forEach(({ file, error }) => {
          console.log(`${file}: ${error}`);
        });
      }
      console.log(`\nCheck duplicates.log for full details`);
    } else {
      console.log('No duplicate files found');
    }

    await db.close();
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
};

// 테스트 실행
const main = async () => {
  try {
    const testDirs = {
      src: 'D:/_test/src1',
      dst: 'D:/_test/dst1',
    };

    // 테스트 디렉토리 생성
    for (const dir of Object.values(testDirs)) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    await cleanup(testDirs.src, testDirs.dst);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
