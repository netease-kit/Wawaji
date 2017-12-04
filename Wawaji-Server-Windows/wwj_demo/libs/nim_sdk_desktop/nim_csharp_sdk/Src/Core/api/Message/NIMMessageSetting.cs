/** @file NIMMessageSetting.cs
  * @brief NIM SDK 消息属性设置的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System.ComponentModel;

namespace NIM
{
    public class NIMMessageSetting:NimUtility.NimJsonObject<NIMMessageSetting>
    {
        /// <summary>
        /// 该消息是否存储云端历史
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus ServerSaveHistory { get; set; }

        /// <summary>
        /// 该消息是否支持漫游
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus Roaming { get; set; }

        /// <summary>
        /// 该消息是否支持发送者多端同步
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus MultiSync { get; set; }

        /// <summary>
        /// 消息是否要存离线
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus OfflineStorage { get; set; }

        /// <summary>
        /// 该消息是否在接收方被静音处理
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus BeMuted { get; set; }

        /// <summary>
        /// 是否需要推送
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus NeedPush { get; set; }

        /// <summary>
        /// 是否要做消息计数
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus NeedCounting { get; set; }

        /// <summary>
        /// 需要推送昵称
        /// </summary>
        [DefaultValue(NIMMessageSettingStatus.kNIMMessageStatusUndefine)]
        public NIMMessageSettingStatus NeedPushNick { get; set; }
    }
}
