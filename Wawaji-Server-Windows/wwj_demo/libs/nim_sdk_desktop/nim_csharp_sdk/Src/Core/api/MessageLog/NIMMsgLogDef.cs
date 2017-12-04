/** @file NIMMsgLogDef.cs
  * @brief NIM SDK消息历史相关的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System.Linq;

namespace NIM.Session
{
    /// <summary>
    /// 会话类型
    /// </summary>
    public enum NIMSessionType
    {
        /// <summary>
        ///个人，即点对点 
        /// </summary>
        kNIMSessionTypeP2P = 0,

        /// <summary>
        /// 群组
        /// </summary>
        kNIMSessionTypeTeam = 1
    }
}

namespace NIM.Messagelog
{
    public enum NIMMsgLogStatus
    {
        /// <summary>
        ///默认,不能当查询条件,意义太多 
        /// </summary>
        kNIMMsgLogStatusNone = 0,

        /// <summary>
        ///收到消息,未读 
        /// </summary>
        kNIMMsgLogStatusUnread = 1,

        /// <summary>
        ///收到消息,已读 
        /// </summary>
        kNIMMsgLogStatusRead = 2,

        /// <summary>
        ///已删 
        /// </summary>
        kNIMMsgLogStatusDeleted = 3,

        /// <summary>
        ///发送中 
        /// </summary>
        kNIMMsgLogStatusSending = 4,

        /// <summary>
        ///发送失败 
        /// </summary>
        kNIMMsgLogStatusSendFailed = 5,

        /// <summary>
        ///已发送 
        /// </summary>
        kNIMMsgLogStatusSent = 6,

        /// <summary>
        ///对方已读发送的内容 
        /// </summary>
        kNIMMsgLogStatusReceipt = 7,

        /// <summary>
        ///草稿 
        /// </summary>
        kNIMMsgLogStatusDraft = 8,

        /// <summary>
        ///发送取消 
        /// </summary>
        kNIMMsgLogStatusSendCancel = 9
    }


    /// <summary>
    ///消息子状态 
    /// </summary>
    public enum NIMMsgLogSubStatus
    {
        /// <summary>
        ///默认状态 
        /// </summary>
        kNIMMsgLogSubStatusNone = 0,

        /// <summary>
        ///未播放 
        /// </summary>
        kNIMMsgLogSubStatusNotPlaying = 20,

        /// <summary>
        ///已播放 
        /// </summary>
        kNIMMsgLogSubStatusPlayed = 21
    }

    /// <summary>
    ///消息历史的检索范围 
    /// </summary>
    public enum NIMMsgLogQueryRange
    {
        /// <summary>
        ///指定的个人（点对点会话）（注意：暂不支持指定多个人的检索！） 
        /// </summary>
        kNIMMsgLogQueryRangeP2P = 0,

        /// <summary>
        ///指定的群组（注意：暂不支持指定多个群组的检索！） 
        /// </summary>
        kNIMMsgLogQueryRangeTeam = 1,

        /// <summary>
        ///全部 
        /// </summary>
        kNIMMsgLogQueryRangeAll = 100,

        /// <summary>
        ///所有个人会话 
        /// </summary>
        kNIMMsgLogQueryRangeAllP2P = 101,

        /// <summary>
        ///所有群组 
        /// </summary>
        kNIMMsgLogQueryRangeAllTeam = 102,

        /// <summary>
        ///未知（如指定个人和群组的集合）（注意：暂不支持指定个人和群组的混合检索！） 
        /// </summary>
        kNIMMsgLogQueryRangeUnknown = 200
    }

    public class MsglogQueryResult
    {
        const string MsglogCountKey = "count";
        const string MsglogContentKey = "content";
        public int Count { get; set; }

        public NIMIMMessage[] MsglogCollection { get; set; }

        public void CreateFromJsonString(string json)
        {
            var jObj = Newtonsoft.Json.Linq.JObject.Parse(json);
            var countToken = jObj.SelectToken(MsglogCountKey);
            var contentToken = jObj.SelectToken(MsglogContentKey);
            if (countToken != null)
            {
                this.Count = countToken.ToObject<int>();
            }
            if (contentToken != null && contentToken.Type == Newtonsoft.Json.Linq.JTokenType.Array)
            {
                var log = from c in contentToken
                          let cobj = c.ToObject<Newtonsoft.Json.Linq.JObject>()
                          let msg = MessageFactory.CreateMessage(cobj)
                          where c.Type == Newtonsoft.Json.Linq.JTokenType.Object
                          select msg;
                if (log != null)
                    this.MsglogCollection = log.ToArray();
            }
        }
    }
}
