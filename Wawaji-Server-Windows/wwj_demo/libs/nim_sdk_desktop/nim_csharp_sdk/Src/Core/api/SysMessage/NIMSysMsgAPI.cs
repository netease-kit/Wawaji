/** @file NIMSysMsgAPI.cs
  * @brief NIM SDK提供的系统消息历史接口 
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using NIM.SysMessage.Delegate;

namespace NIM.SysMessage
{
    public delegate void ReceiveSysMsgResult(NIMSysMessag msg);

    public delegate void SendSysMsgResult(MessageAck arc);

    public delegate void QuerySysMsgResult(NIMSysMsgQueryResult result);

    public delegate void CommomOperateResult(ResponseCode response,int count);

    public class SysMsgAPI
    {
        public static EventHandler<MessageArcEventArgs> SendSysMsgHandler;
        public static EventHandler<NIMSysMsgEventArgs> ReceiveSysMsgHandler;

        static SysMsgAPI()
        {
            SysMsgNativeMethods.nim_sysmsg_reg_custom_notification_ack_cb(null, OnSendMsgCompleted, IntPtr.Zero);
            SysMsgNativeMethods.nim_sysmsg_reg_sysmsg_cb(null, OnReceivingSysMsgDelegate, IntPtr.Zero);
        }

        private static readonly ReceiveSysMsgDelegate OnReceivingSysMsgDelegate = (result, ptr) =>
        {
            if (ReceiveSysMsgHandler != null)
            {
                NIMSysMsgEventArgs args = null;
                if (!string.IsNullOrEmpty(result))
                {
                    var msg = NIMSysMessag.Deserialize(result);
                    args = new NIMSysMsgEventArgs(msg);
                }
                ReceiveSysMsgHandler(null, args);
            }
        };

        private static readonly CustomSysMsgArcDelegate OnSendMsgCompleted = (result, ptr) =>
        {
            if (SendSysMsgHandler != null)
            {
                MessageArcEventArgs args = null;
                if (!string.IsNullOrEmpty(result))
                {
                    var msg = MessageAck.Deserialize(result);
                    args = new MessageArcEventArgs(msg);
                }
                SendSysMsgHandler(null, args);
            }
        };

        public static void SendCustomMessage(NIMSysMessageContent content)
        {
            if (string.IsNullOrEmpty(content.ClientMsgId))
                content.GenerateMsgId();
            var jsonMsg = content.Serialize();
            SysMsgNativeMethods.nim_sysmsg_send_custom_notification(jsonMsg, null);
        }

        private static readonly QuerySysMsgDelegate OnQuerySysMsgCompleted = (count, result, je, ptr) =>
        {
            if (ptr != IntPtr.Zero)
            {
                var msgs = NIMSysMsgQueryResult.Deserialize(result);
                if (msgs != null)
                    msgs.Count = count;
                NimUtility.DelegateConverter.Invoke<QuerySysMsgResult>(ptr, msgs);
            }
        };

        public static void QueryMessage(int limit,long lastTimetag, QuerySysMsgResult cb)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            SysMsgNativeMethods.nim_sysmsg_query_msg_async(limit, lastTimetag,null, OnQuerySysMsgCompleted, ptr);
        }


        private static readonly OperateSysMsgDelegate OnQueryUnreadCompleted = (res, count, je, ptr) =>
        {
            NimUtility.DelegateConverter.InvokeOnce<CommomOperateResult>(ptr, res, count);
        };

        public static void QueryUnreadCount(CommomOperateResult cb)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            SysMsgNativeMethods.nim_sysmsg_query_unread_count(null, OnQueryUnreadCompleted, ptr);
        }

        public static void SetMsgStatus(long msgId,NIMSysMsgStatus status, OperateSysMsgExternDelegate cb)
        {
            SysMsgNativeMethods.nim_sysmsg_set_status_async(msgId, status, null, cb, IntPtr.Zero);
        }

        public static void SetAllMsgRead(OperateSysMsgDelegate cb)
        {
            SysMsgNativeMethods.nim_sysmsg_read_all_async(null, cb, IntPtr.Zero);
        }

        public static void DeleteByMsgId(long msgId, OperateSysMsgExternDelegate cb)
        {
            SysMsgNativeMethods.nim_sysmsg_delete_async(msgId, null, cb, IntPtr.Zero);
        }

        public static void DeleteAll(OperateSysMsgDelegate cb)
        {
            SysMsgNativeMethods.nim_sysmsg_delete_all_async(null, cb, IntPtr.Zero);
        }

        public static void SetMsgStatusByType(NIMSysMsgType type,NIMSysMsgStatus status, OperateSysMsgDelegate cb)
        {
            SysMsgNativeMethods.nim_sysmsg_set_logs_status_by_type_async(type, status, null, cb, IntPtr.Zero);
        }

        public static void DeleteMsgByType(NIMSysMsgType type,OperateSysMsgDelegate cb)
        {
            SysMsgNativeMethods.nim_sysmsg_delete_logs_by_type_async(type, null, cb, IntPtr.Zero);
        }
    }
}
