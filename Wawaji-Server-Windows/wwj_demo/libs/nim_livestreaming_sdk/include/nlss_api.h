/*
*	Author       hzzhuling15
*	Date         2015/09/11
*	Copyright    Hangzhou, Netease Inc.
*	Brief        
*   Notice       
*/
#ifndef _NLSS_API_H_
#define _NLSS_API_H_

#include "nlss_childvideo_api.h"

#ifdef __cplusplus
extern "C" {
#endif

/*! \file */

/*******************************设备管理API：获取可供采集资源列表*************************************/
/**
*  获取可采集应用图像的app个数
*
*  @param  piAppWindNum: 可采集图像的app数量 出参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API   NLSS_RET Nlss_GetAvailableAppWindNum(int *piAppWindNum);

/**
*  获取可采集图像的app列表信息
*
*  @param  pLSAppWindTitles: 可采集图像的app信息 出参
*  @param  iMaxNum：pLSAppWindTitles最大容量 入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API   NLSS_RET Nlss_GetAvailableAppWind(NLSS_OUT ST_NLSS_INDEVICE_INF *pLSAppWindTitles, int iMaxNum);

/**
*  获取可用多媒体设备列表个数
*
*  @param  iVideoDeviceNum: 视频设备数量 出参
*  @param  iAudioDeviceNum：音频设备数量 出参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API   NLSS_RET  Nlss_GetFreeDevicesNum(NLSS_OUT int *iVideoDeviceNum, NLSS_OUT int *iAudioDeviceNum);
/**
*  获取可用多媒体设备列表名称，暂时只支持DShow采集音视频
*
*  @param  pLSVideoDevices: 视频设备信息 出参
*  @param  iMaxVideoDevicesNum：pstVideoDevices最大容量 入参
*  @param  pLSAudioDevices：音频设备信息 出参
*  @param  iMaxAudioDevicesNum：pstAudioDevices最大容量 入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API   NLSS_RET  Nlss_GetFreeDeviceInf(NLSS_OUT ST_NLSS_INDEVICE_INF *pstVideoDevices, int iMaxVideoDevicesNum, NLSS_OUT ST_NLSS_INDEVICE_INF* pstAudioDevices, int iMaxAudioDevicesNum);


/*******************************初始化和参数设置API*************************************************************/
/**
*  创建直播推流实例，推流对象只允许存在一个，多次直播可以只调用一次
*
*  @param  paWorkPath:    NLSS work目录(要求UTF-8编码)，会从work目录下面动态加载所需要的dll。
*                         如果设置为空，则在当前所在目录下面 ，操作上述事情。
*  @param  paCachePath:   NLSS cache目录，会在该目录下面生成日志,需要有文件创建和写入权限
*                         如果设置为空，则在当前所在目录下面 ，操作上述事情。
*  @param  phNLSService: 直播推流实例 ，出参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET  Nlss_Create(const char *paWorkPath, const char *paCachePath, NLSS_OUT _HNLSSERVICE *phNLSService);

/**
*  获取sdk版本号
*
*  @param  ppaVersion: 版本号，需要调用free进行释放，出参
*
*  @return 无
*/
EXPORTS_API   void     Nlss_GetSDKVersion(NLSS_OUT char **ppaVersion);

/**
*  销毁直播推流实例，可以程序退出再销毁
*
*  @param  hNLSService: 直播推流实例，入参
*/
EXPORTS_API  void       Nlss_Destroy(_HNLSSERVICE hNLSService);

/**
*  获取直播默认参数
*  @param  hNLSService: 直播推流实例，入参
*  @param  enVideoInType： 输入视频流类型，入参
*  @param  enAudioInType： 输入音频流类型，入参
*  @param  pstParam: 直播参数，出参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET   Nlss_GetDefaultParam(_HNLSSERVICE hNLSService, NLSS_OUT ST_NLSS_PARAM *pstParam);
/**
*  初始化直播参数
*  @param  hNLSService: 直播推流实例，入参
*  @param  pstParam: 直播参数
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET   Nlss_InitParam(_HNLSSERVICE hNLSService, ST_NLSS_PARAM *pstParam);

/**
*  设置视频水印，默认是无水印
*
*  @param  hNLSService: 直播推流实例，入参
*  @param  pstWaterParam: 水印参数结构体.
*/
EXPORTS_API   void     Nlss_SetVideoWaterMark(_HNLSSERVICE hNLSService, ST_NLSS_VIDEO_WATER_PARAM *pstWaterParam);

/**
*  设置视频截图的的回调
*
*  @param  hNLSService: 直播推流实例，入参
*  @param  pFunVideoSamplerCB 视频截图图像回调
*/
EXPORTS_API void Nlss_SetVideoSamplerCB(_HNLSSERVICE hNLSService, PFN_NLSS_MERGED_VIDEO_SAMPLER_CB pFunVideoSamplerCB);

/**
*  设置直播过程中状态回调
*
*  @param  hNLSService: 直播推流实例
*  @param  pFunStatusNty 直播状态通知函数
*/
EXPORTS_API   void     Nlss_SetStatusCB(_HNLSSERVICE hNLSService, PFN_NLSS_STATUS_NTY pFunStatusNty);

/**
*  清除Nlss_InitParam设置的直播参数
*
*  @param  hNLSService: 直播推流实例，入参
*  @param  pstParam: 直播参数
*
*  @return 无
*/
EXPORTS_API   void    Nlss_UninitParam(_HNLSSERVICE hNLSService);
/*******************************启动|停止处理API*************************************************************/
/**
*  启动处理，在各类初始化之后，在预览和直播启动之前
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET  Nlss_Start(_HNLSSERVICE hNLSService);

/**
*  停止处理，在预览和直播停止之后，在Nlss_UninitParam之前
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API   void     Nlss_Stop(_HNLSSERVICE hNLSService);


/*******************************视频预览API*************************************************************/
/**
*  打开视频预览
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET  Nlss_StartVideoPreview(_HNLSSERVICE hNLSService);

/**
*  暂停视频预览
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void      Nlss_PauseVideoPreview(_HNLSSERVICE hNLSService);

/**
*  恢复视频预览
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void      Nlss_ResumeVideoPreview(_HNLSSERVICE hNLSService);

/**
*  停止视频预览
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_StopVideoPreview(_HNLSSERVICE hNLSService);

/*******************************直播推流API*************************************************************/

/**
*  启动直播推流
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET   Nlss_StartLiveStream(_HNLSSERVICE hNLSService);

/**
*  停止直播推流
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_StopLiveStream(_HNLSSERVICE hNLSService);

/**
*  暂停视频直播推流
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_PauseVideoLiveStream(_HNLSSERVICE hNLSService);
/**
*  恢复视频直播推流
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_ResumeVideoLiveStream(_HNLSSERVICE hNLSService);

/**
*  设置音频音量
*
*  @param  hNLSService: 直播推流实例，入参， iRatio 暂定0-100；0表示静音，100表示原始音量
*
*  @return 无
*/
EXPORTS_API   void     Nlss_SetAudioVolume(_HNLSSERVICE hNLSService, int iRatio);

/**
*  暂停音频直播推流
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_PauseAudioLiveStream(_HNLSSERVICE hNLSService);

/**
*  恢复音频直播推流
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_ResumeAudioLiveStream(_HNLSSERVICE hNLSService);


/**
*  开始直播录制
*
*  @param  hNLSService: 直播推流实例，入参
*  @param  pcRecordPath: 录制文件存放位置及文件名，入参
*
*  @return 无
*/
EXPORTS_API  NLSS_RET   Nlss_StartRecord(_HNLSSERVICE hNLSService, char *pcRecordPath);

/**
*  停止直播录制
*
*  @param  hNLSService: 直播推流实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_StopRecord(_HNLSSERVICE hNLSService);

/*******************************直播推流方式2 API: 裸流直播接口*************************************************************/
/**
*  用户指定音频流推流发送接口，支持直播过程中音频数据重采样
*
*  @param  hNLSService: 直播推流实例，入参
*  @param  pcAudioData: 用户指定音频流数据，入参
*  @param  iLen:        音频流数据长度，入参
*  @param  iSampleRate: 音频流采样率，我们支持中间变化入参
*
*  @return NLSS_RET     NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET   Nlss_SendCustomAudioData(_HNLSSERVICE hNLSService, char *pcAudioData, int iLen, int iSampleRate);

/**
*  获取直播推流状态信息
*
*  @param  hNLSService:   直播推流实例，入参
*  @param  pstatistics:  直播推流统计信息，出参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET   Nlss_GetStaticInfo(_HNLSSERVICE hNLSService, NLSS_OUT ST_NLSS_STATS *pstStats);



#ifdef __cplusplus
}
#endif

#endif// _LS_MEDIACAPTURE_API_H_



