// & Functions AREA
// &---------------------------------------------------------------------------
// * types
// type Str = string | undefined | null;

// * Test
/**
 * Ping(Test)
 */
const ping = () => 'pong';

// * Check
/**
 * Check Dict Empty(`{}`)
 * @remarks
 *  - method1: _.isEmpty(obj)
 *  - method2: obj && Object.keys(obj).length === 0 && obj.constructor === Object
 *  -
 */
const isEmptyDict = (obj: any) => JSON.stringify(obj) === '{}';

/**
 * Check Empty Dict or Arr(`[]`)
 * @remarks
 */
const isEmpty = (v: any) =>
  JSON.stringify(v) === '{}' || JSON.stringify(v) === '[]';

/**
 * Check Falsy
 * @remarks
 *  - method1: _falsey(v) || _.isEmpty(v)
 */
const isFalsy = (v: any) => {
  return (
    v === false ||
    v === undefined ||
    v === null ||
    Number.isNaN(v) ||
    v === 0 ||
    v.length === 0 ||
    Object.keys(v).length === 0
  );
};

/**
 * Check String Valid
 * @remarks
 */
const isValidStr = (s: any) => {
  return !(s === null || s.trim() === '' || typeof s !== 'string');
};

// * Convert Object
/**
 * Serialize NonPOJOs
 * @remarks
 */
const serializeNonPOJOs = (obj: any) => {
  return structuredClone(obj);
};

// * String
/**
 * Evaluate String including `${expression}`
 *
 * @example
 * evalStr('https://www.a.com/pgno=${i}&test=${j+1}&test2=${k+3}&test3=${i+5}', { i: 5, j: 6, k:7 });
 * => 'https://www.a.com/pgno5&test=7&test2=10&test3=10'
 */
const evalStr = (str: string, values: any) => {
  const regex = /\${(.*?)}/g;
  return str.replace(regex, (match, expression) => {
    const code = `return ${expression}`;
    const value = new Function(...Object.keys(values), code)(
      ...Object.values(values)
    );
    return value;
  });
};

/**
 * Check Includes at Multiple String(array)
 *
 * @example
 * includesMulti('abcde', ['f', 'c']) => true
 */
const includesMulti = (s: string, arr: string[]) => {
  for (let a of arr) {
    if (s.includes(a)) {
      return true;
    }
  }
  return false;
};

/**
 * String From Any Data
 */
const strFromAny = (s: any) =>
  typeof s == 'string' ? s.trim() : JSON.stringify(s);



/**
 * Convert Comma-Separated Values(`csv`) => Array of Array(`rows`)
 * @param csv - csv string
 * @param sep - csv seperator / default=','
 * @param hasQuote
 * @param newline
 *
 * @example
 * csv = `"a "," b","c"
 * "1","2","3"
 * "4","5","6"`
 * rowsFromCsv(csv)
 *  => [["a", "b", "c"], ["1","2","3"], ["4","5","6"]]
 */
const rowsFromCsv = (
  csv: string,
  sep = ',',
  hasQuote = true,
  newline = '\n'
) => {
  const rows = [];
  for (const line of csv.split(newline)) {
    if (hasQuote) {
      rows.push(
        line
          .slice(1, -1)
          .split(`"${sep}"`)
          .map((s) => s.trim())
      );
    } else {
      rows.push(line.split(sep).map((s) => s.trim()));
    }
  }
  return rows;
};

/**
 * Array of Array(`rows`) => Convert Comma-Separated Values(`csv`)
 * @param rows -
 * @param sep - csv seperator / default=','
 * @param hasQuote
 * @param newline
 *
 * @example
 * csvFromRows([["a", "b", "c"], ["1","2","3"], ["4","5","6"]])
 *  => `"a "," b","c"
 * "1","2","3"
 * "4","5","6"`
 */
const csvFromRows = (rows: any, sep = ',', hasQuote = true, newline = '\n') => {
  let str = '';
  for (const row of rows) {
    if (hasQuote) {
      str += `"${row.join('"' + sep + '"')}"${newline}`;
    } else {
      str += `${row.join(sep)}${newline}`;
    }
  }
  return str;
};

// * Arr, Arrs, Rows, Duo, Duos, Dict, Dicts
/**
 * Returns arr From arrs(array of array).
 *
 * @param arrs - source arrays
 * @param index - extracted target index(추출하고자 하는 배열의 index값)
 * @hasHeader - has header (bool)
 *
 * @example
 * arrFromRows([[1, 2, 3], [4, 5, 6]], 1)
 *  => [2, 5]
 */
const arrFromArrs = (rows: any[], index = 0, hasHeader = false) => {
  const arr = rows.map((c) => c[index]);
  return hasHeader ? arr.slice(1) : arr;
};

