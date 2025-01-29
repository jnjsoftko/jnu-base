/// <reference types="node" />
import type { Dict } from './types';
/**
 * 간단한 테스트용 함수
 * @returns 'pong'
 *
 * @example
 * ```ts
 * ping() // 'pong'
 * ```
 */
declare const ping: () => string;
/**
 * 객체가 빈 객체(`{}`)인지 확인
 * @param obj 검사할 객체
 * @returns 빈 객체이면 true, 아니면 false
 *
 * @example
 * ```ts
 * isEmptyDict({}) // true
 * isEmptyDict({ a: 1 }) // false
 * ```
 */
declare const isEmptyDict: (obj: any) => boolean;
/**
 * 객체가 빈 객체(`{}`) 또는 빈 배열(`[]`)인지 확인
 * @param v 검사할 값
 * @returns 빈 객체/배열이면 true, 아니면 false
 *
 * @example
 * ```ts
 * isEmpty({}) // true
 * isEmpty([]) // true
 * isEmpty({ a: 1 }) // false
 * ```
 */
declare const isEmpty: (v: any) => boolean;
/**
 * Falsy 값인지 확인
 * @param v 검사할 값
 * @returns Falsy이면 true, 아니면 false
 *
 * @example
 * ```ts
 * isFalsy(false) // true
 * isFalsy(undefined) // true
 * isFalsy(null) // true
 * isFalsy(0) // true
 * isFalsy('') // true
 * isFalsy({}) // true
 * ```
 */
declare const isFalsy: (v: any) => boolean;
/**
 * 유효한 문자열인지 확인
 * @param s 검사할 문자열
 * @returns 유효한 문자열이면 true, 아니면 false
 *
 * @example
 * ```ts
 * isValidStr('hello') // true
 * isValidStr('') // false
 * isValidStr(null) // false
 * ```
 */
declare const isValidStr: (s: any) => boolean;
/**
 * NonPOJO 객체를 POJO 객체로 변환
 * @param obj 변환할 객체
 * @returns POJO 객체
 */
declare const serializeNonPOJOs: (obj: any) => any;
/**
 * 문자열 내의 표현식(`${expression}`) 평가
 * @param str 평가할 문자열
 * @param values 표현식에 사용할 값들
 * @returns 평가된 문자열
 *
 * @example
 * ```ts
 * evalStr('${i + j}', { i: 1, j: 2 }) // '3'
 * ```
 */
declare const evalStr: (str: string, values: Dict) => string;
/**
 * 문자열이 배열의 요소 중 하나를 포함하는지 확인
 * @param s 검사할 문자열
 * @param arr 검사할 문자열 배열
 * @returns 포함하면 true, 아니면 false
 *
 * @example
 * ```ts
 * includesMulti('hello world', ['hello', 'hi']) // true
 * ```
 */
declare const includesMulti: (s: string, arr: string[]) => boolean;
/**
 * 어떤 타입의 값을 문자열로 변환
 * @param s 변환할 값
 * @returns 변환된 문자열
 *
 * @example
 * ```ts
 * strFromAny(123) // '123'
 * strFromAny({ a: 1 }) // '{"a":1}'
 * ```
 */
declare const strFromAny: (s: any) => string;
/**
 * CSV 문자열을 2차원 배열로 변환
 * @param csv CSV 문자열
 * @param sep 구분자 (기본값: ',')
 * @param hasQuote 따옴표 포함 여부 (기본값: true)
 * @param newline 줄바꿈 문자 (기본값: '\n')
 * @returns 2차원 배열
 *
 * @example
 * ```ts
 * rowsFromCsv('"a","b"\n"1","2"') // [['a','b'], ['1','2']]
 * ```
 */
declare const rowsFromCsv: (csv: string, sep?: string, hasQuote?: boolean, newline?: string) => string[][];
/**
 * 2차원 배열을 CSV 문자열로 변환
 * @param rows 2차원 배열
 * @param sep 구분자 (기본값: ',')
 * @param hasQuote 따옴표 포함 여부 (기본값: true)
 * @param newline 줄바꿈 문자 (기본값: '\n')
 * @returns CSV 문자열
 *
 * @example
 * ```ts
 * csvFromRows([['a','b'], ['1','2']]) // '"a","b"\n"1","2"'
 * ```
 */
