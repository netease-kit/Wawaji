/** @file NIMAudioAPI.cs
  * @brief NIM 提供的语音录制和播放接口
  * @copyright (c) 2015, NetEase Inc. All rights reserved
  * @author Harrison
  * @date 2015/12/8
  */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using NIM;

namespace NIMAudio
{
    public class AudioAPI
    {
        private static bool _initialized = false;
        private static NIMAudio.ResCodeIdCb _onAudioStartPlaying;
        private static NIMAudio.ResCodeIdCb _onAudioStopped;
        
        /// <summary>
        /// NIM SDK 初始化语音模块
        /// </summary>
        /// <param name="userDataParentPath">用户目录</param>
        /// <returns><c>true</c> 调用成功, <c>false</c> 调用失败</returns>
        public static bool InitModule(string userDataParentPath)
        {
            return _initialized = AudioNativeMethods.nim_audio_init_module(userDataParentPath);
        }

        /// <summary>
        /// NIM SDK 卸载语音模块（只有在主程序关闭时才有必要调用此接口）
        /// </summary>
        /// <returns><c>true</c> 调用成功, <c>false</c> 调用失败</returns>
        public static bool UninitModule()
        {
            _initialized = false;
            return AudioNativeMethods.nim_audio_uninit_module();
        }

        /// <summary>
        /// NIM SDK 播放,通过回调获取开始播放状态
        /// </summary>
        /// <param name="filePath">播放文件绝对路径</param>
        /// <param name="callerId"></param>
        /// <param name="resId">用以定位资源的二级ID，可选</param>
        /// <param name="audioFormat"></param>
        /// <returns><c>true</c> 调用成功, <c>false</c> 调用失败</returns>
        public static bool PlayAudio(string filePath, string callerId, string resId, NIMAudioType audioFormat)
        {
            if (!_initialized)
                throw new Exception("nim audio moudle uninitialized!");
            return AudioNativeMethods.nim_audio_play_audio(filePath, callerId, resId, (int) audioFormat);
        }

        /// <summary>
        /// NIM SDK 停止播放,通过回调获取停止播放状态
        /// </summary>
        /// <returns><c>true</c> 调用成功, <c>false</c> 调用失败</returns>
        public static bool StopPlayAudio()
        {
            return AudioNativeMethods.nim_audio_stop_play_audio();
        }

        /// <summary>
        /// NIM SDK 注册播放开始事件回调
        /// </summary>
        /// <param name="cb">播放开始事件的回调函数</param>
        /// <returns><c>true</c> 调用成功, <c>false</c> 调用失败</returns>
        public static bool RegStartPlayCb(NIMAudio.ResCodeIdCb cb)
        {
            _onAudioStartPlaying = cb;
            return AudioNativeMethods.nim_audio_reg_start_play_cb(_onAudioStartPlaying);
        }

        /// <summary>
        /// NIM SDK 注册播放结束事件回调
        /// </summary>
        /// <param name="cb">播放结束事件的回调函数</param>
        /// <returns><c>true</c> 调用成功, <c>false</c> 调用失败</returns>
        public static bool RegStopPlayCb(NIMAudio.ResCodeIdCb cb)
        {
            _onAudioStopped = cb;
            return AudioNativeMethods.nim_audio_reg_stop_play_cb(_onAudioStopped);
        }
    }
}