/**
 * Pop Dict By Key
 * @param obj - dict
 * @param key - string
 *
 * @example
 * pop({'a': 1, 'b': 2}, 'a')
 *  => {'b': 2}
 */
const popDict = (obj: any, key: string) => {
  // let val = obj[key];
  delete obj[key];
  return obj;
};

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
const newKeys = (
  obj: Record<string, any>,
  maps: Record<string, string>,
  valMap: Record<string, any>,
  dfault = ''
) => {
  return Object.keys(maps).reduce(function (obj_, key) {
    obj_[maps[key]] = obj[key] ?? valMap[key] ?? dfault;
    return obj_;
  }, {} as Record<string, any>);
};

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
const renameKeys = (obj: Record<string, any>, maps: Record<string, string>) => {
  return Object.keys(obj).reduce(function (obj_, key) {
    obj_[maps[key] ?? key] = obj[key];
    return obj_;
  }, {} as Record<string, any>);
};

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
const overwriteKeys = (
  obj: Record<string, any>,
  maps: Record<string, string>,
  valMap: Record<string, any>,
  dfault = ''
) => {
  return Object.keys({ ...obj, ...valMap }).reduce(function (obj_, key) {
    obj_[maps[key] ?? key] = obj[key] ?? valMap[key] ?? dfault;
    return obj_;
  }, {} as Record<string, any>);
};

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
const updateKeys = (
  obj: Record<string, any>,
  maps: Record<string, string>,
  valMap: Record<string, any>,
  dfault = '',
  method = 'new'
) => {
  let _obj = maps; // method: `new`
  switch (method.toLowerCase()) {
    case 'rename':
      _obj = obj;
      break;
    case 'update':
      _obj = { ...obj, ...valMap };
      break;
  }

  return Object.keys(_obj).reduce(function (obj_, key) {
    obj_[maps[key] ?? key] = obj[key] ?? valMap[key] ?? dfault;
    return obj_;
  }, {} as Record<string, any>);
};

/**
 * Arr From Dicts(Extract array By Key)
 * @param dicts - source dicts
 *
 * @example
 *  arrFromDicts([{'h1': 'v11', 'h1': 'v12'}, {'h1': 'v21', 'h1': 'v22'}], 'h1')
 *   => ['v11', 'v21']
 */
const arrFromDicts = (dicts: any[], key: string) => {
  return dicts.map((dict) => dict[key]);
};

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
const dictFromDuo = (keys: any[], vals: any[]) => {
  return keys.reduce((dict, key, i) => {
    dict[key] = vals[i];
    return dict;
  }, {});
};

/**
 * Returns Dicts(objects) From Duos(Keys, Valss)
 * @param keys - dict keys
 * @param vals - array of values
 *
 * @example
 * dictFromDuo(['a', 'b'], [[1, 2], [3,4]])
 *  => [{'a': 1, 'b': 2}, {'a': 3, 'b': 4}]
 */
const dictsFromDuos = (keys: any[], valss: any[][]) => {
  return valss.map((vals) =>
    keys.reduce((dict, key, i) => {
      dict[key] = vals[i];
      return dict;
    }, {})
  );
};

/**
 * Duo From Dict
 * @param obj - source dict
 * @example
 * duoFromDict({'h1': 'v11', 'h1': 'v12'})
 *  => [['h1', 'h2'], ['v11', 'v12']]
 */
const duoFromDict = (obj: any) => {
  if (obj === null || typeof obj !== 'object') {
    return [];
  }
  return [Object.keys(obj), Object.values(obj)];
};

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
const rowsAddedDefaults = (rows: any[], valMap = {}, isPush = false) => {
  const addKeys = Object.keys(valMap);
  const addVals = Object.values(valMap);
  if (isPush) {
    return rows.map((arr, i) =>
      i === 0 ? [...arr, ...addKeys] : [...arr, ...addVals]
    );
  } else {
    return rows.map((arr, i) =>
      i === 0 ? [...addKeys, ...arr] : [...addVals, ...arr]
    );
  }
};

/**
 * headerIndexArr
 *   - newKeys
 *   - keyDuo의 key에 해당하는 oldHeader의 index(-1: oldHeader에는 없는 key)
 * @param oldHeader - source rows
 * @param keyDuo - key mapping [['oldKey1', ...], ['newKey1', ...]]
 * @example
 * headerIndexArr(['h1', 'h2', 'h3'],  [['h3', 'h4', 'h1'], ['_h3', '_h4', '_h1']])
 *  => [['_h3', '_h4', '_h1'], [2, -1, 0]]
 */