declare const csvFromRows: (rows: any[][], sep?: string, hasQuote?: boolean, newline?: string) => string;
/**
 * 2차원 배열에서 특정 인덱스의 값들을 추출
 * @param rows 2차원 배열
 * @param index 추출할 인덱스
 * @param hasHeader 헤더 포함 여부
 * @returns 추출된 1차원 배열
 *
 * @example
 * ```ts
 * arrFromArrs([[1,2], [3,4]], 1) // [2,4]
 * ```
 */
declare const arrFromArrs: (rows: any[][], index?: number, hasHeader?: boolean) => any[];
/**
 * 객체에서 특정 키를 제거
 * @param obj 대상 객체
 * @param key 제거할 키
 * @returns 키가 제거된 객체
 *
 * @example
 * ```ts
 * popDict({a:1, b:2}, 'a') // {b:2}
 * ```
 */
declare const popDict: (obj: Dict, key: string) => Dict;
/**
 * New Dict Keys(maps의 key들에 대해, 변경된 key 이름으로 dict 생성)
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 * @param valMap - obj에 없는 key(maps에만 있는)에 대한 default값
 * @param dfault - valMap에 없을 때의 default값
 *
 * @example
 * newKeys({ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 'a1', 'c': 'c1', 'd': 'd1' }, {'d1': ''})
 * => { a1: 1, c1: 3, d1: '' }
 */
declare const newKeys: (obj: Record<string, any>, maps: Record<string, string>, valMap: Record<string, any>, dfault?: string) => Record<string, any>;
/**
 * Rename Dict Keys(obj의 key들에 대한 이름 변경(변경 되지 않은 것은 유지))
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 *
 * @example
 * renameKeys({ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 'a1', 'c': 'c1', 'd': 'd1' })
 * =>
 * { a1: 1, b: 2, c1: 3 }
 */
declare const renameKeys: (obj: Record<string, any>, maps: Record<string, string>) => Record<string, any>;
/**
 * Overwrite Dict Keys(newKeys(신규 key 추가) + rename(key 이름 변경))
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 * @param valMap - obj에 없는 key(maps에만 있는)에 대한 default값
 * @param dfault - valMap에 없을 때의 default값
 *
 * @example
 * overwriteKeys({ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 'a1', 'c': 'c1', 'd': 'd1' }, {'d1': ''})
 * =>
 *  { a1: 1, b: 2, c1: 3, d1: '' }
 */
declare const overwriteKeys: (obj: Record<string, any>, maps: Record<string, string>, valMap: Record<string, any>, dfault?: string) => Record<string, any>;
/**
 * Update Dict Keys
 * @param obj - dict
 * @param maps - mapping dict for rename keys
 * @param valMap - obj에 없는 key(maps에만 있는)에 대한 default값
 * @param dfault - valMap에 없을 때의 default값
 * @param method
 *  - new: maps의 key들로만 신규 생성
 *  - rename: obj의 key들에 대한 이름 변경(변경 되지 않은 것은 유지)
 *  - update: new + update(obj 이름 변경, 신규 key 추가)
 *
 * @example
 * const dict = { 'a': 1, 'b': 2, 'c': 3 }
 * const maps = { 'a': 'a1', 'c': 'c1', 'd': 'd1' }
 * const valMap = {'d1': ''}
 * const method = 'new' | 'rename' | 'update';
 * updateKeys(dict, maps, valMap, method)
 * =>
 * - { a1: 1, c1: 3, d1: '' } <= method = 'new'
 * - { a1: 1, b: 2, c1: 3 } <= method = 'rename'
 * - { a1: 1, b: 2, c1: 3, d1: '' } <= method = 'update'
 */
