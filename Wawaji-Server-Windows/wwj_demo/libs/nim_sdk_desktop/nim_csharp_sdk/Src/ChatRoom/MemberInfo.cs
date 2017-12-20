using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIMChatRoom
{
    /// <summary>
    ///成员类型, -1:受限用户; 0:普通;1:创建者;2:管理员 
    /// </summary>
    public enum ChatRoomMemberType
    {
        Restricted = -1,
        Normal = 0,
        Creator = 1,
        Manager = 2
    }

    /// <summary>
    /// 查询成员的成员类型
    /// </summary>
    public enum NIMChatRoomGetMemberType
    {
        /// <summary>
        ///固定成员,固定成员,包括创建者,管理员,普通等级用户,受限用户(禁言+黑名单),即使非在线也可以在列表中看到,有数量限制 
        /// </summary>
        kNIMChatRoomGetMemberTypeSolid = 0,

        /// <summary>
        ///非固定成员,非固定成员,又称临时成员,只有在线时才能在列表中看到,数量无上限 
        /// </summary>
        kNIMChatRoomGetMemberTypeTemp = 1
    }

    /// <summary>
    /// 成员类型
    /// </summary>
    public enum NIMChatRoomGuestFlag
    {
        /// <summary>
        ///非游客 
        /// </summary>
        kNIMChatRoomGuestFlagNoGuest = 0,

        /// <summary>
        ///游客 
        /// </summary>
        kNIMChatRoomGuestFlagGuest = 1
    }

    /// <summary>
    /// 在线状态
    /// </summary>
    public enum NIMChatRoomOnlineState
    {
        /// <summary>
        ///不在线 
        /// </summary>
        kNIMChatRoomOnlineStateOffline = 0,

        /// <summary>
        ///在线 
        /// </summary>
        kNIMChatRoomOnlineStateOnline = 1
    }

    public class MemberInfo:NimUtility.NimJsonObject<MemberInfo>
    {
        /// <summary>
        ///聊天室id 
        /// </summary>
        [JsonProperty("room_id")]
        public long RoomId { get; set; }

        /// <summary>
        ///成员账号 
        /// </summary>
        [JsonProperty("account_id")]
        public string MemberId { get; set; }

        /// <summary>
        ///成员类型 
        /// </summary>
        [JsonProperty("type")]
        public ChatRoomMemberType MemberType { get; set; }

        /// <summary>
        ///成员级别: >=0表示用户开发者可以自定义的级别 
        /// </summary>
        [JsonProperty("level")]
        public int Level { get; set; }

        /// <summary>
        /// 聊天室内的昵称字段,预留字段, 可从Uinfo中取, [可以由用户进聊天室时提交]
        /// </summary>
        [JsonProperty("nick")]
        public string Nick { get; set; }

        /// <summary>
        ///聊天室内的头像,预留字段, 可从Uinfo中取icon, [可以由用户进聊天室时提交] 
        /// </summary>
        [JsonProperty("avator")]
        public string MemberIcon { get; set; }

        /// <summary>
        /// 开发者扩展字段, 长度限制2k, [可以由用户进聊天室时提交]
        /// </summary>
        [JsonProperty("ext")]
        public NimUtility.Json.JsonExtension Extension { get; set; }

        /// <summary>
        /// 成员是否处于在线状态, 仅特殊成员才可能离线, 对游客/匿名用户而言只能是在线
        /// </summary>
        [JsonProperty("online_state")]
        public NIMChatRoomOnlineState OnlineState { get; set; }

        /// <summary>
        /// 是否是普通游客类型,0:不是游客,1:是游客; 游客身份在聊天室中没有持久化, 只有在线时才会有内存状态
        /// </summary>
        [JsonProperty("guest_flag")]
        public NIMChatRoomGuestFlag GuestFlag { get; set; }

        /// <summary>
        /// 进入聊天室的时间点,对于离线成员该字段为空
        /// </summary>
        [JsonProperty("enter_timetag")]
        public long JoinTimeStamp { get; set; }

        /// <summary>
        /// 是黑名单
        /// </summary>
        [JsonProperty("is_blacklist")]
        public bool IsInBlacklist { get; set; }

        /// <summary>
        /// 是禁言用户
        /// </summary>
        [JsonProperty("is_muted")]
        public bool IsMuted { get; set; }

        /// <summary>
        /// 记录有效标记位
        /// </summary>
        [JsonProperty("valid")]
        public bool IsValid { get; set; }

        public MemberInfo()
        {
            MemberType = ChatRoomMemberType.Normal;
            OnlineState = NIMChatRoomOnlineState.kNIMChatRoomOnlineStateOffline;
            GuestFlag = NIMChatRoomGuestFlag.kNIMChatRoomGuestFlagGuest;
        }
    }

    class QueryChatRoomMembersParam : NimUtility.NimJsonObject<QueryChatRoomMembersParam>
    {
        [JsonProperty("type")]
        public NIMChatRoomGetMemberType MemberType { get; set; }

        [JsonProperty("offset")]
        public long TimeOffset { get; set; }

        [JsonProperty("limit")]
        public int Count { get; set; }
    }

    class ChatRoomLoginResultParam:NimUtility.NimJsonObject<ChatRoomLoginResultParam>
    {
        [JsonProperty("room_info")]
        internal ChatRoomInfo RoomInfo { get; set; }

        [JsonProperty("my_info")]
        internal MemberInfo MemberInfo { get; set; }
    }
}
