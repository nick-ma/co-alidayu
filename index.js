var API = require('./lib/api_common');
// alibaba.aliqin.fc.sms.num.send (短信发送)
API.mixin(require('./lib/api_sms'));
// alibaba.aliqin.fc.voice.num.singlecall (语音通知)
API.mixin(require('./lib/api_voice_singlecall'));
// alibaba.aliqin.fc.tts.num.singlecall (文本转语音通知)
API.mixin(require('./lib/api_tts_singlecall'));
// alibaba.aliqin.fc.voice.num.doublecall (语音双呼)
API.mixin(require('./lib/api_voice_doublecall'));
// 消息服务
// API.mixin(require('./lib/api_message'));
// // 敏感词服务
// API.mixin(require('./lib/api_wordfilter'));
// // 群组服务
// API.mixin(require('./lib/api_group'));
// // 聊天室服务
// API.mixin(require('./lib/api_chatroom'));
// // 消息历史记录服务
// API.mixin(require('./lib/api_history'));

module.exports = API;