declare const updateKeys: (obj: Record<string, any>, maps: Record<string, string>, valMap: Record<string, any>, dfault?: string, method?: string) => Record<string, any>;
/**
 * Arr From Dicts(Extract array By Key)
 * @param dicts - source dicts
 *
 * @example
 *  arrFromDicts([{'h1': 'v11', 'h1': 'v12'}, {'h1': 'v21', 'h1': 'v22'}], 'h1')
 *   => ['v11', 'v21']
 */
declare const arrFromDicts: (dicts: any[], key: string) => any[];
/**
 * Returns Dict(object) From Duo(Keys, Vals)
 * @param keys - dict keys
 * @param vals - dict values
 *
 * @example
 * dictFromDuo(['a', 'b'], [1, 2]))
 *  => {'a': 1, 'b': 2}
 * ```
 */
declare const dictFromDuo: (keys: any[], vals: any[]) => any;
/**
 * Returns Dicts(objects) From Duos(Keys, Valss)
 * @param keys - dict keys
 * @param vals - array of values
 *
 * @example
 * dictFromDuo(['a', 'b'], [[1, 2], [3,4]])
 *  => [{'a': 1, 'b': 2}, {'a': 3, 'b': 4}]
 */
declare const dictsFromDuos: (keys: any[], valss: any[][]) => any[];
/**
 * Duo From Dict
 * @param obj - source dict
 * @example
 * duoFromDict({'h1': 'v11', 'h1': 'v12'})
 *  => [['h1', 'h2'], ['v11', 'v12']]
 */
declare const duoFromDict: (obj: any) => unknown[][];
/**
 * Rows Added Default Values
 * @param rows - given rows
 * @param valMap - added default values
 * @param isPush -
 *
 * @example
 *  rowsAddedDefaults([['h1', 'h2'], ['v11', 'v12'], ['v21', 'v22']], {'h3': ''}, false)
 *  => [['h1', 'h2', 'h3'], ['v11', 'v12', ''], ['v21', 'v22', '']]
 */
declare const rowsAddedDefaults: (rows: any[], valMap?: {}, isPush?: boolean) => any[][];
/**
 * Dicts From Rows
 * @param rows - source rows
 * @param keyDuo - key mapping [['oldKey1', ...], ['newKey1', ...]]
 * @param dfault - rows에 없는 key인 경우 default값
 * @example
 * dictsFromRows([['h1', 'h2'], ['v11', 'v12'], ['v21', 'v22']],  [['h2', 'h3', 'h1'], ['_h2', '_h3', '_h1']])
 *  => [{ _h2: 'v12', _h3: '', _h1: 'v11' }, { _h2: 'v22', _h3: '', _h1: 'v21' }]  // 순서는 의미가 없을 수 있음
 */
declare const dictsFromRows: (rows: any[][], keyDuo?: any[][], dfault?: string) => any[];
/**
 * Rows From Dicts
 * @param dicts - source dicts
 * @param keyDuo - key mapping [['oldKey1', ...], ['newKey1', ...]]
 * @param dfault - rows에 없는 key인 경우 default값
 * @example
 * rowsFromDicts([{'h1': 'v11', 'h2': 'v12', 'h3': 'v13'}, {'h1': 'v21', 'h2': 'v22', 'h3': 'v13'}], [['h3', 'h4', 'h1'], ['_h3', '_h4', '_h1']], '_v_')
 *  => [[ '_h3', '_h4', '_h1' ], [ 'v13', '_v_', 'v11' ], [ 'v13', '_v_', 'v21' ]]
 */
declare const rowsFromDicts: (dicts: any[], keyDuo?: any[][], dfault?: string) => any[][];
/**
 * Arrs From Dicts
 */
declare const arrsFromDicts: (dicts: Record<any, any>[]) => any[][];
/**
 * Dicts From Arrs
 */
declare const dictsFromArrs: (arrs: any[][]) => Record<any, any>[];
/**
 * Swap Dict Key-Value
 *
 * @example
 * swapDict({a: 1, b: 2})
 * => {'1': 'a', '2': 'b'}
 */
