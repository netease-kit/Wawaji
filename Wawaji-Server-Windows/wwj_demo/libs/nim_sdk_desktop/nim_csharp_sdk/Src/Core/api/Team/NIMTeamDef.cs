/** @file NIMTeamDef.cs
  * @brief NIM SDK team相关的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using Newtonsoft.Json;

namespace NIM.Team
{
    /// <summary>
    /// 群类型
    /// </summary>
    public enum NIMTeamType
    {
        /// <summary>
        /// 普通群
        /// </summary>
        kNIMTeamTypeNormal = 0,

        /// <summary>
        /// 高级群
        /// </summary>
        kNIMTeamTypeAdvanced = 1
    }

    /// <summary>
    /// 群成员类型
    /// </summary>
    public enum NIMTeamUserType
    {
        /// <summary>
        /// 普通成员
        /// </summary>
        kNIMTeamUserTypeNomal = 0,      

        /// <summary>
        /// 创建者
        /// </summary>
        kNIMTeamUserTypeCreator = 1,        

        /// <summary>
        /// 管理员
        /// </summary>
        kNIMTeamUserTypeManager = 2,        

       /// <summary>
       /// 申请加入用户
       /// </summary>
        kNIMTeamUserTypeApply = 3,

        /// <summary>
        ///本地记录等待正在入群的用户 
        /// </summary>
        kNIMTeamUserTypeLocalWaitAccept = 100
    }

    /// <summary>
    /// 群允许加入类型
    /// </summary>
    public enum NIMTeamJoinMode
    {
        /// <summary>
        /// 不用验证
        /// </summary>
        kNIMTeamJoinModeNoAuth = 0,     

        /// <summary>
        /// 需要验证
        /// </summary>
        kNIMTeamJoinModeNeedAuth = 1,       

        /// <summary>
        /// 拒绝所有人入群
        /// </summary>
        kNIMTeamJoinModeRejectAll = 2
    }


    /// <summary>
    /// 群组信息
    /// </summary>
    public class NIMTeamInfo : NimUtility.NimJsonObject<NIMTeamInfo>
    {
        [JsonProperty("tid")]
        public string TeamId { get; set; }

        [JsonProperty("valid")]
        private object IsValid { get; set; }

        [JsonProperty("member_count")]
        public int MembersCount { get; set; }

        [JsonProperty("list_timetag")]
        public long MemberListTimetag { get; set; }

        [JsonProperty("create_timetag")]
        public long CreatedTimetag { get; set; }

        [JsonProperty("pdate_timetag")]
        public long UpdatedTimetag { get; set; }

        [JsonProperty("server_custom")]
        public string ServerCustom { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("type")]
        public NIMTeamType TeamType { get; set; }

        [JsonProperty("creator")]
        public string OwnerId { get; set; }

        [JsonProperty("level")]
        public int Level { get; set; }

        [JsonProperty("prop")]
        public string Property { get; set; }

        [JsonProperty("member_valid")]
        private object IsMemberValid { get; set; }

        [JsonProperty("intro")]
        public string Introduce { get; set; }

        [JsonProperty("announcement")]
        public string Announcement { get; set; }

        [JsonProperty("join_mode")]
        public NIMTeamJoinMode JoinMode { get; set; }

        [JsonProperty("bits")]
        public long ConfigBits { get; set; }

        [JsonProperty("custom")]
        public string Custom { get; set; }

        [JsonIgnore]
        public bool TeamValid
        {
            get { return IsValid != null && int.Parse(IsValid.ToString()) > 0; }
        }

        [JsonIgnore]
        public bool TeamMemberValid
        {
            get { return IsMemberValid != null && int.Parse(IsMemberValid.ToString()) > 0; }
        }

        public NIMTeamInfo()
        {
            IsValid = 1;
            IsMemberValid = 1;
        }
    }

    /// <summary>
    /// 群成员信息
    /// </summary>
    public class NIMTeamMemberInfo : NimUtility.NimJsonObject<NIMTeamMemberInfo>
    {
        [JsonProperty("type")]
        public NIMTeamUserType Type { get; set; }

        [JsonProperty("valid")]
        public bool IsValid { get; set; }

        [JsonProperty("create_timetag")]
        public long CreatedTimetag { get; set; }

        [JsonProperty("update_timetag")]
        public long UpdatedTimetag { get; set; }

        [JsonProperty("tid")]
        public string TeamId { get; set; }

        [JsonProperty("accid")]
        public string AccountId { get; set; }

        [JsonProperty("nick")]
        public string NickName { get; set; }

        [JsonProperty("bits")]
        public long ConfigBits { get; set; }
    }
}
