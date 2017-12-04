/** @file NIMSessionDef.cs
  * @brief session define
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace NIM.Session
{
    /// <summary>
    /// 会话操作命令
    /// </summary>
    public enum NIMSessionCommand
    {
        /// <summary>
        /// 添加会话项
        /// </summary>
        kNIMSessionCommandAdd = 0,

        /// <summary>
        /// 删除单个会话项
        /// </summary>
        kNIMSessionCommandRemove = 1,

        /// <summary>
        /// 删除所有会话项
        /// </summary>
        kNIMSessionCommandRemoveAll = 2,

        /// <summary>
        /// 删除所有点对点的会话项
        /// </summary>
        kNIMSessionCommandRemoveAllP2P = 3,

        /// <summary>
        /// 删除所有群的会话项
        /// </summary>
        kNIMSessionCommandRemoveAllTeam = 4,

        /// <summary>
        /// 单个会话项的消息已删除
        /// </summary>
        kNIMSessionCommandMsgDeleted = 5,

        /// <summary>
        /// 所有会话项的消息已删除
        /// </summary>
        kNIMSessionCommandAllMsgDeleted = 6,

        /// <summary>
        /// 所有点对点会话项的消息已删除
        /// </summary>
        kNIMSessionCommandAllP2PMsgDeleted = 7,

        /// <summary>
        /// 所有群会话项的消息已删除
        /// </summary>
        kNIMSessionCommandAllTeamMsgDeleted = 8,

        /// <summary>
        /// 更新会话项
        /// </summary>
        kNIMSessionCommandUpdate = 9,
    }

    public class SessionInfo : NimUtility.NimJsonObject<SessionInfo>
    {
        /// <summary>
        /// 会话ID
        /// </summary>
        [Newtonsoft.Json.JsonProperty("id")]
        public string Id { get; set; }

        /// <summary>
        /// 会话类型
        /// </summary>
        [Newtonsoft.Json.JsonProperty("type")]
        public Session.NIMSessionType SessionType { get; set; }

        /// <summary>
        /// 当前会话消息未读数
        /// </summary>
        [Newtonsoft.Json.JsonProperty("unread_count")]
        public int UnreadCount { get; set; }

        /// <summary>
        /// 会话修改命令
        /// </summary>
        [Newtonsoft.Json.JsonProperty("command")]
        public NIMSessionCommand Command { get; set; }

        /// <summary>
        /// 当前会话最新一条消息ID
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_client_id")]
        public string MsgId { get; set; }

        /// <summary>
        /// 当前会话最新一条消息发送方ID
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_from_account")]
        public string Sender { get; set; }

        /// <summary>
        /// 当前会话最新一条消息时间戳（毫秒）
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_time")]
        public long Timetag { get; set; }

        /// <summary>
        /// 当前会话最新一条消息类型
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_type")]
        public NIMMessageType MsgType { get; set; }

        /// <summary>
        /// 当前会话最新一条消息内容
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_body")]
        public string Content { get; set; }

        /// <summary>
        /// 当前会话最新一条消息附件
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_attach")]
        private string Attach { get; set; }

        public object Attachment { get; set; }

        /// <summary>
        /// 当前会话最新一条消息状态
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_status")]
        public Messagelog.NIMMsgLogStatus Status { get; set; }

        /// <summary>
        /// 当前会话最新一条消息子状态
        /// </summary>
        [Newtonsoft.Json.JsonProperty("msg_sub_status")]
        public Messagelog.NIMMsgLogSubStatus SubStatus { get; set; }

        SessionInfo()
        {
            UnreadCount = 0;
            Timetag = 0;
            SessionType = Session.NIMSessionType.kNIMSessionTypeP2P;
            Command = NIMSessionCommand.kNIMSessionCommandAdd;
            MsgType = NIMMessageType.kNIMMessageTypeUnknown;
            Status = Messagelog.NIMMsgLogStatus.kNIMMsgLogStatusNone;
            SubStatus = Messagelog.NIMMsgLogSubStatus.kNIMMsgLogSubStatusNone;
        }

        public void ParseAttachmentInfo()
        {
            if (MsgType != NIMMessageType.kNIMMessageTypeUnknown && !string.IsNullOrEmpty(Attach))
            {
                //TODO:处理 kNIMMessageTypeNotification 会话消息
                if (MsgType == NIMMessageType.kNIMMessageTypeNotification)
                    Attachment = NIM.Team.NIMTeamEventData.Deserialize(Attach);
                else
                    Attachment = NIM.Message.MessageAttachmentFactory.CreateAttachment(MsgType, Attach);
            }
        }
    }

    public class SesssionInfoList
    {
        const string CountJsonKey = "count";
        const string UnreadJsonKey = "unread_counts";
        const string ContentJsonKey = "content";

        /// <summary>
        /// 最近会话个数
        /// </summary>
        [Newtonsoft.Json.JsonProperty(CountJsonKey)]
        public int Count { get; set; }

        /// <summary>
        /// 总未读数
        /// </summary>
        [Newtonsoft.Json.JsonProperty(UnreadJsonKey)]
        public int UnreadCounts { get; set; }

        /// <summary>
        /// 最近会话列表
        /// </summary>
        [Newtonsoft.Json.JsonProperty(ContentJsonKey)]
        public List<SessionInfo> SessionList { get; set; }

        public static SesssionInfoList Deserialize(string json)
        {
            SesssionInfoList resultObj = new SesssionInfoList();
            JObject jObj = JObject.Parse(json);
            if (jObj == null) return null;
            var countToken = jObj.SelectToken(CountJsonKey);
            var unreadToken = jObj.SelectToken(UnreadJsonKey);
            var contentToken = jObj.SelectToken(ContentJsonKey);
            resultObj.Count = countToken.ToObject<int>();
            resultObj.UnreadCounts = unreadToken.ToObject<int>();
            if (contentToken != null && contentToken.Type == JTokenType.Array)
            {
                resultObj.SessionList = new List<SessionInfo>();
                var sessionContentList = contentToken.ToArray();
                foreach (var item in sessionContentList)
                {
                    var info = item.ToObject<SessionInfo>();
                    info.ParseAttachmentInfo();
                    resultObj.SessionList.Add(info);
                }
            }
            return resultObj;
        }
    }

    public class SessionChangedEventArgs : EventArgs
    {
        public ResponseCode ResCode { get; private set; }
        public SessionInfo Info { get; private set; }
        public int TotalUnreadCount { get; private set; }

        public SessionChangedEventArgs(ResponseCode code, SessionInfo info, int unreadCount)
        {
            ResCode = code;
            Info = info;
            TotalUnreadCount = unreadCount;
        }
    }

    /// <summary>
    /// 最近会话项更新通知的回调
    /// </summary>
    /// <param name="rescode">操作结果，成功200</param>
    /// <param name="result">最近会话</param>
    /// <param name="totalUnreadCounts">总的未读数目</param>
    public delegate void SessionChangeHandler(int rescode, SessionInfo result, int totalUnreadCounts);

    /// <summary>
    /// 查询所有最近会话项的回调
    /// </summary>
    /// <param name="totalUnreadCount">总的未读数目</param>
    /// <param name="result">最近会话列表</param>
    public delegate void QueryRecentHandler(int totalUnreadCount, SesssionInfoList result);
}
