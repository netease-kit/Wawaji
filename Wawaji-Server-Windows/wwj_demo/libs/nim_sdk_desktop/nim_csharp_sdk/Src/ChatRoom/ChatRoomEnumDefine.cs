using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NIMChatRoom
{
    /// <summary>
    /// 消息属性
    /// </summary>
    public enum NIMChatRoomMsgFeature
    {
        kNIMChatRoomMsgFeatureDefault = 0
    }

    /// <summary>
    /// 聊天室离开原因
    /// </summary>
    public enum NIMChatRoomExitReason
    {
        /// <summary>
        ///自行退出,重登前需要重新请求登录 
        /// </summary>
        kNIMChatRoomExitReasonExit = 0,

        /// <summary>
        ///聊天室已经被解散,重登前需要重新请求登录 
        /// </summary>
        kNIMChatRoomExitReasonRoomInvalid = 1,

        /// <summary>
        ///被管理员踢出,重登前需要重新请求登录 
        /// </summary>
        kNIMChatRoomExitReasonKickByManager = 2,

        /// <summary>
        ///多端被踢 
        /// </summary>
        kNIMChatRoomExitReasonKickByMultiSpot = 3,

        /// <summary>
        ///当前链接状态异常 
        /// </summary>
        kNIMChatRoomExitReasonIllegalState = 4,

        /// <summary>
        ///被加黑了 
        /// </summary>
        kNIMChatRoomExitReasonBeBlacklisted = 5
    }

    /// <summary>
    /// 聊天室链接情况，一般都是有本地网路情况引起
    /// </summary>
    public enum NIMChatRoomLinkCondition
    {
        /// <summary>
        ///链接正常 
        /// </summary>
        kNIMChatRoomLinkConditionAlive = 0,

        /// <summary>
        ///链接失败,sdk尝试重链 
        /// </summary>
        kNIMChatRoomLinkConditionDeadAndRetry = 1,

        /// <summary>
        ///链接失败,开发者需要重新申请聊天室登录信息 
        /// </summary>
        kNIMChatRoomLinkConditionDead = 2
    }

    
}
