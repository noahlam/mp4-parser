function read(data, start, length) {
    const result = [];
    const end = start + length;
    for (let i = start; i < end; i++) {
        result.push(data[i])
    }

    return result;
}

function readInt(data, start, length) {
    const arr = read(data, start, length);
    return arrToInt(arr);
}

function readString(data, start, length) {
    const arr = read(data, start, length);
    return String.fromCharCode.apply(null, arr).replace(/\u0000/g, '');
}
function readStringUntil(data, start, char) {
    if(char === undefined) {
        throw new Error('The 3rd parameter must not be undefined');
    }
    const code = char.charCodeAt();
    const arr = [];

    let pos = start;
    while(true) {
        const cur = data[pos];
        arr.push(cur);
        pos++;

        if(cur === code) break;
    }

    return {
        str: String.fromCharCode.apply(null, arr).replace(/\u0000/g, ''),
        length: pos - start
    };
}

function arrToInt(arr) {
    const len = arr.length - 1;
    let coefficient = 1;
    let result = 0;
    for (let i = len; i >= 0; i--) {
        result += arr[i] * coefficient;
        coefficient *= 255;
    }
    return result;
}