# co-alidayu
阿里大鱼NodeJS CO版
支持最新的NodeJS 5.0.0

http://www.alidayu.com/

## 功能列表
- 短信发送
- 语音通知
- 文本转语音通知
- 语音双呼

详细参见[淘宝API文档](http://open.taobao.com/doc2/apiList?spm=0.0.0.0.pYsowQ&cid=20711)

## Installation

```sh
$ npm install co-alidayu
```

## Usage

```js
var AliDayu = require('co-alidayu');

var alidayu = new AliDayu(appid, appsecret);
var sms = {
    extend: "",
    sms_free_sign_name: "注册验证",
    sms_param: {
        code: '168398',
        product: '启示录'
    },
    rec_num: "13700000000",
    sms_template_code: "SMS_1880148",
};
var ret = yield api.send_sms(sms);
```

## License
The MIT license.