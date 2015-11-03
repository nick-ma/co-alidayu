var extend = require('util')._extend;
/**
 * 文本转语音通知
 * http://open.taobao.com/doc2/apiDetail?spm=0.0.0.0.F0x8qp&apiId=25444
 * 举例:
 * ```
 * // 文本转语音通知
 * var flag = yield api.tts_singlecall(args);
 * ```
 * @param {Object} args 请求的参数（必填）
 */
exports.tts_singlecall = function* (args) {
    args = extend(args, {
        "method": 'alibaba.aliqin.fc.tts.num.singlecall',
    });
    args = this.sign(args);
    var url = this.genURL(args);
    return yield * this.request(url, this.__headers__);
};

