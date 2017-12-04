/** @file NIMSysMessage.cs
  * @brief NIM SDK提供的系统消息相关的定义 
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using Newtonsoft.Json;

namespace NIM.SysMessage
{
    public class NIMSysMessag:NimUtility.NimJsonObject<NIMSysMessag>
    {
        /// <summary>
        ///通知错误码 
        /// </summary>
        [JsonProperty("rescode")]
        public ResponseCode Response { get; set; }

        /// <summary>
        ///通知属性 
        /// </summary>
        [JsonProperty("feature")]
        public NIMMessageFeature Feature { get; set; }

        /// <summary>
        ///总计的通知未读数 
        /// </summary>
        [JsonProperty("unread_count")]
        int TotalUnread { get; set; }

        /// <summary>
        ///通知内容 
        /// </summary>
        [JsonProperty("content")]
        public NIMSysMessageContent Content { get; set; }

    }

    public class NIMSysMessageContent:NimUtility.NimJsonObject<NIMSysMessageContent>
    {
        /// <summary>
        /// 时间戳,选填
        /// </summary>
        [JsonProperty("msg_time")]
        public long Timetag { get; set; }

        /// <summary>
        /// 通知类型
        /// </summary>
        [JsonProperty("msg_type")]
        public NIMSysMsgType MsgType { get; set; }

        /// <summary>
        /// 接收者id,如果是个人,则是对方用户id,如果是群,则是群id,必填
        /// </summary>
        [JsonProperty("to_account")]
        public string ReceiverId { get; set; }

        /// <summary>
        /// 自己id,选填
        /// </summary>
        [JsonProperty("from_account")]
        public string SenderId { get; set; }

        /// <summary>
        /// 附件,按需填写
        /// </summary>
        [JsonProperty("attach")]
        public string Attachment { get; set; }

        /// <summary>
        /// 服务器消息id（自定义通知消息,必须填0）,发送方不需要填写
        /// </summary>
        [JsonProperty("msg_id")]
        public long Id { get; set; }

        /// <summary>
        /// 自定义通知消息是否存离线:0-不存（只发给在线用户）,1-存（可发给离线用户）
        /// </summary>
        [JsonProperty("custom_save_flag")]
        public NIMMessageSettingStatus SupportOffline { get; set; }

        /// <summary>
        /// 自定义通知消息推送文本，不填则不推送
        /// </summary>
        [JsonProperty("custom_apns_text")]
        public string PushContent { get; set; }

        /// <summary>
        /// 本地定义的系统消息状态,见NIMSysMsgStatus,发送方不需要填写
        /// </summary>
        [JsonProperty("log_status")]
        public NIMSysMsgStatus Status { get; set; }

        /// <summary>
        /// 是否需要推送
        /// </summary>
        [JsonProperty("push_enable")]
        public NIMMessageSettingStatus NeedPush { get; set; }

        /// <summary>
        /// 是否要做消息计数
        /// </summary>
        [JsonProperty("need_badge")]
        public NIMMessageSettingStatus NeedPushCount { get; set; }

        /// <summary>
        /// 需要推送昵称
        /// </summary>
        [JsonProperty("push_nick")]
        public NIMMessageSettingStatus NeedPushNick { get; set; }

        /// <summary>
        /// 本地定义的消息id,发送方必填,建议使用uuid
        /// </summary>
        [JsonProperty("client_msg_id")]
        public string ClientMsgId { get; set; }

        /// <summary>
        /// 第三方自定义的推送属性
        /// </summary>
        [JsonProperty("push_payload")]
        public NimUtility.Json.JsonExtension CustomPushContent { get; set; }

        public string GenerateMsgId()
        {
            return NimUtility.Utilities.GenerateGuid();
        }
    }

    public class NIMSysMsgQueryResult : NimUtility.NimJsonObject<NIMSysMsgQueryResult>
    {
        [JsonIgnore]
        public int Count { get; set; }

        [JsonProperty("unread_count")]
        public int UnreadCount { get; private set; }

        [JsonProperty("content")]
        public NIMSysMessageContent[] MsgCollection { get;private set; }
    }

    public class NIMSysMsgEventArgs : EventArgs
    {
        public NIMSysMessag Message { get; private set; }

        public NIMSysMsgEventArgs(NIMSysMessag msg)
        {
            Message = msg;
        }
    }
}
