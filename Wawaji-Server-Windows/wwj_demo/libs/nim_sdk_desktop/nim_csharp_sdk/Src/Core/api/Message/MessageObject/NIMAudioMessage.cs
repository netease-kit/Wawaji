using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMAudioAttachment : NIMMessageAttachment
    {

        [JsonProperty("dur")]
        public int Duration { get; set; }
    }

    public class NIMAudioMessage : NIMIMMessage
    {
        [JsonProperty(AttachmentPath)]
        public NIMAudioAttachment AudioAttachment { get; set; }

        public NIMAudioMessage()
        {
            MessageType = NIMMessageType.kNIMMessageTypeAudio;
        }
    }
}
