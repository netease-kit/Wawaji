using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace NIMAudio
{ /// <summary>
  /// audio模块调用返回错误码
  /// </summary>
    public enum NIMAudioResCode
    {
        /// <summary>
        /// 成功
        /// </summary>
	    kNIMAudioSuccess = 200,
        /// <summary>
        /// 操作失败
        /// </summary>
        kNIMAudioFailed = 100,
        /// <summary>
        /// 未初始化或未成功初始化
        /// </summary>
        kNIMAudioUninitError = 101,
        /// <summary>
        /// 正在播放中，操作失败
        /// </summary>
        kNIMAudioClientPlaying = 102,
        /// <summary>
        /// 正在采集中，操作失败
        /// </summary>
        kNIMAudioClientCapturing = 103,
        /// <summary>
        /// 采集设备初始化失败（e.g. 找不到mic设备）
        /// </summary>
        kNIMAudioCaptureDeviceInitError = 104,
        /// <summary>
        /// 采集或播放对象或操作不存在
        /// </summary>
        kNIMAudioClientNotExist = 105,
        /// <summary>
        /// 线程出错退出，需要重新初始化语音模块
        /// </summary>
        kNIMAudioThreadError = 300,
    }

    /// <summary>
    /// 音频编码方式
    /// </summary>
    public enum NIMAudioType
    {
        /// <summary>
        /// 音频AAC编码
        /// </summary>
	    kNIMAudioAAC = 0,
        /// <summary>
        /// 音频AMR编码（暂不支持）
        /// </summary>
	    kNIMAudioAMR = 1,
    }
    public static class NIMAudio
    {
        /// <summary>
        /// The NIM Audio native DLL
        /// </summary>
#if DEBUG
        internal const string NIMAudioNativeDLL = "nim_audio_d.dll";
#else
        internal const string NIMAudioNativeDLL = "nim_audio.dll";
#endif

        /// <summary>
        /// 操作结果回调
        /// </summary>
        /// <param name="resCode">操作结果，一切正常200</param>
        /// <param name="filePath">播放文件绝对路径</param>
        /// <param name="callId">用以定位资源的一级ID，可选</param>
        /// <param name="resId">用以定位资源的二级ID，可选</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void ResCodeIdCb(int resCode,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string filePath,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string callId,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string resId);
    }

    class AudioNativeMethods
    {
        //引用C中的方法
#region NIM Audio C SDK native methods

        [DllImport(NIMAudio.NIMAudioNativeDLL, EntryPoint = "nim_audio_init_module", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_audio_init_module(
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string user_data_parent_path);

        [DllImport(NIMAudio.NIMAudioNativeDLL, EntryPoint = "nim_audio_uninit_module", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_audio_uninit_module();

        [DllImport(NIMAudio.NIMAudioNativeDLL, EntryPoint = "nim_audio_play_audio", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_audio_play_audio(
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string filePath,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string callerId,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))]string resId,
            int format);

        [DllImport(NIMAudio.NIMAudioNativeDLL, EntryPoint = "nim_audio_stop_play_audio", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_audio_stop_play_audio();

        [DllImport(NIMAudio.NIMAudioNativeDLL, EntryPoint = "nim_audio_reg_start_play_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_audio_reg_start_play_cb(NIMAudio.ResCodeIdCb cb);

        [DllImport(NIMAudio.NIMAudioNativeDLL, EntryPoint = "nim_audio_reg_stop_play_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_audio_reg_stop_play_cb(NIMAudio.ResCodeIdCb cb);
#endregion
    }
}
