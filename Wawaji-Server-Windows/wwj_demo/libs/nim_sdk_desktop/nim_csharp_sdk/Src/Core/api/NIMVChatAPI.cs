/** @file NIMVChatAPI.cs
  * @brief NIM VChat提供的音视频相关接口，相关功能调用前需要先Init()
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Runtime.InteropServices;

namespace NIM
{
    /// <summary>
    /// 音视频相关的回调
    /// </summary>
    public struct NIMVChatSessionStatus
    {
        /// <summary>
        /// 发起结果回调
        /// </summary>
        public onSessionHandler             onSessionStartRes;
        /// <summary>
        /// 邀请通知
        /// </summary>
        public onSessionInviteNotify        onSessionInviteNotify;
        /// <summary>
        /// 邀请响应的结果回调
        /// </summary>
        public onSessionHandler             onSessionCalleeAckRes;
        /// <summary>
        /// 发起后对方响应通知
        /// </summary>
        public onSessionCalleeAckNotify     onSessionCalleeAckNotify;
        /// <summary>
        /// 控制操作结果回调
        /// </summary>
        public onSessionControlRes          onSessionControlRes;
        /// <summary>
        /// 控制操作通知
        /// </summary>
        public onSessionControlNotify       onSessionControlNotify;
        /// <summary>
        /// 链接通知
        /// </summary>
        public onSessionConnectNotify       onSessionConnectNotify;
        /// <summary>
        /// 成员状态通知
        /// </summary>
        public onSessionPeopleStatus        onSessionPeopleStatus;
        /// <summary>
        /// 网络状态通知
        /// </summary>
        public onSessionNetStatus           onSessionNetStatus;
        /// <summary>
        /// 主动挂断结果回调
        /// </summary>
        public onSessionHandler             onSessionHangupRes;
        /// <summary>
        /// 对方挂断通知
        /// </summary>
        public onSessionHandler             onSessionHangupNotify;
        /// <summary>
        /// 本人其他端响应通知
        /// </summary>
        public onSessionSyncAckNotify       onSessionSyncAckNotify;
    }
    public class VChatAPI
    {
        //引用C中的方法（考虑到不同平台下的C接口引用方式差异，如[DllImport("__Internal")]，[DllImport("nimapi")]等） 
        #region NIM C SDK native methods

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_init", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern bool nim_vchat_init(
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_cleanup", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_vchat_cleanup(
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_cb_func", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_vchat_set_cb_func(nim_vchat_cb_func cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_start", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern bool nim_vchat_start(NIMVideoChatMode mode,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string apns_text,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string custom_info,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_talking_mode", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern bool nim_vchat_set_talking_mode(NIMVideoChatMode mode,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_callee_ack", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern bool nim_vchat_callee_ack(long channel_id, bool accept,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_control", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern bool nim_vchat_control(long channel_id, NIMVChatControlType type,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_end", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_vchat_end([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_viewer_mode", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_set_viewer_mode(bool viewer);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_get_viewer_mode", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern bool nim_vchat_get_viewer_mode();

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_audio_mute", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_set_audio_mute(bool muted);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_audio_mute_enabled", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern bool nim_vchat_audio_mute_enabled();

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_member_in_blacklist", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_set_member_in_blacklist(
			 [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string uid, bool add, bool audio,
			 [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
			 nim_vchat_opt_cb_func cb,
			 IntPtr user_data);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_start_record", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_start_record(
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string path,
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
			nim_vchat_mp4_record_opt_cb_func cb,
			IntPtr user_data);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_stop_record", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_stop_record(
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
			nim_vchat_mp4_record_opt_cb_func cb,
			IntPtr user_data);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_create_room", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_create_room(
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string room_name,
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string custom_info,
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
			nim_vchat_opt_cb_func cb,
			IntPtr user_data);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_join_room", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern bool nim_vchat_join_room(
			NIMVideoChatMode mode,
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string room_name,
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
			 nim_vchat_opt2_cb_func cb,
			 IntPtr user_data);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_video_quality", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_set_video_quality(int video_quality,
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
			nim_vchat_opt_cb_func cb,
			IntPtr user_data);

		[DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_custom_data", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
		private static extern void nim_vchat_set_custom_data(bool custom_audio, bool custom_video,
			[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
			nim_vchat_opt_cb_func cb,
			IntPtr user_data);
		#endregion


		/// <summary>
		/// VCHAT初始化，需要在SDK的Client.Init成功之后
		/// </summary>
		/// <returns></returns>
		public static bool Init()
        {
            ClientAPI.GuaranteeInitialized();
            return nim_vchat_init("");
        }

        /// <summary>
        /// VCHAT释放，需要在SDK的Client.Cleanup之前
        /// </summary>
        /// <returns></returns>
        public static void Cleanup()
        {
            nim_vchat_cleanup("");
        }


        static nim_vchat_cb_func VChatStatusCb = new nim_vchat_cb_func(VChatSessionStatusCallback);
        /// <summary>
        /// 设置统一的通话回调或者服务器通知
        /// </summary>
        /// <param name="session">回调通知对象</param>
        public static void SetSessionStatusCb(NIMVChatSessionStatus session)
        {
            session_status = session;
            nim_vchat_set_cb_func(VChatStatusCb, IntPtr.Zero);
        }
        private static NIMVChatSessionStatus session_status;
        private static void VChatSessionStatusCallback(NIMVideoChatSessionType type, long channel_id, int code, string json_extension, IntPtr user_data)
        {
            if(json_extension == null)
            {
                return;
            }
            NIMVChatSessionInfo info = NIMVChatSessionInfo.Deserialize(json_extension);
            switch (type)
            {
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeStartRes:
                    {
                        if (session_status.onSessionStartRes != null)
                        {
                            session_status.onSessionStartRes.DynamicInvoke(channel_id, code);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeInviteNotify:
                    {
                        if (session_status.onSessionInviteNotify != null)
                        {
                            session_status.onSessionInviteNotify.DynamicInvoke(channel_id, info.Uid, info.Type, info.Time);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeCalleeAckRes:
                    {
                        if (session_status.onSessionCalleeAckRes != null)
                        {
                            session_status.onSessionCalleeAckRes.DynamicInvoke(channel_id, code);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeCalleeAckNotify:
                    {
                        if (session_status.onSessionCalleeAckNotify != null)
                        {
                            session_status.onSessionCalleeAckNotify.DynamicInvoke(channel_id, info.Uid, info.Type, info.Accept > 0);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeControlRes:
                    {
                        if (session_status.onSessionControlRes != null)
                        {
                            session_status.onSessionControlRes.DynamicInvoke(channel_id, code, info.Type);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeControlNotify:
                    {
                        if (session_status.onSessionControlNotify != null)
                        {
                            session_status.onSessionControlNotify.DynamicInvoke(channel_id, info.Uid, info.Type);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeConnect:
                    {
                        if (session_status.onSessionConnectNotify != null)
                        {
                            if (info != null)
                                session_status.onSessionConnectNotify.DynamicInvoke(channel_id, code, info.RecordAddr, info.RecordFile);
                            else
                                session_status.onSessionConnectNotify.DynamicInvoke(channel_id, code, null, null);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypePeopleStatus:
                    {
                        if (session_status.onSessionPeopleStatus != null)
                        {
                            session_status.onSessionPeopleStatus.DynamicInvoke(channel_id, info.Uid, code);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeNetStatus:
                    {
                        if (session_status.onSessionNetStatus != null)
                        {
                            session_status.onSessionNetStatus.DynamicInvoke(channel_id, code);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeHangupRes:
                    {
                        if (session_status.onSessionHangupRes != null)
                        {
                            session_status.onSessionHangupRes.DynamicInvoke(channel_id, code);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeHangupNotify:
                    {
                        if (session_status.onSessionHangupNotify != null)
                        {
                            session_status.onSessionHangupNotify.DynamicInvoke(channel_id, code);
                        }
                    } break;
                case NIMVideoChatSessionType.kNIMVideoChatSessionTypeSyncAckNotify:
                    {
                        if (session_status.onSessionSyncAckNotify != null)
                        {
                            session_status.onSessionSyncAckNotify.DynamicInvoke(channel_id, code, info.Uid, info.Type, info.Accept > 0, info.Time, info.Client);
                        }
                    } break;
            }
        }

        /// <summary>
        /// 启动通话
        /// </summary>
        /// <param name="mode">启动音视频通话类型</param>
        /// <param name="json_extension">扩展，kNIMVChatUids成员id列表(必填),其他可选 如{"uids":["uid_temp"],"custom_video":0, "custom_audio":0}</param>
        /// <returns></returns>
        public static bool Start(NIMVideoChatMode mode, NIMVChatInfo info)
        {
            string json_extension = info.Serialize();
            return nim_vchat_start(mode,null,null, json_extension, IntPtr.Zero);
        }

        /// <summary>
        /// 设置通话模式，在更改通话模式后，通知底层
        /// </summary>
        /// <param name="mode">音视频通话类型</param>
        /// <returns></returns>
        public static bool SetMode(NIMVideoChatMode mode)
        {
            return nim_vchat_set_talking_mode(mode, "");
        }

        /// <summary>
        /// 回应音视频通话邀请
        /// </summary>
        /// <param name="channel_id">音视频通话通道id</param>
        /// <param name="accept">true 接受，false 拒绝</param>
        /// <param name="json_extension">接起时有效 参数可选 如{"custom_video":0, "custom_audio":0}</param>
        /// <returns></returns>
        public static bool CalleeAck(long channel_id, bool accept, NIMVChatInfo info)
        {
            string json_extension = info.Serialize();
            return nim_vchat_callee_ack(channel_id, accept, json_extension, IntPtr.Zero);
        }

        /// <summary>
        /// 音视频通话控制操作
        /// </summary>
        /// <param name="channel_id">音视频通话通道id</param>
        /// <param name="type">操作类型</param>
        /// <returns></returns>
        public static bool ChatControl(long channel_id, NIMVChatControlType type)
        {
            return nim_vchat_control(channel_id, type, "", IntPtr.Zero);
        }

        /// <summary>
        /// 结束通话(需要主动在通话结束后调用，用于底层挂断和清理数据)
        /// </summary>
        public static void End()
        {
            nim_vchat_end("");
        }

		/// <summary>
		/// 设置观众模式（多人模式下），全局有效（重新发起时也生效）
		/// </summary>
		/// <param name="viewer"></param>
		public static void SetViewerMode(bool viewer)
		{
			nim_vchat_set_viewer_mode(viewer);
		}

		/// <summary>
		/// 获取当前是否是观众模式
		/// </summary>
		/// <returns></returns>
		public static bool GetViewerMode()
		{
			return nim_vchat_get_viewer_mode();
		}

		/// <summary>
		/// 设置音频静音，全局有效（重新发起时也生效）
		/// </summary>
		/// <param name="muted"></param>
		public static void SetAudioMute(bool muted)
		{
			nim_vchat_set_audio_mute(muted);
		}

		/// <summary>
		/// 获取音频静音状态
		/// </summary>
		/// <returns></returns>
		public static bool GetAudioMuteEnabled()
		{
			return nim_vchat_audio_mute_enabled();
		}

		/// <summary>
		/// 设置单个成员的黑名单状态，即是否显示对方的音频或视频数据，当前通话有效(只能设置进入过房间的成员)
		/// </summary>
		/// <param name="uid">uid成员 account</param>
		/// <param name="add">true:添加到黑名单.false:从黑名单中移除</param>
		/// <param name="audio">ture:表示音频黑名单.false:表示视频黑名单</param>
		/// <param name="json_extension">无效扩展字段</param>
		/// <param name="cb">返回的json_extension无效</param>
		/// <param name="user_data"> APP的自定义数据，SDK只负责传回给回调函数cb，不做任何处理</param>
		public static void SetMemberInBlackList(string uid,bool add,bool audio,string json_extension, nim_vchat_opt_cb_func cb,
			 IntPtr user_data)
		{
			 nim_vchat_set_member_in_blacklist(uid, add, audio, json_extension, cb, user_data);
		}

		/// <summary>
		/// 开始录制MP4，一次只允许一个录制文件，在通话开始的时候才有实际数据。状态变化见nim_vchat_cb_func通知，type值对应kNIMVideoChatSessionTypeMp4Notify。
		/// </summary>
		/// <param name="path">文件录制路径</param>
		/// <param name="json_extension">无效扩展字段</param>
		/// <param name="cb"></param>
		/// <param name="user_data">APP的自定义数据，SDK只负责传回给回调函数cb，不做任何处理</param>
		public static void StartRecord(string path,string json_extension, nim_vchat_mp4_record_opt_cb_func cb,IntPtr user_data)
		{
			nim_vchat_start_record(path, json_extension, cb, user_data);
		}

		/// <summary>
		/// 停止录制MP4
		/// </summary>
		/// <param name="json_extension">无效扩展字段</param>
		/// <param name="cb"></param>
		/// <param name="user_data">APP的自定义数据，SDK只负责传回给回调函数cb，不做任何处理</param>
		public static void StopRecord(string json_extension, nim_vchat_mp4_record_opt_cb_func cb, IntPtr user_data)
		{
			nim_vchat_stop_record(json_extension, cb, user_data);
		}

		/// <summary>
		/// 创建一个多人房间（后续需要主动调用加入接口进入房间）
		/// </summary>
		/// <param name="room_name">房间名</param>
		/// <param name="custom_info">自定义的房间信息（加入房间的时候会返回）</param>
		/// <param name="json_extension">无效扩展字段</param>
		/// <param name="cb">返回的json_extension无效</param>
		/// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理</param>
		public static void CreateRoom(string room_name,string custom_info,string json_extension,
			nim_vchat_opt_cb_func cb,IntPtr user_data)
		{
			nim_vchat_create_room(room_name, custom_info, json_extension, cb, user_data);
		}

		/// <summary>
		/// 加入一个多人房间（进入房间后成员变化等，等同点对点nim_vchat_cb_func）
		/// </summary>
		/// <param name="room_name"></param>
		/// <param name="json_extension"></param>
		/// <param name="cb"></param>
		/// <param name="user_data"></param>
		/// <returns></returns>
		public static bool JoinRoom(NIMVideoChatMode mode,string room_name,string json_extension, nim_vchat_opt2_cb_func cb,IntPtr user_data)
		{
			return nim_vchat_join_room(mode,room_name, json_extension, cb, user_data);
		}

		/// <summary>
		/// 通话中修改分辨率，只在多人中支持
		/// </summary>
		/// <param name="video_quality"> 分辨率模式</param>
		/// <param name="json_extension">无效扩展字段</param>
		/// <param name="cb">返回的json_extension无效</param>
		/// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理</param>
		public static void SetVideoQuality(int video_quality,string json_extension,nim_vchat_opt_cb_func cb,IntPtr user_data)
		{
			nim_vchat_set_video_quality(video_quality, json_extension, cb, user_data);
		}

		/// <summary>
		/// 通话中修改自定义音视频数据模式
		/// </summary>
		/// <param name="custom_audio">true:表示使用自定义的音频数据.false:表示不使用</param>
		/// <param name="custom_video">true:表示使用自定义的视频数据.false:表示不使用</param>
		/// <param name="json_extension">无效扩展字段</param>
		/// <param name="cb"></param>
		/// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理</param>
		public static void SetCustomData(bool custom_audio,bool custom_video,string json_extension,nim_vchat_opt_cb_func cb,IntPtr user_data)
		{
			nim_vchat_set_custom_data(custom_audio, custom_video, json_extension, cb, user_data);
		}

	}
}
