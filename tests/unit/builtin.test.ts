import {
  slashedFolder,
  setPath,
  sanitizeName,
  loadFile,
  loadJson,
  saveFile,
  saveJson,
  makeDir,
  copyDir,
  findFiles,
  findFolders,
  existsFolder,
  existsFile,
  exists
} from '../../src/builtin';

describe('Builtin Functions', () => {
  describe('Path Manipulation', () => {
    describe('slashedFolder', () => {
      it('should convert backslashes to forward slashes', () => {
        expect(slashedFolder('path\\to\\folder')).toBe('path/to/folder');
      });

      it('should remove trailing slash', () => {
        expect(slashedFolder('path/to/folder/')).toBe('path/to/folder');
      });
    });

    describe('setPath', () => {
      it('should resolve relative path', () => {
        const result = setPath('./test');
        expect(result).toContain('test');
        expect(result).not.toContain('//');
      });
    });

    describe('sanitizeName', () => {
      it('should sanitize filename', () => {
        expect(sanitizeName('[test]')).toBe('(test)');
        expect(sanitizeName('한글 test')).toBe('한글 test');
      });
    });
  });

  describe('File Operations', () => {
    describe('loadFile', () => {
      it('should return empty string for non-existent file', () => {
        expect(loadFile('nonexistent.txt')).toBe('');
      });
    });

    describe('loadJson', () => {
      it('should return empty object for non-existent file', () => {
        expect(loadJson('nonexistent.json')).toEqual({});
      });
    });

    describe('File Existence Checks', () => {
      it('should check if file exists', () => {
        expect(exists('nonexistent')).toBe(false);
      });

      it('should check if folder exists', () => {
        expect(existsFolder('nonexistent')).toBe(false);
      });

      it('should check if file exists', () => {
        expect(existsFile('nonexistent')).toBe(false);
      });
    });

    describe('File Search', () => {
      it('should find files by pattern', () => {
        const files = findFiles(__dirname, '*.test.ts');
        expect(Array.isArray(files)).toBe(true);
        expect(files.some(f => f.endsWith('builtin.test.ts'))).toBe(true);
      });

      it('should find folders by pattern', () => {
        const folders = findFolders(__dirname, 'unit');
        expect(Array.isArray(folders)).toBe(true);
      });
    });
  });
});