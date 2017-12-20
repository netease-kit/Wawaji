/** @file NIMSysMsgDef.cs
  * @brief NIM SDK提供的系统消息状态、内容类型等定义 
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */


namespace NIM.SysMessage
{
    /// <summary>
    /// 系统消息状态
    /// </summary>
    public enum NIMSysMsgStatus
    {
        /// <summary>
        /// 默认,未读
        /// </summary>
        kNIMSysMsgStatusNone    = 0, 
        /// <summary>
        /// 收到消息,通过
        /// </summary>
        kNIMSysMsgStatusPass    = 1,       
        /// <summary>
        /// 收到消息,拒绝
        /// </summary>
        kNIMSysMsgStatusDecline = 2,     
        /// <summary>
        /// 收到消息,已读
        /// </summary>
        kNIMSysMsgStatusRead    = 3,      
        /// <summary>
        /// 已删
        /// </summary>
        kNIMSysMsgStatusDeleted = 4,      
        /// <summary>
        /// 已失效
        /// </summary>
        kNIMSysMsgStatusInvalid = 5,     
    };

    /// <summary>
    /// 系统消息内容类型
    /// </summary>
    public enum NIMSysMsgType
    {
        /// <summary>
        /// 申请入群
        /// </summary>
        kNIMSysMsgTypeTeamApply = 0,       
        /// <summary>
        /// 拒绝入群申请
        /// </summary>
        kNIMSysMsgTypeTeamReject = 1,      
        /// <summary>
        /// 邀请进群
        /// </summary>
        kNIMSysMsgTypeTeamInvite = 2,      
        /// <summary>
        /// 拒绝邀请
        /// </summary>
        kNIMSysMsgTypeTeamInviteReject = 3,   
        /// <summary>
        /// 加好友
        /// </summary>
        kNIMSysMsgTypeFriendAdd = 5,       
        /// <summary>
        /// 删除好友
        /// </summary>
        kNIMSysMsgTypeFriendDel = 6,      
        /// <summary>
        /// 点对点透传消息
        /// </summary>
        kNIMSysMsgTypeCustomP2PMsg = 100,     
        /// <summary>
        /// 群透传消息
        /// </summary>
        kNIMSysMsgTypeCustomTeamMsg = 101,   
        /// <summary>
        /// 未知类型，作为默认
        /// </summary>
        kNIMSysMsgTypeUnknown = 1000,      
    };
}
