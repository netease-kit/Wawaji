using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace NIM
{
    internal static class MessageFactory
    {
        internal static NIMIMMessage CreateMessage(Newtonsoft.Json.Linq.JObject token)
        {
            if (!token.HasValues || token.Type != Newtonsoft.Json.Linq.JTokenType.Object)
                return null;
            var msgTypeToken = token.SelectToken(NIMIMMessage.MessageTypePath);
            if (msgTypeToken == null)
                throw new ArgumentException("message type must be seted:" + token.ToString(Formatting.None));
            var msgType = msgTypeToken.ToObject<NIMMessageType>();
            NIMIMMessage message = null;
            ConvertAttachStringToObject(token);
            switch (msgType)
            {
                case NIMMessageType.kNIMMessageTypeAudio:
                    message = token.ToObject<NIMAudioMessage>();
                    break;
                case NIMMessageType.kNIMMessageTypeFile:
                    message = token.ToObject<NIMFileMessage>();
                    break;
                case NIMMessageType.kNIMMessageTypeImage:
                    message = token.ToObject<NIMImageMessage>();
                    break;
                case NIMMessageType.kNIMMessageTypeLocation:
                    message = token.ToObject<NIMLocationMessage>();
                    break;
                case NIMMessageType.kNIMMessageTypeText:
                    message = token.ToObject<NIMTextMessage>();
                    break;
                case NIMMessageType.kNIMMessageTypeVideo:
                    message = token.ToObject<NIMVedioMessage>();
                    break;
                case NIMMessageType.kNIMMessageTypeNotification:
                    message = token.ToObject<NIMTeamNotificationMessage>();
                    break;
                case NIMMessageType.kNIMMessageTypeCustom:
                    message = token.ToObject<NIMCustomMessage<object>>();
                    break;
                default:
                    message = new NIMUnknownMessage();
                    ((NIMUnknownMessage) message).RawMessage = token.ToString(Formatting.None);
                    break;
            }
            return message;
        }

        internal static NIMIMMessage CreateMessage(string json)
        {
            var token = Newtonsoft.Json.Linq.JObject.Parse(json);
            return CreateMessage(token);
        }

        static void ConvertAttachStringToObject(Newtonsoft.Json.Linq.JObject token)
        {
            //处理"msg_attach"值，该json原始值是一个string，需要转换为json object
            var attachmentToken = token.SelectToken(NIMIMMessage.AttachmentPath);
            if (attachmentToken == null)
                return;

            if (attachmentToken.Type == Newtonsoft.Json.Linq.JTokenType.String)
            {
                var attachValue = attachmentToken.ToObject<string>();
                if (string.IsNullOrEmpty(attachValue))
                {
                    token.Remove(NIMIMMessage.AttachmentPath);
                    return;
                }
                var newAttachToken = Newtonsoft.Json.Linq.JToken.Parse(attachValue);
                attachmentToken.Replace(newAttachToken);
            }
            
        }

        //处理"msg_attach"值，发送消息的时候需要把json object 转换成string
        internal static void ConvertAttachObjectToString(Newtonsoft.Json.Linq.JToken token)
        {
            var attachmentToken = token.SelectToken(NIMIMMessage.AttachmentPath);
            if (attachmentToken == null)
                return;
            if (attachmentToken.Type == Newtonsoft.Json.Linq.JTokenType.Object)
            {
                var attachValue = attachmentToken.ToString(Formatting.None);
                attachmentToken.Replace(attachValue);
            }
        }
    }
}
