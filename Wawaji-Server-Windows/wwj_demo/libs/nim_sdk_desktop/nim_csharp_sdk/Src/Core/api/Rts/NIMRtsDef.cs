/** @file NIMRtsDef.cs
  * @brief NIM RTS提供的实时会话（数据通道）接口定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Runtime.InteropServices;

namespace NIM
{
    namespace NIMRts
    {
        /// <summary>
        /// rts通道类型
        /// </summary>
        [Flags]
        public enum NIMRtsChannelType
        {
            /// <summary>
            /// 无通道
            /// </summary>
	        kNIMRtsChannelTypeNone	= 0,
            /// <summary>
            /// tcp通道
            /// </summary>
	        kNIMRtsChannelTypeTcp	= 1,
            /// <summary>
            /// udp通道 暂不支持
            /// </summary>
	        kNIMRtsChannelTypeUdp	= 2,
            /// <summary>
            /// 音视频通道
            /// </summary>
	        kNIMRtsChannelTypeVchat	= 4,
        };

        /// <summary>
        /// 成员变化类型
        /// </summary>
        public enum NIMRtsMemberStatus
        {
            /// <summary>
            /// 成员进入
            /// </summary>
	        kNIMRtsMemberStatusJoined           = 0,
            /// <summary>
            /// 成员退出
            /// </summary>
	        kNIMRtsMemberStatusLeaved           = 1,
        };

        /// <summary>
        /// 音视频通话类型
        /// </summary>
        public enum NIMRtsVideoChatMode
        {
            /// <summary>
            /// 语音通话模式
            /// </summary>
	        kNIMRtsVideoChatModeAudio	=	1,
            /// <summary>
            /// 视频通话模式
            /// </summary>
	        kNIMRtsVideoChatModeVideo	=	2
        };

        
        /// <summary>
        /// 音视频服务器连接状态类型
        /// </summary>
        public enum NIMRtsConnectStatus
        {
            /// <summary>
            /// 断开连接
            /// </summary>
	        kNIMRtsConnectStatusDisconn			= 0,
            /// <summary>
            /// 启动失败
            /// </summary>
	        kNIMRtsConnectStatusStartFail		= 1,
            /// <summary>
            /// 超时
            /// </summary>
	        kNIMRtsConnectStatusTimeout			= 101,
            /// <summary>
            /// 成功
            /// </summary>
	        kNIMRtsConnectStatusSuccess			= 200,
            /// <summary>
            /// 错误参数
            /// </summary>
	        kNIMRtsConnectStatusInvalidParam	= 400,
            /// <summary>
            /// 密码加密错误
            /// </summary>
	        kNIMRtsConnectStatusDesKey			= 401,
            /// <summary>
            /// 错误请求
            /// </summary>
	        kNIMRtsConnectStatusInvalidRequst	= 417,
            /// <summary>
            /// 服务器内部错误
            /// </summary>
	        kNIMRtsConnectStatusServerUnknown	= 500,
            /// <summary>
            /// 退出
            /// </summary>
	        kNIMRtsConnectStatusLogout			= 1001,
        };

        /// <summary>
        /// 发起rts或者接起rts时的配置参数
        /// </summary>
        public class RtsStartInfo : NimUtility.NimJsonObject<RtsStartInfo>
        {
            /// <summary>
            /// 视频通道的发起模式NIMRtsVideoChatMode，非视频模式时不会发送视频数据
            /// </summary>
            [Newtonsoft.Json.JsonProperty("mode")]
            public int Mode { get; set; }

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
            
            /// <summary>
            /// 推送用的文本，接收方无效
            /// </summary>
            [Newtonsoft.Json.JsonProperty("apns")]
            public string ApnsText { get; set; }

            /// <summary>
            /// 自定义数据，透传给被邀请方，接收方无效
            /// </summary>
            [Newtonsoft.Json.JsonProperty("custom_info")]
            public string CustomInfo { get; set; }

            public RtsStartInfo()
            {
                Mode = (int)NIMRtsVideoChatMode.kNIMRtsVideoChatModeAudio;
                CustomAudio = 0;
                CustomVideo = 0;
            }
        }
        /// <summary>
        /// 收到本人其他端已经处理的通知
        /// </summary>
        public class RtsSyncAckInfo : NimUtility.NimJsonObject<RtsSyncAckInfo>
        {
            /// <summary>
            /// 客户端类型
            /// </summary>
            [Newtonsoft.Json.JsonProperty("client_type")]
            public int client { get; set; }
        }
        /// <summary>
        /// 通道连接成功后会返回服务器录制信息
        /// </summary>
        public class RtsConnectInfo : NimUtility.NimJsonObject<RtsConnectInfo>
        {
            /// <summary>
            /// 录制地址（服务器开启录制时有效）
            /// </summary>
            [Newtonsoft.Json.JsonProperty("record_addr")]
            public string RecordAddr { get; set; }
            /// <summary>
            /// 录制文件名（服务器开启录制时有效）
            /// </summary>
            [Newtonsoft.Json.JsonProperty("record_file")]
            public string RecordFile { get; set; }

            RtsConnectInfo()
            {
                RecordAddr = null;
                RecordFile = null;
            }
        }

        


    }
}
