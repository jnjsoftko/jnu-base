"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"cleanup",{enumerable:!0,get:function(){return c}});const e=/*#__PURE__*/s(require("fs")),t=/*#__PURE__*/s(require("path")),a=/*#__PURE__*/s(require("crypto")),i=/*#__PURE__*/s(require("sqlite3")),l=require("sqlite");function s(e){return e&&e.__esModule?e:{default:e}}const d=i=>{let l=[],s=i=>{for(let d of e.default.readdirSync(i)){let o=t.default.join(i,d),E=e.default.statSync(o);if(E.isDirectory())s(o);else{let t=e.default.readFileSync(o),i=a.default.createHash("md5").update(t).digest("hex");l.push({path:o,hash:i,size:E.size,modTime:E.mtime})}}};return s(i),l},o=async()=>{let e=t.default.join(process.cwd(),"files.db"),a=await (0,l.open)({filename:e,driver:i.default.Database});return await a.exec(`
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
  `),a},E=e=>({".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".gif":"image/gif",".pdf":"application/pdf",".txt":"text/plain",".md":"text/markdown",".doc":"application/msword",".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document"})[t.default.extname(e).toLowerCase()]||"application/octet-stream",r=async(e,a)=>{let i=new Set;i.add(a.mimeType.split("/")[0]),a.size>0x6400000&&i.add("large-file"),a.size<10240&&i.add("small-file");let l=t.default.basename(a.path).toLowerCase();l.includes("screenshot")&&i.add("screenshot"),l.includes("backup")&&i.add("backup");let s=new Date(a.modTime);return i.add(`year-${s.getFullYear()}`),Array.from(i)},T=async(e,t,a,i="auto")=>{for(let l of a){await e.run("INSERT OR IGNORE INTO tags (name) VALUES (?)",[l]);let{id:a}=await e.get("SELECT id FROM tags WHERE name = ?",[l]);await e.run("INSERT OR IGNORE INTO file_tags (fileId, tagId, source) VALUES (?, ?, ?)",[t,a,i])}},n=async(e,t,a)=>{let i={path:t.path,hash:t.hash,size:t.size,modTime:t.modTime.toISOString(),folder:a,status:"active",mimeType:E(t.path),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},l=await e.run(`INSERT INTO files (path, hash, size, modTime, folder, status, mimeType)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     RETURNING id`,[i.path,i.hash,i.size,i.modTime,i.folder,i.status,i.mimeType]),s=await r(e,i);await T(e,l.lastID,s,"auto")},f=async(e,t)=>await e.all(`
    SELECT f1.path, f1.hash, f1.size
    FROM files f1
    JOIN files f2 ON f1.hash = f2.hash AND f1.size = f2.size
    WHERE f1.folder = ? AND f2.folder != f1.folder
    AND f1.status = 'active' AND f2.status = 'active'
  `,[t]),u=async(e,t,a)=>{await e.run(`
    UPDATE files 
    SET status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE path = ?
  `,[a,t])},c=async(a,i)=>{try{if(a=t.default.normalize(a.trim()),i=t.default.normalize(i.trim()),!e.default.existsSync(a))throw Error(`Source folder does not exist: ${a}`);if(!e.default.existsSync(i))throw Error(`Destination folder does not exist: ${i}`);let l=await o();console.log("Collecting and saving file information...");let s=d(a),E=d(i);for(let e of s)await n(l,e,a);for(let e of E)await n(l,e,i);console.log("Finding duplicates...");let r=await f(l,i);if(r.length>0){console.log(`Found ${r.length} duplicate files`);let a=t.default.join(i,"duplicates.log");for(let s of(e.default.writeFileSync(a,r.map(e=>e.path).join("\n")),r)){let a=t.default.join(i,"_duplicates",t.default.relative(i,s.path));e.default.mkdirSync(t.default.dirname(a),{recursive:!0}),e.default.renameSync(s.path,a),await u(l,s.path,"duplicate")}console.log(`Moved ${r.length} files to _duplicates folder`),console.log("Check duplicates.log for details")}else console.log("No duplicate files found");await l.close()}catch(e){throw console.error("Error during cleanup:",e),e}};