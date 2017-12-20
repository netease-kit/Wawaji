using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMFileMessage : NIMIMMessage
    {
        [JsonProperty(AttachmentPath)]
        public NIMMessageAttachment FileAttachment { get; set; }

        public NIMFileMessage()
        {
            MessageType = NIMMessageType.kNIMMessageTypeFile;
        }
    }
}