declare const swapDict: (obj: Record<any, any>) => Record<any, any>;
/**
 * Get Upsert Dicts
 * @param olds - 원본 dicts
 * @param news - 출력 dicts
 * @param keys - (동일여부) 비교 대상 keys
 *
 * @example
 * const olds = [{a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6}, {a: 4, b: 6, c: 9}]
 * const news = [{a: 1, b: 2, d: 3}, {a: 4, b: 6, d: 8}, {a: 4, b: 8, d: 10}]
 * const keys = ['a', 'b']
 * let upserts = getUpsertDicts(olds, news, keys)
 * => upserts
 * upserts.adds = [{a: 4, b: 8, d: 10}]  // dicts exist in news, but not exist in olds for keys['a', 'b']. {a: 4, b: 8} is
 * upserts.dels = [{a: 4, b: 5, c: 6}]  // dicts not exist in news, but not exist in olds for keys['a', 'b']. {a: 4, b: 5} is in `news`, but is not in `olds`
 * upserts.upds = [{a: 1, b: 2, d: 3}, {a: 4, b: 6, d: 8}]  // dicts exist in news, and exist in olds for keys['a', 'b']. {a: 1, b: 2}, {a: 4, b: 6} are in `news`, `olds`.
 */
declare function getUpsertDicts<T extends Record<string, any>>(olds: T[] | undefined, news: T[] | undefined, keys: (keyof T)[]): {
    adds: T[];
    dels: T[];
    upds: T[];
};
/**
 * Remove Keys From Dict
 * @param dict - 원본 dict
 * @param keys - 제거할 keys
 *
 * @example
 * removeDictKeys({a: 1, b: 2, c: 3}, ['a', 'c'])
 * => {b: 2}
 */
declare const removeDictKeys: (dict: any, keys: any[]) => any;
/**
 * Convert date string to ko-KR(yyyy년 M월 d일 (요일))
 * @param {string} dateStr The function to delay.
 * @example
 *
 * dateKo('2023-07-15')
 * => 2023년 7월 15일 (토)
 */
declare const dateKo: (dateStr: string) => string;
/**
 * Get Now Date Time ()
 * @param {Object} options options
 *   - timeZone: default 'Asia/Seoul'
 *   - hour12: default false
 *   - format: 'basic'|'ko' default 'basic'
 * @returns {string} Returns detetime string.
 * @example
 *
 * now()
 * => 2023-07-16 14:27:37
 * now({format: 'ko'})
 * => 2023. 7. 16. (일) 14:28:57
 */
declare const now: (options: any) => string;
declare const timeFromTimestamp: (timestamp: number) => string;
/**
 * #source: https://github.com/lodash/lodash/blob/master/delay.js
 * Invokes `func` after `wait` milliseconds. Any additional arguments are
 * provided to `func` when it's invoked.
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * delay(text => console.log(text), 1000, 'later')
 * // => Logs 'later' after one second.
 */
declare const delay: (func: (...args: any[]) => void, wait: number, ...args: any[]) => NodeJS.Timeout;
/**
 * Sleep For Second
 * @param sec
 */
declare const sleep: (sec: number) => void;
/**
 * Sleep For `wait` milliseconds.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @example
 *
 * console.log(new Date())
 * await sleep(1000);
 * console.log(new Date())
 * // => Logs 'later' after one second.
 */
declare const sleepAsync: (wait: number) => Promise<void>;
export { ping, isEmptyDict, isEmpty, isFalsy, isValidStr, serializeNonPOJOs, evalStr, includesMulti, strFromAny, rowsFromCsv, csvFromRows, arrFromArrs, popDict, newKeys, renameKeys, overwriteKeys, updateKeys, arrFromDicts, dictFromDuo, dictsFromDuos, duoFromDict, rowsFromDicts, dictsFromRows, arrsFromDicts, dictsFromArrs, rowsAddedDefaults, swapDict, getUpsertDicts, removeDictKeys, dateKo, now, timeFromTimestamp, delay, sleep, sleepAsync };
//# sourceMappingURL=basic.d.ts.map