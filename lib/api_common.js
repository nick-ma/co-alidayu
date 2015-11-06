// 本文件用于wechat API，基础文件，主要用于Token的处理和mixin机制
var httpx = require('httpx');
var streamx = require('streamx');
var crypto = require('crypto');
var extend = require('util')._extend;
var querystring = require('querystring');
var format_now = require('./util').format_now;

/**
 * API构造函数
 * Examples:
 * ```
 * // 创建api实例
 * var api = new API("appkey", "appsecret", "use_https", "sandbox");
 * ```
 * @param {String} appKey 应用的app key
 * @param {String} appSecret 应用的app secret
 * @param {Boolean} use_https 是否使用https通道
 * @param {Boolean} sandbox 是否使用砂箱
 */
var API = function (appKey, appSecret, use_https, sandbox) {
    this.__http_gw__ = 'http://gw.api.taobao.com/router/rest';
    this.__http_gw_sandbox__ = 'http://gw.api.tbsandbox.com/router/rest';
    this.__https_gw__ = 'https://eco.taobao.com/router/rest';
    this.__https_gw_sandbox__ = 'https://gw.api.tbsandbox.com/router/rest';
    // 确定用哪个接口
    if (sandbox) {
        if (use_https) {
            this.gw = this.__https_gw_sandbox__
        } else {
            this.gw = this.__http_gw_sandbox__
        };
    } else {
        if (use_https) {
            this.gw = this.__https_gw__
        } else {
            this.gw = this.__http_gw__
        };
    };

    this.format = 'json';
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.v = '2.0';
    this.sign_method = 'md5';

    this.__headers__ = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'app_key': this.appKey,
    };
    this.defaults = {};

};

/**
 * 计算签名。单独使用可以用于验证各种回调接口的签名。
 * Examples:
 * ```
 * // 计算签名
 * var shasum = api.getSignature("nonce", "timestamp");
 * ```
 * @param {String} nonce 
 * @param {String} timestamp 
 */
API.prototype.sign = function (args) {
    args = extend(args, {
        app_key: this.appKey,
        v: this.v,
        sign_method: this.sign_method,
        format: this.format,
        timestamp: format_now(),
    });
    var _signString = [];
    for (var key in args) {
        if (typeof args[key] == 'object')
            _signString.push(key + JSON.stringify(args[key]));
        else
            _signString.push(key + args[key]);
    }
    _signString.sort();
    var str = this.appSecret + _signString.join("") + this.appSecret
    var bufferSize = str.length > 1024 ? str.length : 1024;
    var Buffer = require('buffer').Buffer;
    var buf = new Buffer(bufferSize);
    var len = buf.write(str, 0, bufferSize);
    str = buf.toString('binary', 0, len);
    // 签名
    args.sign = crypto.createHash('md5').update(str).digest('hex').toUpperCase();
    return args;
};

API.prototype.genURL = function (args) {
    var _reqStr = [],
        keys = Object.keys(args);
    for (var i = 0; i < keys.length; i++) {
        if ((typeof args[keys[i]]) === 'object') {
            _reqStr.push(keys[i] + '=' + encodeURIComponent(JSON.stringify(args[keys[i]])));
        } else {
            _reqStr.push(keys[i] + '=' + encodeURIComponent(args[keys[i]]));
        }
    }
    return url = this.gw + '?' + _reqStr.join('&');
};

/**
 * 设置HTTP请求的参数
 * Examples:
 * ```
 * // 设定超时为15秒
 * var token = api.setOpts({
 *    timeout: 15000
 * });
 * ```
 * @param {Object} obj 请求的配置参数
 */
API.prototype.setOpts = function (opts) {
    this.defaults = opts;
};

API.prototype.request = function* (url, opts) {
    var options = {};
    extend(options, this.defaults);
    opts || (opts = {});
    for (var key in opts) {
        if (key !== 'headers') {
            options[key] = opts[key];
        } else {
            if (opts.headers) {
                options.headers = options.headers || {};
                extend(options.headers, opts.headers);
            }
        }
    }

    var res = yield httpx.request(url, options);
    if (res.statusCode < 200 || res.statusCode > 204) {
        var err = new Error("url: " + url + ", status code: " + res.statusCode);
        err.name = "TOPAPIError";
        throw err;
    }

    var buffer = yield streamx.read(res);
    var contentType = res.headers['content-type'] || '';
    if (contentType.indexOf('application/json') !== -1) {
        var data;
        try {
            data = JSON.parse(buffer);
        } catch (ex) {
            var err = new Error('JSON.parse error. buffer is ' + buffer.toString());
            err.name = "TOPAPIError";
            throw err;
        }
        if (data && data.errcode) {
            var err = new Error(data.errmsg);
            err.name = 'TOPAPIError';
            err.code = data.errcode;
            throw err;
        }

        return data;
    }

    try {
        return JSON.parse(buffer.toString());
    } catch (e) {
        return buffer.toString();
    }
};


/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 加入发送短信的模块
 * API.mixin(require('./lib/api_sms'));
 * ```
 * @param {Object} obj 要合并的对象
 */
API.mixin = function (obj) {
    for (var key in obj) {
        if (API.prototype.hasOwnProperty(key)) {
            throw new Error('Don\'t allow override existed prototype method. method: ' + key);
        }
        API.prototype[key] = obj[key];
    }
};

module.exports = API;
