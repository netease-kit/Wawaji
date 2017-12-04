using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace NIMChatRoom
{
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomLoginCbFunc(long room_id, int login_step, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomExitCbFunc(long room_id, int error_code, int exit_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomLinkConditionCbFunc(long room_id, int condition, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomSendmsgArcCbFunc(long room_id, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomReceiveMsgCbFunc(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomReceiveNotificationCbFunc(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomGetMembersCbFunc(long room_id, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomGetMsgCbFunc(long room_id, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomSetMemberAttributeCbFunc(long room_id, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomCloseCbFunc(long room_id, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomGetInfoCbFunc(long room_id, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string result, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void NimChatroomKickMemberCbFunc(long room_id, int error_code, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    internal static class ChatRoomNativeMethods
    {
#if DEBUG
        const string ChatRoomNativeDll = "nim_chatroom.dll";
#else
        const string ChatRoomNativeDll = "nim_chatroom.dll";
#endif

        /// <summary>
        ///注册全局登录回调 
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_reg_enter_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_reg_enter_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomLoginCbFunc cb, IntPtr user_data);

        /// <summary>
        ///注册全局登出、被踢回调 
        /// </summary> 
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_reg_exit_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_reg_exit_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomExitCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 注册聊天室链接状况回调
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_reg_link_condition_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_reg_link_condition_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomLinkConditionCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 注册全局发送消息回执回调
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_reg_send_msg_arc_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_reg_send_msg_arc_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomSendmsgArcCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 注册全局接收消息回调
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_reg_receive_msg_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_reg_receive_msg_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomReceiveMsgCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 注册全局接收通知回调
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_reg_receive_notification_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_reg_receive_notification_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomReceiveNotificationCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 聊天室模块初始化
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_init", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_chatroom_init([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension);

        /// <summary>
        /// 聊天室登录
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_enter", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_chatroom_enter(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string request_login_data, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string login_info, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension);

        /// <summary>
        /// 聊天室登出
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_exit", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_exit(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension);

        /// <summary>
        /// 聊天室模块清理
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_cleanup", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_cleanup([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension);

        /// <summary>
        /// 发送消息
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_send_msg", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_send_msg(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string msg, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension);

        /// <summary>
        /// 异步获取聊天室成员（分页）
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_get_members_online_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_get_members_online_async(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string parameters_json_str, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomGetMembersCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 异步获取消息历史（分页）
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_get_msg_history_online_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_get_msg_history_online_async(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string parameters_json_str, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomGetMsgCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 异步修改成员身份标识
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_set_member_attribute_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_set_member_attribute_async(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string notify_ext, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomSetMemberAttributeCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 异步关闭聊天室（只有创建者有权限）
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_close_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_close_async(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string notify_ext, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomCloseCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 异步获取当前聊天室信息
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_get_info_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_get_info_async(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomGetInfoCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 异步获取指定成员信息
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_get_members_by_ids_online_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_get_members_by_ids_online_async(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string ids_json_array_string, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomGetMembersCbFunc cb, IntPtr user_data);

        /// <summary>
        /// 异步踢掉指定成员
        /// </summary>
        [DllImport(ChatRoomNativeDll, EntryPoint = "nim_chatroom_kick_member_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_chatroom_kick_member_async(long room_id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string id, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string notify_ext, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension, NimChatroomKickMemberCbFunc cb, IntPtr user_data);
    }
}
