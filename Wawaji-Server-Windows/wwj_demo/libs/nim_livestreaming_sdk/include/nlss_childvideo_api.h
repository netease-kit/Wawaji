/*
*	Author       hzzhuling15
*	Date         2015/09/11
*	Copyright    Hangzhou, Netease Inc.
*	Brief        
*   Notice       
*/
#ifndef _NLSS_CHILDVIDEO_API_H_
#define _NLSS_CHILDVIDEO_API_H_

#include "nlss_type.h"

#ifdef __cplusplus
extern "C" {
#endif

/*! \file */

/**
*  获取摄像头设备支持的采集参数
*
*  @param  pstCamera: 摄像头对象，入参
*  @param  pstCaptureParams: 摄像头支持的采集参数数组，出参
*  @param  piNum: 摄像头支持的采集参数数组个数，出参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API   NLSS_RET  Nlss_DeviceGetCamereCaptureInf(ST_NLSS_INDEVICE_INF *pstCamera, NLSS_OUT ST_NLSS_CAMERA_CAPTURE_PARAM **pstCaptureParams, NLSS_OUT int *piNum);

/**
*  打开子视频实例，用于推流直播
*
*  @param  hNLSService: 直播推流实例，入参
*  @param  pVideoInParam: 子视频采集参数，入参
*
*  @return _HNLSSCHILDSERVICE 非NULL成功， NULL失败
*/
EXPORTS_API  _HNLSSCHILDSERVICE      Nlss_ChildVideoOpen(_HNLSSERVICE hNLSService, ST_NLSS_VIDEOIN_PARAM *pVideoInParam);

/**
*  将该子视频设为背景层，同时将子视频显示全部铺开
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return 无
*/
EXPORTS_API       void               Nlss_ChildVideoSetBackLayer(_HNLSSCHILDSERVICE hNLSSChild);

/**
*  将该子视频层级调降或者调升一层来显示
*
*  @param  hNLSSChild: 对应子视频实例，入参
*  @param  bAdustUp: true上升一层，false降一层，入参
*
*  @return 无
*/
EXPORTS_API       void               Nlss_ChildVideoAdjustLayer(_HNLSSCHILDSERVICE hNLSSChild, bool bAdustUp);

/**
*  设置该子视频窗口在主窗口中的显示位置和大小
*
*  @param  hNLSSChild: 对应子视频实例，入参
*  @param  pstRect: 显示位置参数
*
*  @return 无
*/
EXPORTS_API       void               Nlss_ChildVideoSetDisplayRect(_HNLSSCHILDSERVICE hNLSSChild, ST_NLSS_RECTSCREEN_PARAM *pstRect);

/**
*  关闭子视频实例
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return 无
*/
EXPORTS_API       void               Nlss_ChildVideoClose(_HNLSSCHILDSERVICE hNLSSChild);

/**
*  检查是否为其他采集设备（如视频采集卡）
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return bool true有，false没有
*/
EXPORTS_API  bool  Nlss_ChildVideoIsOtherDevice(_HNLSSCHILDSERVICE hNLSSChild);

/**
*  打开采集设备的高级设置，
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*  注： 该接口可能系统会弹出采集配置窗口，所以建议在Nlss_IsOtherCaptureDevice检测到之后，让用户手动选择是否开启
*/
EXPORTS_API  NLSS_RET  Nlss_ChildVideoOpenOtherDeviceConf(_HNLSSCHILDSERVICE hNLSSChild);

/**
*  临时开|关该子视频窗口是否显示
*
*  @param  hNLSSChild: 对应子视频实例，入参
*  @param  bHide: 子视频窗口单独是否隐藏，入参
*
*  @return 无
*/
EXPORTS_API       void     Nlss_ChildVideoSwitchDisplay(_HNLSSCHILDSERVICE hNLSSChild, bool bHide);

/**
*  打开子视频采集，需要在视频预览前调用，当需要改变采集设备时的时候需要先停止再重新打开
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API  NLSS_RET  Nlss_ChildVideoStartCapture( _HNLSSCHILDSERVICE hNLSSChild);

/**
*  关闭视频采集
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return 无
*/
EXPORTS_API   void     Nlss_ChildVideoStopCapture(_HNLSSCHILDSERVICE hNLSSChild);


/*******************************单独图像回调API*************************************************************/
/**
*  设置单独预览的视频流buffer回调函数，可用于预览进行显示
*
*  @param  hNLSSChild: 对应子视频实例，入参
*  @param  pFunVideoSamplerCB: 单独推流的buffer回调函数，入参
*
*  @return 无
*/
EXPORTS_API   void     Nlss_ChildVideoSetSoloPreviewCB(_HNLSSCHILDSERVICE hNLSSChild, PFN_NLSS_CHILD_VIDEO_SAMPLER_CB pFunVideoSamplerCB);

/**
*  开|关子视频单独预览
*
*  @param  hNLSSChild: 对应子视频实例，入参
*  @param  bOn: 子视频窗口单独预览开关，入参
*
*  @return 无
*/
EXPORTS_API  void      Nlss_ChildVideoSwitchSoloPreview(_HNLSSCHILDSERVICE hNLSSChild, bool bOn);


/*******************************直播推流API*************************************************************/
/**
*  暂停视频直播推流
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_ChildVideoPauseLiveStream(_HNLSSCHILDSERVICE hNLSSChild);
/**
*  恢复视频直播推流
*
*  @param  hNLSSChild: 对应子视频实例，入参
*
*  @return 无
*/
EXPORTS_API  void       Nlss_ChildVideoResumeLiveStream(_HNLSSCHILDSERVICE hNLSSChild);

/**
*  用户指定视频流推流发送接口
*
*  @param  hNLSService: 直播推流实例，入参
*  @param  pcVideoData: 用户指定视频流数据，入参
*  @param  iLen:        视频流数据长度，入参
*
*  @return NLSS_RET NLSS_OK成功，NLSS_ERR失败
*/
EXPORTS_API NLSS_RET    Nlss_VideoChildSendCustomData(_HNLSSCHILDSERVICE hNLSSChild, char *pcVideoData, int iLen);



#ifdef __cplusplus
}
#endif

#endif// _LS_MEDIACAPTURE_API_H_