const headerIndexArr = (oldHeader: any[], keyDuo: any[][] = [[]]) => {
  let newHeader = oldHeader;
  let indexArr = [...Array(oldHeader.length).keys()];
  if (keyDuo[0].length > 0) {
    newHeader = keyDuo[1];
    indexArr = keyDuo[0].map((h) => oldHeader.indexOf(h));
  }
  return [newHeader, indexArr];
};

/**
 * Dicts From Rows
 * @param rows - source rows
 * @param keyDuo - key mapping [['oldKey1', ...], ['newKey1', ...]]
 * @param dfault - rows에 없는 key인 경우 default값
 * @example
 * dictsFromRows([['h1', 'h2'], ['v11', 'v12'], ['v21', 'v22']],  [['h2', 'h3', 'h1'], ['_h2', '_h3', '_h1']])
 *  => [{ _h2: 'v12', _h3: '', _h1: 'v11' }, { _h2: 'v22', _h3: '', _h1: 'v21' }]  // 순서는 의미가 없을 수 있음
 */
const dictsFromRows = (rows: any[][], keyDuo: any[][] = [[]], dfault = '') => {
  if (!rows || rows.length == 0) {
    return [];
  }
  let [header, indexMaps] = headerIndexArr(rows.shift()!, keyDuo);

  return rows.map((arr) => {
    let dict: any = {};
    header.forEach((h: any, i: number) => {
      dict[h] = indexMaps[i] != -1 ? arr[indexMaps[i]] ?? dfault : dfault;
    });
    return dict;
  });
};

/**
 * Rows From Dicts
 * @param dicts - source dicts
 * @param keyDuo - key mapping [['oldKey1', ...], ['newKey1', ...]]
 * @param dfault - rows에 없는 key인 경우 default값
 * @example
 * rowsFromDicts([{'h1': 'v11', 'h2': 'v12', 'h3': 'v13'}, {'h1': 'v21', 'h2': 'v22', 'h3': 'v13'}], [['h3', 'h4', 'h1'], ['_h3', '_h4', '_h1']], '_v_')
 *  => [[ '_h3', '_h4', '_h1' ], [ 'v13', '_v_', 'v11' ], [ 'v13', '_v_', 'v21' ]]
 */
const rowsFromDicts = (dicts: any[], keyDuo: any[][] = [[]], dfault = '') => {
  if (!dicts || dicts.length == 0) {
    return [];
  }

  const _header = Object.keys(dicts[0]);
  let [header, indexMaps] = headerIndexArr(_header, keyDuo);

  let rows = [header];
  for (let row of dicts) {
    let content = [];
    for (let i = 0; i < header.length; i++) {
      const i_ = indexMaps[i];
      i_ == -1 ? content.push(dfault) : content.push(row[_header[i_]]);
    }
    rows.push(content);
  }
  return rows;
};

/**
 * Arrs From Dicts
 */
const arrsFromDicts = (dicts: Record<any, any>[]): any[][] => {
  const keys = Object.keys(dicts[0]);
  const result: any[][] = [keys];

  for (const dict of dicts) {
    const values: any[] = [];

    for (const key of keys) {
      values.push(dict[key]);
    }

    result.push(values);
  }

  return result;
};

/**
 * Dicts From Arrs
 */
const dictsFromArrs = (arrs: any[][]): Record<any, any>[] => {
  const keys = arrs[0];
  const result = [];

  for (let i = 1; i < arrs.length; i++) {
    const values = arrs[i];
    const dict: Record<any, any> = {};

    for (let j = 0; j < keys.length; j++) {
      dict[keys[j]] = values[j];
    }

    result.push(dict);
  }

  return result;
};

/**
 * Swap Dict Key-Value
 *
 * @example
 * swapDict({a: 1, b: 2})
 * => {'1': 'a', '2': 'b'}
 */
const swapDict = (obj: Record<any, any>) => {
  return Object.keys(obj).reduce((obj_: Record<any, any>, key: any) => {
    obj_[obj[key]] = key;
    return obj_;
  }, {});
};

// const swapDict = (dict: any) => {
//   let ret: any = {};
//   for (let key in dict) {
//     ret[dict[key]] = key;
//   }
//   return ret;
// };

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
function getUpsertDicts<T extends Record<string, any>>(
  olds: T[] = [],
  news: T[] = [],
  keys: (keyof T)[]
) {
  const upserts = {
    adds: [] as T[],
    dels: [] as T[],
    upds: [] as T[],
  };

  // Check for adds and upds dicts
  news.forEach((newDict) => {
    const matchingOldDict = olds.find((oldDict) =>
      keys.every((key) => newDict[key] === oldDict[key])
    );

    if (!matchingOldDict) {
      upserts.adds.push(newDict);
    } else if (
      !Object.entries(newDict).every(
        ([key, value]) => matchingOldDict[key] === value
      )
    ) {
      upserts.upds.push(newDict);
    }
  });

  // Check for dels dicts
  olds.forEach((oldDict) => {
    const matchingNewDict = news.find((newDict) =>
      keys.every((key) => oldDict[key] === newDict[key])
    );

    if (!matchingNewDict) {
      upserts.dels.push(oldDict);
    }
  });

  return upserts;
}
// function getUpsertDicts(olds: any[], news: any[], keys: any[]) {
//   const upserts = {
//     adds: any[],
//     dels: any[],
//     upds: any[],
//   };

