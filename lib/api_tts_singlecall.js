var extend = require('util')._extend;
/**
 * 文本转语音通知
 * http://open.taobao.com/doc2/apiDetail?spm=0.0.0.0.F0x8qp&apiId=25444
 * 举例:
 * ```
 * // 文本转语音通知
 * var flag = yield api.tts_singlecall(args);
 * if (flag){
 *   // 发送成功
 * } else {
 *   // 发送失败
 * }
 * ```
 * @param {Object} args 请求的参数（必填）
 */
exports.tts_singlecall = function* (args) {
    args = _.extend(args, {
        "method": 'alibaba.aliqin.fc.tts.num.singlecall',
    });
    args = this.sign(args);
    var url = this.genURL(args);
    var ret_data = yield * this.request(url, this.__headers__);
    if (ret_data['alibaba.aliqin.fc.tts.num.singlecall']) {
        return ret_data['alibaba.aliqin.fc.tts.num.singlecall']['result']['success'];
    } else {
        return false;
    };
};

