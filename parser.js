let pathPerfix = '|-';

const BoxParsers = {
    ftyp(data, length) {

        const isom = readString(data, 4);
        console.log('isom:', isom);

        const isomVersion = read(data, 4);
        console.log('isom版本号:', isomVersion);

        const protocol = readString(data, 16);
        console.log('文件遵从协议:', protocol);
    },
    ilst(data, length) {

        const isom = readString(data, 4);
        console.log('isom:', isom);

        const isomVersion = read(data, 4);
        console.log('isom版本号:', isomVersion);

        const protocol = readString(data, 4);
        console.log('文件遵从协议:', protocol);
    },
    free: skipBox,
    edts: skipBox,
    tmcd: skipBox,
    mp4a: skipBox,
    mdat: skipBox,

    moov: iterateBox,
    trak: iterateBox,
    minf: iterateBox,
    dinf: iterateBox,
    stbl: iterateBox,

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
    mvhd(data, length) {
        const version = readInt(data, 1);
        console.log('pathPerfix box版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        const creation = readInt(data, 4);
        console.log(pathPerfix + ' creation', creation);

        const modification = readInt(data, 4);
        console.log(pathPerfix + ' modification', modification);

        const timescale = readInt(data, 4);
        console.log(pathPerfix + ' timescale', timescale);

        const duration = readInt(data, 4);
        console.log(pathPerfix + ' duration', duration);

        const rate = readInt(data, 4);
        console.log(pathPerfix + ' rate', rate);

        const volume = readInt(data, 2);
        console.log(pathPerfix + ' volume', volume);

        const reserved = read(data, 10);
        console.log(pathPerfix + ' 保留位', reserved);

        const matrix = read(data, 36);
        console.log(pathPerfix + ' 视频转换矩阵', matrix);

        const preDefined = read(data, 24);
        console.log(pathPerfix + ' preDefined', preDefined);

        const nextTrackId = readInt(data, 4);
        console.log(pathPerfix + ' nextTrackId', nextTrackId);
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
    tkhd(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' tkhd版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        const creation = read(data, 4);
        console.log(pathPerfix + ' creation', creation);

        const modification = read(data, 4);
        console.log(pathPerfix + ' modification', modification);

        const trackId = readInt(data, 4);
        console.log(pathPerfix + ' trackId', trackId);

        let reserved = read(data, 4);
        console.log(pathPerfix + ' 保留位0', reserved);

        const duration = readInt(data, 4);
        console.log(pathPerfix + ' duration', duration);

        reserved = read(data, 8);
        console.log(pathPerfix + ' 保留位1', reserved);

        const layer = readInt(data, 2);
        console.log(pathPerfix + ' 视频层', layer);

        const alternateGroup = readInt(data, 2);
        console.log(pathPerfix + ' track 分组信息', alternateGroup);

        const volume = readInt(data, 2);
        console.log(pathPerfix + ' volume', volume);

        reserved = read(data, 2);
        console.log(pathPerfix + ' 保留位2', reserved);

        const matrix = read(data, 36);
        console.log(pathPerfix + ' 视频转换矩阵', matrix);

        const width = read(data, 4);
        console.log(pathPerfix + ' width', width);

        const height = read(data, 4);
        console.log(pathPerfix + ' height', height);

        console.warn(`pos:${data.pos}`);


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
    mdhd(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        const creation = read(data, 4);
        console.log(pathPerfix + ' creation', creation);

        const modification = read(data, 4);
        console.log(pathPerfix + ' modification', modification);

        const timescale = readInt(data, 4);
        console.log(pathPerfix + ' timescale', timescale);

        const duration = readInt(data, 4);
        console.log(pathPerfix + ' duration', duration);

        const language = read(data, 2);
        console.log(pathPerfix + ' language', language);

        const preDefined = read(data, 2);
        console.log(pathPerfix + ' preDefined', preDefined);

        console.warn(`pos:${data.pos}`);


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
    hdlr(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        const preDefined = read(data, 4);
        console.log(pathPerfix + ' preDefined', preDefined);

        const handleType = readString(data, 4);
        console.log(pathPerfix + ' handleType', handleType);

        const reserved = read(data, 12);
        console.log(pathPerfix + ' reserved', reserved);

        const { str: name, length: len } = readStringUntil(data, '\u0000');
        console.log(pathPerfix + ' name', name);

        console.warn(`pos:${data.pos}`);

    },

    /**
     * box size	4	box 大小
     * box type	4	box 类型
     * version	1	box 版本, 0或1, 一般为0, (以下字节数均按version=0)
     * flags	3
     * graphics	4	视频合成模式, 为0时拷贝原始图像, 否则与opcolor进行合成
     * opcolor	2 * 3	{red, green, blue}
     */
    vmhd(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        const graphicsmode = read(data, 4);
        console.log(pathPerfix + ' graphicsmode', graphicsmode);

        const opcolor = read(data, 4);
        console.log(pathPerfix + ' opcolor', opcolor);

        console.warn(`pos:${data.pos}`);


    },

    /**
     * box size	4	box 大小
     * box type	4	box 类型
     * version	1	box 版本, 0或1, 一般为0, (以下字节数均按version=0)
     * flags	3
     * balance	2	立体声平衡, [8, 8] 格式值, 一般为0, -1.0 表示全部左声道, 1.0表示全部右声道
     * reserved	2
     */
    smhd(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        const balance = read(data, 2);
        console.log(pathPerfix + ' balance', balance);

        const reserved = read(data, 2);
        console.log(pathPerfix + ' reserved', reserved);

        console.warn(`pos:${data.pos}`);


    },

    /**
     * box size	4	box 大小
     * box type	4	box 类型
     * version	1	box 版本, 0或1, 一般为0, (以下字节数均按version=0)
     * flags	3
     * entry count	4	“url”或”urn”表的元素个数
     * “url”或”urn”列表	不定
     * url”或”urn” 都是box, “url”的内容为字符串(location string),
     * “urn”的内容为一对字符串(name string and location string).
     * 当”url”或 “urn”的box flags 为1时, 字符串均为空
     */
    dref(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        let entryCount = readInt(data, 4);
        console.log(pathPerfix + ' entryCount', entryCount);

        while (entryCount > 0){
            const length = readInt(data, 4);
            console.log(pathPerfix + ' box 长度:', length);

            const type = readString(data, 4);
            console.log(pathPerfix + ' box类型:', type);

            pos = BoxParsers[type](data, length - 8, type);
            entryCount --;
        }

        console.warn(`pos:${data.pos}`);


    },

    'url '(data, length) {

        const str = readString(data, length);
        console.log(pathPerfix + ' url', str);

        console.warn(`pos:${data.pos}`);

    },
    stsd(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        let entryCount = readInt(data, 4);
        console.log(pathPerfix + ' entryCount', entryCount);

        while (entryCount > 0){
            const length = readInt(data, 4);
            console.log(pathPerfix + ' box 长度:', length);

            const type = readString(data, 4);
            console.log(pathPerfix + ' box类型:', type);

            pos = BoxParsers[type](data, length - 8, type);
            entryCount --;
        }

        console.warn(`pos:${data.pos}`);

    },
    stts(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        let entryCount = readInt(data, 4);
        console.log(pathPerfix + ' entryCount', entryCount);

        while (entryCount > 0){
            const sample = readInt(data, 4);
            console.log(pathPerfix + ' sample:', sample);

            const delta = readInt(data, 4);
            console.log(pathPerfix + ' delta:', delta);

            entryCount --;
        }

        console.warn(`pos:${data.pos}`);

    },
    stsc(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        let entryCount = readInt(data, 4);
        console.log(pathPerfix + ' entryCount', entryCount);

        const chunks = [];
        while (entryCount > 0){
            const firstChunk = readInt(data, 4);

            const samplePerChunk = readInt(data, 4);

            const sampleDescriptionIndex = readInt(data, 4);

            chunks.push({firstChunk, samplePerChunk, sampleDescriptionIndex});
            entryCount --;
        }

        console.log(pathPerfix + ' chunks:', chunks);

        console.warn(`pos:${data.pos}`);

    },
    stsz(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        const sampleSize = readInt(data, 4);
        console.log(pathPerfix + ' sampleSize', sampleSize);

        let sampleCount = readInt(data, 4);
        console.log(pathPerfix + ' sampleCount', sampleCount);

        const sampleSizes = [];
        while (sampleCount > 0){
            const sampleSize = readInt(data, 4);

            sampleSizes.push(sampleSize);

            sampleCount --;
        }

        console.log(pathPerfix + ' sampleSizes', sampleSizes);

        console.warn(`pos:${data.pos}`);
        const preserved = read(data, 4);
        console.log(pathPerfix + ' preserved', preserved);
    },
    stss(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        let entryCount = readInt(data, 4);
        console.log(pathPerfix + ' entryCount', entryCount);

        while (entryCount > 0){
            const framePosition = readInt(data, 4);
            console.log(pathPerfix + ' framePosition:', framePosition);

            entryCount --;
        }

        console.warn(`pos:${data.pos}`);

    },
    stco(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        let entryCount = readInt(data, 4);
        console.log(pathPerfix + ' entryCount', entryCount);

        const entrys = [];
        while (entryCount > 0){
            const offset = readInt(data, 4);
            entrys.push(offset);

            entryCount --;
        }

        console.log(pathPerfix + ' offset:', entrys);

        console.warn(`pos:${data.pos}`);

        const preserved = read(data, 4);
        console.log(pathPerfix + ' preserved', preserved);

    },
    avc1(data, length) {
        const reserved = read(data, 6);
        console.log(pathPerfix + ' reserved:', reserved);

        const index = readInt(data, 2);
        console.log(pathPerfix + ' index:', index);

        const pre_defined = readInt(data, 2);
        console.log(pathPerfix + ' pre_defined', pre_defined);

        const reserved1 = readInt(data, 2);
        console.log(pathPerfix + ' reserved1', reserved1);

        const pre_defined2 = readInt(data, 12);
        console.log(pathPerfix + ' pre_defined2', pre_defined2);

        const Width = readInt(data, 2);
        console.log(pathPerfix + ' Width', Width);

        const Height = readInt(data, 2);
        console.log(pathPerfix + ' Height', Height);

        const HorizontalResolution = readInt(data, 4) / 255 / 255;
        console.log(pathPerfix + ' HorizontalResolution', HorizontalResolution);

        const VerticalResolution = readInt(data, 4) / 255 / 255;
        console.log(pathPerfix + ' VerticalResolution', VerticalResolution);

        const reverse3	 = readInt(data, 4);
        console.log(pathPerfix + ' reverse3', reverse3);

        const FrameCount = readInt(data, 2);
        console.log(pathPerfix + ' FrameCount', FrameCount);

        const CompressorName = readString(data, 32);
        console.log(pathPerfix + ' CompressorName', CompressorName);

        const Depth = readInt(data, 2);
        console.log(pathPerfix + ' Depth', Depth);

        const pre_defined3 = read(data, 2);
        console.log(pathPerfix + ' pre_defined3', pre_defined3);

        // AVCC -------------------------------------------------------
        const AVCCLength = readInt(data, 4);
        console.log(pathPerfix + ' AVCCLength', AVCCLength);

        const AVCCType = readString(data, 4);
        console.log(pathPerfix + ' AVCCType', AVCCType);

        BoxParsers[AVCCType](data, AVCCLength, AVCCType);
        // AVCC -------------------------------------------------------

        console.warn(`pos:${data.pos}`);

    },
    avcC(data, length) {


        const configurationVersion = readInt(data, 1);
        console.log(pathPerfix + ' configurationVersion', configurationVersion);

        const AVCProfileIndication = readInt(data, 1);
        console.log(pathPerfix + ' AVCProfileIndication', AVCProfileIndication);

        const profile_compatibility = readInt(data, 1);
        console.log(pathPerfix + ' profile_compatibility', profile_compatibility);

        const AVCLevelIndication = readInt(data, 1);
        console.log(pathPerfix + ' AVCLevelIndication', AVCLevelIndication);

        const lengthSizeMinusOne = readInt(data, 1) % 3;
        console.log(pathPerfix + ' lengthSizeMinusOne', lengthSizeMinusOne);

        let nb_SPS_nalus = readInt(data, 1) & 0x1F;
        console.log(pathPerfix + ' nb_SPS_nalus', nb_SPS_nalus);
        const SPS = [];
        while(nb_SPS_nalus > 0){
            const $length = readInt(data, 2);
            const $nalu = read(data, $length);
            SPS.push($nalu);
            nb_SPS_nalus--;
        }

        console.log(pathPerfix + ' SPS',SPS);


        let nb_PPS_nalus = readInt(data, 1);
        console.log(pathPerfix + ' nb_PPS_nalus', nb_PPS_nalus);

        const PPS = [];
        while(nb_PPS_nalus > 0){
            const $length = readInt(data, 2);
            const $nalu = read(data, $length);
            PPS.push($nalu);
            nb_PPS_nalus--;
        }

        console.log(pathPerfix + ' PPS',PPS);

        console.warn(`pos:${data.pos}`);
        console.warn(`pos:${data.pos}`);

    },
    ctts(data, length) {

        const version = readInt(data, 1);
        console.log(pathPerfix + ' 版本', version);

        const flags = readInt(data, 3);
        console.log(pathPerfix + ' flags', flags);

        let entryCount = readInt(data, 4);
        console.log(pathPerfix + ' entryCount', entryCount);

        const entrys = [];
        while (entryCount > 0){
            const sample = readInt(data, 4);
            const offset = readInt(data, 4);
            entrys.push({ sample, offset });

            entryCount --;
        }

        console.log(pathPerfix + ' entrys', entrys);

        console.warn(`pos:${data.pos}`);

    },
}

function skipBox(data, length) {
    data.pos += length;
};

function iterateBox(data, length, type) {
    const start = data.pos;
    const end = start + length
    const oldPathPerfix = pathPerfix;
    pathPerfix += `--${type}--`;
    while (data.pos < end) {
        const length = readInt(data, 4);
        console.log(pathPerfix + ' box 长度:', length);

        const type = readString(data, 4);
        console.log(pathPerfix + ' box类型:', type);

        BoxParsers[type](data, length, type);
        console.error(`当前位置(${type}): `, data.pos);
    }
    pathPerfix = oldPathPerfix;


};

function readBox(data) {
    const boxSize = readInt(data, 4);
    console.log('盒子长度:', boxSize);

    const boxType = readString(data, 4);
    console.log('盒子类型标示:', boxType);

    BoxParsers[boxType](data, boxSize, boxType);
}
