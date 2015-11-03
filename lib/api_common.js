// 本文件用于wechat API，基础文件，主要用于Token的处理和mixin机制
var httpx = require('httpx');
var streamx = require('streamx');
var crypto = require('crypto');
var extend = require('util')._extend;
var querystring = require('querystring');


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
API.prototype.getSignature = function (nonce, timestamp) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.__appsecert__ + nonce + timestamp);
    return shasum.digest('hex');
};

API.prototype.updateHeader = function () {
    var nonce = parseInt(Math.random() * 0xffffff);
    var timestamp = Date.parse(new Date()) / 1000;
    var signature = this.getSignature(nonce, timestamp);
    return extend(this.__headers__, {
        'Nonce': nonce,
        'Timestamp': timestamp,
        'Signature': signature
    });
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

    return buffer;
};

API.prototype.genURL = function (path) {
    return [this.__baseurl__, path, '.', this.__format__].join('');
};

API.prototype.genPostData = function (post_data) {
    return {
        headers: this.updateHeader(),
        method: 'POST',
        data: querystring.stringify(post_data)
    };
};

API.prototype.genPostJsonData = function (post_data) {
    var data = {
        headers: this.updateHeader(),
        method: 'POST',
        data: post_data
    };
    data.headers['Content-Type'] = 'Application/json';
    return data;
};

/**
 * 换取用户的token
 * Examples:
 * ```
 * // 获取用户的token
 * var token = yield api.getToken(userid, <name>, <portrait_url>);
 * ```
 * @param {String} userid 用户的userid（必填）
 * @param {String} name 姓名（选填）
 * @param {String} portrait_url 头像url（选填）
 */
API.prototype.getToken = function* (userid, name, portrait_url) {
    var url = this.genURL('/user/getToken');
    var post_data = {
        userId: userid
    };
    if (name) {
        post_data['name'] = name;
    };
    if (portrait_url) {
        post_data['portraitUri'] = portrait_url;
    };
    var opts = {
        headers: this.updateHeader(),
        method: 'POST',
        data: querystring.stringify(post_data)
    };
    var ret_data = yield * this.request(url, opts);
    if (ret_data.code == 200) {
        return ret_data.token;
    } else {
        return null;
    };
};

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 加入用户管理模块
 * API.mixin(require('./lib/api_user'));
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
