using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace NIM
{
    namespace NIMRts
    {
        /// <summary>
        /// 创建通道返回结果
        /// </summary>
        /// <param name="code">调用结果</param>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型 如要tcp+音视频，则channel_type=kNIMRtsChannelTypeTcp|kNIMRtsChannelTypeVchat</param>
        /// <param name="uid">对方帐号</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void StartResHandler(int code, string sessionId, int channelType, string uid);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsStartCbFunc(int code, string sessionId, int channelType, string uid,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 收到对方创建通道通知
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型 如要tcp+音视频，则channel_type=kNIMRtsChannelTypeTcp|kNIMRtsChannelTypeVchat</param>
        /// <param name="uid">对方帐号</param>
        /// <param name="customInfo">透传数据</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnStartNotify(string sessionId, int channelType, string uid,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string customInfo);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsStartNotifyCbFunc(string sessionId, int channelType, string uid,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 回复收到邀请的结果
        /// </summary>
        /// <param name="code">调用结果</param>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型</param>
        /// <param name="accept">是否接受</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void AckResHandler(int code, string sessionId, int channelType, bool accept);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsAckResCbFunc(int code, string sessionId, int channelType, bool accept,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 收到对方回复邀请的通知
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型</param>
        /// <param name="accept">是否接受</param>
        /// <param name="uid">对方帐号</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnAckNotify(string sessionId, int channelType, bool accept, string uid);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsAckNotifyCbFunc(string sessionId, int channelType, bool accept, string uid,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 收到本人在其他端回复邀请的同步通知
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型</param>
        /// <param name="accept">是否接受</param>
        /// <param name="client">客户端类型NIMClientType</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnSyncAckNotify(string sessionId, int channelType, bool accept, int client);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsSyncAckNotifyCbFunc(string sessionId, int channelType, bool accept,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 通道连接状态通知
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型</param>
        /// <param name="code">连接状态 非200都是未连接</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnConnectNotify(string sessionId, int channelType, int code);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void NimRtsConnectNotifyCbFunc(string sessionId, int channelType, int code,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 通道连接成员变化通知
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型</param>
        /// <param name="type">成员变化类型NIMRtsMemberStatus</param>
        /// <param name="uid">对方帐号</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnMemberNotify(string sessionId, int channelType, int type, string uid);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsMemberChangeCbFunc(string sessionId, int channelType, int type, string uid,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 控制接口调用结果
        /// </summary>
        /// <param name="code">调用结果</param>
        /// <param name="sessionId">会话id</param>
        /// <param name="info">透传数据</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void ControlResHandler(int code, string sessionId, string info);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsControlResCbFunc(int code, string sessionId,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string info,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 控制消息通知回调
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="info">透传数据</param>
        /// <param name="uid">对方帐号</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnControlNotify(string sessionId, string info, string uid);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsControlNotifyCbFunc(string sessionId, 
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string info,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string uid,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 挂断会话调用结果
        /// </summary>
        /// <param name="code">调用结果</param>
        /// <param name="sessionId">会话id</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void HangupResHandler(int code, string sessionId);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsHangupResCbFunc(int code, string sessionId,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 挂断会话通知回调
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="uid">对方帐号</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnHangupNotify(string sessionId, string uid);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsHangupNotifyCbFunc(string sessionId, string uid,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        /// <summary>
        /// 数据监听回调
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型</param>
        /// <param name="uid">对方帐号</param>
        /// <param name="data">接受的数据</param>
        /// <param name="size">data的数据长度</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void OnRecData(string sessionId, int channelType, string uid, IntPtr data, int size);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void NimRtsRecDataCbFunc(string sessionId, int channelType, string uid, IntPtr data, int size,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string jsonExtension,
            IntPtr userData);

        class RtsNativeMethods
        {
            //引用C中的方法（考虑到不同平台下的C接口引用方式差异，如[DllImport("__Internal")]，[DllImport("nimapi")]等） 

            #region NIM C SDK native methods

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_start", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_start(int channel_type, string uid,
                [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension,
                NimRtsStartCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_start_notify_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_start_notify_cb_func(NimRtsStartNotifyCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_ack", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_ack(string session_id, int channel_type, bool accept,
                [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension,
                NimRtsAckResCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_ack_notify_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_ack_notify_cb_func(NimRtsAckNotifyCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_sync_ack_notify_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_sync_ack_notify_cb_func(NimRtsSyncAckNotifyCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_connect_notify_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_connect_notify_cb_func(NimRtsConnectNotifyCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_member_change_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_member_change_cb_func(NimRtsMemberChangeCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_control", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_control(string session_id,
                [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string info,
                [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension,
                NimRtsControlResCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_control_notify_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_control_notify_cb_func(NimRtsControlNotifyCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_vchat_mode", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_vchat_mode(string session_id, int mode,
                [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_hangup", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_hangup(string session_id,
                [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension,
                NimRtsHangupResCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_hangup_notify_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_hangup_notify_cb_func(NimRtsHangupNotifyCbFunc cb, IntPtr user_data);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_send_data", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_send_data(string session_id, int channel_type, IntPtr data, int size,
                [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof (NimUtility.Utf8StringMarshaler))] string json_extension);

            [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_rts_set_rec_data_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
            public static extern void nim_rts_set_rec_data_cb_func(NimRtsRecDataCbFunc cb, IntPtr user_data);

            #endregion
        }
    }
}
