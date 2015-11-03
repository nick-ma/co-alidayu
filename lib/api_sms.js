var extend = require('util')._extend;

/**
 * 发送短信
 * http://open.taobao.com/doc2/apiDetail?spm=0.0.0.0.a90QvS&apiId=25450
 * 举例:
 * ```
 * // 发送短信
 * var ret = yield api.send_sms(args);
 * ```
 * @param {Object} args 请求的参数（必填）
 */
exports.send_sms = function* (args) {
    args = extend(args, {
        "method": 'alibaba.aliqin.fc.sms.num.send',
        "sms_type": 'normal'
    });
    args = this.sign(args);
    var url = this.genURL(args);
    return yield * this.request(url, this.__headers__);
};
