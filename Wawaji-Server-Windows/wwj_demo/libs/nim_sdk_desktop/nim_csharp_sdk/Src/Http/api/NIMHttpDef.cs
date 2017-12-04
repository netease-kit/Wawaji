/** @file NimHttpDef.cs
  * @brief NIM HTTP提供的http传输相关的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;

namespace NIMHttp
{
    /// <summary>
    /// http 模块回调与参数定义
    /// </summary>
    public class NimHttpDef
    {
        /// <summary>
        /// The NIM Http native DLL
        /// </summary>
#if DEBUG
        public const string NIMHttpNativeDLL = "nim_tools_http_d.dll";
#else
        public const string NIMHttpNativeDLL = "nim_tools_http.dll";
#endif

        /// <summary>
        /// http传输结果回调
        /// </summary>
        /// <param name="userData">回传的自定义数据</param>
        /// <param name="result">传输结果，true代表传输成功，false代表传输失败</param>
        /// <param name="responseCode">http响应码</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void CompletedCb(IntPtr userData, bool result, int responseCode);
        
        /// <summary>
        /// http请求结果回调
        /// </summary>
        /// <param name="userData">回传的自定义数据</param>
        /// <param name="result">传输结果，true代表传输成功，false代表传输失败</param>
        /// <param name="responseCode">http响应码</param>
        /// <param name="responseContent">http响应实体内容</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void ResponseCb(IntPtr userData, bool result, int responseCode, string responseContent);

        /// <summary>
        /// http传输进度回调
        /// </summary>
        /// <param name="userData">回传的自定义数据</param>
        /// <param name="uploadedSize">已经上传的字节数</param>
        /// <param name="totalUploadSize">总的待上传的字节数</param>
        /// <param name="downloadedSize">已经下载的字节数</param>
        /// <param name="totalDownloadSize">总的待下载的字节数</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void ProgressCb(IntPtr userData, long uploadedSize, long totalUploadSize, long downloadedSize, long totalDownloadSize);
        
    }
}
