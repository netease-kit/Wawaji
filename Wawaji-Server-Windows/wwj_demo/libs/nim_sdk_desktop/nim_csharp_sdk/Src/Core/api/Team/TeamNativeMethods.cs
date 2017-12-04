using NIM.Team.Delegate;
using System;
using System.Runtime.InteropServices;

namespace NIM.Team
{
    namespace Delegate
    {
        /// <summary>
        /// 群组通知的回调函数定义
        /// </summary>
        /// <param name="res_code"></param>
        /// <param name="notification_id">通知类型枚举值</param>
        /// <param name="tid"></param>
        /// <param name="result"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void TeamEventDelegate(int res_code, int notification_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        /// <summary>
        /// 群组操作的回调函数定义
        /// </summary>
        /// <param name="res_code"></param>
        /// <param name="notification_id"></param>
        /// <param name="tid"></param>
        /// <param name="result"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void TeamOperationDelegate(int res_code, int notification_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        /// <summary>
        /// 查询我的所有群组的回调函数定义
        /// </summary>
        /// <param name="team_count">有效群组数量</param>
        /// <param name="result"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void QueryMyTeamsDelegate(int team_count, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        /// <summary>
        /// 查询我的所有群组信息的回调函数定义
        /// </summary>
        /// <param name="team_count">有效群组数量</param>
        /// <param name="result"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void QueryMyTeamsDetailInfoDelegate(int team_count, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        /// <summary>
        /// 查询群成员的回调函数定义
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="member_count">有效群成员数量</param>
        /// <param name="include_user_info">返回结果里是否包含user_info</param>
        /// <param name="result"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void QueryTeamMembersDelegate([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid, int member_count, bool include_user_info, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        /// <summary>
        /// 查询(单个)群成员的回调函数定义
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="user_id"></param>
        /// <param name="result"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void QuerySingleMemberDelegate([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string user_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        /// <summary>
        /// 查询群信息的回调函数定义
        /// </summary>
        /// <param name="tid"></param>
        /// <param name="result"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void QueryTeamInfoDelegate([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

       

    }
    

    class TeamNativeMethods
    {
        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_reg_team_event_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_reg_team_event_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamEventDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_create_team_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_create_team_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string team_info,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonlist_uids,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string invitation_postscript,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_invite_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_invite_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonlist_uids,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string invitation_postscript,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_kick_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_kick_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonlist_uids,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_leave_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_leave_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_dismiss_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_dismiss_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_update_team_info_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_update_team_info_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_info,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_apply_join_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_apply_join_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string reason,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_pass_join_apply_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_pass_join_apply_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string applicant_id,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_reject_join_apply_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_reject_join_apply_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string applicant_id,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string reason,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_add_managers_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_add_managers_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonlist_admin_ids,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_remove_managers_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_remove_managers_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonlist_admin_ids, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_transfer_team_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_transfer_team_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string new_owner,  bool is_leave,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_update_my_property_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_update_my_property_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string info,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_update_other_nick_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_update_other_nick_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string info,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_accept_invitation_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_accept_invitation_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string invitor,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_reject_invitation_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_reject_invitation_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string invitor,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string reason,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_query_all_my_teams_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_query_all_my_teams_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QueryMyTeamsDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_query_all_my_teams_info_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_query_all_my_teams_info_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QueryMyTeamsDetailInfoDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_query_team_members_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_query_team_members_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  bool include_user_info,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QueryTeamMembersDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_query_team_member_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_query_team_member_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string user_id,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QuerySingleMemberDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_query_team_info_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_query_team_info_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QueryTeamInfoDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_team_query_team_info_online_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_team_query_team_info_online_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string tid,  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, TeamOperationDelegate cb, IntPtr user_data);

    }
}
