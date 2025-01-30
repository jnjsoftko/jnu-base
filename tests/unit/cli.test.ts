import { exec, exe, getParentDir, PLATFORM } from '../../src/cli';
import { execSync } from 'child_process';
import Path from 'path';
import { tree } from '../../src/cli';

describe('CLI Functions', () => {
  describe('tree', () => {
    it('tree 명령을 실행하고 결과를 반환해야 함', () => {
      // 실제 tree 함수 실행
      const result = tree({
        exec: '',
        excluded: 'node_modules,dist,_backups,_drafts,types'
      });
      
      // 실행 결과 출력
      console.log('디렉토리 구조:');
      console.log('-------------------');
      console.log(result);
      console.log('-------------------');
      
      // 결과 검증
      expect(typeof result).toBe('string');  // 항상 문자열 반환
      
      // Mac/Linux에서만 검증
      if (PLATFORM !== 'win') {
        expect(result).toBeDefined();
      }
    });
  });
}); 