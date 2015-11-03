var extend = require('util')._extend;
/**
 * 语音双呼
 * http://open.taobao.com/doc2/apiDetail?spm=0.0.0.0.56MDBW&apiId=25443
 * 举例:
 * ```
 * // 语音双呼
 * var flag = yield api.voice_doublecall(args);
 * if (flag){
 *   // 发送成功
 * } else {
 *   // 发送失败
 * }
 * ```
 * @param {Object} args 请求的参数（必填）
 */
exports.voice_doublecall = function* (args) {
    args = _.extend(args, {
        "method": 'alibaba.aliqin.fc.voice.num.doublecall',
    });
    args = this.sign(args);
    var url = this.genURL(args);
    var ret_data = yield * this.request(url, this.__headers__);
    if (ret_data['alibaba.aliqin.fc.voice.num.doublecall']) {
        return ret_data['alibaba.aliqin.fc.voice.num.doublecall']['result']['success'];
    } else {
        return false;
    };
};