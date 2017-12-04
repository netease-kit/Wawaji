using System;
using System.Runtime.InteropServices;

namespace NIM.DataSync
{
    /// <summary>
    /// 数据同步回调
    /// </summary>
    /// <param name="syncType">数据同步类型</param>
    /// <param name="status">数据同步状态</param>
    /// <param name="jsonAttachment">输出的json字符串内容</param>
    /// <param name="userData">APP的自定义用户数据，SDK只负责传回给回调函数，不做任何处理！</param>
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    internal delegate void DataSyncCb(NIMDataSyncType syncType, NIMDataSyncStatus status, string jsonAttachment, IntPtr userData);
    internal static class DataSyncNativeMethods
    {
        //引用C中的方法（考虑到不同平台下的C接口引用方式差异，如[DllImport("__Internal")]，[DllImport("nimapi")]等） 
        #region NIM C SDK native methods

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_data_sync_reg_complete_cb", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        internal static extern void nim_data_sync_reg_complete_cb(DataSyncCb cb, IntPtr user_data);

        #endregion
    }
}
