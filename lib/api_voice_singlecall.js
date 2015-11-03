var extend = require('util')._extend;
/**
 * 语音通知
 * http://open.taobao.com/doc2/apiDetail?spm=0.0.0.0.gZWjRM&apiId=25445
 * 举例:
 * ```
 * // 语音通知
 * var flag = yield api.voice_singlecall(args);
 * if (flag){
 *   // 发送成功
 * } else {
 *   // 发送失败
 * }
 * ```
 * @param {Object} args 请求的参数（必填）
 */
exports.voice_singlecall = function* (args) {
    args = _.extend(args, {
        "method": 'alibaba.aliqin.fc.voice.num.singlecall',
    });
    args = this.sign(args);
    var url = this.genURL(args);
    var ret_data = yield * this.request(url, this.__headers__);
    if (ret_data['alibaba.aliqin.fc.voice.num.singlecall']) {
        return ret_data['alibaba.aliqin.fc.voice.num.singlecall']['result']['success'];
    } else {
        return false;
    };
};
