using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIMChatRoom
{
    /// <summary>
    /// 聊天室通知类型
    /// </summary>
    public enum NIMChatRoomNotificationId
    {
        /// <summary>
        ///成员进入聊天室 
        /// </summary>
        kNIMChatRoomNotificationIdMemberIn = 301,

        /// <summary>
        ///成员离开聊天室 
        /// </summary>
        kNIMChatRoomNotificationIdMemberExit = 302,

        /// <summary>
        ///成员被加黑 
        /// </summary>
        kNIMChatRoomNotificationIdAddBlack = 303,

        /// <summary>
        ///成员被取消黑名单 
        /// </summary>
        kNIMChatRoomNotificationIdRemoveBlack = 304,

        /// <summary>
        ///成员被设置禁言 
        /// </summary>
        kNIMChatRoomNotificationIdAddMute = 305,

        /// <summary>
        ///成员被取消禁言 
        /// </summary>
        kNIMChatRoomNotificationIdRemoveMute = 306,

        /// <summary>
        ///设置为管理员 
        /// </summary>
        kNIMChatRoomNotificationIdAddManager = 307,

        /// <summary>
        ///取消管理员 
        /// </summary>
        kNIMChatRoomNotificationIdRemoveManager = 308,

        /// <summary>
        ///成员设定为固定成员 
        /// </summary>
        kNIMChatRoomNotificationIdAddFixed = 309,

        /// <summary>
        ///成员取消固定成员 
        /// </summary>
        kNIMChatRoomNotificationIdRemoveFixed = 310,

        /// <summary>
        ///聊天室被关闭了 
        /// </summary>
        kNIMChatRoomNotificationIdClosed = 311,

        /// <summary>
        ///聊天室信息被更新了 
        /// </summary>
        kNIMChatRoomNotificationIdInfoUpdated = 312,

        /// <summary>
        ///成员被踢了 
        /// </summary>
        kNIMChatRoomNotificationIdMemberKicked = 313
    }

    public class Notification:NimUtility.NimJsonObject<Notification>
    {
        /// <summary>
        /// 通知类型
        /// </summary>
        [JsonProperty("id")]
        public NIMChatRoomNotificationId Type { get; set; }

        [JsonProperty("data")]
        public Data InnerData { get; set; }

        public class Data
        {
            /// <summary>
            /// 上层开发自定义的事件通知扩展字段
            /// </summary>
            [JsonProperty("ext")]
            public NimUtility.Json.JsonExtension Extension { get; set; }

            /// <summary>
            /// 操作者的账号id
            /// </summary>
            [JsonProperty("operator")]
            public string OperatorId { get; set; }

            /// <summary>
            /// 操作者的账号nick
            /// </summary>
            [JsonProperty("opeNick")]
            public string OperatorNick { get; set; }

            /// <summary>
            /// 被操作者的账号nick列表
            /// </summary>
            [JsonProperty("tarNick")]
            public string[] TargetAccountsNick { get; set; }

            /// <summary>
            /// 被操作者的accid列表
            /// </summary>
            [JsonProperty("target")]
            public string[] TargetIdCollection { get; set; }
        }
    }
}
