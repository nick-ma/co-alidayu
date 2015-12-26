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

## Changelog
### 1.0.4
- 修复util里格式化日期的错误
- 开始增加test case

### 1.0.3
- 修复util里前方补0的BUG

### 1.0.2
- 修复生成时间戳的BUG

### 1.0.1
- 调用方法的返回值改为JSON对象
- 更新 README 

## Installation

```sh
$ npm install co-alidayu
```

## Usage

```js
var AliDayu = require('co-alidayu');

var alidayu = new AliDayu(appid, appsecret);

// 发送短信
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

// 语音通知
var data = {
    extend: "",
    called_num: "13700000000",
    called_show_num: "125900008888",
    voice_code: "367821",
};
var ret = yield api.voice_singlecall(data);

// 文本转语音通知
var data = {
    extend: "",
    tts_param: {
        name: '以下验证码',
        code: '123451'
    },
    called_num: "13700000000",
    called_show_num: "125900008888",
    tts_code: "TTS123214",
};
var ret = yield api.tts_singlecall(data);

// 语音双呼
var data = {
    extend: "",
    session_time_out: "120", // 超时自动挂断的秒数。不传视为不自动挂断。
    caller_num: "13700000000", // 主叫号码
    caller_show_num: "10086", // 主叫端显示的号码（马甲，必须在系统里登记备案过）
    called_num: "13700008888", // 被叫号码
    called_show_num: "10000", // 被叫端显示的号码（马甲，必须在系统里登记备案过）
};
var ret = yield api.voice_doublecall(data);

```

## License
The MIT license.