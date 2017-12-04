using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NIM
{
    public class NIMMessageAttachment : NimUtility.NimJsonObject<NIMMessageAttachment>
    {
        /// <summary>
        /// 文件内容MD5
        /// </summary>
        [JsonProperty("md5")]
        public string MD5 { get; set; }

        /// <summary>
        /// 文件大小
        /// </summary>
        [JsonProperty("size")]
        public long Size { get; set; }

        /// <summary>
        /// 上传云端后得到的文件下载地址
        /// </summary>
        [JsonProperty("url")]
        public string RemoteUrl { get; set; }

        /// <summary>
        /// 用于显示的文件名称
        /// </summary>
        [JsonProperty("name")]
        public string DisplayName { get; set; }

        /// <summary>
        /// 文件扩展名
        /// </summary>
        [JsonProperty("ext")]
        public string FileExtension { get; set; }

        [JsonProperty("res_id")]
        public string LocalResID { get; set; }
    }
}
