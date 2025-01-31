const ping = ()=>'pong';
const isEmptyDict = (obj)=>JSON.stringify(obj) === '{}';
const isEmpty = (v)=>JSON.stringify(v) === '{}' || JSON.stringify(v) === '[]';
const isFalsy = (v)=>{
    if (v === true) return false;
    if (typeof v === 'number' && v !== 0) return false;
    return v === false || v === undefined || v === null || Number.isNaN(v) || v === 0 || v === '' || Array.isArray(v) && v.length === 0 || typeof v === 'object' && v !== null && Object.keys(v).length === 0;
};
const isValidStr = (s)=>{
    if (s === null || s === undefined || typeof s !== 'string') {
        return false;
    }
    return s.trim() !== '';
};
const serializeNonPOJOs = (obj)=>structuredClone(obj);
const evalStr = (str, values)=>{
    const regex = /\${(.*?)}/g;
    return str.replace(regex, (match, expression)=>{
        const code = `return ${expression}`;
        const value = new Function(...Object.keys(values), code)(...Object.values(values));
        return value;
    });
};
const includesMulti = (s, arr)=>{
    for (const a of arr){
        if (s.includes(a)) return true;
    }
    return false;
};
const strFromAny = (s)=>typeof s === 'string' ? s.trim() : JSON.stringify(s);
const rowsFromCsv = (csv, sep = ',', hasQuote = true, newline = '\n')=>{
    const rows = [];
    for (const line of csv.split(newline)){
        if (hasQuote) {
            rows.push(line.slice(1, -1).split(`"${sep}"`).map((s)=>s.trim()));
        } else {
            rows.push(line.split(sep).map((s)=>s.trim()));
        }
    }
    return rows;
};
const csvFromRows = (rows, sep = ',', hasQuote = true, newline = '\n')=>{
    let str = '';
    for (const row of rows){
        if (hasQuote) {
            str += `"${row.join('"' + sep + '"')}"${newline}`;
        } else {
            str += `${row.join(sep)}${newline}`;
        }
    }
    return str;
};
const arrFromArrs = (rows, index = 0, hasHeader = false)=>{
    const arr = rows.map((row)=>row[index]);
    return hasHeader ? arr.slice(1) : arr;
};
const popDict = (obj, key)=>{
    delete obj[key];
    return obj;
};
const newKeys = (obj, maps, valMap, dfault = '')=>{
    return Object.keys(maps).reduce(function(obj_, key) {
        obj_[maps[key]] = obj[key] ?? valMap[key] ?? dfault;
        return obj_;
    }, {});
};
const renameKeys = (obj, maps)=>{
    return Object.keys(obj).reduce(function(obj_, key) {
        obj_[maps[key] ?? key] = obj[key];
        return obj_;
    }, {});
};
const overwriteKeys = (obj, maps, valMap, dfault = '')=>{
    return Object.keys({
        ...obj,
        ...valMap
    }).reduce(function(obj_, key) {
        obj_[maps[key] ?? key] = obj[key] ?? valMap[key] ?? dfault;
        return obj_;
    }, {});
};
const updateKeys = (obj, maps, valMap, dfault = '', method = 'new')=>{
    let _obj = maps;
    switch(method.toLowerCase()){
        case 'rename':
            _obj = obj;
            break;
        case 'update':
            _obj = {
                ...obj,
                ...valMap
            };
            break;
    }
    return Object.keys(_obj).reduce(function(obj_, key) {
        obj_[maps[key] ?? key] = obj[key] ?? valMap[key] ?? dfault;
        return obj_;
    }, {});
};
const arrFromDicts = (dicts, key)=>{
    return dicts.map((dict)=>dict[key]);
};
const dictFromDuo = (keys, vals)=>{
    return keys.reduce((dict, key, i)=>{
        dict[key] = vals[i];
        return dict;
    }, {});
};
const dictsFromDuos = (keys, valss)=>{
    return valss.map((vals)=>keys.reduce((dict, key, i)=>{
            dict[key] = vals[i];
            return dict;
        }, {}));
};
const duoFromDict = (obj)=>{
    if (obj === null || typeof obj !== 'object') {
        return [];
    }
    return [
        Object.keys(obj),
        Object.values(obj)
    ];
};
const rowsAddedDefaults = (rows, valMap = {}, isPush = false)=>{
    const addKeys = Object.keys(valMap);
    const addVals = Object.values(valMap);
    if (isPush) {
        return rows.map((arr, i)=>i === 0 ? [
                ...arr,
                ...addKeys
            ] : [
                ...arr,
                ...addVals
            ]);
    } else {
        return rows.map((arr, i)=>i === 0 ? [
                ...addKeys,
                ...arr
            ] : [
                ...addVals,
                ...arr
            ]);
    }
};
const headerIndexArr = (oldHeader, keyDuo = [
    []
])=>{
    let newHeader = oldHeader;
    let indexArr = [
        ...Array(oldHeader.length).keys()
    ];
    if (keyDuo[0].length > 0) {
        newHeader = keyDuo[1];
        indexArr = keyDuo[0].map((h)=>oldHeader.indexOf(h));
    }
    return [
        newHeader,
        indexArr
    ];
};
const dictsFromRows = (rows, keyDuo = [
    []
], dfault = '')=>{
    if (!rows || rows.length == 0) {
        return [];
    }
    let [header, indexMaps] = headerIndexArr(rows.shift(), keyDuo);
    return rows.map((arr)=>{
        let dict = {};
        header.forEach((h, i)=>{
            dict[h] = indexMaps[i] != -1 ? arr[indexMaps[i]] ?? dfault : dfault;
        });
        return dict;
    });
};
const rowsFromDicts = (dicts, keyDuo = [
    []
], dfault = '')=>{
    if (!dicts || dicts.length == 0) {
        return [];
    }
    const _header = Object.keys(dicts[0]);
    let [header, indexMaps] = headerIndexArr(_header, keyDuo);
    let rows = [
        header
    ];
    for (let row of dicts){
        let content = [];
        for(let i = 0; i < header.length; i++){
            const i_ = indexMaps[i];
            i_ == -1 ? content.push(dfault) : content.push(row[_header[i_]]);
        }
        rows.push(content);
    }
    return rows;
};
const arrsFromDicts = (dicts)=>{
    const keys = Object.keys(dicts[0]);
    const result = [
        keys
    ];
    for (const dict of dicts){
        const values = [];
        for (const key of keys){
            values.push(dict[key]);
        }
        result.push(values);
    }
    return result;
};
const dictsFromArrs = (arrs)=>{
    const keys = arrs[0];
    const result = [];
    for(let i = 1; i < arrs.length; i++){
        const values = arrs[i];
        const dict = {};
        for(let j = 0; j < keys.length; j++){
            dict[keys[j]] = values[j];
        }
        result.push(dict);
    }
    return result;
};
const swapDict = (obj)=>{
    return Object.keys(obj).reduce((obj_, key)=>{
        obj_[obj[key]] = key;
        return obj_;
    }, {});
};
function getUpsertDicts(olds = [], news = [], keys) {
    const upserts = {
        adds: [],
        dels: [],
        upds: []
    };
    news.forEach((newDict)=>{
        const matchingOldDict = olds.find((oldDict)=>keys.every((key)=>newDict[key] === oldDict[key]));
        if (!matchingOldDict) {
            upserts.adds.push(newDict);
        } else if (!Object.entries(newDict).every(([key, value])=>matchingOldDict[key] === value)) {
            upserts.upds.push(newDict);
        }
    });
    olds.forEach((oldDict)=>{
        const matchingNewDict = news.find((newDict)=>keys.every((key)=>oldDict[key] === newDict[key]));
        if (!matchingNewDict) {
            upserts.dels.push(oldDict);
        }
    });
    return upserts;
}
const removeDictKeys = (dict, keys)=>{
    for (let key of keys){
        delete dict[key];
    }
    return dict;
};
const dateKo = (dateStr)=>new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short'
    }).format(new Date(dateStr));
