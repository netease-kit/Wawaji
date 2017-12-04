/** @file NIMTalkAPI.cs
  * @brief NIM SDK提供的talk接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;

namespace NIM
{
    public delegate void ReportUploadProgressDelegate(long uploadedSize, long totalSize);

    public delegate void ReceiveBatchMesaagesDelegate(List<NIMReceivedMessage> msgsList);
    public class TalkAPI
    {
        private static readonly IMReceiveMessageCallback ReceivedMessageCallback;
        private static readonly IMMessageArcCallback MessageArcCallback;
        private static readonly UploadFileCallback UploadFileProgressChanged;
        /// <summary>
        /// 接收消息事件通知
        /// </summary>
        public static EventHandler<NIMReceiveMessageEventArgs> OnReceiveMessageHandler { get; set; }
        public static EventHandler<MessageArcEventArgs> OnSendMessageCompleted { get; set; }

        static TalkAPI()
        {
            ReceivedMessageCallback = new IMReceiveMessageCallback(OnReceiveIMMessage);
            MessageArcCallback = new IMMessageArcCallback(OnReceiveMessageAck);
            UploadFileProgressChanged = new UploadFileCallback(OnUploadFileProgressChanged);
            TalkNativeMethods.nim_talk_reg_ack_cb("", MessageArcCallback, IntPtr.Zero);
            TalkNativeMethods.nim_talk_reg_receive_cb("", ReceivedMessageCallback, IntPtr.Zero);
        }

        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="message">消息对象</param>
        public static void SendMessage(NIMIMMessage message, ReportUploadProgressDelegate action = null)
        {
            System.Diagnostics.Debug.Assert(message != null && !string.IsNullOrEmpty(message.ReceiverID));
            var msg = message.Serialize();
            IntPtr ptr = IntPtr.Zero;
            if(action != null)
                ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            System.Diagnostics.Debug.WriteLine("send message:" + msg);
            TalkNativeMethods.nim_talk_send_msg(msg, null, UploadFileProgressChanged, ptr);
        }

        /// <summary>
        /// 取消发送消息,目前用于取消发送文件消息
        /// </summary>
        /// <param name="message">消息体</param>
        /// <param name="action">附件上传进度回调</param>
        public static void StopSendMessage(NIMIMMessage message, ReportUploadProgressDelegate action = null)
        {
            System.Diagnostics.Debug.Assert(message != null);
            var msg = message.Serialize();
            IntPtr ptr = IntPtr.Zero;
            if (action != null)
                ptr = NimUtility.DelegateConverter.ConvertToIntPtr(action);
            TalkNativeMethods.nim_talk_stop_send_msg(msg, null, UploadFileProgressChanged, ptr);
        }

        private static void OnUploadFileProgressChanged(long uploadedSize, long totalSize, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<ReportUploadProgressDelegate>(userData, uploadedSize, totalSize);
        }

        private static void OnReceiveMessageAck(string arcResult, IntPtr userData)
        {
            if (string.IsNullOrEmpty(arcResult))
                return;
            var arc = MessageAck.Deserialize(arcResult);
            if (OnSendMessageCompleted != null)
            {
                OnSendMessageCompleted(null, new MessageArcEventArgs(arc));
            }
        }

        static void OnReceiveIMMessage(string content, string jsonArcResult, IntPtr userData)
        {
            if (string.IsNullOrEmpty(content) || OnReceiveMessageHandler == null)
                return;
            System.Diagnostics.Debug.WriteLine("receive message:" + content);
            var obj = Newtonsoft.Json.Linq.JObject.Parse(content);
            NIMReceivedMessage msg = new NIMReceivedMessage();
            var resCode = obj.SelectToken(NIMReceivedMessage.ResCodePath);
            var feature = obj.SelectToken(NIMReceivedMessage.FeaturePath);
            var token = obj.SelectToken(NIMReceivedMessage.MessageContentPath);
            if (resCode != null)
                msg.ResponseCode = resCode.ToObject<ResponseCode>();
            if (feature != null)
                msg.Feature = feature.ToObject<NIMMessageFeature>();

            if (token != null && token.Type == Newtonsoft.Json.Linq.JTokenType.Object)
            {
                var contentObj = token.ToObject<Newtonsoft.Json.Linq.JObject>();
                var realMsg = MessageFactory.CreateMessage(contentObj);
                msg.MessageContent = realMsg;
                OnReceiveMessageHandler(null, new NIMReceiveMessageEventArgs(msg));
            }
        }

        /// <summary>
        /// 注册接收批量消息回调 （如果在注册了接收消息回调的同时也注册了该批量接口，当有批量消息时，会改走这个接口通知应用层，例如登录后接收到的离线消息等）
        /// </summary>
        /// <param name="cb"></param>
        public static void RegReceiveBatchMessagesCb(ReceiveBatchMesaagesDelegate cb)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            TalkNativeMethods.nim_talk_reg_receive_msgs_cb(null, OnReceivedBatchMessages, ptr);
        }

        private static readonly IMReceiveMessageCallback OnReceivedBatchMessages = (content, jsonArcResult, userData) =>
        {
            List<NIMReceivedMessage> msgs = null;
            if (!string.IsNullOrEmpty(content))
            {
                msgs = NimUtility.Json.JsonParser.Deserialize<List<NIMReceivedMessage>>(content);
            }
            NimUtility.DelegateConverter.InvokeOnce<ReceiveBatchMesaagesDelegate>(userData, msgs);
        };
    }
}
