/** @file NIMNosAPI.cs
  * @brief NIM SDK提供的NOS云存储服务接口 
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Runtime.InteropServices;

namespace NIM.Nos
{
    /// <summary>
    /// 下载结果回调
    /// </summary>
    /// <param name="rescode">下载结果，一切正常200</param>
    /// <param name="filePath">下载资源文件本地绝对路径</param>
    /// <param name="callId">如果下载的是消息中的资源，则为消息所属的会话id，否则为空</param>
    /// <param name="resId">如果下载的是消息中的资源，则为消息id，否则为空</param>
    public delegate void DownloadResultHandler(int rescode, string filePath, string callId, string resId);

    /// <summary>
    /// 上传结果回调
    /// </summary>
    /// <param name="rescode">上传结果，一切正常200</param>
    /// <param name="url">url地址</param>
    public delegate void UploadResultHandler(int rescode, string url);

    /// <summary>
    /// 传输进度回调
    /// </summary>
    /// <param name="curSize">已传输数据大小</param>
    /// <param name="fileSize">文件大小</param>
    public delegate void ProgressResultHandler(long curSize, long fileSize);

    public class NosAPI
    {
        /// <summary>
        /// 注册下载回调，通过注册回调获得http下载结果通知，刷新资源
        /// </summary>
        /// <param name="handler">下载的结果回调</param>
        public static void RegDownloadCb(DownloadResultHandler handler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(handler);
            NosNativeMethods.nim_nos_reg_download_cb(DownloadCb, ptr);
        }

        /// <summary>
        /// 获取资源
        /// </summary>
        /// <param name="msg">消息体,NIMVedioMessage NIMAudioMessage NIMFileMessage等带msg_attach属性的有下载信息的消息</param>
        /// <param name="resHandler">下载的结果回调</param>
        /// <param name="prgHandler">下载进度的回调</param>
        public static void DownloadMedia(NIMIMMessage msg, DownloadResultHandler resHandler, ProgressResultHandler prgHandler)
        {
            var ptr1 = NimUtility.DelegateConverter.ConvertToIntPtr(resHandler);
            var ptr2 = NimUtility.DelegateConverter.ConvertToIntPtr(prgHandler);
            var msgJson = msg.Serialize();
            NosNativeMethods.nim_nos_download_media(msgJson, DownloadCb, ptr1, DownloadPrgCb, ptr2);
        }

        /// <summary>
        /// 停止获取资源（目前仅对文件消息类型有效）
        /// </summary>
        /// <param name="msg">消息体</param>
        public static void StopDownloadMedia(NIMIMMessage msg)
        {
            var msgJson = msg.Serialize();
            NosNativeMethods.nim_nos_stop_download_media(msgJson);
        }

        /// <summary>
        /// 上传资源
        /// </summary>
        /// <param name="localFile">本地文件的完整路径</param>
        /// <param name="resHandler">上传的结果回调</param>
        /// <param name="prgHandler">上传进度的回调</param>
        public static void Upload(string localFile, UploadResultHandler resHandler, ProgressResultHandler prgHandler)
        {
            var ptr1 = NimUtility.DelegateConverter.ConvertToIntPtr(resHandler);
            var ptr2 = NimUtility.DelegateConverter.ConvertToIntPtr(prgHandler);
            NosNativeMethods.nim_nos_upload(localFile, UploadCb, ptr1, UploadPrgCb, ptr2);
        }

        /// <summary>
        /// 下载资源
        /// </summary>
        /// <param name="nosUrl">下载资源的URL</param>
        /// <param name="resHandler">下载的结果回调</param>
        /// <param name="prgHandler">下载进度的回调</param>
        public static void Download(string nosUrl, DownloadResultHandler resHandler, ProgressResultHandler prgHandler)
        {
            var ptr1 = NimUtility.DelegateConverter.ConvertToIntPtr(resHandler);
            var ptr2 = NimUtility.DelegateConverter.ConvertToIntPtr(prgHandler);
            NosNativeMethods.nim_nos_download(nosUrl, DownloadCb, ptr1, DownloadPrgCb, ptr2);
        }

        static readonly DownloadCb DownloadCb = new DownloadCb(DownloadCallback);
        private static void DownloadCallback(int rescode, string filePath, string callId, string resId, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.InvokeOnce<DownloadResultHandler>(userData, rescode, filePath, callId, resId);
        }

        static readonly DownloadPrgCb DownloadPrgCb = new DownloadPrgCb(DownloadProgressCallback);
        private static void DownloadProgressCallback(long curSize, long fileSize, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<ProgressResultHandler>(userData, curSize, fileSize);
        }

        static readonly UploadCb UploadCb = new UploadCb(UploadCallback);
        private static void UploadCallback(int rescode, string url, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.InvokeOnce<UploadResultHandler>(userData, rescode, url);
        }

        static readonly UploadPrgCb UploadPrgCb = new UploadPrgCb(UploadProgressCallback);
        private static void UploadProgressCallback(long curSize, long fileSize, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<ProgressResultHandler>(userData, curSize, fileSize);
        }
    }
}
