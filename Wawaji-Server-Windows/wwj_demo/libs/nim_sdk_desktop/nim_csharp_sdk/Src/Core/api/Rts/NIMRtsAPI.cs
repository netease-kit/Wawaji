/** @file NIMRtsAPI.cs
  * @brief NIM RTS提供的实时会话（数据通道）相关接口，如果需要用到音视频功能请使用NIMDeviceAPI.cs中相关接口，并调用NIM.VChatAPI.Init初始化
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Runtime.InteropServices;
using NIM.NIMRts;

namespace NIM
{
    public class RtsAPI
    {
        /// <summary>
        /// 创建rts会话
        /// </summary>
        /// <param name="channelType">通道类型 如要tcp+音视频，则channel_type=kNIMRtsChannelTypeTcp|kNIMRtsChannelTypeVchat，同时整个SDK只允许一个音视频通道存在（包括vchat）</param>
        /// <param name="uid">对方帐号</param>
        /// <param name="info">发起扩展参数</param>
        /// <param name="startResHandler">结果回调</param>
        public static void Start(NIMRtsChannelType channelType, string uid, NIMRts.RtsStartInfo info, NIMRts.StartResHandler startResHandler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(startResHandler);
            var json = info.Serialize();
            NIMRts.RtsNativeMethods.nim_rts_start((int)channelType, uid, json, StartResCb, ptr);
        }
        private static readonly NIMRts.NimRtsStartCbFunc StartResCb = new NIMRts.NimRtsStartCbFunc(StartResCallback);
        private static void StartResCallback(int code, string sessionId, int channelType, string uid, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.InvokeOnce<NIMRts.StartResHandler>(userData, code, sessionId, channelType, uid);
        }

        /// <summary>
        /// 回复收到的邀请
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型,暂时无效</param>
        /// <param name="accept">是否接受</param>
        /// <param name="info">接受时的发起信息扩展参数</param>
        /// <param name="ackResHandler">结果回调</param>
        public static void Ack(string sessionId, NIMRtsChannelType channelType, bool accept, NIMRts.RtsStartInfo info, NIMRts.AckResHandler ackResHandler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(ackResHandler);
            var json =info == null ? null: info.Serialize();
            NIMRts.RtsNativeMethods.nim_rts_ack(sessionId, (int)channelType, accept, json, AckResCb, ptr);
        }
        private static readonly NIMRts.NimRtsAckResCbFunc AckResCb = new NIMRts.NimRtsAckResCbFunc(AckResCallback);
        private static void AckResCallback(int code, string sessionId, int channelType, bool accept, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.AckResHandler>(userData, code, sessionId, channelType, accept);
        }

        /// <summary>
        /// 会话控制（透传）
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="info">透传内容</param>
        /// <param name="controlResHandler">结果回调</param>
        public static void Control(string sessionId, string info, NIMRts.ControlResHandler controlResHandler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(controlResHandler);
            NIMRts.RtsNativeMethods.nim_rts_control(sessionId, info, "", ControlResCb, ptr);
        }
        private static readonly NIMRts.NimRtsControlResCbFunc ControlResCb = new NIMRts.NimRtsControlResCbFunc(ControlResCallback);
        private static void ControlResCallback(int code, string sessionId, string info, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.ControlResHandler>(userData, code, sessionId, info);
        }
        
        /// <summary>
        /// 修改音视频的模式
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="mode">音频模式或视频模式</param>
        public static void SetVChatMode(string sessionId, NIMRts.NIMRtsVideoChatMode mode)
        {
            NIMRts.RtsNativeMethods.nim_rts_set_vchat_mode(sessionId, (int)mode, "");
        }
        
        /// <summary>
        /// 结束会话
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="hangupResHandler">结果回调</param>
        public static void Hangup(string sessionId, NIMRts.HangupResHandler hangupResHandler)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(hangupResHandler);
            NIMRts.RtsNativeMethods.nim_rts_hangup(sessionId, "", HangupResCb, ptr);
        }
        private static readonly NIMRts.NimRtsHangupResCbFunc HangupResCb = new NIMRts.NimRtsHangupResCbFunc(HangupResCallback);
        private static void HangupResCallback(int code, string sessionId, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.InvokeOnce<NIMRts.HangupResHandler>(userData, code, sessionId);
        }
        
        /// <summary>
        /// 发送数据，暂时支持tcp通道，建议发送频率在20Hz以下
        /// </summary>
        /// <param name="sessionId">会话id</param>
        /// <param name="channelType">通道类型</param>
        /// <param name="data">发送数据</param>
        /// <param name="size">data的数据长度</param>
        public static void SendData(string sessionId, NIMRtsChannelType channelType, IntPtr data, int size)
        {
            NIMRts.RtsNativeMethods.nim_rts_send_data(sessionId, (int)channelType, data, size, "");
        }

        
        #region 设置rts的通知回调
        public static void SetStartNotifyCallback(OnStartNotify cb)
        {
            var ptr1 = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            NIMRts.RtsNativeMethods.nim_rts_set_start_notify_cb_func(StartNotifyCb, ptr1);
        }

        public static void SetAckNotifyCallback(OnAckNotify cb)
        {
            var ptr2 = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            NIMRts.RtsNativeMethods.nim_rts_set_ack_notify_cb_func(AckNotifyCb, ptr2);
        }

        public static void SetSyncAckNotifyCallback(OnSyncAckNotify cb)
        {
            var ptr3 = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            NIMRts.RtsNativeMethods.nim_rts_set_sync_ack_notify_cb_func(SyncAckNotifyCb, ptr3);
        }

        public static void SetConnectionNotifyCallback(OnConnectNotify cb)
        {
            var ptr4 = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            NIMRts.RtsNativeMethods.nim_rts_set_connect_notify_cb_func(ConnectNotifyCb, ptr4);
        }

        public static void SetMemberChangedNotifyCallback(OnMemberNotify cb)
        {
            var ptr5 = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            NIMRts.RtsNativeMethods.nim_rts_set_member_change_cb_func(MemberChangeCb, ptr5);
        }

        public static void SetControlNotifyCallback(OnControlNotify cb)
        {
            var ptr6 = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            NIMRts.RtsNativeMethods.nim_rts_set_control_notify_cb_func(ControlNotifyCb, ptr6);
        }

        public static void SetHungupNotify(OnHangupNotify cb)
        {
            var ptr7 = NimUtility.DelegateConverter.ConvertToIntPtr(cb);
            NIMRts.RtsNativeMethods.nim_rts_set_hangup_notify_cb_func(HangupNotifyCb, ptr7);
        }

        public static void SetReceiveDataCallback(NIMRts.OnRecData callback)
        {
            var ptr = NimUtility.DelegateConverter.ConvertToIntPtr(callback);
            NIMRts.RtsNativeMethods.nim_rts_set_rec_data_cb_func(RecDataCb, ptr);
        }

        private static readonly NIMRts.NimRtsStartNotifyCbFunc StartNotifyCb = new NIMRts.NimRtsStartNotifyCbFunc(StartNotifyCallback);
        private static readonly NIMRts.NimRtsAckNotifyCbFunc AckNotifyCb = new NIMRts.NimRtsAckNotifyCbFunc(AckNotifyCallback);
        private static readonly NIMRts.NimRtsSyncAckNotifyCbFunc SyncAckNotifyCb = new NIMRts.NimRtsSyncAckNotifyCbFunc(SyncAckNotifyCallback);
        private static readonly NIMRts.NimRtsConnectNotifyCbFunc ConnectNotifyCb = new NIMRts.NimRtsConnectNotifyCbFunc(ConnectNotifyCallback);
        private static readonly NIMRts.NimRtsMemberChangeCbFunc MemberChangeCb = new NIMRts.NimRtsMemberChangeCbFunc(MemberChangeCallback);
        private static readonly NIMRts.NimRtsControlNotifyCbFunc ControlNotifyCb = new NIMRts.NimRtsControlNotifyCbFunc(ControlNotifyCallback);
        private static readonly NIMRts.NimRtsHangupNotifyCbFunc HangupNotifyCb = new NIMRts.NimRtsHangupNotifyCbFunc(HangupNotifyCallback);
        private static readonly NIMRts.NimRtsRecDataCbFunc RecDataCb = new NIMRts.NimRtsRecDataCbFunc(RecDataCallback);
        private static void StartNotifyCallback(string sessionId, int channelType, string uid, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.OnStartNotify>(userData, sessionId, channelType, uid, jsonExtension);
        }
        private static void AckNotifyCallback(string sessionId, int channelType, bool accept, string uid, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.OnAckNotify>(userData, sessionId, channelType, accept, uid);
        }
        private static void SyncAckNotifyCallback(string sessionId, int channelType, bool accept, string jsonExtension, IntPtr userData)
        {
            NIMRts.RtsSyncAckInfo info = NIMRts.RtsSyncAckInfo.Deserialize(jsonExtension);
            NimUtility.DelegateConverter.Invoke<NIMRts.OnSyncAckNotify>(userData, sessionId, channelType, accept, info.client);
        }
        private static void ConnectNotifyCallback(string sessionId, int channelType, int code, string jsonExtension, IntPtr userData)
        {
            //NIMRts.RtsConnectInfo info = NIMRts.RtsConnectInfo.Deserialize(jsonExtension);
            NimUtility.DelegateConverter.Invoke<NIMRts.OnConnectNotify>(userData, sessionId, channelType, code);
        }
        private static void MemberChangeCallback(string sessionId, int channelType, int type, string uid, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.OnMemberNotify>(userData, sessionId, channelType, type, uid);
        }
        private static void ControlNotifyCallback(string sessionId, string info, string uid, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.OnControlNotify>(userData, sessionId, info, uid);
        }
        private static void HangupNotifyCallback(string sessionId, string uid, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.OnHangupNotify>(userData, sessionId, uid);
        }
        private static void RecDataCallback(string sessionId, int type, string uid, IntPtr data, int size, string jsonExtension, IntPtr userData)
        {
            NimUtility.DelegateConverter.Invoke<NIMRts.OnRecData>(userData, sessionId, type, uid, data, size);
        }
        
        #endregion
    }

}
