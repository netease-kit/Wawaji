using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMLocationMsgInfo
    {
        [JsonProperty("title")]
        public string Description { get; set; }

        [JsonProperty("lat")]
        public double Latitude { get; set; }

        [JsonProperty("lng")]
        public double Longitude { get; set; }
    }
    public class NIMLocationMessage : NIMIMMessage
    {
        [JsonProperty(AttachmentPath)]
        public NIMLocationMsgInfo LocationInfo { get; set; }

        public NIMLocationMessage()
        {
            MessageType = NIMMessageType.kNIMMessageTypeLocation;
        }
    }
}
