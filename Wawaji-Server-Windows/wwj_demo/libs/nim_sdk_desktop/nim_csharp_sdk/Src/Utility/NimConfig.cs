/** @file NIMSDKConfig.cs
  * @brief NIM SDK提供的SDK配置定义
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System.Collections.Generic;

namespace NimUtility
{
    /// <summary>
    /// SDK log级别，级别越高，log越详细 
    /// </summary>
    public enum SdkLogLevel
    {
        /// <summary>
        /// 应用级别Log，正式发布时为了精简sdk log，可采用此级别
        /// </summary>
        App = 5,

        /// <summary>
        /// SDK过程级别Log，更加详细，更有利于开发调试
        /// </summary>
        Pro = 6
    };

    public class SdkCommonSetting
    {
        /// <summary>
        /// 数据库秘钥，必填，目前只支持最多32个字符的加密密钥！建议使用32个字符
        /// </summary>
        [Newtonsoft.Json.JsonProperty("db_encrypt_key")]
        public string DataBaseEncryptKey { get; set; }

        /// <summary>
        /// 必填，是否需要预下载附件缩略图，默认为true
        /// </summary>
        [Newtonsoft.Json.JsonProperty("preload_attach")]
        public bool PredownloadAttachmentThumbnail { get; set; }

        /// <summary>
        /// 定义见NIMSDKLogLevel，选填，SDK默认的内置级别为kNIMSDKLogLevelPro
        /// </summary>
        [Newtonsoft.Json.JsonProperty("sdk_log_level")]
        public SdkLogLevel LogLevel { get; set; }

        /// <summary>
        /// 选填，是否使用私有服务器
        /// </summary>
        [Newtonsoft.Json.JsonProperty("private_server_setting")]
        public bool UsePriviteServer { get; set; }

        public SdkCommonSetting()
        {
            PredownloadAttachmentThumbnail = true;
            UsePriviteServer = false;
            LogLevel = SdkLogLevel.App;
        }
    }

    public class SdkPrivateServerSetting
    {
        /// <summary>
        /// lbs地址，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("lbs")]
        public string LbsAddress { get; set; }

        /// <summary>
        /// nos lbs地址，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("nos_lbs")]
        public string NOSLbsAddress { get; set; }

        /// <summary>
        /// 默认link服务器地址，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("default_link")]
        public List<string> LinkServerList { get; set; }

        /// <summary>
        /// 默认nos 上传服务器地址，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("default_nos_upload")]
        public List<string> UploadServerList { get; set; }

        /// <summary>
        /// 默认nos 下载服务器地址，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("default_nos_download")]
        public List<string> DownloadServerList { get; set; }

        /// <summary>
        /// 默认nos access服务器地址，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("default_nos_access")]
        public List<string> AccessServerList { get; set; }

        /// <summary>
        /// RSA public key，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("rsa_public_key_module")]
        public string RSAPublicKey { get; set; }

        /// <summary>
        /// RSA version，如果选择使用私有服务器，则必填
        /// </summary>
        [Newtonsoft.Json.JsonProperty("rsa_version")]
        [Newtonsoft.Json.JsonIgnore()]
        public int RsaVersion { get; set; }

        public SdkPrivateServerSetting()
        {
            RsaVersion = 0;
        }
    }

    public class NimConfig : NimUtility.NimJsonObject<NimConfig>
    {
        [Newtonsoft.Json.JsonProperty("global_config")]
        public SdkCommonSetting CommonSetting { get; set; }

        [Newtonsoft.Json.JsonProperty(PropertyName = "private_server_setting", NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public SdkPrivateServerSetting PrivateServerSetting { get; set; }

        public bool IsValiad()
        {
            return CommonSetting != null;
        }
    }
}
