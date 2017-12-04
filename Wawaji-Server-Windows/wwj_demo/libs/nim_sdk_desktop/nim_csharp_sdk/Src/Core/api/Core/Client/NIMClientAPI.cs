/** @file NIMClientAPI.cs
  * @brief NIM SDK提供的Client接口，主要包括SDK初始化/清理、客户端登录/退出/重连/掉线/被踢等流程
  * NIM SDK所有接口命名说明: nim.***(模块).***(功能)，如nim.ClientAPI.Init
  * NIM SDK所有接口参数说明: C#层的字符串参数全部指定用UTF-16编码
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using NimUtility;

namespace NIM
{
    /// <summary>
    /// NIM SDK提供的Client接口，主要包括SDK初始化/清理、客户端登录/退出/重连/掉线/被踢等流程
    /// </summary>
    public class ClientAPI
    {
        
        public static EventHandler<LoginResultEventArgs> LoginResultHandler;
        private static bool _sdkInitialized = false;
        public delegate void KickOtherClientResultHandler(NIMKickOtherResult result);
        public delegate void MultiSpotLoginNotifyResultHandler(NIMMultiSpotLoginNotifyResult result);
        public delegate void KickoutResultHandler(NIMKickoutResult result);
        public delegate void LogoutResultDelegate(NIMLogoutResult result);
        public delegate void LoginResultDelegate(NIMLoginResult result);
        /// <summary>
        /// SDK是否已经初始化
        /// </summary>
        public static bool SdkInitialized
        {
            get { return _sdkInitialized; }
        }

        static ClientAPI()
        {
        }

        /// <summary>
        /// NIM SDK初始化
        /// </summary>
        /// <param name="config">The config.</param>
        /// <param name="appDataDir">使用默认路径时只需传入单个目录名（不以反斜杠结尾)，使用自定义路径时需传入完整路径（以反斜杠结尾，并确保有正确的读写权限！）.</param>
        /// <param name="appInstallDir">目前不需要传入（SDK可以自动获取）.</param>
        /// <returns><c>true</c> 成功, <c>false</c> 失败</returns>
        public static bool Init(string appDataDir, string appInstallDir = "", NimUtility.NimConfig config = null)
        {
            if (_sdkInitialized)
                return true;
           // CheckDependencyDll();
            string configJson = null;
            if (config != null && config.IsValiad())
                configJson = config.Serialize();
            return _sdkInitialized = ClientNativeMethods.nim_client_init(appDataDir, appInstallDir, configJson);
        }

        static void CheckDependencyDll()
        {
            var dependents = ConfigReader.GetDependentsInfo();
            if (dependents == null)
                return;
            var executeDir = System.Environment.CurrentDirectory;
            List<string> lostDll = new List<string>();
            foreach (var d in dependents)
            {
                string path = Path.Combine(executeDir, d.Name);
                if (File.Exists(path))
                {
                    CheckDependentVersion(path, d);
                    continue;
                }
                lostDll.Add(path);
            }
            if (lostDll.Count > 0)
            {
                string msg = "can't find dlls:";
                for (int i = 0; i < lostDll.Count; i++)
                {
                    msg += lostDll[i] + System.Environment.NewLine;
                    if (i < lostDll.Count - 1)
                        msg += ",  ";

                }
                throw new FileNotFoundException(msg);
            }
        }

        [Conditional("DEBUG")]
        static void CheckDependentVersion(string path,NativeDependentInfo info)
        {
            FileVersionInfo verInfo = FileVersionInfo.GetVersionInfo(path);
            if (verInfo.ProductVersion != info.Version)
            {
                throw new NimException.VersionUnmatchedException(path, info.Version);
            }
        }

        internal static void GuaranteeInitialized()
        {
            if (!_sdkInitialized)
                throw new NimException.SdkUninitializedException();
        }

        /// <summary>
        /// NIM SDK清理
        /// </summary>
        public static void Cleanup()
        {
            if (_sdkInitialized)
            {
                ClientNativeMethods.nim_client_cleanup(null);
                _sdkInitialized = false;
            }
        }

        /// <summary>
        /// NIM客户端登录
        /// </summary>
        /// <param name="appKey">The app key.</param>
        /// <param name="account">The account.</param>
        /// <param name="token">令牌 (在后台绑定的登录token).</param>
        /// <param name="handler">登录流程的回调函数</param>
        public static void Login(string appKey, string account, string token, LoginResultDelegate handler = null)
        {
            GuaranteeInitialized();
            if (!CheckLoginParams(appKey, account, token))
                return;
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            ClientNativeMethods.nim_client_login(appKey, account, token, null, LoginResultCallback, ptr);
        }

        static bool CheckLoginParams(string appkey, string account, string token)
        {
            if (string.IsNullOrEmpty(appkey) || string.IsNullOrEmpty(account) || string.IsNullOrEmpty(token))
                return false;
            return true;
        }

        /// <summary>
        /// NIM客户端手动重连（注意 APP需要统一处理自动重连/手动重连的回调，因为如果处于某次自动重连的过程中调用手动重连接口，不起作用！）   .
        /// </summary>
        /// <param name="jsonExtension"> json扩展参数（备用，目前不需要）.</param>
        public static void Relogin(string jsonExtension = null)
        {
            ClientNativeMethods.nim_client_relogin(jsonExtension);
        }

        /// <summary>
        /// NIM客户端注销/退出
        /// </summary>
        /// <param name="logoutType">Logout操作类型</param>
        /// <param name="delegate">注销/退出的回调函数.</param>
        public static void Logout(NIMLogoutType logoutType, LogoutResultDelegate @delegate)
        {
            IntPtr ptr = NimUtility.DelegateConverter.ConvertToIntPtr(@delegate);
            ClientNativeMethods.nim_client_logout(logoutType, null, LogoutResultCallback, ptr);
        }

        /// <summary>
        /// 将本帐号的其他端踢下线.通过注册RegKickOtherClientCb回调得到结果
        /// </summary>
        /// <param name="devices">设备标识</param>
        public static void KickOtherClients(NIMKickoutOtherDeviceInfo devices)
        {
            var json = devices.Serialize();
            ClientNativeMethods.nim_client_kick_other_client(json);
        }

        /// <summary>
        /// 注册NIM客户端自动重连回调。重连失败时，如果不是网络错误引起的（网络相关的错误号为kNIMResTimeoutError和kNIMResConnectionError），而是服务器返回了非kNIMResSuccess的错误号,
        /// 则说明重连的机制已经失效，需要APP层调用Logout执行注销操作并退回到登录界面后进行重新登录.
        /// </summary>
        /// <param name="jsonExtension">json扩展参数（备用，目前不需要）</param>
        /// <param name="handler">自动重连的回调函数
        /// 如果返回错误号kNIMResExist，说明无法继续重连，App层必须调用Logout退出到登录界面，以便用户重新进行登录.
        /// </param>
        public static void RegAutoReloginCb(LoginResultDelegate handler, string jsonExtension = null)
        {
            GuaranteeInitialized();
            IntPtr ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            ClientNativeMethods.nim_client_reg_auto_relogin_cb(jsonExtension, LoginResultCallback, ptr);
        }

        /// <summary>
        /// 注册NIM客户端被踢回调.
        /// </summary>
        /// <param name="handler">被踢回调</param>
        public static void RegKickoutCb(KickoutResultHandler handler)
        {
            GuaranteeInitialized();
            IntPtr ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            ClientNativeMethods.nim_client_reg_kickout_cb(null, BeKickedOfflineCallback, ptr);
        }

        /// <summary>
        ///  注册NIM客户端掉线回调.
        /// </summary>
        /// <param name="handler">掉线的回调函数.</param>
        public static void RegDisconnectedCb(Action handler)
        {
            GuaranteeInitialized();
            IntPtr ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            ClientNativeMethods.nim_client_reg_disconnect_cb(null, DisconnectedCallback, ptr);
        }

        /// <summary>
        /// 注册NIM客户端多点登录通知回调.
        /// </summary>
        /// <param name="handler">多点登录通知的回调函数.</param>
        public static void RegMultiSpotLoginNotifyCb(MultiSpotLoginNotifyResultHandler handler)
        {
            GuaranteeInitialized();
            IntPtr ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            ClientNativeMethods.nim_client_reg_multispot_login_notify_cb(null, MultiSpotLoginNotifyCallback, ptr);
        }

        /// <summary>
        /// 注册NIM客户端将本帐号的其他端踢下线结果回调.
        /// </summary>
        /// <param name="handler">操作结果的回调函数.</param>
        public static void RegKickOtherClientCb(KickOtherClientResultHandler handler)
        {
            GuaranteeInitialized();
            IntPtr ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            ClientNativeMethods.nim_client_reg_kickout_other_client_cb(null, KickOtherClientCb, ptr);
        }


        private static readonly NIMGlobal.JsonTransportCb LoginResultCallback = (jsonResult, ptr) =>
        {
            var loginResult = NIMLoginResult.Deserialize(jsonResult);
            ptr.Invoke<LoginResultDelegate>(loginResult);
            if (LoginResultHandler != null)
            {
                LoginResultHandler(null, new LoginResultEventArgs(loginResult));
            }
        };

        private static readonly NIMGlobal.JsonTransportCb LogoutResultCallback = (jsonResult, ptr) =>
        {
            var result = NIMLogoutResult.Deserialize(jsonResult);
            ptr.InvokeOnce<LogoutResultDelegate>(result);
        };

        private static readonly NIMGlobal.JsonTransportCb BeKickedOfflineCallback = (jsonResult, ptr) =>
        {
            var result = NIMKickoutResult.Deserialize(jsonResult);
            ptr.InvokeOnce<KickoutResultHandler>(result);
        };

        private static readonly NIMGlobal.JsonTransportCb DisconnectedCallback = (jsonResult, ptr) =>
        {
            ptr.Invoke<Action>();
        };

        private static readonly NIMGlobal.JsonTransportCb MultiSpotLoginNotifyCallback = (jsonResult, handler) =>
        {
            var result = NIMMultiSpotLoginNotifyResult.Deserialize(jsonResult);
            handler.Invoke<MultiSpotLoginNotifyResultHandler>(result);
        };

        private static readonly NIMGlobal.JsonTransportCb KickOtherClientCb = (jsonResult, handler) =>
        {
            var result = NIMKickOtherResult.Deserialize(jsonResult);
            handler.InvokeOnce<KickOtherClientResultHandler>(result);
        };
    }
}
