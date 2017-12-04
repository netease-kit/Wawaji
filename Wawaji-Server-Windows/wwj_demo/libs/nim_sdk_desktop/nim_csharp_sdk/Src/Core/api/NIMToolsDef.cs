/** @file NIMToolsDef.cs
  * @brief NIM SDK提供的一些工具相关定义，主要包括获取SDK里app account对应的app data目录，计算md5等
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using Newtonsoft.Json;
using System.Runtime.InteropServices;

namespace NIM
{
    /// <summary>
    /// AppData类型
    /// </summary>
    public enum NIMAppDataType
    {
        /// <summary>
        /// 其他资源文件（除了消息历史文件和已知类型之外的消息数据缓存文件）
        /// </summary>
	    kNIMAppDataTypeUnknownOtherRes	= 0,	
        /// <summary>
        /// 图片消息文件
        /// </summary>
	    kNIMAppDataTypeImage			= 1,	
        /// <summary>
        /// 语音消息文件
        /// </summary>
	    kNIMAppDataTypeAudio			= 2,	
        /// <summary>
        /// 视频消息文件
        /// </summary>
	    kNIMAppDataTypeVideo			= 3,	
    };
    
    /// <summary>
    /// 语音信息，用于语音转文字
    /// </summary>
    public class NIMAudioInfo : NimUtility.NimJsonObject<NIMAudioInfo>
    {
        /// <summary>
        /// 语音类型
        /// </summary>
        [JsonProperty(PropertyName = "mime", NullValueHandling = NullValueHandling.Ignore)]
        public string MimeType { get; set; }
        /// <summary>
        /// 采样率
        /// </summary>
        [JsonProperty(PropertyName = "samp", NullValueHandling = NullValueHandling.Ignore)]
        public string SampleRate { get; set; }
        /// <summary>
        /// 上传云端后得到的下载地址
        /// </summary>
        [JsonProperty(PropertyName = "url", NullValueHandling = NullValueHandling.Ignore)]
        public string URL { get; set; }
        /// <summary>
        /// 语音时长，毫秒
        /// </summary>
        [JsonProperty(PropertyName = "dur", NullValueHandling = NullValueHandling.Ignore)]
        public long? Duration { get; set; }
    };

    public class NIMTools
    {
        /// <summary>
        /// 转换结果回调
        /// </summary>
        /// <param name="rescode">转换结果，成功200</param>
        /// <param name="text">语音文字</param>
        /// <param name="json_extension">json扩展数据（备用）</param>
        /// <param name="user_data">APP的自定义用户数据，SDK只负责传回给回调函数，不做任何处理！</param>
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void GetAudioTextCb(int rescode, string text, string json_extension, IntPtr user_data);
    }
}
