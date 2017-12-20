/** @file NIMGlobalAPI.cs
  * @brief NIM SDK提供的一些全局接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Runtime.InteropServices;

namespace NIM
{
    /// <summary>
    /// 代理类型
    /// </summary>
    public enum NIMProxyType
    {
        /// <summary>
        ///不使用代理 
        /// </summary>
        kNIMProxyNone = 0,

        /// <summary>
        ///HTTP 1.1 Proxy（暂不支持） 
        /// </summary>
        kNIMProxyHttp11 = 1,

        /// <summary>
        ///Socks4 
        /// </summary>
        kNIMProxySocks4 = 4,

        /// <summary>
        ///Socks4a 
        /// </summary>
        kNIMProxySocks4a = 5,

        /// <summary>
        ///Socks5 
        /// </summary>
        kNIMProxySocks5 = 6,
    }

    public class GlobalAPI
    {
        #region NIM C SDK native methods

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_global_free_str_buf", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_global_free_str_buf(IntPtr str);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_global_free_buf", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_global_free_buf(IntPtr data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_global_set_proxy", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_global_set_proxy(NIMProxyType type,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string host, 
            int port,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string user,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string password);

        #endregion

        /// <summary>
        /// 释放SDK内部分配的内存
        /// </summary>
        /// <param name="str">由SDK内部分配内存的字符串</param>
        public static void FreeStringBuffer(IntPtr str)
        {
            nim_global_free_str_buf(str);            
        }

        /// <summary>
        /// 释放SDK内部分配的内存
        /// </summary>
        /// <param name="data">由SDK内部分配的内存</param>
        public static void FreeBuffer(IntPtr data)
        {
            nim_global_free_buf(data);
        }

        /// <summary>
        /// 设置SDK统一的网络代理。不需要代理时，type设置为kNIMProxyNone，其余参数都传空字符串（端口设为0）。有些代理不需要用户名和密码，相应参数也传空字符串
        /// </summary>
        /// <param name="type"></param>
        /// <param name="host"></param>
        /// <param name="port"></param>
        /// <param name="user"></param>
        /// <param name="password"></param>
        public static void SetProxy(NIMProxyType type, string host, int port, string user, string password)
        {
            nim_global_set_proxy(type, host, port, user, password);
        }
    }
}
