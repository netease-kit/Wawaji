using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMTextMessage : NIMIMMessage
    {
        [JsonProperty(MessageBodyPath)]
        public string TextContent { get; set; }

        public NIMTextMessage()
        {
            MessageType = NIMMessageType.kNIMMessageTypeText;
        }
    }
}
