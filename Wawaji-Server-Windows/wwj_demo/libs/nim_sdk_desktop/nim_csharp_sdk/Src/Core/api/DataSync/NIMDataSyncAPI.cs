/** @file NIMDataSyncAPI.cs
  * @brief NIM SDK提供的数据同步相关接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */


namespace NIM.DataSync
{
    public delegate void DataSyncDelegate(NIMDataSyncType syncType, NIMDataSyncStatus status, string jsonAttachment);
    public class DataSyncAPI
    {
        /// <summary>
        /// 注册数据同步完成的回调函数   
        /// </summary>
        /// <param name="cb">数据同步完成的回调函数</param>
        public static void RegCompleteCb(DataSyncDelegate cb)
        {
            var userData = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            DataSyncNativeMethods.nim_data_sync_reg_complete_cb(OnDataSyncCompleted, userData);
        }

        private static readonly DataSyncCb OnDataSyncCompleted = (syncType, status, jsonAttachment, ptr) =>
        {
            NimUtility.DelegateConverter.InvokeOnce<DataSyncDelegate>(ptr, syncType, status, jsonAttachment);
        };
    }
}
