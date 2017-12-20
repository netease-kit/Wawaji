using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace NIMChatRoom
{
    /// <summary>
    /// 聊天室登录信息
    /// </summary>
    public class LoginData:NimUtility.NimJsonObject<LoginData>
    {
        /// <summary>
        /// 进入聊天室后展示的昵称,选填
        /// </summary>
        [JsonProperty("nick")]
        public string Nick { get; set; }

        /// <summary>
        /// 进入聊天室后展示的头像,选填
        /// </summary>
        [JsonProperty("avator")]
        public string Icon { get; set; }

        /// <summary>
        /// 聊天室可用的扩展字段,选填
        /// </summary>
        [JsonProperty("ext")]
        public NimUtility.Json.JsonExtension Extension { get;  set; }

        /// <summary>
        /// 进入聊天室通知开发者扩展字段
        /// </summary>
        [JsonProperty("notify_ext")]
        public NimUtility.Json.JsonExtension NotifyExtension { get; set; }
    }

    /// <summary>
    /// 聊天室登录状态
    /// </summary>
    public enum NIMChatRoomLoginStep
    {
        /// <summary>
        ///本地服务初始化 
        /// </summary>
        kNIMChatRoomLoginStepInit = 1,

        /// <summary>
        ///服务器连接中 
        /// </summary>
        kNIMChatRoomLoginStepServerConnecting = 2,

        /// <summary>
        ///服务器连接结束,连接结果error_code 
        /// </summary>
        kNIMChatRoomLoginStepServerConnectOver = 3,

        /// <summary>
        ///聊天室鉴权中 
        /// </summary>
        kNIMChatRoomLoginStepRoomAuthing = 4,

        /// <summary>
        ///聊天室鉴权结束,鉴权结果见error_code, error_code非408则需要开发者重新请求聊天室登录信息 
        /// </summary>
        kNIMChatRoomLoginStepRoomAuthOver = 5,
    }
}
