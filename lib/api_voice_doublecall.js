var extend = require('util')._extend;
/**
 * 语音双呼
 * http://open.taobao.com/doc2/apiDetail?spm=0.0.0.0.56MDBW&apiId=25443
 * 举例:
 * ```
 * // 语音双呼
 * var flag = yield api.voice_doublecall(args);
 * ```
 * @param {Object} args 请求的参数（必填）
 */
exports.voice_doublecall = function* (args) {
    args = extend(args, {
        "method": 'alibaba.aliqin.fc.voice.num.doublecall',
    });
    args = this.sign(args);
    var url = this.genURL(args);
    return yield * this.request(url, this.__headers__);
};