const now = (options)=>{
    const timeZone = options?.timeZone ?? 'Asia/Seoul';
    const hour12 = options?.hour12 ?? false;
    const format = options?.format ?? 'basic';
    const date = new Date().toLocaleString('en-US', {
        timeZone,
        hour12
    });
    let now = new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    switch(format.toUpperCase()){
        case 'KO':
            const [dateStr, timeStr] = now.split(' ');
            now = `${dateKo(dateStr)} ${timeStr}`;
            break;
    }
    return now;
};
const timeFromTimestamp = (timestamp)=>{
    const date = new Date(timestamp);
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};
const delay = (func, wait, ...args)=>{
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    return setTimeout(func, +wait || 0, ...args);
};
const sleep = (sec)=>{
    let start = Date.now(), now = start;
    while(now - start < sec * 1000){
        now = Date.now();
    }
};
const sleepAsync = async (wait)=>{
    await new Promise((resolve)=>setTimeout(resolve, wait));
};
export { ping, isEmptyDict, isEmpty, isFalsy, isValidStr, serializeNonPOJOs, evalStr, includesMulti, strFromAny, rowsFromCsv, csvFromRows, arrFromArrs, popDict, newKeys, renameKeys, overwriteKeys, updateKeys, arrFromDicts, dictFromDuo, dictsFromDuos, duoFromDict, rowsFromDicts, dictsFromRows, arrsFromDicts, dictsFromArrs, rowsAddedDefaults, swapDict, getUpsertDicts, removeDictKeys, dateKo, now, timeFromTimestamp, delay, sleep, sleepAsync };

//# sourceMappingURL=basic.js.map