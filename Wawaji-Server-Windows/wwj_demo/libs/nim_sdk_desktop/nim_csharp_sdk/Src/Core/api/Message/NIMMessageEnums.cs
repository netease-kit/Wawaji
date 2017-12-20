/** @file NIMMessageEnums.cs
  * @brief NIM SDK 消息类型、属性相关的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */


namespace NIM
{
    public enum NIMMessageType
    {
        /// <summary>
        /// 文本类型消息
        /// </summary>
        kNIMMessageTypeText = 0,

        /// <summary>
        /// 图片类型消息
        /// </summary>
        kNIMMessageTypeImage = 1,

        /// <summary>
        /// 声音类型消息
        /// </summary>
        kNIMMessageTypeAudio = 2,

        /// <summary>
        /// 视频类型消息
        /// </summary>
        kNIMMessageTypeVideo = 3,

        /// <summary>
        /// 位置类型消息
        /// </summary>
        kNIMMessageTypeLocation = 4,

        /// <summary>
        /// 系统类型通知（包括入群出群通知等） NIMNotificationId
        /// </summary>
        kNIMMessageTypeNotification = 5,

        /// <summary>
        /// 文件类型消息
        /// </summary>
        kNIMMessageTypeFile = 6,

        /// <summary>
        /// 提醒类型消息,Tip内容根据格式要求填入消息结构中的kNIMMsgKeyServerExt字段
        /// </summary>
        kNIMMessageTypeTips = 10,

        /// <summary>
        /// 自定义消息
        /// </summary>
        kNIMMessageTypeCustom = 100,

        /// <summary>
        /// 未知类型消息，作为默认值
        /// </summary>
        kNIMMessageTypeUnknown = 1000
    }

    public enum NIMMessageFeature
    {
        /// <summary>
        /// 默认
        /// </summary>
        kNIMMessageFeatureDefault = 0,

        /// <summary>
        /// 离线消息
        /// </summary>
        kNIMMessageFeatureLeaveMsg = 1,

        /// <summary>
        /// 漫游消息
        /// </summary>
        kNIMMessageFeatureRoamMsg = 2,

        /// <summary>
        /// 同步消息
        /// </summary>
        kNIMMessageFeatureSyncMsg = 3,

        /// <summary>
        /// 透传消息
        /// </summary>
        kNIMMessageFeatureCustomizedMsg = 4
    }

    public enum NIMMessageSettingStatus
    {
        kNIMMessageStatusUndefine = -1,
        kNIMMessageStatusNotSet = 0,
        kNIMMessageStatusSetted = 1
    }
}
