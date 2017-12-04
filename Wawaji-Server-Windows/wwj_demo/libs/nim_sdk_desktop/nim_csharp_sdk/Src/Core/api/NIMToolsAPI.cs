/** @file NIMToolsAPI.cs
  * @brief NIM SDK提供的一些工具接口，主要包括获取SDK里app account对应的app data目录，计算md5等
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Runtime.InteropServices;

namespace NIM
{
    public class ToolsAPI
    {
        #region NIM C SDK native methods

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_user_appdata_dir", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_tool_get_user_appdata_dir(string app_account);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_user_specific_appdata_dir", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_tool_get_user_specific_appdata_dir(string app_account, NIMAppDataType appdata_type);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_local_appdata_dir", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_tool_get_local_appdata_dir();

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_cur_module_dir", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_tool_get_cur_module_dir();

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_md5", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_tool_get_md5(string input);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_file_md5", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_tool_get_file_md5(string file_path);

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_uuid", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr nim_tool_get_uuid();

        [DllImport(NIMGlobal.NIMNativeDLL, EntryPoint = "nim_tool_get_audio_text_async", CharSet = CharSet.Ansi, CallingConvention = CallingConvention.Cdecl)]
        private static extern void nim_tool_get_audio_text_async(string json_audio_info, string json_extension, NIMTools.GetAudioTextCb cb, IntPtr user_data);

        #endregion

        /// <summary>
        /// 获取SDK里app account对应的app data目录（各个帐号拥有独立的目录，其父目录相同） 
        /// </summary>
        /// <param name="appAccount">APP account。如果传入空字符串，则将获取到各个帐号目录的父目录（谨慎删除！）</param>
        /// <returns>返回的目录路径</returns>
        public static string GetUserAppDataDir(string appAccount)
        {
            IntPtr outStrPtr = nim_tool_get_user_appdata_dir(appAccount);
            string ret = Marshal.PtrToStringAuto(outStrPtr);
            GlobalAPI.FreeStringBuffer(outStrPtr);
            return ret;
        }

        /// <summary>
        /// 获取SDK里app account对应的具体类型的app data目录（如图片消息文件存放目录，语音消息文件存放目录等） 
        /// </summary>
        /// <param name="appAccount">APP account。如果传入空字符串，则返回结果为空</param>
        /// <param name="appdataType">具体类型的app data。见NIMAppDataType定义</param>
        /// <returns>返回的目录路径（目录可能未生成，需要app自行判断是否已生成）</returns>
        public static string GetUserSpecificAppDataDir(string appAccount, NIMAppDataType appdataType)
        {
            IntPtr outStrPtr = nim_tool_get_user_specific_appdata_dir(appAccount, appdataType);
            string ret = Marshal.PtrToStringAuto(outStrPtr);
            GlobalAPI.FreeStringBuffer(outStrPtr);
            return ret;
        }

        /// <summary>
        /// 获取本地存储路径
        /// </summary>
        /// <returns>返回的目录路径</returns>
        public static string GetLocalAppDataDir()
        {
            IntPtr outStrPtr = nim_tool_get_local_appdata_dir();
            string ret = Marshal.PtrToStringAuto(outStrPtr);
            GlobalAPI.FreeStringBuffer(outStrPtr);
            return ret;
        }

        /// <summary>
        /// 获取安装目录（SDK DLL所在的当前目录）
        /// </summary>
        /// <returns>返回的目录路径</returns>
        public static string GetCurModuleDir()
        {
            IntPtr outStrPtr = nim_tool_get_cur_module_dir();
            string ret = Marshal.PtrToStringAuto(outStrPtr);
            GlobalAPI.FreeStringBuffer(outStrPtr);
            return ret;
        }

        /// <summary>
        /// 计算md5
        /// </summary>
        /// <param name="input">需要计算md5的内容</param>
        /// <returns>返回的md5</returns>
        public static string GetMd5(string input)
        {
            IntPtr outStrPtr = nim_tool_get_md5(input);
            string ret = Marshal.PtrToStringAnsi(outStrPtr);
            GlobalAPI.FreeStringBuffer(outStrPtr);
            return ret;
        }
        
        /// <summary>
        /// 计算文件的md5
        /// </summary>
        /// <param name="filePath">文件完整路径</param>
        /// <returns>返回的md5</returns>
        public static string GetFileMd5(string filePath)
        {
            IntPtr outStrPtr = nim_tool_get_file_md5(filePath);
            string ret = Marshal.PtrToStringAnsi(outStrPtr);
            GlobalAPI.FreeStringBuffer(outStrPtr);
            return ret;
        }

        /// <summary>
        /// 生成UUID
        /// </summary>
        /// <returns>返回的UUID</returns>
        public static string GetUuid()
        {
            IntPtr outStrPtr = nim_tool_get_uuid();
            string ret = Marshal.PtrToStringAnsi(outStrPtr);
            GlobalAPI.FreeStringBuffer(outStrPtr);
            return ret;
        }

        /// <summary>
        /// 语音转文字
        /// </summary>
        /// <param name="audioInfo">语音信息</param>
        /// <param name="jsonExtension">json_extension json扩展参数（备用，目前不需要）</param>
        /// <param name="cb">语音转文字回调</param>
        /// <param name="userData">APP的自定义用户数据，SDK只负责传回给回调函数cb，不做任何处理！</param>
        public static void GetAudioTextAsync(NIMAudioInfo audioInfo, string jsonExtension, NIMTools.GetAudioTextCb cb, IntPtr userData)
        {
            var json = audioInfo.Serialize();
            nim_tool_get_audio_text_async(json, jsonExtension, cb, userData);
        }
    }
}
