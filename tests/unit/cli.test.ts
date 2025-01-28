import { exec, exe } from '../../src/cli';

describe('CLI Functions', () => {
  describe('exec', () => {
    it('should execute single command', () => {
      const result = exec('echo "test"');
      expect(result).toBe('test');
    });

    it('should handle command with arguments', () => {
      const result = exec('echo "hello world"');
      expect(result).toBe('hello world');
    });
  });

  describe('exe', () => {
    it('should execute multiple commands', () => {
      const results = exe(['echo "test1"', 'echo "test2"']);
      expect(results).toEqual(['test1', 'test2']);
    });

    it('should return results in order', () => {
      const results = exe(['echo "first"', 'echo "second"', 'echo "third"']);
      expect(results).toEqual(['first', 'second', 'third']);
    });
  });
}); 