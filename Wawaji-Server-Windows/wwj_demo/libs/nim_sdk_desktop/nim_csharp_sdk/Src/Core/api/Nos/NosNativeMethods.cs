using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace NIM.Nos
{
    /// <summary>
    /// 下载结果回调
    /// </summary>
    /// <param name="rescode">下载结果，一切正常200</param>
    /// <param name="file_path">下载资源文件本地绝对路径</param>
    /// <param name="call_id">如果下载的是消息中的资源，则为消息所属的会话id，否则为空</param>
    /// <param name="res_id">如果下载的是消息中的资源，则为消息id，否则为空</param>
    /// <param name="json_extension">json扩展数据（备用）</param>
    /// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数，不做任何处理！</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void DownloadCb(int rescode,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string file_path,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string call_id,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string res_id,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension,
        IntPtr user_data);

    /// <summary>
    /// 下载进度回调
    /// </summary>
    /// <param name="downloaded_size">已下载数据大小</param>
    /// <param name="file_size">文件大小</param>
    /// <param name="json_extension">json扩展数据（备用）</param>
    /// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数，不做任何处理！</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void DownloadPrgCb(long downloaded_size, long file_size,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension,
        IntPtr user_data);

    /// <summary>
    /// 上传结果回调
    /// </summary>
    /// <param name="rescode">上传结果，一切正常200</param>
    /// <param name="url">url地址</param>
    /// <param name="json_extension">json扩展数据（备用）</param>
    /// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数，不做任何处理！</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void UploadCb(int rescode,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string url,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension,
        IntPtr user_data);

    /// <summary>
    /// 上传进度回调
    /// </summary>
    /// <param name="uploaded_size">已上传数据大小</param>
    /// <param name="file_size">文件大小</param>
    /// <param name="json_extension">json扩展数据（备用）</param>
    /// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数，不做任何处理！</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void UploadPrgCb(long uploaded_size, long file_size,
        [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_extension,
        IntPtr user_data);

    internal static class NosNativeMethods
    {
        //引用C中的方法（考虑到不同平台下的C接口引用方式差异，如[DllImport("__Internal")]，[DllImport("nimapi")]等） 
        #region NIM C SDK native methods

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_nos_reg_download_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_nos_reg_download_cb(DownloadCb cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_nos_download_media", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_nos_download_media([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_msg,
            DownloadCb res_cb, IntPtr res_user_data, DownloadPrgCb prg_cb, IntPtr prg_user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_nos_stop_download_media", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_nos_stop_download_media([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string json_msg);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_nos_upload", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_nos_upload([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string local_file,
            UploadCb res_cb, IntPtr res_user_data, UploadPrgCb prg_cb, IntPtr prg_user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_nos_download", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_nos_download([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string nos_url,
            DownloadCb res_cb, IntPtr res_user_data, DownloadPrgCb prg_cb, IntPtr prg_user_data);

        #endregion
    }
}
