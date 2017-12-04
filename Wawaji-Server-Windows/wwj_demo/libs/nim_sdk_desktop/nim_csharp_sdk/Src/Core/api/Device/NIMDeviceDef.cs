/** @file NIMDeviceDef.cs
  * @brief NIM VChat提供的设备相关接口定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author gq
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace NIM
{
    /// <summary>
    /// 设备类型
    /// </summary>
    public enum NIMDeviceType
    {
        /// <summary>
        /// 麦克风设备
        /// </summary>
        kNIMDeviceTypeAudioIn = 0,
        /// <summary>
        /// 听筒设备用于播放本地采集音频数据
        /// </summary>
        kNIMDeviceTypeAudioOut = 1,
        /// <summary>
        /// 听筒设备用于通话音频数据（StartDevice和EndDevice中使用）
        /// </summary>
        kNIMDeviceTypeAudioOutChat = 2,
        /// <summary>
        /// 摄像头
        /// </summary>
        kNIMDeviceTypeVideo = 3,
    };

    /// <summary>
    /// 设备状态类型
    /// </summary>
    public enum NIMDeviceStatus
    {
        /// <summary>
        /// 设备没有变化
        /// </summary>
        kNIMDeviceStatusNoChange = 0x0,
        /// <summary>
        /// 设备有变化
        /// </summary>
        kNIMDeviceStatusChange = 0x1,
        /// <summary>
        /// 工作设备被移除
        /// </summary>
        kNIMDeviceStatusWorkRemove = 0x2,
        /// <summary>
        /// 设备重新启动
        /// </summary>
        kNIMDeviceStatusReset = 0x4,
        /// <summary>
        /// 设备开始工作
        /// </summary>
        kNIMDeviceStatusStart = 0x8,
        /// <summary>
        /// 设备停止工作
        /// </summary>
        kNIMDeviceStatusEnd = 0x10,
    };
    
    /// <summary>
    /// 设备属性
    /// </summary>
    public class NIMDeviceInfo : NimUtility.NimJsonObject<NIMDeviceInfo>
    {
        /// <summary>
        /// 设备名
        /// </summary>
        [Newtonsoft.Json.JsonProperty("name")]
        public string Name { get; set; }

        /// <summary>
        /// 设备路径，如果为空底层填设备名代替
        /// </summary>
        [Newtonsoft.Json.JsonProperty("path")]
        public string Path { get; set; }
    };
    /// <summary>
    /// 设备属性列表
    /// </summary>
    public class NIMDeviceInfoList : NimUtility.NimJsonObject<NIMDeviceInfoList>
    {
        /// <summary>
        /// 设备属性
        /// </summary>
        [Newtonsoft.Json.JsonProperty("list")]
        public List<NIMDeviceInfo> DeviceList { get; set; }

        public static new NIMDeviceInfoList Deserialize(string json)
        {
            json = "{\"list\":" + json + "}";
            return NimUtility.Json.JsonParser.Deserialize<NIMDeviceInfoList>(json);
        }
    }

    /// <summary>
    /// 自定义音频数据参数
    /// </summary>
    public class NIMCustomAudioDataInfo : NimUtility.NimJsonObject<NIMCustomAudioDataInfo>
    {
        /// <summary>
        /// 采样频率
        /// </summary>
        [Newtonsoft.Json.JsonProperty("sample_rate")]
        public int SampleRate { get; set; }

        /// <summary>
        /// 采样位深
        /// </summary>
        [Newtonsoft.Json.JsonProperty("sample_bit")]
        public int SampleBit { get; set; }

        public NIMCustomAudioDataInfo()
        {
            SampleRate = 16000;
            SampleBit = 16;
        }
    }

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void nim_vchat_enum_device_devpath_sync_cb_func(bool ret, NIMDeviceType type,
    [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void nim_vchat_start_device_cb_func(NIMDeviceType type, bool ret,
    [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void nim_vchat_device_status_cb_func(NIMDeviceType type, uint status,
    [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string device_path,
    [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void nim_vchat_audio_data_cb_func(ulong time, IntPtr data, uint size,
    [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    public delegate void nim_vchat_video_data_cb_func(ulong time, IntPtr data, uint size, uint width, uint height,
    [MarshalAs(UnmanagedType.CustomMarshaler, MarshalTypeRef = typeof(NimUtility.Utf8StringMarshaler))] string json_extension, IntPtr user_data);

}
