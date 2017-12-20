using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace NIM
{
    static class DeviceNativeMethods
    {
        //引用C中的方法（考虑到不同平台下的C接口引用方式差异，如[DllImport("__Internal")]，[DllImport("nimapi")]等） 
        #region NIM C SDK native methods

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_enum_device_devpath", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_enum_device_devpath(NIMDeviceType type, 
           [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, 
            nim_vchat_enum_device_devpath_sync_cb_func cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_start_device", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_start_device(NIMDeviceType type,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string device_path, uint fps,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, 
            nim_vchat_start_device_cb_func cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_end_device", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_end_device(NIMDeviceType type,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_add_device_status_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_add_device_status_cb(NIMDeviceType type, nim_vchat_device_status_cb_func cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_remove_device_status_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_remove_device_status_cb(NIMDeviceType type);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_audio_data_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_set_audio_data_cb(bool capture,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, 
            nim_vchat_audio_data_cb_func cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_video_data_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_set_video_data_cb(bool capture,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension,
            nim_vchat_video_data_cb_func cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_audio_volumn", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_set_audio_volumn(byte volumn, bool capture);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_get_audio_volumn", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern byte nim_vchat_get_audio_volumn(bool capture);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_set_audio_input_auto_volumn", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_vchat_set_audio_input_auto_volumn(bool auto_volumn);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_get_audio_input_auto_volumn", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_vchat_get_audio_input_auto_volumn();

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_custom_audio_data", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_vchat_custom_audio_data(ulong time, IntPtr data, uint size,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_vchat_custom_video_data", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern bool nim_vchat_custom_video_data(ulong time, IntPtr data, uint size, uint width, uint height,
            [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension);

        #endregion
    }
}
