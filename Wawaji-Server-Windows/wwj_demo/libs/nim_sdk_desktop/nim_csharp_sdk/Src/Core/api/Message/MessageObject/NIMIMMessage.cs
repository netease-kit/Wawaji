using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace NIM
{
    public abstract class NIMIMMessage : NimUtility.NimJsonObject<NIMIMMessage>
    {
        #region 协议定义字段
        /// <summary>
        /// 会话类型
        /// </summary>
        [JsonProperty("to_type")]
        public Session.NIMSessionType SessionType { get; set; }

        /// <summary>
        /// 发送者ID
        /// </summary>
        [JsonProperty("from_id")]
        public string SenderID { get; set; }

        /// <summary>
        /// 接收者ID
        /// </summary>
        [JsonProperty("to_accid")]
        public string ReceiverID { get; set; }

        /// <summary>
        /// 消息发送方客户端类型
        /// </summary>
        [JsonProperty("from_client_type")]
        public NIMClientType SenderClientType { get; private set; }

        /// <summary>
        /// 消息发送方设备id
        /// </summary>
        [JsonProperty("from_device_id")]
        public string SenderDeviceId { get; private set; }

        /// <summary>
        /// 消息发送方昵称
        /// </summary>
        [JsonProperty("from_nick")]
        public string SenderNickname { get; private set; }

        /// <summary>
        /// 消息时间戳（毫秒）
        /// </summary>
        [JsonProperty(PropertyName = "time", DefaultValueHandling = DefaultValueHandling.Ignore)]
        public long TimeStamp { get; set; }

        /// <summary>
        /// 消息类型
        /// </summary>
        [JsonProperty(MessageTypePath)]
        public NIMMessageType MessageType { get; protected set; }

        /// <summary>
        /// 消息ID（客户端）
        /// </summary>
        [JsonProperty("client_msg_id")]
        public string ClientMsgID { get; set; }

        /// <summary>
        /// 服务器端消息id
        /// </summary>
        [JsonProperty("server_msg_id")]
        public string ServerMsgId { get; private set; }

        /// <summary>
        /// 消息重发标记位,第一次发送0,重发1
        /// </summary>
        [JsonProperty("resend_flag")]
        public int ResendFlag { get; set; }

        /// <summary>
        /// 该消息是否存储云端历史 (可选，仅对kNIMMessageTypeCustom有效)
        /// </summary>
        [JsonProperty(PropertyName = "cloud_history", NullValueHandling = NullValueHandling.Ignore)]
        public NIMMessageSettingStatus? ServerSaveHistory { get; set; }

        /// <summary>
        /// 该消息是否支持漫游(可选,仅对kNIMMessageTypeCustom有效)
        /// </summary>
        [JsonProperty(PropertyName = "roam_msg", NullValueHandling = NullValueHandling.Ignore)]
        public NIMMessageSettingStatus? Roaming { get; set; }

        /// <summary>
        /// 该消息是否支持发送者多端同步 (可选,仅对kNIMMessageTypeCustom有效)
        /// </summary>
        [JsonProperty(PropertyName = "sync_msg", NullValueHandling = NullValueHandling.Ignore)]
        public NIMMessageSettingStatus? MultiSync { get; set; }

        /// <summary>
        /// 是否要做消息计数
        /// </summary>
        [JsonProperty(PropertyName = "need_badge", NullValueHandling = NullValueHandling.Ignore)]
        public NIMMessageSettingStatus? NeedCounting { get; set; }

        //服务器扩展,内容限非格式化的json string,长度限制1024
        [JsonProperty(PropertyName = "server_ext")]
        public NimUtility.Json.JsonExtension ServerExtension { get; set; }

        //自定义的推送属性，限制非格式化的json string，长度2048
        [JsonProperty(PropertyName = "push_payload")]
        public NimUtility.Json.JsonExtension PushPayload { get; set; }

        /// <summary>
        /// 自定义推送文案，长度限制200字节
        /// </summary>
        [JsonProperty("push_content")]
        public string PushContent { get; set; }

        /// <summary>
        /// 是否需要推送
        /// </summary>
        [JsonProperty(PropertyName = "push_enable", NullValueHandling = NullValueHandling.Ignore)]
        public NIMMessageSettingStatus? NeedPush { get; set; }

        /// <summary>
        /// 需要推送昵称
        /// </summary>
        [JsonProperty(PropertyName = "push_nick")]
        public NIMMessageSettingStatus? NeedPushNick { get; set; }

        #endregion

        #region 客户端定义字段
        /// <summary>
        /// 多媒体消息资源本地绝对路径,SDK本地维护,发送多媒体消息时必填
        /// </summary>
        [JsonProperty("local_res_path")]
        public string LocalFilePath { get; set; }

        /// <summary>
        /// 会话id,发送方选填,接收方收到的是消息发送方id
        /// </summary>
        [JsonProperty("talk_id")]
        public string TalkID { get; set; }

        /// <summary>
        /// 多媒体资源id,发送方选填,接收方收到的是客户端消息id
        /// </summary>
        [JsonProperty("res_id")]
        public string ResourceId { get; set; }

        /// <summary>
        /// 消息状态
        /// </summary>
        [JsonProperty("log_status")]
        public NIM.Messagelog.NIMMsgLogStatus MsgLogStatus { get; set; }

        /// <summary>
        /// 消息状态
        /// </summary>
        [JsonProperty("log_sub_status")]
        public NIM.Messagelog.NIMMsgLogSubStatus MsgLogSubStatus { get; set; }

        /// <summary>
        /// 本地扩展内容
        /// </summary>
        [JsonProperty("local_ext")]
        public string LocalExtension { get; set; }

        #endregion
        /// <summary>
        /// 消息是否要存离线
        /// </summary>
        [JsonIgnore]
        public NIMMessageSettingStatus? OfflineStorage { get; set; }

        /// <summary>
        /// 该消息是否在接收方被静音处理
        /// </summary>
        [JsonIgnore]
        public NIMMessageSettingStatus? BeMuted { get; set; }


        protected NIMIMMessage()
        {
            NeedPushNick = NIMMessageSettingStatus.kNIMMessageStatusSetted;
            NeedPush = NIMMessageSettingStatus.kNIMMessageStatusSetted;
        }

        public override string Serialize()
        {
            if (string.IsNullOrEmpty(ClientMsgID))
                ClientMsgID = NimUtility.Utilities.GenerateGuid();
            string jsonValue = base.Serialize();
            var rootObj = Newtonsoft.Json.Linq.JObject.Parse(jsonValue);
            MessageFactory.ConvertAttachObjectToString(rootObj.Root);
            var newValue = rootObj.ToString(Formatting.None);
            return newValue;
        }

        public void SetMessageStatus(NIMMessageSetting setting)
        {
            this.BeMuted = setting.BeMuted;
            this.MultiSync = setting.MultiSync;
            this.NeedCounting = setting.NeedCounting;
            this.NeedPush = setting.NeedPush;
            this.NeedPushNick = setting.NeedPushNick;
            this.OfflineStorage = setting.OfflineStorage;
        }
        internal const string MessageTypePath = "msg_type";
        internal const string AttachmentPath = "msg_attach";
        internal const string MessageBodyPath = "msg_body";
    }
}
