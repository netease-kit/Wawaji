using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NIM
{
    public class NIMUnknownMessage : NIMIMMessage
    {
        public string RawMessage { get; set; }

        public NIMUnknownMessage()
        {
            MessageType = NIMMessageType.kNIMMessageTypeUnknown;
        }
    }
}
