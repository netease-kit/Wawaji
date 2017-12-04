/** @file NIMFriendDef.cs
  * @brief NIM SDK friend相关的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using Newtonsoft.Json;

namespace NIM
{
    namespace Friend
    {
        /// <summary>
        /// 好友类型
        /// </summary>
        public enum NIMFriendFlag
        {
            /// <summary>
            ///陌生人 
            /// </summary>
            kNIMFriendFlagNotFriend = 0,

            /// <summary>
            ///普通好友 
            /// </summary>
            kNIMFriendFlagNormal = 1,
        }

        /// <summary>
        /// 好友来源 
        /// </summary>
        public enum NIMFriendSource
        {
            /// <summary>
            /// 默认
            /// </summary>
            kNIMFriendSourceDefault = 0
        }

        /// <summary>
        /// 好友验证方式
        /// </summary>
        public enum NIMVerifyType
        {
            /// <summary>
            /// 直接加好友
            /// </summary>
            kNIMVerifyTypeAdd = 1,

            /// <summary>
            /// 请求加好友
            /// </summary>
            kNIMVerifyTypeAsk = 2,

            /// <summary>
            /// 同意
            /// </summary>
            kNIMVerifyTypeAgree = 3,

            /// <summary>
            /// 拒绝
            /// </summary>
            kNIMVerifyTypeReject = 4
        }

        /// <summary>
        /// 好友数据变化类型
        /// </summary>
        public enum NIMFriendChangeType
        {
            /// <summary>
            ///加好友/处理好友请求 
            /// </summary>
            kNIMFriendChangeTypeRequest = 1,

            /// <summary>
            ///删除好友 
            /// </summary>
            kNIMFriendChangeTypeDel = 2,

            /// <summary>
            /// 更新好友
            /// </summary>
            kNIMFriendChangeTypeUpdate = 3,

            /// <summary>
            /// 好友列表同步与更新
            /// </summary>
            kNIMFriendChangeTypeSyncList = 5
        }

        public class NIMFriendProfile : NimUtility.NimJsonObject<NIMFriendProfile>
        {
            /// <summary>
            ///用户账号 
            /// </summary>
            [JsonProperty("accid")]
            public string AccountId { get; set; }

            /// <summary>
            ///主动的好友关系 
            /// </summary>
            [JsonProperty(PropertyName = "flag")]
            public NIMFriendFlag? InitiativeRelationship { get; set; }

            /// <summary>
            ///被动的好友关系 
            /// </summary>
            [JsonProperty(PropertyName = "beflag")]
            public NIMFriendFlag? PassiveRelationship { get; set; }

            /// <summary>
            ///好友来源 
            /// </summary>
            [JsonProperty(PropertyName = "source")]
            public NIMFriendSource? Source { get; set; }

            /// <summary>
            ///好友别名 
            /// </summary>
            [JsonProperty(PropertyName = "alias")]
            public string Alias { get; set; }

            /// <summary>
            ///扩展数据 
            /// </summary>
            [JsonProperty(PropertyName = "bits")]
            public long? ExtensionalBits { get; set; }

            /// <summary>
            /// 扩展数据
            /// </summary>
            [JsonProperty(PropertyName = "ex")]
            public NimUtility.Json.JsonExtension ExtensionalData { get; set; }

            /// <summary>
            ///好友创建时间戳（毫秒） 
            /// </summary>
            [JsonProperty(PropertyName = "create_timetag")]
            private long? CreatedTimetag { get; set; }

            /// <summary>
            ///好友更新时间戳（毫秒） 
            /// </summary>
            [JsonProperty(PropertyName = "update_timetag")]
            private long? UpdatedTimetag { get; set; }

        }

        public class NIMFriends : NimUtility.NimJsonObject<NIMFriends>
        {
            [JsonProperty("list")]
            public NIMFriendProfile[] ProfileList { get; set; }
        }

        public class NIMFriendProfileChangedArgs : EventArgs
        {
            public INIMFriendChangedInfo ChangedInfo { get; private set; }

            public NIMFriendProfileChangedArgs(INIMFriendChangedInfo info)
            {
                ChangedInfo = info;
            }
        }
    }
}
