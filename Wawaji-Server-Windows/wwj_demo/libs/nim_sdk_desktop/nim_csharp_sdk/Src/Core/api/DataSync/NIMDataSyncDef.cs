/** @file NIMDataSyncDef.cs
  * @brief data sync define
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */


namespace NIM.DataSync
{
    /// <summary>
    /// 数据同步类型
    /// </summary>
    public enum NIMDataSyncType
    {
        /// <summary>
        /// 所有群的信息同步
        /// </summary>
	    kNIMDataSyncTypeTeamInfo		= 3,		
        /// <summary>
        /// 群成员列表同步
        /// </summary>
	    kNIMDataSyncTypeTeamUserList	= 1000,		
    };

    /// <summary>
    /// 数据同步状态
    /// </summary>
    public enum NIMDataSyncStatus
    {
        /// <summary>
        /// 同步完成
        /// </summary>
	    kNIMDataSyncStatusComplete = 1,		
    };
}
