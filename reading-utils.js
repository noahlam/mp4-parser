function read(data, length) {
    const result = [];
    const start = data.pos;
    const end = start + length;
    for (let i = start; i < end; i++) {
        result.push(data[i])
    }

    data.pos += length;
    return result;
}

function readInt(data, length) {
    const arr = read(data, length);
    return arrToInt(arr);
}

function readString(data, length) {
    const arr = read(data, length);
    return String.fromCharCode.apply(null, arr).replace(/\u0000/g, '');
}
function readStringUntil(data, char) {
    if(char === undefined) {
        throw new Error('The 3rd parameter must not be undefined');
    }
    const code = char.charCodeAt();
    const arr = [];

    let start = data.pos;
    let pos = start;
    while(true) {
        const cur = data[pos];
        arr.push(cur);
        pos++;

        if(cur === code) break;
    }

    const length = pos - start;

    data.pos += length;

    return {
        str: String.fromCharCode.apply(null, arr).replace(/\u0000/g, ''),
        length
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