//   // Check for adds and upds dicts
//   news.forEach((newDict) => {
//     const matchingOldDict = olds.find((oldDict) => keys.every((key) => newDict[key] === oldDict[key]));

//     if (!matchingOldDict) {
//       upserts.adds.push(newDict);
//     } else if (!Object.entries(newDict).every(([key, value]) => matchingOldDict[key] === value)) {
//       upserts.upds.push(newDict);
//     }
//   });

//   // Check for dels dicts
//   olds.forEach((oldDict) => {
//     const matchingNewDict = news.find((newDict) => keys.every((key) => oldDict[key] === newDict[key]));

//     if (!matchingNewDict) {
//       upserts.dels.push(oldDict);
//     }
//   });

//   return upserts;
// }

/**
 * Remove Keys From Dict
 * @param dict - 원본 dict
 * @param keys - 제거할 keys
 *
 * @example
 * removeDictKeys({a: 1, b: 2, c: 3}, ['a', 'c'])
 * => {b: 2}
 */
const removeDictKeys = (dict: any, keys: any[]) => {
  for (let key of keys) {
    delete dict[key];
  }
  return dict;
};

// * Data / Time
/**
 * Convert date string to ko-KR(yyyy년 M월 d일 (요일))
 * @param {string} dateStr The function to delay.
 * @example
 *
 * dateKo('2023-07-15')
 * => 2023년 7월 15일 (토)
 */
const dateKo = (dateStr: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(dateStr));

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
const now = (options: any) => {
  const timeZone = options?.timeZone ?? 'Asia/Seoul';
  const hour12 = options?.hour12 ?? false;
  const format = options?.format ?? 'basic'; // yyyy-MM-dd hh:mm:ss
  const date = new Date().toLocaleString('en-US', { timeZone, hour12 });
  let now = new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '');

  switch (format.toUpperCase()) {
    case 'KO': // `2023년 7월 15일 (토) hh:mm:ss`
      const [dateStr, timeStr] = now.split(' ');
      now = `${dateKo(dateStr)} ${timeStr}`;
      break;
  }

  return now;
};

const timeFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

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
const delay = (func: Function, wait: number, ...args: any) => {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  return setTimeout(func, +wait || 0, ...args);
};

/**
 * Sleep For Second
 * @param sec
 */
const sleep = (sec: number) => {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
};

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
const sleepAsync = async (wait: number) => {
  await new Promise((resolve) => setTimeout(resolve, wait));
};

// & Export AREA
// &---------------------------------------------------------------------------
export {
  popDict, // pop for dictionary
  serializeNonPOJOs, // NonPOJO -> POJO(Plain Old Java Object) object
  // ? string
  evalStr, // Evaluate String including `${expression}`
  includesMulti, // Check Includes at Multiple String(array)
  strFromAny, // String From Any Data
  rowsFromCsv, // Convert Comma-Separated Values(`csv`) => Array of Array(`rows`)
  csvFromRows, // rows -> csv
  // ? arr, rows, duo, duos, dict, dicts
  newKeys, // New Dict Keys(maps의 key들에 대해, 변경된 key 이름으로 dict 생성)
  renameKeys, // Rename Dict Keys(obj의 key들에 대한 이름 변경(변경 되지 않은 것은 유지))
  overwriteKeys, //Overwrite Dict Keys(newKeys(신규 key 추가) + rename(key 이름 변경))
  updateKeys, // Update Dict Keys
  arrFromArrs, // Returns arr From rows(array of array)
  arrFromDicts, // Returns arr From dicts (extract values by key)
  dictFromDuo, // Returns Dict(object) From Duo(Keys, Vals)
  dictsFromDuos, //Returns Dicts(objects) From Duos(Keys, Valss)
  duoFromDict, // Duo From Dict
  rowsFromDicts, // Rows From Dicts
  dictsFromRows, //Dicts From Rows
  arrsFromDicts, // Returns
  dictsFromArrs, // Returns
  rowsAddedDefaults, // Rows Added Default Values
  swapDict, // Swap Dict Key-Value
  getUpsertDicts, // Get Upsert Dicts({adds: [], dels: [], upds: []})
  removeDictKeys, // Remove Keys From Dict
  //  ? date, time
  now,
  delay,
  sleep,
  sleepAsync,
  timeFromTimestamp
};
