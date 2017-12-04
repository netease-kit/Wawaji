using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace NIM
{
    public class NIMImageAttachment : NIMMessageAttachment
    {
        /// <summary>
        /// 图片宽度
        /// </summary>
        [JsonProperty("w")]
        public int Width { get; set; }

        /// <summary>
        /// 图片高度
        /// </summary>
        [JsonProperty("h")]
        public int Height { get; set; }
    }

    public class NIMImageMessage : NIMIMMessage
    {
        [JsonProperty(AttachmentPath)]
        public NIMImageAttachment ImageAttachment { get; set; }

        public NIMImageMessage()
        {
            MessageType = NIMMessageType.kNIMMessageTypeImage;
        }
    }
}
