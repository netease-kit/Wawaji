/** @file NIMReceivedMessage.cs
  * @brief NIM SDK 收发消息相关的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMReceivedMessage : NimUtility.NimJsonObject<NIMReceivedMessage>
    {
        [JsonProperty(MessageContentPath)]
        public NIMIMMessage MessageContent { get; set; }

        [JsonProperty(FeaturePath)]
        public NIMMessageFeature Feature { get; set; }

        [JsonProperty(ResCodePath)]
        public ResponseCode ResponseCode { get; set; }

        internal const string MessageContentPath = "content";
        internal const string ResCodePath = "rescode";
        internal const string FeaturePath = "feature";
    }

    public class ReceiveMessageArgs : EventArgs
    {
        public NIMIMMessage Message { get; set; }

        public ReceiveMessageArgs(NIMIMMessage msg)
        {
            Message = msg;
        }
    }

    public class NIMReceiveMessageEventArgs : EventArgs
    {
        public NIMReceivedMessage Message { get; set; }

        public NIMReceiveMessageEventArgs(NIMReceivedMessage msg)
        {
            Message = msg;
        }
    }

    public class MessageAck : NimUtility.NimJsonObject<MessageAck>
    {
        /// <summary>
        /// 会话ID
        /// </summary> 
        [JsonProperty("talk_id")]
        public string TalkId { get; set; }

        /// <summary>
        ///消息ID 
        /// </summary>
        [JsonProperty("msg_id")]
        public string MsgId { get; set; }

        /// <summary>
        ///错误码 
        /// </summary>
        [JsonProperty("rescode")]
        public ResponseCode Response { get; set; }
    }

    public class MessageArcEventArgs : EventArgs
    {
        public MessageAck ArcInfo { get; private set; }

        public MessageArcEventArgs(MessageAck arc)
        {
            ArcInfo = arc;
        }
    }
}
