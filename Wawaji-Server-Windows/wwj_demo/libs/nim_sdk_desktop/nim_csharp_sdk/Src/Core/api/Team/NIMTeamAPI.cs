/** @file NIMTeamAPI.cs
  * @brief NIM SDK提供的team接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Linq;
using NIM.Team.Delegate;

namespace NIM.Team
{
    public delegate void TeamChangedNotificationDelegate(NIMTeamEventData data);

    public delegate void QueryMyTeamsResultDelegate(int count, string[] accountIdList);

    public delegate void QueryMyTeamsInfoResultDelegate(NIMTeamInfo[] infoList);

    public delegate void QueryTeamMembersInfoResultDelegate(NIMTeamMemberInfo[] infoList);

    public delegate void QuerySingleMemberResultDelegate(NIMTeamMemberInfo info);

    public delegate void QueryCachedTeamInfoResultDelegate(string tid, NIMTeamInfo info);

    public class TeamAPI
    {
        private static readonly TeamEventDelegate TeamEventNotificationDelegate;
        private static readonly TeamOperationDelegate TeamChangedCallback;
        private static readonly QueryMyTeamsDelegate QueryAllMyTeamsCompleted;
        private static readonly QueryMyTeamsDetailInfoDelegate QueryMyTeamsInfoCompleted;
        private static readonly QueryTeamMembersDelegate QueryTeamMembersCompleted;
        private static readonly QuerySingleMemberDelegate QuerySingleMemberCompleted;
        private static readonly QueryTeamInfoDelegate QueryCachedTeamInfoCompleted;

        /// <summary>
        /// 群通知事件，注册该事件监听群信息变更
        /// </summary>
        public static EventHandler<NIMTeamEventArgs> TeamEventNotificationHandler;

        static TeamAPI()
        {
            TeamEventNotificationDelegate = new TeamEventDelegate(NotifyTeamEvent);
            TeamChangedCallback = new TeamOperationDelegate(OnTeamChanged);
            QueryAllMyTeamsCompleted = new QueryMyTeamsDelegate(OnQueryAllMyTeamsCompleted);
            QueryMyTeamsInfoCompleted = new QueryMyTeamsDetailInfoDelegate(OnQueryMyTeamsInfoCompleted);
            QueryTeamMembersCompleted = new QueryTeamMembersDelegate(OnQueryTeamMembersInfoCompleted);
            QuerySingleMemberCompleted = new QuerySingleMemberDelegate(OnQuerySingleMemberCompleted);
            QueryCachedTeamInfoCompleted = new QueryTeamInfoDelegate(OnQueryCachedTeamInfoCompleted);
            RegTeamEventCb();
        }

        private static void RegTeamEventCb()
        {
            TeamNativeMethods.nim_team_reg_team_event_cb(null, TeamEventNotificationDelegate, IntPtr.Zero);
        }

        private static void NotifyTeamEvent(int resCode, int nid, string tid, string result, string jsonExtension, IntPtr userData)
        {
            if (TeamEventNotificationHandler != null)
            {
                NIMTeamEventData eventData = ParseTeamEventData(resCode, nid, tid, result);
                TeamEventNotificationHandler.Invoke(null, new NIMTeamEventArgs(eventData));
            }
        }

        private static NIMTeamEventData ParseTeamEventData(int resCode, int nid, string tid, string result)
        {
            NIMTeamEventData eventData = null;
            if (!string.IsNullOrEmpty(result))
                eventData = NIMTeamEventData.Deserialize(result);
            if (eventData == null)
            {
                eventData = new NIMTeamEventData();
            }
            if (eventData.TeamEvent == null)
            {
                eventData.TeamEvent = new NIMTeamEvent();
            }
            eventData.TeamEvent.TeamId = tid;
            eventData.TeamEvent.ResponseCode = (ResponseCode) Enum.Parse(typeof (ResponseCode), resCode.ToString());
            eventData.TeamEvent.NotificationType = (NIMNotificationType) Enum.Parse(typeof (NIMNotificationType), nid.ToString());
            return eventData;
        }

        /// <summary>
        /// 创建群
        /// </summary>
        /// <param name="teamInfo">群组信息</param>
        /// <param name="idList">成员id列表(不包括自己)</param>
        /// <param name="postscript">附言</param>
        /// <param name="action"></param>
        public static void CreateTeam(NIMTeamInfo teamInfo, string[] idList, string postscript, TeamChangedNotificationDelegate action)
        {
            var tinfoJson = teamInfo.Serialize();
            var idJson = NimUtility.Json.JsonParser.Serialize(idList);
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_create_team_async(tinfoJson, idJson, postscript, null, TeamChangedCallback, ptr);
        }

        private static void OnTeamChanged(int resCode, int nid, string tid, string result, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                NIMTeamEventData eventData = ParseTeamEventData(resCode, nid, tid, result);
                NimUtility.DelegateConverter.InvokeOnce<TeamChangedNotificationDelegate>(userData, eventData);
            }
        }

        /// <summary>
        /// 邀请好友入群
        /// </summary>
        /// <param name="tid">群id</param>
        /// <param name="idList">被邀请人员id列表</param>
        /// <param name="postscript">邀请附言</param>
        /// <param name="action">操作结果回调</param>
        public static void Invite(string tid, string[] idList, string postscript, TeamChangedNotificationDelegate action)
        {
            var idJson = NimUtility.Json.JsonParser.Serialize(idList);
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_invite_async(tid, idJson, postscript, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 将用户踢下线
        /// </summary>
        /// <param name="tid">群id</param>
        /// <param name="idList">被踢用户id 列表</param>
        /// <param name="action"></param>
        public static void KickMemberOutFromTeam(string tid, string[] idList, TeamChangedNotificationDelegate action)
        {
            var idJson = NimUtility.Json.JsonParser.Serialize(idList);
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_kick_async(tid, idJson, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 离开群
        /// </summary>
        /// <param name="tid">群id</param>
        /// <param name="action">操作结果回调函数</param>
        public static void LeaveTeam(string tid, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_leave_async(tid, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 解散群组
        /// </summary>
        /// <param name="tid">群id</param>
        /// <param name="action">操作结果回调函数</param>
        public static void DismissTeam(string tid, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_dismiss_async(tid, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 更新群信息
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="info"></param>
        /// <param name="action"></param>
        public static void UpdateTeamInfo(string tid, NIMTeamInfo info, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            var infoJson = info.Serialize();
            TeamNativeMethods.nim_team_update_team_info_async(tid, infoJson, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 申请入群
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="reason"></param>
        /// <param name="action"></param>
        public static void ApplyForJoiningTeam(string tid, string reason, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_apply_join_async(tid, reason, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 同意入群申请
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="uid"></param>
        /// <param name="action"></param>
        public static void AgreeJoinTeamApplication(string tid, string uid, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_pass_join_apply_async(tid, uid, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 拒绝入群申请
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="uid"></param>
        /// <param name="reason"></param>
        /// <param name="action"></param>
        public static void RejectJoinTeamApplication(string tid, string uid, string reason, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_reject_join_apply_async(tid, uid, reason, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 添加群管理员
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="managerIdArray"></param>
        /// <param name="action"></param>
        public static void AddTeamManagers(string tid, string[] managerIdArray, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            var managersJson = NimUtility.Json.JsonParser.Serialize(managerIdArray);
            TeamNativeMethods.nim_team_add_managers_async(tid, managersJson, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 删除群管理员
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="managerIdArray"></param>
        /// <param name="action"></param>
        public static void RemoveTeamManagers(string tid, string[] managerIdArray, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            var managersJson = NimUtility.Json.JsonParser.Serialize(managerIdArray);
            TeamNativeMethods.nim_team_remove_managers_async(tid, managersJson, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 移交群主
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="newOwnerId"></param>
        /// <param name="leaveTeam">是否在移交后退出群</param>
        /// <param name="action"></param>
        public static void TransferTeamAdmin(string tid, string newOwnerId, bool leaveTeam, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_transfer_team_async(tid, newOwnerId, leaveTeam, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 更新自己的群属性
        /// </summary>
        /// <param name="info"></param>
        /// <param name="action"></param>
        public static void UpdateMyTeamProperty(NIMTeamMemberInfo info, TeamChangedNotificationDelegate action)
        {
            var infoJson = info.Serialize();
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_update_my_property_async(infoJson, null, TeamChangedCallback, ptr);

        }

        /// <summary>
        /// 修改其他成员的群昵称
        /// </summary>
        /// <param name="info"></param>
        /// <param name="action"></param>
        public static void UpdateMemberNickName(NIMTeamMemberInfo info, TeamChangedNotificationDelegate action)
        {
            var infoJson = info.Serialize();
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_update_other_nick_async(infoJson, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 接受入群邀请
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="invitor"></param>
        /// <param name="action"></param>
        public static void AcceptTeamInvitation(string tid, string invitor, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_accept_invitation_async(tid, invitor, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 拒绝入群邀请
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="invitor"></param>
        /// <param name="reason"></param>
        /// <param name="action"></param>
        public static void RejectTeamInvitation(string tid, string invitor, string reason, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_reject_invitation_async(tid, invitor, reason, null, TeamChangedCallback, ptr);
        }

        /// <summary>
        /// 查询自己的群
        /// </summary>
        /// <param name="action"></param>
        public static void QueryAllMyTeams(QueryMyTeamsResultDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_query_all_my_teams_async(null, QueryAllMyTeamsCompleted, ptr);

        }

        private static void OnQueryAllMyTeamsCompleted(int teamCount, string result, string jsonExtension, IntPtr userData)
        {
            string[] idList = null;
            if (!string.IsNullOrEmpty(result))
            {
                idList = NimUtility.Json.JsonParser.Deserialize<string[]>(result);
            }
            NimUtility.DelegateConverter.InvokeOnce<QueryMyTeamsResultDelegate>(userData, teamCount, idList);
        }

        /// <summary>
        /// 查询所有群信息
        /// </summary>
        /// <param name="action"></param>
        public static void QueryMyTeamsInfo(QueryMyTeamsInfoResultDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_query_all_my_teams_info_async(null, QueryMyTeamsInfoCompleted, ptr);
        }

        private static void OnQueryMyTeamsInfoCompleted(int teamCount, string result, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                var infoList = NimUtility.Json.JsonParser.Deserialize<List<NIMTeamInfo>>(result);
                if (infoList != null)
                {
                    var validTeams = infoList.Where((info) => { return info.TeamValid; });
                    NimUtility.DelegateConverter.InvokeOnce<QueryMyTeamsInfoResultDelegate>(userData, (object) validTeams.ToArray());
                }
                else
                {
                    NimUtility.DelegateConverter.InvokeOnce<QueryMyTeamsInfoResultDelegate>(userData, (object)new NIMTeamInfo[] {});
                }
            }

        }

        /// <summary>
        /// 查询群成员信息
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="action"></param>
        public static void QueryTeamMembersInfo(string tid, QueryTeamMembersInfoResultDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_query_team_members_async(tid, true, null, QueryTeamMembersCompleted, ptr);
        }

        private static void OnQueryTeamMembersInfoCompleted(string tid, int memberCount, bool includeUserInfo, string result, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                var membersInfo = NimUtility.Json.JsonParser.Deserialize<NIMTeamMemberInfo[]>(result);
                NimUtility.DelegateConverter.InvokeOnce<QueryTeamMembersInfoResultDelegate>(userData, (object) membersInfo);
            }
        }

        /// <summary>
        /// 查询(单个)群成员信息
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="uid"></param>
        /// <param name="action"></param>
        public static void QuerySingleMemberInfo(string tid, string uid, QuerySingleMemberResultDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_query_team_member_async(tid, uid, null, QuerySingleMemberCompleted, ptr);
        }

        private static void OnQuerySingleMemberCompleted(string tid, string userId, string result, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                var info = NIMTeamMemberInfo.Deserialize(result);
                NimUtility.DelegateConverter.InvokeOnce<QuerySingleMemberResultDelegate>(userData, info);
            }
        }

        /// <summary>
        /// 查询本地缓存的群信息
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="action"></param>
        public static void QueryCachedTeamInfo(string tid, QueryCachedTeamInfoResultDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_query_team_info_async(tid, null, QueryCachedTeamInfoCompleted, ptr);
        }

        private static void OnQueryCachedTeamInfoCompleted(string tid, string result, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                var tinfo = NIMTeamInfo.Deserialize(result);
                NimUtility.DelegateConverter.InvokeOnce<QueryCachedTeamInfoResultDelegate>(userData, tid, tinfo);
            }
        }

        /// <summary>
        /// 在线查询群信息
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="action"></param>
        public static void QueryTeamInfoOnline(string tid, TeamChangedNotificationDelegate action)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TeamNativeMethods.nim_team_query_team_info_online_async(tid, null, TeamChangedCallback, ptr);
        }
    }
}
