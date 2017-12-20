/** @file NIMTeamNotificationType.cs
  * @brief NIM SDK 群通知类型的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */


namespace NIM.Team
{
    /// <summary>
    /// 群通知类型
    /// </summary>
    public enum NIMNotificationType
    {
        /// <summary>
        ///普通群拉人，{"ids":["a1", "a2"]} 
        /// </summary>
        kNIMNotificationIdTeamInvite = 0,

        /// <summary>
        ///普通群踢人，{"ids":["a1", "a2"]} 
        /// </summary>
        kNIMNotificationIdTeamKick = 1,

        /// <summary>
        ///退出群，{"id" : "a1"} 
        /// </summary>
        kNIMNotificationIdTeamLeave = 2,

        /// <summary>
        ///team_info更新，{"team_info":team_info} 
        /// </summary>
        kNIMNotificationIdTeamUpdate = 3,

        /// <summary>
        ///群解散，{} 
        /// </summary>
        kNIMNotificationIdTeamDismiss = 4,

        /// <summary>
        ///高级群申请加入成功，{"id":"a1"} 
        /// </summary>
        kNIMNotificationIdTeamApplyPass = 5,

        /// <summary>
        ///高级群移交群主，{"id":"a1", "leave" : bool} 
        /// </summary>
        kNIMNotificationIdTeamOwnerTransfer = 6,

        /// <summary>
        ///增加管理员，{"ids":["a1","a2"]} 
        /// </summary>
        kNIMNotificationIdTeamAddManager = 7,

        /// <summary>
        ///删除管理员，{"ids":["a1","a2"]} 
        /// </summary>
        kNIMNotificationIdTeamRemoveManager = 8,

        /// <summary>
        ///高级群接受邀请进群，{"id":"a1"} 
        /// </summary>
        kNIMNotificationIdTeamInviteAccept = 9,

        /// <summary>
        ///未接电话,{"calltype":1,"channel":6146078138783760761,"from":"id1","ids":["id1","id2"],"time":1430995380471} 
        /// </summary>
        kNIMNotificationIdNetcallMiss = 101,

        /// <summary>
        ///话单,{"calltype":2,"channel":6146077129466446197,"duration":8,"ids":["id1","id2"],"time":1430995117398} 
        /// </summary>
        kNIMNotificationIdNetcallBill = 102,


        /// <summary>
        ///创建群 {"team_info" : team_info}
        /// </summary>
        kNIMNotificationIdTeamSyncCreate = 1000,

        /// <summary>
        ///群成员变更{"team_member" : team_member_info} //群组成员信息（不包括自己） 
        /// </summary>
        kNIMNotificationIdTeamMemberChanged = 1001,

        /// <summary>
        ///同步通知：修改群属性（可能是自己的或别人的）{"team_member" : team_member_info} //目前只需kNIMTeamUserKeyNick和kNIMTeamUserKeyBits 
        /// </summary>
        kNIMNotificationIdTeamSyncUpdateTlist = 1002,

        /// <summary>
        ///本地操作创建群 {"ids" : ["a1", "a2"]} 
        /// </summary>
        kNIMNotificationIdLocalCreateTeam = 2000,

        /// <summary>
        ///本地操作申请加入群 {} 
        /// </summary>
        kNIMNotificationIdLocalApplyTeam = 2001,

        /// <summary>
        ///本地操作拒绝申请 {"id":"a1"} 
        /// </summary>
        kNIMNotificationIdLocalRejectApply = 2002,

        /// <summary>
        ///本地操作拒绝邀请 {"id":"a1"} 
        /// </summary>
        kNIMNotificationIdLocalRejectInvite = 2003,

        /// <summary>
        ///本地操作更新tlist  {"team_member" : team_member_info}，目前只需kNIMTeamUserKeyNick和kNIMTeamUserKeyBits 
        /// </summary>
        kNIMNotificationIdLocalUpdateTlist = 2004,

        /// <summary>
        ///本地操作更新他人nickname {} 
        /// </summary>
        kNIMNotificationIdLocalUpdateOtherNick = 2005,

        /// <summary>
        ///本地操作获取群信息 {"team_info":team_info} 
        /// </summary>
        kNIMNotificationIdLocalGetTeamInfo = 2006,

        /// <summary>
        /// 本地操作获取群成员信息结束
        /// </summary>
        kNIMNotificationIdLocalGetTeamList = 2007,

        /// <summary>
        ///拒绝电话,{"calltype":1,"channel":6146078138783760761,"from":"id1","ids":["id1","id2"],"time":1430995380471} 
        /// </summary>
        kNIMNotificationIdLocalNetcallReject = 3103,

        /// <summary>
        ///无应答，未接通电话,{"calltype":1,"channel":6146078138783760761,"from":"id1","ids":["id1","id2"],"time":1430995380471} 
        /// </summary>
        kNIMNotificationIdLocalNetcallNoResponse = 3104,
    }
}
