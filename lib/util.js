/*!
 * 对提交参数一层封装，当POST JSON，并且结果也为JSON时使用 */
exports.postJSON = function (data) {
    return {
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

exports.format_now = function () {
    var now = new Date();
    var ret = [now.getFullYear(), '-', perfix0p1(now.getMonth()), '-', perfix0p1(now.getDate()),
        ' ',
        perfix0(now.getHours()), ':', perfix0(now.getMinutes()), ':', perfix0(now.getSeconds()),
    ];
    return ret.join("");
};

var perfix0p1 = function (num) {
    if (num < 9) {
        return '0' + (num + 1)
    } else {
        return num + 1
    };
};

var perfix0 = function (num) {
    if (num < 9) {
        return '0' + num
    } else {
        return num
    };
};