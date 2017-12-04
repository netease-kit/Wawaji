using System;
using System.Runtime.InteropServices;

namespace NIM
{
    namespace Friend.Delegate
    {
        [UnmanagedFunctionPointer( CallingConvention.Cdecl)]
        internal delegate void GetFriendsListDelegate( int resCode, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string friendListJson, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, IntPtr userData);

        [UnmanagedFunctionPointer( CallingConvention.Cdecl)]
        internal delegate void FriendInfoChangedDelegate( NIMFriendChangeType type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string resultJson, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, IntPtr userData);

        [UnmanagedFunctionPointer( CallingConvention.Cdecl)]
        public delegate void FriendOperationDelegate( int resCode, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, IntPtr userData);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void GetFriendProfileDelegate([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string accid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string profileJson, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string jsonExtension, IntPtr userData);

        public delegate void GetFriendsListResultDelegate(NIMFriends friends);

        public delegate void GetFriendProfileResultDelegate(string accountId, NIMFriendProfile profile);
    }

    namespace Friend
    {
        class FriendNativeMethods
        {
            [DllImport( NIMGlobal.NIMNativeDLL, EntryPoint = "nim_friend_reg_changed_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention .Cdecl)]
            public static extern void nim_friend_reg_changed_cb ([MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, Friend.Delegate.FriendInfoChangedDelegate cb, IntPtr user_data);

            [DllImport( NIMGlobal.NIMNativeDLL, EntryPoint = "nim_friend_get_profile", CharSet = CharSet.Ansi, CallingConvention = CallingConvention .Cdecl)]
            public static extern void nim_friend_get_profile( [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string accid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, Friend.Delegate.GetFriendProfileDelegate cb, IntPtr userData);

            [DllImport( NIMGlobal.NIMNativeDLL, EntryPoint = "nim_friend_get_list", CharSet = CharSet.Ansi, CallingConvention = CallingConvention .Cdecl)]
            public static extern void nim_friend_get_list( [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, [MarshalAs(UnmanagedType.FunctionPtr)]Friend.Delegate.GetFriendsListDelegate cb, IntPtr user_data);

            [DllImport( NIMGlobal.NIMNativeDLL, EntryPoint = "nim_friend_request", CharSet = CharSet.Ansi, CallingConvention = CallingConvention .Cdecl)]
            public static extern void nim_friend_request( [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string accid, NIMVerifyType verify_type, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string msg, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, Friend.Delegate.FriendOperationDelegate cb, IntPtr user_data);

            [DllImport( NIMGlobal.NIMNativeDLL, EntryPoint = "nim_friend_delete", CharSet = CharSet.Ansi, CallingConvention = CallingConvention .Cdecl)]
            public static extern void nim_friend_delete( [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string accid, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, Friend.Delegate.FriendOperationDelegate cb, IntPtr user_data);

            [DllImport( NIMGlobal.NIMNativeDLL, EntryPoint = "nim_friend_update", CharSet = CharSet.Ansi, CallingConvention = CallingConvention .Cdecl)]
            public static extern void nim_friend_update( [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string friend_json, [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, Friend.Delegate.FriendOperationDelegate cb, IntPtr user_data);
        }
    }
}
