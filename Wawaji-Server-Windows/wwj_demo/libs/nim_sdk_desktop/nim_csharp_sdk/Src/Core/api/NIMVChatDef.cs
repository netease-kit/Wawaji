/** @file NIMVChatDef.cs
  * @brief NIM VChat提供的音视频接口定义，
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace NIM
{
    /** @enum NIMVideoChatSessionType 音视频通话状态通知类型 */
    public enum NIMVideoChatSessionType
    {
        kNIMVideoChatSessionTypeStartRes = 1,		/**< 创建通话结果 */
        kNIMVideoChatSessionTypeInviteNotify = 2,		/**< 通话邀请 */
        kNIMVideoChatSessionTypeCalleeAckRes = 3,		/**< 确认通话，接受拒绝结果 */
        kNIMVideoChatSessionTypeCalleeAckNotify = 4,		/**< 确认通话，接受拒绝通知 */
        kNIMVideoChatSessionTypeControlRes = 5,		/**< NIMVChatControlType 结果 */
        kNIMVideoChatSessionTypeControlNotify = 6,		/**< NIMVChatControlType 通知 */
        kNIMVideoChatSessionTypeConnect = 7,		/**< 通话中链接状态通知 */
        kNIMVideoChatSessionTypePeopleStatus = 8,		/**< 通话中成员状态 */
        kNIMVideoChatSessionTypeNetStatus = 9,		/**< 通话中网络状态 */
        kNIMVideoChatSessionTypeHangupRes = 10,		/**< 通话挂断结果 */
        kNIMVideoChatSessionTypeHangupNotify = 11,		/**< 通话被挂断通知 */
        kNIMVideoChatSessionTypeSyncAckNotify = 12,		/**< 通话接听挂断同步通知 */
    };

    /// <summary>
    /// 音视频通话控制类型
    /// </summary>
    public enum NIMVChatControlType
    {
        /// <summary>
        /// 打开音频
        /// </summary>
        kNIMTagControlOpenAudio = 1,
        /// <summary>
        /// 关闭音频
        /// </summary>
        kNIMTagControlCloseAudio = 2,
        /// <summary>
        /// 打开视频
        /// </summary>
        kNIMTagControlOpenVideo = 3,
        /// <summary>
        /// 关闭视频
        /// </summary>
        kNIMTagControlCloseVideo = 4,
        /// <summary>
        /// 请求从音频切换到视频
        /// </summary>
        kNIMTagControlAudioToVideo = 5,
        /// <summary>
        /// 同意从音频切换到视频
        /// </summary>
        kNIMTagControlAgreeAudioToVideo = 6,
        /// <summary>
        /// 拒绝从音频切换到视频
        /// </summary>
        kNIMTagControlRejectAudioToVideo = 7,
        /// <summary>
        /// 从视频切换到音频
        /// </summary>
        kNIMTagControlVideoToAudio = 8,
        /// <summary>
        /// 占线
        /// </summary>
        kNIMTagControlBusyLine = 9,
        /// <summary>
        /// 告诉对方自己的摄像头不可用
        /// </summary>
        kNIMTagControlCamaraNotAvailable = 10,
        /// <summary>
        /// 告诉对方自已处于后台
        /// </summary>
        kNIMTagControlEnterBackground = 11,
        /// <summary>
        /// 告诉发送方自己已经收到请求了（用于通知发送方开始播放提示音）
        /// </summary>
        kNIMTagControlReceiveStartNotifyFeedback = 12,
    };

    /// <summary>
    /// 音视频通话类型
    /// </summary>
    public enum NIMVideoChatMode
    {
        /// <summary>
        /// 语音通话模式
        /// </summary>
        kNIMVideoChatModeAudio = 1,
        /// <summary>
        /// 视频通话模式
        /// </summary>
        kNIMVideoChatModeVideo = 2,
    };

    /// <summary>
    /// 音视频通话成员变化类型
    /// </summary>
    public enum NIMVideoChatSessionStatus
    {
        /// <summary>
        /// 成员进入
        /// </summary>
        kNIMVideoChatSessionStatusJoined = 0,
        /// <summary>
        /// 成员退出
        /// </summary>
        kNIMVideoChatSessionStatusLeaved = 1,
    };

    /// <summary>
    /// 音视频通话网络变化类型
    /// </summary>
    public enum NIMVideoChatSessionNetStat
    {
        /// <summary>
        /// 网络状态很好
        /// </summary>
        kNIMVideoChatSessionNetStatVeryGood = 0,
        /// <summary>
        /// 网络状态较好
        /// </summary>
        kNIMVideoChatSessionNetStatGood = 1,
        /// <summary>
        /// 网络状态较差
        /// </summary>
        kNIMVideoChatSessionNetStatBad = 2,
        /// <summary>
        /// 网络状态很差
        /// </summary>
        kNIMVideoChatSessionNetStatVeryBad = 3,
    };

    /// <summary>
    /// 音视频服务器连接状态类型
    /// </summary>
    public enum NIMVChatConnectErrorCode
    {
        /// <summary>
        /// 断开连接
        /// </summary>
        kNIMVChatConnectDisconn = 0,
        /// <summary>
        /// 启动失败
        /// </summary>
        kNIMVChatConnectStartFail = 1,
        /// <summary>
        /// 超时
        /// </summary>
        kNIMVChatConnectTimeout = 101,
        /// <summary>
        /// 成功
        /// </summary>
        kNIMVChatConnectSuccess = 200,
        /// <summary>
        /// 错误参数
        /// </summary>
        kNIMVChatConnectInvalidParam = 400,
        /// <summary>
        /// 密码加密错误
        /// </summary>
        kNIMVChatConnectDesKey = 401,
        /// <summary>
        /// 错误请求
        /// </summary>
        kNIMVChatConnectInvalidRequst = 417,
        /// <summary>
        /// 服务器内部错误
        /// </summary>
        kNIMVChatConnectServerUnknown = 500,
        /// <summary>
        /// 退出
        /// </summary>
        kNIMVChatConnectLogout = 1001,
    };

	


    /// <summary>
    /// 发起和接受通话时的参数
    /// </summary>
    public class NIMVChatInfo : NimUtility.NimJsonObject<NIMVChatInfo>
    {
        /// <summary>
        /// 成员id列表，主动发起非空
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "uids", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public List<string> Uids { get; set; }

        /// <summary>
        /// 是否用自定义音频数据（PCM）
        /// </summary>
        [Newtonsoft.Json.JsonProperty("custom_audio")]
        public int CustomAudio { get; set; }
        
        /// <summary>
        /// 是否用自定义视频数据（i420）
        /// </summary>
        [Newtonsoft.Json.JsonProperty("custom_video")]
        public int CustomVideo { get; set; }

        public NIMVChatInfo()
        {
            CustomAudio = 0;
            CustomVideo = 0;
            Uids = null;
        }
    }
    
    public class NIMVChatSessionInfo : NimUtility.NimJsonObject<NIMVChatSessionInfo>
    {
        [Newtonsoft.Json.JsonProperty(PropertyName = "uid", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Uid { get; set; }
        
        [Newtonsoft.Json.JsonProperty(PropertyName = "status", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int Status { get; set; }
        
        [Newtonsoft.Json.JsonProperty(PropertyName = "record_addr", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string RecordAddr { get; set; }
        
        [Newtonsoft.Json.JsonProperty(PropertyName = "record_file", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string RecordFile { get; set; }
        
        [Newtonsoft.Json.JsonProperty(PropertyName = "type", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int Type { get; set; }
        
        [Newtonsoft.Json.JsonProperty(PropertyName = "time", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public long Time { get; set; }
        
        [Newtonsoft.Json.JsonProperty(PropertyName = "accept", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int Accept { get; set; }
        
        [Newtonsoft.Json.JsonProperty(PropertyName = "client", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int Client { get; set; }

        public NIMVChatSessionInfo()
        {
            Uid = null;
            Status = 0;
            RecordAddr = null;
            RecordFile = null;
            Type = 0;
            Time = 0;
            Accept = 0;
            Client = 0;
        }
    }

    /// <summary>
    /// 调用接口回调
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="code">结果</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionHandler(long channel_id, int code);

    /// <summary>
    /// 收到邀请
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="uid">对方uid</param>
    /// <param name="mode">通话类型</param>
    /// <param name="time">毫秒级 时间戳</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionInviteNotify(long channel_id, string uid, int mode, long time);

    /// <summary>
    /// 确认通话，接受拒绝通知
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="uid">对方uid</param>
    /// <param name="mode">通话类型</param>
    /// <param name="accept">结果</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionCalleeAckNotify(long channel_id, string uid, int mode, bool accept);

    /// <summary>
    /// 控制操作结果
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="code">结果</param>
    /// <param name="type">操作类型</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionControlRes(long channel_id, int code, int type);

    /// <summary>
    /// 控制操作通知
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="uid">对方uid</param>
    /// <param name="type">操作类型</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionControlNotify(long channel_id, string uid, int type);

    /// <summary>
    /// 通话中链接状态通知
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="code">结果状态</param>
    /// <param name="record_addr">录制地址（服务器开启录制时有效）</param>
    /// <param name="record_file">录制文件名（服务器开启录制时有效）</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionConnectNotify(long channel_id, int code, string record_addr, string record_file);

    /// <summary>
    /// 通话中成员状态
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="uid">对方uid</param>
    /// <param name="status">状态</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionPeopleStatus(long channel_id, string uid, int status);

    /// <summary>
    /// 通话中网络状态
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="status">状态</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionNetStatus(long channel_id, int status);

    /// <summary>
    /// 其他端接听挂断后的同步通知
    /// </summary>
    /// <param name="channel_id">频道id</param>
    /// <param name="uid">对方uid</param>
    /// <param name="mode">通话类型</param>
    /// <param name="accept">结果</param>
    /// <param name="time">毫秒级 时间戳</param>
    /// <param name="client">客户端类型</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void onSessionSyncAckNotify(long channel_id, string uid, int mode, bool accept, long time, int client);


    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void nim_vchat_cb_func(NIMVideoChatSessionType type, long channel_id, int code,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension, 
            IntPtr user_data);//通知客户端收到一条新聊天室通知消息

	[UnmanagedFunctionPointer(CallingConvention.Cdecl)]
	public delegate void nim_vchat_opt_cb_func(bool ret, int code,
		[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension,
		IntPtr user_data); //操作回调，通用的操作回调接口


  /// <summary>
    /// NIM 操作回调，通用的操作回调接口
  /// </summary>
  /// <param name="code">code 结果代码，code==200表示成功</param>
  /// <param name="channel_id">通道id</param>
  /// <param name="json_extension"> 扩展字段</param>
    /// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void nim_vchat_opt2_cb_func(int code, Int64 channel_id,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension,
        IntPtr user_data); //操作回调，通用的操作回调接口

	/// <summary>
	/// NIM MP4操作回调，实际的开始录制和结束都会在nim_vchat_cb_func中返回
	/// </summary>
	/// <param name="ret">结果代码，true表示成功</param>
	/// <param name="code">对应NIMVChatMp4RecordCode,用于获取失败时的错误原因</param>
	/// <param name="file">文件路径</param>
	/// <param name="time">录制结束时有效，对应毫秒级的录制时长</param>
	/// <param name="json_extension">无效扩展字段</param>
	/// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理</param>
	[UnmanagedFunctionPointer(CallingConvention.Cdecl)]
	public delegate void nim_vchat_mp4_record_opt_cb_func(bool ret, int code,
		[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string file,
		Int64 time,
		[MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension,
		IntPtr user_data);
}
