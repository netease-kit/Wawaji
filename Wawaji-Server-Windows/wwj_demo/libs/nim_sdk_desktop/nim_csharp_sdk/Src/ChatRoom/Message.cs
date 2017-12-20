using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace NIMChatRoom
{
    /// <summary>
    /// 聊天室消息类型
    /// </summary>
    public enum NIMChatRoomMsgType
    {
        /// <summary>
        ///文本类型消息 
        /// </summary>
        kNIMChatRoomMsgTypeText = 0,

        /// <summary>
        ///活动室通知 
        /// </summary>
        kNIMChatRoomMsgTypeNotification = 5,

        /// <summary>
        ///自定义消息 
        /// </summary>
        kNIMChatRoomMsgTypeCustom = 100,

        /// <summary>
        ///未知类型消息，作为默认值 
        /// </summary>
        kNIMChatRoomMsgTypeUnknown = 1000,
    }

    /// <summary>
    /// 聊天室消息
    /// </summary>
    public class Message:NimUtility.NimJsonObject<Message>
    {
        /// <summary>
        /// 消息所属的聊天室id(服务器填充)
        /// </summary>
        [JsonProperty("room_id")]
        public long RoomId { get; set; }

        /// <summary>
        /// 消息发送者的账号(服务器填充) 
        /// </summary>
        [JsonProperty("from_id")]
        public string SenderId { get; set; }

        /// <summary>
        /// 消息发送的时间戳(服务器填充)(毫秒)
        /// </summary>
        [JsonProperty("time")]
        public long TimeStamp { get; set; }

        /// <summary>
        /// 消息发送方客户端类型,服务器填写,发送方不需要填写
        /// </summary>
        [JsonProperty("from_client_type")]
        public int SenderClientType { get; set; }

        /// <summary>
        /// 消息发送方昵称
        /// </summary>
        [JsonProperty("from_nick")]
        public string SenderNickName { get; set; }

        /// <summary>
        /// 消息类型
        /// </summary>
        [JsonProperty("msg_type")]
        public NIMChatRoomMsgType MessageType { get; set; }

        /// <summary>
        /// 消息内容,如果约定的是json字符串，必须为可以解析为json的非格式化的字符串
        /// </summary>
        [JsonProperty("msg_attach")]
        public string MessageAttachment { get; set; }

        /// <summary>
        /// 客户端消息id
        /// </summary>
        [JsonProperty("client_msg_id")]
        public string ClientMsgId { get; set; }

        /// <summary>
        /// 消息重发标记位
        /// </summary>
        [JsonProperty("resend_flag")]
        public bool NeedResend { get; set; }

        /// <summary>
        /// 第三方扩展字段, 格式不限，长度限制4096
        /// </summary>
        [JsonProperty("ext")]
        public NimUtility.Json.JsonExtension Extension { get; set; }

        /// <summary>
        /// 媒体文件本地绝对路径（客户端）
        /// </summary>
        [JsonProperty("local_res_path")]
        public string LocalResourcePath { get; set; }

        /// <summary>
        ///  媒体文件ID（客户端）
        /// </summary>
        [JsonProperty("res_id")]
        public string LocalResourceId { get; set; }
    }

    class QueryMessageHistoryParam : NimUtility.NimJsonObject<QueryMessageHistoryParam>
    {
        [JsonProperty("start")]
        public long StartTime { get; set; }

        [JsonProperty("limit")]
        public int Count { get; set; }
    }
}
