using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMCustomMessage<T> : NIMIMMessage
    {
        [JsonProperty(AttachmentPath)]
        public virtual T CustomContent { get; set; }

        [JsonProperty(MessageBodyPath)]
        public string Extention { get; set; }

        public NIMCustomMessage()
        {
            MessageType = NIMMessageType.kNIMMessageTypeCustom;
        }
    }
}
