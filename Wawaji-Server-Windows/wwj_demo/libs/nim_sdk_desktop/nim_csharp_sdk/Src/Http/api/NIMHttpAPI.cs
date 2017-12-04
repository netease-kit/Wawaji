/** @file NIMHttpDef.cs
  * @brief NIM HTTP提供的http传输相关接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using NIM;

namespace NIMHttp
{
    /// <summary>
    /// Http 访问接口
    /// </summary>
    public class HttpAPI
    {
        //引用C中的方法
        #region NIM Http C SDK native methods

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_init", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_http_init();

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_uninit", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_http_uninit();

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_post_request", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern int nim_http_post_request(IntPtr request_handle);

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_remove_request", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_http_remove_request(int request_id);

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_create_download_file_request", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_http_create_download_file_request([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string url, 
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string download_file_path,
            NimHttpDef.CompletedCb complete_cb, IntPtr user_data);

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_create_download_file_range_request", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_http_create_download_file_range_request([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string url, 
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string download_file_path,
            long range_start, NimHttpDef.CompletedCb complete_cb, IntPtr user_data);

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_create_request", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_http_create_request([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string url, 
            IntPtr post_body, int post_body_size, NimHttpDef.ResponseCb response_cb, IntPtr user_data);
        
        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_add_request_header", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_http_add_request_header(IntPtr request_handle,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string key,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string value);

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_set_request_progress_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_http_set_request_progress_cb(IntPtr request_handle, NimHttpDef.ProgressCb progress_cb, IntPtr user_data);

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_set_request_method_as_post", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_http_set_request_method_as_post(IntPtr request_handle);

        [DllImport(NimHttpDef.NIMHttpNativeDLL, EntryPoint = "nim_http_set_timeout", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_http_set_timeout(IntPtr request_handle, int timeout_ms);

        #endregion
        
        /// <summary>
        /// NIM HTTP 初始化
        /// </summary>
        public static void Init()
        {
            nim_http_init();
        }

        /// <summary>
        /// NIM HTTP 反初始化
        /// </summary>
        public static void UnInit()
        {
            nim_http_uninit();
        }
        
        /// <summary>
        /// 发起任务
        /// </summary>
        /// <param name="requestHandle">http任务句柄</param>
        /// <returns>任务id</returns>
        public static int PostRequest(IntPtr requestHandle)
        {
            return nim_http_post_request(requestHandle);
        }
        
        /// <summary>
        /// 取消任务
        /// </summary>
        /// <param name="httpRequestId">任务id</param>
        public static void RemoveRequest(int httpRequestId)
        {
            nim_http_remove_request(httpRequestId);
        }

        /// <summary>
        /// 创建下载文件任务
        /// </summary>
        /// <param name="url">资源地址</param>
        /// <param name="downloadFilePath">下载文件保存的本地路径</param>
        /// <param name="completeCb">结束回调</param>
        /// <param name="userData">自定义数据</param>
        /// <returns>http任务句柄</returns>
        public static IntPtr CreateDownloadFileRequest(string url, string downloadFilePath, NimHttpDef.CompletedCb completeCb, IntPtr userData)
        {
            return nim_http_create_download_file_request(url, downloadFilePath, completeCb, userData);
        }

        /// <summary>
        /// 创建下载文件任务，支持断点续传
        /// </summary>
        /// <param name="url">资源地址</param>
        /// <param name="downloadFilePath">下载文件保存的本地路径</param>
        /// <param name="rangeStart"></param>
        /// <param name="completeCb">结束回调</param>
        /// <param name="userData">自定义数据</param>
        /// <returns>http任务句柄</returns>
        public static IntPtr CreateDownloadFileRangeRequest(string url, string downloadFilePath, long rangeStart, NimHttpDef.CompletedCb completeCb, IntPtr userData)
        {
            return nim_http_create_download_file_range_request(url, downloadFilePath, rangeStart, completeCb, userData);
        }

        /// <summary>
        /// 创建任务
        /// </summary>
        /// <param name="url">资源地址</param>
        /// <param name="postBody">上传内容</param>
        /// <param name="postBodySize">上传内容大小</param>
        /// <param name="responseCb">结束回调，响应实体内容</param>
        /// <param name="userData">自定义数据</param>
        /// <returns>http任务句柄</returns>
        public static IntPtr CreateRequest(string url, IntPtr postBody, int postBodySize, NimHttpDef.ResponseCb responseCb, IntPtr userData)
        {
            return nim_http_create_request(url, postBody, postBodySize, responseCb, userData);
        }

        /// <summary>
        /// 添加header
        /// </summary>
        /// <param name="requestHandle">http任务句柄</param>
        /// <param name="key">头的key</param>
        /// <param name="value">头的value</param>
        public static void AddHeader(IntPtr requestHandle, string key, string value)
        {
            nim_http_add_request_header(requestHandle, key, value);
        }

        /// <summary>
        /// 设置进度回调
        /// </summary>
        /// <param name="requestHandle">http任务句柄</param>
        /// <param name="progressCb">进度回调函数</param>
        /// <param name="userData">自定义数据</param>
        public static void SetProgressCb(IntPtr requestHandle, NimHttpDef.ProgressCb progressCb, IntPtr userData)
        {
            nim_http_set_request_progress_cb(requestHandle, progressCb, userData);
        }
        
        /// <summary>
        /// 强制设置http请求方法为post
        /// </summary>
        /// <param name="requestHandle">http任务句柄</param>
        public static void SetRequestAsPost(IntPtr requestHandle)
        {
            nim_http_set_request_method_as_post(requestHandle);
        }
        
        /// <summary>
        /// 设置超时
        /// </summary>
        /// <param name="requestHandle">http任务句柄</param>
        /// <param name="timeoutMs">超时时间，单位是毫秒</param>
        public static void SetTimeout(IntPtr requestHandle, int timeoutMs)
        {
            nim_http_set_timeout(requestHandle, timeoutMs);
        }
    }
}
