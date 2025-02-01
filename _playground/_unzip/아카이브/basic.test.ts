import {
  ping,
  isEmptyDict,
  isEmpty,
  isFalsy,
  isValidStr,
  serializeNonPOJOs,
  evalStr,
  includesMulti,
  strFromAny,
  rowsFromCsv,
  csvFromRows,
  arrFromArrs,
  popDict,
  newKeys,
  renameKeys,
  overwriteKeys,
  updateKeys,
  arrFromDicts,
  dictFromDuo,
  dictsFromDuos,
  duoFromDict,
  rowsFromDicts,
  dictsFromRows,
  arrsFromDicts,
  dictsFromArrs,
  rowsAddedDefaults,
  swapDict,
  getUpsertDicts,
  removeDictKeys,
  dateKo,
  now,
  timeFromTimestamp,
  delay,
  sleep,
  sleepAsync
} from '../../src/basic';

describe('Basic Functions', () => {
  describe('ping', () => {
    it('should return pong', () => {
      expect(ping()).toBe('pong');
    });
  });

  describe('isEmptyDict', () => {
    it('should return true for empty object', () => {
      expect(isEmptyDict({})).toBe(true);
    });

    it('should return false for non-empty object', () => {
      expect(isEmptyDict({ a: 1 })).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return false for non-empty array', () => {
      expect(isEmpty([1])).toBe(false);
    });
  });

  describe('isFalsy', () => {
    it('should return true for falsy values', () => {
      expect(isFalsy(false)).toBe(true);
      expect(isFalsy(undefined)).toBe(true);
      expect(isFalsy(null)).toBe(true);
      expect(isFalsy(0)).toBe(true);
      expect(isFalsy('')).toBe(true);
      expect(isFalsy({})).toBe(true);
      expect(isFalsy([])).toBe(true);
    });

    it('should return false for truthy values', () => {
      expect(isFalsy(true)).toBe(false);
      expect(isFalsy(1)).toBe(false);
      expect(isFalsy('hello')).toBe(false);
      expect(isFalsy({ a: 1 })).toBe(false);
      expect(isFalsy([1])).toBe(false);
    });
  });

  describe('isValidStr', () => {
    it('should return true for valid strings', () => {
      expect(isValidStr('hello')).toBe(true);
      expect(isValidStr(' hello ')).toBe(true);
    });

    it('should return false for invalid strings', () => {
      expect(isValidStr('')).toBe(false);
      expect(isValidStr(' ')).toBe(false);
      expect(isValidStr(null)).toBe(false);
      expect(isValidStr(undefined)).toBe(false);
      expect(isValidStr(123)).toBe(false);
    });
  });

  describe('serializeNonPOJOs', () => {
    it('should clone object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const result = serializeNonPOJOs(obj);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
    });
  });

  describe('evalStr', () => {
    it('should evaluate expressions in string', () => {
      expect(evalStr('${i + j}', { i: 1, j: 2 })).toBe('3');
      expect(evalStr('Hello ${name}!', { name: 'World' })).toBe('Hello World!');
    });
  });

  describe('includesMulti', () => {
    it('should check if string includes any of array elements', () => {
      expect(includesMulti('hello world', ['hello', 'hi'])).toBe(true);
      expect(includesMulti('hello world', ['hi', 'hey'])).toBe(false);
    });
  });

  describe('strFromAny', () => {
    it('should convert any value to string', () => {
      expect(strFromAny(123)).toBe('123');
      expect(strFromAny({ a: 1 })).toBe('{"a":1}');
      expect(strFromAny('hello ')).toBe('hello');
    });
  });

  describe('CSV Functions', () => {
    describe('rowsFromCsv', () => {
      it('should convert CSV string to 2D array', () => {
        expect(rowsFromCsv('"a","b"\n"1","2"')).toEqual([['a', 'b'], ['1', '2']]);
        expect(rowsFromCsv('a,b\n1,2', ',', false)).toEqual([['a', 'b'], ['1', '2']]);
      });
    });

    describe('csvFromRows', () => {
      it('should convert 2D array to CSV string', () => {
        expect(csvFromRows([['a', 'b'], ['1', '2']])).toBe('"a","b"\n"1","2"\n');
        expect(csvFromRows([['a', 'b'], ['1', '2']], ',', false)).toBe('a,b\n1,2\n');
      });
    });
  });

  describe('Array Functions', () => {
    describe('arrFromArrs', () => {
      it('should extract values from 2D array by index', () => {
        const rows = [[1, 2], [3, 4]];
        expect(arrFromArrs(rows, 1)).toEqual([2, 4]);
        expect(arrFromArrs(rows, 0)).toEqual([1, 3]);
      });
    });
  });

  describe('Dictionary Functions', () => {
    describe('popDict', () => {
      it('should remove key from object', () => {
        const obj = { a: 1, b: 2 };
        expect(popDict(obj, 'a')).toEqual({ b: 2 });
      });
    });

    describe('newKeys', () => {
      it('should create new dict with renamed keys', () => {
        const result = newKeys(
          { 'a': 1, 'b': 2, 'c': 3 },
          { 'a': 'a1', 'c': 'c1', 'd': 'd1' },
          { 'd1': '' }
        );
        expect(result).toEqual({ a1: 1, c1: 3, d1: '' });
      });
    });

    describe('renameKeys', () => {
      it('should rename keys in dict', () => {
        const result = renameKeys(
          { 'a': 1, 'b': 2, 'c': 3 },
          { 'a': 'a1', 'c': 'c1' }
        );
        expect(result).toEqual({ a1: 1, b: 2, c1: 3 });
      });
    });

    describe('overwriteKeys', () => {
      it('should overwrite keys in dict', () => {
        const result = overwriteKeys(
          { 'a': 1, 'b': 2, 'c': 3 },
          { 'a': 'a1', 'c': 'c1', 'd': 'd1' },
          { 'd1': '' }
        );
        expect(result).toEqual({ a1: 1, b: 2, c1: 3, d1: '' });
      });
    });

    describe('updateKeys', () => {
      it('should update keys based on method', () => {
        const dict = { 'a': 1, 'b': 2, 'c': 3 };
        const maps = { 'a': 'a1', 'c': 'c1', 'd': 'd1' };
        const valMap = { 'd1': '' };

        expect(updateKeys(dict, maps, valMap, '', 'new'))
          .toEqual({ a1: 1, c1: 3, d1: '' });
        expect(updateKeys(dict, maps, valMap, '', 'rename'))
          .toEqual({ a1: 1, b: 2, c1: 3 });
        expect(updateKeys(dict, maps, valMap, '', 'update'))
          .toEqual({ a1: 1, b: 2, c1: 3, d1: '' });
      });
    });
  });

  describe('Data Conversion Functions', () => {
    describe('arrFromDicts', () => {
      it('should extract array from dicts by key', () => {
        const dicts = [{ h1: 'v11', h2: 'v12' }, { h1: 'v21', h2: 'v22' }];
        expect(arrFromDicts(dicts, 'h1')).toEqual(['v11', 'v21']);
      });
    });

    describe('dictFromDuo', () => {
      it('should create dict from keys and values arrays', () => {
        expect(dictFromDuo(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 });
      });
    });

    describe('dictsFromDuos', () => {
      it('should create dicts from keys and values arrays', () => {
        expect(dictsFromDuos(['a', 'b'], [[1, 2], [3, 4]]))
          .toEqual([{ a: 1, b: 2 }, { a: 3, b: 4 }]);
      });
    });

    describe('duoFromDict', () => {
      it('should extract keys and values from dict', () => {
        expect(duoFromDict({ h1: 'v11', h2: 'v12' }))
          .toEqual([['h1', 'h2'], ['v11', 'v12']]);
      });
    });
  });

  describe('Date/Time Functions', () => {
    describe('dateKo', () => {
      it('should format date in Korean style', () => {
        expect(dateKo('2023-07-15')).toMatch(/2023\. 7\. 15\. \(토\)/);
      });
    });

    describe('timeFromTimestamp', () => {
      it('should convert timestamp to formatted time string', () => {
        const timestamp = new Date('2023-07-15T14:30:00').getTime();
        expect(timeFromTimestamp(timestamp)).toBe('20230715 14:30:00');
      });
    });
  });

  describe('Async Functions', () => {
    describe('delay', () => {
      it('should delay execution', (done) => {
        const start = Date.now();
        delay(() => {
          const elapsed = Date.now() - start;
          expect(elapsed).toBeGreaterThanOrEqual(100);
          done();
        }, 100);
      });
    });

    describe('sleepAsync', () => {
      it('should sleep for specified time', async () => {
        const start = Date.now();
        await sleepAsync(100);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(100);
      });
    });
  });
}); 