/** @file NIMSessionAPI.cs
  * @brief NIM SDK提供的session接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;

namespace NIM.Session
{
    public class SessionAPI
    {
        static SessionAPI()
        {
            RegChangeCb();
        }

        /// <summary>
        /// 会话列表变化事件，通过注册该事件来监听会话项变化
        /// </summary>
        public static EventHandler<SessionChangedEventArgs> RecentSessionChangedHandler;

        /// <summary>
        /// 注册最近会话列表项变更通知
        /// </summary>
        private static void RegChangeCb()
        {
            SessionNativeMethods.nim_session_reg_change_cb("", GlobalSessionChangedCb, IntPtr.Zero);
        }

        private static readonly NimSessionChangeCbFunc GlobalSessionChangedCb = (code, info, unread, je, data) =>
        {
            if (RecentSessionChangedHandler != null)
            {
                var sessionInfo = SessionInfo.Deserialize(info);
                var args = new SessionChangedEventArgs((ResponseCode) code, sessionInfo, unread);
                RecentSessionChangedHandler(null, args);
            } 
        };

        /// <summary>
        /// 查询会话列表
        /// </summary>
        /// <param name="handler">查询会话列表的回调</param>
        public static void QueryAllRecentSession(QueryRecentHandler handler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            SessionNativeMethods.nim_session_query_all_recent_session_async("", QueryRecentSessionCb, ptr);
        }

        /// <summary>
        /// 删除最近联系人
        /// </summary>
        /// <param name="toType">会话类型</param>
        /// <param name="id">对方的account id或者群组tid</param>
        /// <param name="handler">最近会话列表项变更的回调</param>
        public static void DeleteRecentSession(Session.NIMSessionType toType, string id, SessionChangeHandler handler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            SessionNativeMethods.nim_session_delete_recent_session_async((int)toType, id, "", SessionChangeCb, ptr);
        }

        /// <summary>
        /// 删除全部最近联系人
        /// </summary>
        /// <param name="handler">最近会话列表项变更的回调</param>
        public static void DeleteAllRecentSession(SessionChangeHandler handler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            SessionNativeMethods.nim_session_delete_all_recent_session_async("", SessionChangeCb, ptr);
        }

        /// <summary>
        /// 最近联系人项未读数清零
        /// </summary>
        /// <param name="toType">会话类型</param>
        /// <param name="id">对方的account id或者群组tid</param>
        /// <param name="handler">最近会话列表项变更的回调</param>
        public static void SetUnreadCountZero(Session.NIMSessionType toType, string id, SessionChangeHandler handler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            SessionNativeMethods.nim_session_set_unread_count_zero_async((int)toType, id, "", SessionChangeCb, ptr);
        }

        static readonly NimSessionChangeCbFunc SessionChangeCb = new NimSessionChangeCbFunc(SessionChangeCallback);
        private static void SessionChangeCallback(int rescode, string result, int totalUnreadCounts, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                SessionInfo info = SessionInfo.Deserialize(result);
                NimUtility.DelegateConverter.InvokeOnce<SessionChangeHandler>(userData, rescode, info, totalUnreadCounts);
            }
        }
        static readonly NimSessionQueryRecentSessionCbFunc QueryRecentSessionCb = new NimSessionQueryRecentSessionCbFunc(QueryRecentSession);
        private static void QueryRecentSession(int totalUnreadCounts, string result, string jsonExtension, IntPtr userData)
        {
            if (userData != IntPtr.Zero)
            {
                SesssionInfoList infoList = SesssionInfoList.Deserialize(result);
                NimUtility.DelegateConverter.InvokeOnce<QueryRecentHandler>(userData, totalUnreadCounts, infoList);
            }
        }
    }
}
