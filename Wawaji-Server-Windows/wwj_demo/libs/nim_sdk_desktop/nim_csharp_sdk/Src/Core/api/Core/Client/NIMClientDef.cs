/** @file NIMClientDef.cs
  * @brief NIM SDK提供的Client相关定义（如登录、注销、被踢、掉线等功能）
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using Newtonsoft.Json;

//定义NIM Client相关的数据类型
namespace NIM
{
    /// <summary>
    /// Logout类型
    /// </summary>
    public enum NIMLogoutType
    {
        /// <summary>
        /// 注销/切换帐号（返回到登录界面）
        /// </summary>
        kNIMLogoutChangeAccout  = 1,	
        /// <summary>
        /// 被踢（返回到登录界面）
        /// </summary>
        kNIMLogoutKickout       = 2,	
        /// <summary>
        /// 程序退出
        /// </summary>
        kNIMLogoutAppExit       = 3,	
        /// <summary>
        /// 重连操作，包括保存密码时启动程序伪登录后的重连操作以及掉线后的重连操作（帐号未变化）
        /// </summary>
        kNIMLogoutRelogin       = 4,	
    };

    /// <summary>
    /// 被踢原因
    /// </summary>
    public enum NIMKickReason
    {
        /// <summary>
        /// 互斥类型的客户端互踢
        /// </summary>
        kNIMKickReasonSameGeneric               = 1,  
        /// <summary>
        /// 服务器端发起踢客户端指令
        /// </summary>
        kNIMKickReasonServerKick                = 2,  
        /// <summary>
        /// 被自己的其他端踢掉
        /// </summary>
        kNIMKickReasonKickBySelfOtherClient     = 3,  
    };

    /// <summary>
    /// 客户端类型
    /// </summary>
    public enum NIMClientType
    {
        /// <summary>
        /// Android
        /// </summary>
        kNIMClientTypeAndroid       = 1,  
        /// <summary>
        /// iOS
        /// </summary>
        kNIMClientTypeiOS           = 2, 
        /// <summary>
        /// PC Windows
        /// </summary>
        kNIMClientTypePCWindows     = 4,  
        /// <summary>
        /// Windows Phone
        /// </summary>
        kNIMClientTypeWindowsPhone  = 8,  
        /// <summary>
        /// Web
        /// </summary>
        kNIMClientTypeWeb           = 16, 
    };

    /// <summary>
    /// 登录步骤
    /// </summary>
    public enum NIMLoginStep
    {
        /// <summary>
        /// 正在连接
        /// </summary>
        kNIMLoginStepLinking    = 0,	
        /// <summary>
        /// 连接服务器
        /// </summary>
        kNIMLoginStepLink       = 1,	
        /// <summary>
        /// 正在登录
        /// </summary>
        kNIMLoginStepLogining   = 2,	
        /// <summary>
        /// 登录验证
        /// </summary>
        kNIMLoginStepLogin      = 3,	
    };

    /// <summary>
    /// 多点登录通知类型
    /// </summary>
    public enum NIMMultiSpotNotifyType
    {
        /// <summary>
        /// 通知其他在线端自己登录了
        /// </summary>
        kNIMMultiSpotNotifyTypeImIn  = 2,		
        /// <summary>
        /// 通知其他在线端自己退出
        /// </summary>
        kNIMMultiSpotNotifyTypeImOut = 3,		
    };

    public class NIMMultiClientLoginInfo : NimUtility.NimJsonObject<NIMMultiClientLoginInfo>
    {
        /// <summary>
        /// 第三方账号
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("app_account")]
        public string AppAccount { get; set; }

        /// <summary>
        /// 客户端类型<see cref="NIMClientType"/>
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("client_type")]
        public NIMClientType ClientType { get; set; }

        /// <summary>
        /// 登录系统类型,比如ios 6.0.1 
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("client_os")]
        public string OperateSystem { get; set; }

        /// <summary>
        /// 登录设备的mac地址
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("mac")]
        public string MacAddress { get; set; }

        /// <summary>
        /// 设备id，uuid
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("device_id")]
        public string DeviceID { get; set; }

        /// <summary>
        /// 本次登陆时间, 精度到ms
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("login_time")]
        public long LoginTimeStamp { get; set; }
    }

    public class NIMLoginResult : NimUtility.NimJsonObject<NIMLoginResult>
    {
        /// <summary>
        /// 返回的错误码
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("err_code")]
        public ResponseCode Code { get; set; }

        /// <summary>
        /// 是否为重连过程
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("relogin")]
        public bool IsRelogin { get; set; }

        /// <summary>
        /// 登录步骤
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("login_step")]
        public NIMLoginStep LoginStep { get; set; }

        /// <summary>
        /// 其他端的在线状态列表，登录成功才会返回这部分内容
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("other_clients_pres")]
        public List<NIMMultiClientLoginInfo> LoginedClients { get; set; }
    }

    public class NIMLogoutResult : NimUtility.NimJsonObject<NIMLogoutResult>
    {
        /// <summary>
        /// 返回的错误码
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("err_code")]
        public ResponseCode Code { get; set; }
    }

    public class NIMKickoutOtherDeviceInfo : NimUtility.NimJsonObject<NIMKickoutOtherDeviceInfo>
    {
        [JsonProperty("device_ids")]
        public List<string> DeviceIDs { get; set; }
    }

    public class NIMKickoutResult : NimUtility.NimJsonObject<NIMKickoutResult>
    {
        /// <summary>
        /// 客户端类型NIMClientType
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("client_type")]
        public NIMClientType ClientType { get; set; }

        /// <summary>
        /// 返回的被踢原因NIMKickReason
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("reason_code")]
        public NIMKickReason KickReason { get; set; }
    }

    public class NIMMultiSpotLoginNotifyResult : NimUtility.NimJsonObject<NIMMultiSpotLoginNotifyResult>
    {
        /// <summary>
        /// 客户端类型NIMClientType
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("multi_spot_notiy_type")]
        public NIMMultiSpotNotifyType NotifyType { get; set; }

        /// <summary>
        /// 其他端的在线状态列表，登录成功才会返回这部分内容
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("other_clients_pres")]
        public List<NIMMultiClientLoginInfo> OtherClients { get; set; }
    }

    public class NIMKickOtherResult : NimUtility.NimJsonObject<NIMKickOtherResult>
    {
        /// <summary>
        /// 返回的错误码
        /// </summary>
        [Newtonsoft.Json.JsonPropertyAttribute("err_code")]
        public ResponseCode ResCode { get; set; }

        /// <summary>
        /// 设备id，uuid
        /// </summary>
        [JsonProperty("device_ids")]
        public List<string> DeviceIDs { get; set; }
    }

    public class LoginResultEventArgs : EventArgs
    {
        public NIMLoginResult LoginResult { get; private set; }

        public LoginResultEventArgs(NIMLoginResult result)
        {
            LoginResult = result;
        }
    }
}
