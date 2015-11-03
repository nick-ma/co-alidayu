var extend = require('util')._extend;

/**
 * 发送短信
 * http://open.taobao.com/doc2/apiDetail?spm=0.0.0.0.a90QvS&apiId=25450
 * 举例:
 * ```
 * // 发送短信
 * var flag = yield api.send_sms(args);
 * if (flag){
 *   // 发送成功
 * } else {
 *   // 发送失败
 * }
 * ```
 * @param {Object} args 请求的参数（必填）
 */
exports.send_sms = function* (args) {
    args = _.extend(args, {
        "method": 'alibaba.aliqin.fc.sms.num.send',
        "sms_type": 'normal'
    });
    args = this.sign(args);
    var url = this.genURL(args);
    var ret_data = yield * this.request(url, this.__headers__);
    if (ret_data['alibaba_aliqin_fc_sms_num_send_response']) {
        return ret_data['alibaba_aliqin_fc_sms_num_send_response']['result']['success'];
    } else {
        return false;
    };
};
