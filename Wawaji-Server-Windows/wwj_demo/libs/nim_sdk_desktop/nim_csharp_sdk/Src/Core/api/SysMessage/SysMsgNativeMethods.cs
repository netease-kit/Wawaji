using System;
using System.Runtime.InteropServices;
using NIM.SysMessage.Delegate;

namespace NIM.SysMessage
{
    namespace Delegate
    {
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void ReceiveSysMsgDelegate([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  result, IntPtr user_data);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void CustomSysMsgArcDelegate ([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  result, IntPtr user_data);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void QuerySysMsgDelegate(int count, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, IntPtr user_data);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OperateSysMsgDelegate(int res_code, int unread_count, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, IntPtr user_data);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OperateSysMsgExternDelegate (int res_code, long msg_id, int unread_count, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, IntPtr user_data);
    }


    class SysMsgNativeMethods
    {
        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_reg_sysmsg_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_reg_sysmsg_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, ReceiveSysMsgDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_send_custom_notification(const char *json_msg, const char *json_extension)
          * 发送自定义通知
          * @param[in] json_msg		消息体Json [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(Utf8StringMarshaler))] string  (Keys SEE MORE `nim_sysmsg_def.h` 『系统消息结构 Json Keys』)
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_send_custom_notification", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_send_custom_notification([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_msg, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension);

        /** @fn public static extern void nim_sysmsg_reg_custom_notification_arc_cb(const char *json_extension, CustomSysMsgArcDelegate cb, const public static extern void *user_data)
          * 发送自定义通知结果回调函数 （必须全局注册，统一接受回调后分发消息到具体的会话。注意：客户端发包之后，服务器不一定会返回！）
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb		发送透传消息的回调函数, CustomSysMsgArcDelegate回调函数定义见nim_sysmsg_def.h
          * @param[in] user_data APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_reg_custom_notification_ack_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_reg_custom_notification_ack_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, CustomSysMsgArcDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_query_msg_async(int limit_count, long last_time, const char *json_extension, QuerySysMsgDelegate cb, const public static extern void *user_data)
          * 查询本地系统消息（按时间逆序起查，逆序排列）
          * @param[in] limit_count	一次查询数量，建议20
          * @param[in] last_time	上次查询最后一条消息的时间戳（按时间逆序起查，即最小的时间戳）
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			查询本地系统消息的回调函数， QuerySysMsgDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_query_msg_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_query_msg_async(int limit_count, long last_time, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, QuerySysMsgDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_query_unread_count(const char *json_extension, OperateSysMsgDelegate cb, const public static extern void *user_data)
          * 查询未读消息数
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			查询未读消息数的回调函数， OperateSysMsgDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_query_unread_count", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_query_unread_count([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, OperateSysMsgDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_set_status_async(long msg_id, NIMSysMsgStatus status, const char *json_extension, OperateSysMsgExternDelegate cb, const public static extern void *user_data)
          * 设置消息状态
          * @param[in] msg_id		消息id
          * @param[in] status		消息状态
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			设置消息状态的回调函数， OperateSysMsgExternDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_set_status_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_set_status_async(long msg_id, NIMSysMsgStatus status, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, OperateSysMsgExternDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_read_all_async(const char *json_extension, OperateSysMsgDelegate cb, const public static extern void *user_data)
          * 设置全部消息为已读
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			设置全部消息为已读的回调函数， OperateSysMsgDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_read_all_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_read_all_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, OperateSysMsgDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_delete_async(long msg_id, const char *json_extension, OperateSysMsgExternDelegate cb, const public static extern void *user_data)
          * 删除消息
          * @param[in] msg_id		消息id
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			删除消息的回调函数， OperateSysMsgExternDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_delete_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_delete_async(long msg_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, OperateSysMsgExternDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_delete_all_async(const char *json_extension, OperateSysMsgDelegate cb, const public static extern void *user_data)
          * 全部删除
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			删除消息的回调函数， OperateSysMsgDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */
        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_delete_all_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_delete_all_async([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, OperateSysMsgDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_set_logs_status_by_type_async(NIMSysMsgType type, NIMSysMsgStatus status, const char *json_extension, OperateSysMsgDelegate cb, const public static extern void *user_data)
          * 按消息类型批量设置消息状态
          * @param[in] type 消息类型
          * @param[in] status 消息状态,见NIMSysMsgStatus
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			回调函数， OperateSysMsgDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_set_logs_status_by_type_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_set_logs_status_by_type_async(NIMSysMsgType type, NIMSysMsgStatus status, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, OperateSysMsgDelegate cb, IntPtr user_data);

        /** @fn public static extern void nim_sysmsg_delete_logs_by_type_async(NIMSysMsgType type, const char *json_extension, OperateSysMsgDelegate cb, const public static extern void *user_data)
          * 按消息类型批量删除消息
          * @param[in] type 消息类型
          * @param[in] json_extension json扩展参数（备用，目前不需要）
          * @param[in] cb			回调函数， OperateSysMsgDelegate回调函数定义见nim_msglog_def.h
          * @param[in] user_data	APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！
          * @return public static extern void 无返回值
          */

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_sysmsg_delete_logs_by_type_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_sysmsg_delete_logs_by_type_async(NIMSysMsgType type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string  json_extension, OperateSysMsgDelegate cb, IntPtr user_data);
    }
}
