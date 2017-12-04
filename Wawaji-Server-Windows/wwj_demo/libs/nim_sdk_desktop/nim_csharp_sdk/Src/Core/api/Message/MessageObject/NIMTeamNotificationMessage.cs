using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMTeamNotification : NimUtility.NimJsonObject<NIMTeamNotification>
    {
        [JsonProperty("ids")]
        public List<string> IdCollection { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("tinfo")]
        public Team.NIMTeamInfo TeamInfo { get; set; }

        [JsonProperty("team_member")]
        public Team.NIMTeamMemberInfo MemberInfo { get; set; }
    }

    public class NotificationData
    {
        [JsonProperty("data")]
        public NIMTeamNotification Data { get; set; }

        [JsonProperty("id")]
        public Team.NIMNotificationType NotificationId { get; set; }
    }

    public class NIMTeamNotificationMessage : NIMIMMessage
    {
        [JsonProperty(AttachmentPath)]
        public NotificationData NotifyMsgData { get; set; }
    }
}
