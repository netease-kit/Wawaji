using System;
using System.Runtime.InteropServices;

namespace NIM
{
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    delegate void UploadFileCallback(long uploadedSize, long totalSize, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, IntPtr userData);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    delegate void IMMessageArcCallback([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonArcResult, IntPtr userData);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    delegate void IMReceiveMessageCallback([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string content,
                                                  [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonArcResult, IntPtr userData);
    class TalkNativeMethods
    {
        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_talk_send_msg", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_talk_send_msg([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonMsg, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, UploadFileCallback cb, IntPtr userData);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_talk_stop_send_msg", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_talk_stop_send_msg([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonMsg, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, UploadFileCallback cb, IntPtr userData);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_talk_reg_ack_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_talk_reg_ack_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, IMMessageArcCallback cb, IntPtr user_data);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_talk_reg_receive_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_talk_reg_receive_cb([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, IMReceiveMessageCallback cb, IntPtr user_data);
        
        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_talk_reg_receive_msgs_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        public static extern void nim_talk_reg_receive_msgs_cb(string json_extension, IMReceiveMessageCallback cb, IntPtr user_data);
    }
}
