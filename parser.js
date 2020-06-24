const BoxParsers = {
    ftyp(data, pos, length) {
        const isom = readString(data, pos, 4);
        pos += 4;
        console.log('isom:', isom);

        const isomVersion = read(data, pos, 4);
        pos += 4;
        console.log('isom版本号:', isomVersion);

        const protocol = readString(data, pos, 4);
        pos += 4;
        console.log('文件遵从协议:', protocol);

        return pos;
    },
    ilst(data, pos, length) {
        const isom = readString(data, pos, 4);
        pos += 4;
        console.log('isom:', isom);

        const isomVersion = read(data, pos, 4);
        pos += 4;
        console.log('isom版本号:', isomVersion);

        const protocol = readString(data, pos, 4);
        pos += 4;
        console.log('文件遵从协议:', protocol);

        return pos;
    },
    free: skipBox,
    edts: skipBox,
    tmcd: skipBox,
    moov: iterateBox,
    trak: iterateBox,
    minf: iterateBox,

    /** 
    * box size	4	box大小
    * box type	4	box类型
    * version	1	box版本, 0或者1, 一般为0(以下字节数均按照version=0)
    * flags	3	 
    * creation	4	创建时间(相对于UTC时间1904-01-01 0点秒数
    * modification	4	修改时间
    * time scale	4	文件媒体在1秒时间内的刻度值, 可以理解为1秒长度的时间单元数
    * duration	4	该tack的时间长度, 用duration和time scale值可以计算track时长, 比如audio track的time scale = 8000, duration = 560128, 时长为70.016, video track 的time scale = 600, duration = 42000, 时长为70
    * rate	4	推荐播放速率, 高16位和低16位分别为小数点整数播放和小数部分, 即[16, 16] 格式, 该值为1.0(0x00010000) 表示正常前向播放
    * volume	2	与rate类型, [8, 8]格式, 1.0 (0x0100) 表示最大音量
    * reserved	10	保留位
    * matrix	36	视频转换矩阵
    * pre-defined	24	 
    * next track id	4	下一个track使用的id号
    */
    mvhd(data, pos, length) {
        const version = readInt(data, pos, 1);
        pos += 1;
        console.log('|---- box版本', version);

        const flags = readInt(data, pos, 3);
        pos += 3;
        console.log('|---- flags', flags);

        const creation = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- creation', creation);

        const modification = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- modification', modification);

        const timescale = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- timescale', timescale);

        const duration = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- duration', duration);

        const rate = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- rate', rate);

        const volume = readInt(data, pos, 2);
        pos += 2;
        console.log('|---- volume', volume);

        const reserved = read(data, pos, 10);
        pos += 10;
        console.log('|---- 保留位', reserved);

        const matrix = read(data, pos, 36);
        pos += 36;
        console.log('|---- 视频转换矩阵', matrix);

        const preDefined = read(data, pos, 24);
        pos += 24;
        console.log('|---- preDefined', preDefined);

        const nextTrackId = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- nextTrackId', nextTrackId);

        return pos;
    },

    /** 
    * box size	4	box 大小
    * box type	4	box 类型
    * version	1	box版本, 0或者1, 一般为0. (以下字节数均按version=0)
    * flags	3	按位或处置结果值, 预定义如下: 0x000001 track_enabled, 否则该track 不被播放; 0x000002 track_in_movie, 表示该track在播放中被引用; 0x000004 track_in_preview, 表示该track在预览时被引用. 一般该值为7, 如果一个馒头所有track均未设置track_in_movie和track_in_preview, 将被理解为所有track均设置了这两项; 对于hint track, 该值为0
    * creation	4	创建时间(相对于UTC时间1904-01-01 0点的秒数
    * modification time	4	修改时间
    * track id	4	id 号, 不能重复且不能为0
    * reserved	4	保留位
    * duration	4	track的时间长度
    * reserved	8	保留位
    * layer	2	视频层, 默认为0, 值小的在上层
    * alternate group	2	track 分组信息, 默认为0表示该track未与其他track有群组关系
    * volume	2	[8, 8]格式, 如果为音频track, 1.0(0x0100)表示最大音量:否则为0
    * reserved	2	保留位
    * matrix	36	视频变换矩阵
    * width	4	宽
    * height	4	高, 均为[16, 16] 格式值, 与sample描述中的实际画面大小比值, 用于播放时的展示宽高
    */
    tkhd(data, pos, length) {
        const version = readInt(data, pos, 1);
        pos += 1;
        console.log('|---- tkhd版本', version);

        const flags = readInt(data, pos, 3);
        pos += 3;
        console.log('|---- flags', flags);

        const creation = read(data, pos, 4);
        pos += 4;
        console.log('|---- creation', creation);

        const modification = read(data, pos, 4);
        pos += 4;
        console.log('|---- modification', modification);

        const trackId = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- trackId', trackId);

        let reserved = read(data, pos, 4);
        pos += 4;
        console.log('|---- 保留位0', reserved);

        const duration = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- duration', duration);

        reserved = read(data, pos, 8);
        pos += 8;
        console.log('|---- 保留位1', reserved);

        const layer = readInt(data, pos, 2);
        pos += 2;
        console.log('|---- 视频层', layer);

        const alternateGroup = readInt(data, pos, 2);
        pos += 2;
        console.log('|---- track 分组信息', alternateGroup);

        const volume = readInt(data, pos, 2);
        pos += 2;
        console.log('|---- volume', volume);

        reserved = read(data, pos, 2);
        pos += 2;
        console.log('|---- 保留位2', reserved);

        const matrix = read(data, pos, 36);
        pos += 36;
        console.log('|---- 视频转换矩阵', matrix);

        const width = read(data, pos, 4);
        pos += 4;
        console.log('|---- width', width);

        const height = read(data, pos, 4);
        pos += 4;
        console.log('|---- height', height);

        return pos;

    },

    /** 
     * box size	4	box 大小
     * box type	4	box 类型
     * version	1	box 版本, 0或1, 一般为0, (以下字节数均按version=0)
     * flags	3	 
     * creation	4	创建时间(相对于UTC时间1904-01-01 0点的秒数
     * modification time	4	修改时间
     * time scale	4	同前表
     * duration	4	track 的时间长度
     * language	2	媒体语言码. 最高位为0, 后面15位为3个字符(见 ISO 639-2/T 标准中定义)
     * pre-defined	2	 
     */
    mdhd(data, pos, length) {


        const version = readInt(data, pos, 1);
        pos += 1;
        console.log('|---- mdhd版本', version);

        const flags = readInt(data, pos, 3);
        pos += 3;
        console.log('|---- flags', flags);

        const creation = read(data, pos, 4);
        pos += 4;
        console.log('|---- creation', creation);

        const modification = read(data, pos, 4);
        pos += 4;
        console.log('|---- modification', modification);

        const timescale = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- timescale', timescale);

        const duration = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- duration', duration);

        const language = read(data, pos, 2);
        pos += 2;
        console.log('|---- language', language);

        const preDefined = read(data, pos, 2);
        pos += 2;
        console.log('|---- preDefined', preDefined);

        return pos;

    },

    /** 
     * box size	4	box 大小
     * box type	4	box 类型
     * version	1	box版本, 0或1, 一般为0.(以下字节数均按version=0)
     * flags	3	 
     * pre-defined	4	 
     * handler type	4	在media box中, 该值为4个字符: “vide” - video track “soun” - audio track “hint” - hint track
     * reserved	12	 
     * name	不定	track type name, 以’\0’结尾的字符串
    */
    hdlr(data, pos, length) {
        const version = readInt(data, pos, 1);
        pos += 1;
        console.log('|---- mdhd版本', version);

        const flags = readInt(data, pos, 3);
        pos += 3;
        console.log('|---- flags', flags);

        const preDefined = read(data, pos, 4);
        pos += 4;
        console.log('|---- preDefined', preDefined);

        const handleType = readString(data, pos, 4);
        pos += 4;
        console.log('|---- handleType', handleType);

        const reserved = read(data, pos, 12);
        pos += 12;
        console.log('|---- reserved', reserved);

        const { str: name, length: len } = readStringUntil(data, pos, '\u0000');
        pos += len;
        console.log('|---- name', name);

        return pos;
    },

    /** 
    * box size	4	box 大小
    * box type	4	box 类型
    * version	1	box 版本, 0或1, 一般为0, (以下字节数均按version=0)
    * flags	3	 
    * graphics	4	视频合成模式, 为0时拷贝原始图像, 否则与opcolor进行合成
    * opcolor	2 * 3	{red, green, blue}
    */
    vmhd(data, pos, length) {


        const version = readInt(data, pos, 1);
        pos += 1;
        console.log('|---- mdhd版本', version);

        const flags = readInt(data, pos, 3);
        pos += 3;
        console.log('|---- flags', flags);

        const creation = read(data, pos, 4);
        pos += 4;
        console.log('|---- creation', creation);

        const modification = read(data, pos, 4);
        pos += 4;
        console.log('|---- modification', modification);

        const timescale = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- timescale', timescale);

        const duration = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- duration', duration);

        const language = read(data, pos, 2);
        pos += 2;
        console.log('|---- language', language);

        const preDefined = read(data, pos, 2);
        pos += 2;
        console.log('|---- preDefined', preDefined);

        return pos;

    },
    
}

function skipBox(data, pos, length) {
    return pos + length;
};

function iterateBox(data, pos, length) {
    const start = pos;
    while (pos < start + length) {
        const length = readInt(data, pos, 4);
        pos += 4;
        console.log('|---- box 长度:', length);

        const type = readString(data, pos, 4);
        pos += 4;
        console.log('|---- box类型:', type);

        pos = BoxParsers[type](data, pos, length);
        console.error('当前位置: ', pos);
    }
    console.error('start + length: ', start + length);
    const endPos = start + length;
    return endPos;
};

function readBox(data, start) {
    let pos = start;

    const 盒子长度 = readInt(data, pos, 4);
    pos += 4;
    console.log('盒子长度:', 盒子长度);

    const 盒子类型标示 = readString(data, pos, 4);
    pos += 4;
    console.log('盒子类型标示:', 盒子类型标示);

    pos = BoxParsers[盒子类型标示](data, pos, 盒子长度);

    const endPos = start + 盒子长度;
    return endPos;
}