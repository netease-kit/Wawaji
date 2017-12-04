/** @file NIMTeamEvent.cs
  * @brief NIM SDK 群事件相关的定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace NIM.Team
{
    public class NIMTeamEvent:NimUtility.NimJsonObject<NIMTeamEvent>
    {
        [JsonIgnore]
        public ResponseCode ResponseCode { get; set; }

        [JsonIgnore]
        public string TeamId { get; set; }

        [JsonIgnore]
        public NIMNotificationType NotificationType { get; set; }

        [JsonProperty("ids")]
        public List<string> IdCollection { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("team_info")]
        public NIMTeamInfo TeamInfo { get; set; }

        [JsonProperty("team_member")]
        public NIMTeamMemberInfo MemberInfo { get; set; }

        [JsonProperty("name_cards")]
        public List<User.UserNameCard> OperatorNameCards { get; set; }
    }

    public class NIMTeamEventData : NimUtility.NimJsonObject<NIMTeamEventData>
    {
        [JsonProperty(PropertyName = "data", NullValueHandling = NullValueHandling.Ignore)]
        public NIMTeamEvent TeamEvent { get; set; }

        [JsonProperty("id")]
        public NIMNotificationType NotificationId { get; set; }
    }

    public class NIMTeamEventArgs : EventArgs
    {
        public NIMTeamEventData Data { get; set; }

        public NIMTeamEventArgs(NIMTeamEventData data)
        {
            Data = data;
        }
    }
}
