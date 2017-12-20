using System;
using System.Runtime.InteropServices;
using NIM.Messagelog.Delegate;
using NIM.Session;

namespace NIM.Messagelog
{
    namespace Delegate
    {
        ///<summary>查询单条消息历史回调函数定义</summary>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void QuerySingleLogDelegate(int res_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string msg_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        ///<summary>本地或在线查询消息的回调函数定义</summary>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void QueryMessageLogDelegate(int res_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string id, NIMSessionType type, 
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string result,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        ///<summary>消息历史操作结果的回调函数定义(按消息历史id操作)</summary>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void OperateMsglogByLogIdDelegate(int res_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string msg_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        ///<summary>消息历史操作结果的回调函数定义（按消息对象id操作）(按消息历史id操作)</summary>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void OperateMsglogByObjectIdDelegate(int res_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string uid, NIMSessionType type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        ///<summary>消息历史操作结果的回调函数定义(只关心rescode)(按消息历史id操作)</summary>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void OperateMsglogCommonDelegate(int res_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        ///<summary>消息历史数据库导入过程的回调函数定义(按消息历史id操作)</summary>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void ImportMsglogProgressDelegate(long imported_count, long total_count, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void NimMsglogStatusChangedCbFunc(int res_code, string result, string json_extension, IntPtr user_data);

        /// <summary>
        /// 本地或在线查询消息的回调函数定义
        /// </summary>
        /// <param name="res_code"></param>
        /// <param name="msg_id"></param>
        /// <param name="json_extension"></param>
        /// <param name="user_data"></param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate void NimMsglogResCbFunc(int res_code, string msg_id, string json_extension, IntPtr user_data);
    }

    class MsglogNativeMethods
    {
        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_query_msg_by_id_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_query_msg_by_id_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string client_msg_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QuerySingleLogDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_query_msg_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_query_msg_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string account_id, NIMSessionType to_type, int limit_count, long last_time, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QueryMessageLogDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_query_msg_online_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_query_msg_online_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string id, NIMSessionType to_type, int limit_count, long from_time, long end_time, long end_msg_id, bool reverse, bool need_save_to_local, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QueryMessageLogDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_query_msg_by_options_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_query_msg_by_options_async(NIMMsgLogQueryRange query_range, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string ids, int limit_count, long from_time, long end_time, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string end_client_msg_id, bool reverse, NIMMessageType msg_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string search_content, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, QueryMessageLogDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_batch_status_read_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_batch_status_read_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string account_id, NIMSessionType to_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogByObjectIdDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_set_status_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_set_status_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string msg_id, NIMMsgLogStatus msglog_status, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogByLogIdDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_set_sub_status_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_set_sub_status_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string msg_id, NIMMsgLogSubStatus msglog_sub_status, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogByLogIdDelegate cb, IntPtr user_data);


        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_write_db_only_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_write_db_only_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string account_id, NIMSessionType to_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string msg_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_msg, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogByLogIdDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_batch_status_delete_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_batch_status_delete_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string account_id, NIMSessionType to_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogByObjectIdDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_delete_by_session_type_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_delete_by_session_type_async(bool delete_sessions, NIMSessionType to_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogByObjectIdDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_delete_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_delete_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string account_id, NIMSessionType to_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string msg_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogByLogIdDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_delete_all_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_delete_all_async(bool delete_sessions, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogCommonDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_export_db_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_export_db_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string dst_path, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogCommonDelegate cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_import_db_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_import_db_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string src_path, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, OperateMsglogCommonDelegate res_cb, IntPtr res_user_data, ImportMsglogProgressDelegate prg_cb, IntPtr prg_user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_query_be_readed", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_msglog_query_be_readed([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_msg, 
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_send_receipt_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_send_receipt_async(string json_msg, string json_extension, NimMsglogStatusChangedCbFunc cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_reg_status_changed_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_reg_status_changed_cb(string json_extension, NimMsglogStatusChangedCbFunc cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_msglog_update_localext_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_msglog_update_localext_async(string msg_id, string local_ext, string json_extension, NimMsglogResCbFunc cb, IntPtr user_data);
    }
}
