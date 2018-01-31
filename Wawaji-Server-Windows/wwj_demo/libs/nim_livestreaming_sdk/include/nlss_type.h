#ifndef _NLSS_TYPE_NEW_H_
#define _NLSS_TYPE_NEW_H_

#include "nlss_define.h"

#ifdef __cplusplus
extern "C" {
#endif

/*! \file */

typedef  NLSS_MASK_HANDLE_TYPE(_HNLSSERVICE)  _HNLSSERVICE;

typedef  NLSS_MASK_HANDLE_TYPE(_HNLSSCHILDSERVICE)  _HNLSSCHILDSERVICE;

/**
*  直播推流状态
*/
typedef enum enum_NLSS_STATUS{
    EN_NLSS_STATUS_INIT,                      //!< 初始状态
    EN_NLSS_STATUS_START,                     //!< 直播开始状态
    EN_NLSS_STATUS_ERR,                       //!< 直播出错
    EN_NLSS_STATUS_STOP                       //!< 直播停止
}EN_NLSS_STATUS;

/**
*  直播推流视频源模式：即视频推流内容
*/
typedef enum enum_NLSS_VIDEOIN_TYPE{
    EN_NLSS_VIDEOIN_NONE = 0,                  //!< 不采集视频
    EN_NLSS_VIDEOIN_CAMERA,                    //!< 摄像头模式
    EN_NLSS_VIDEOIN_FULLSCREEN,			       //!< 全屏模式
    EN_NLSS_VIDEOIN_RECTSCREEN,			       //!< 任意区域截屏
    EN_NLSS_VIDEOIN_APP,					   //!< 应用程序窗口截屏
    EN_NLSS_VIDEOIN_PNG,					   //!< PNG图片源，可以作为背景
    EN_NLSS_VIDEOIN_RAWDATA,                   //!< 视频裸数据模式
}EN_NLSS_VIDEOIN_TYPE;

/**
*  直播推流音频源模式：即音频推流采集源
*/
typedef enum enum_NLSS_AUDIOIN_TYPE{
    EN_NLSS_AUDIOIN_NONE = 0,                  //!< 不采集声音
    EN_NLSS_AUDIOIN_MIC,                       //!< 麦克风模式
    EN_NLSS_AUDIOIN_SYS,                       //!< windows系统声音
    EN_NLSS_AUDIOIN_RAWDATA                   //!< 音频流裸数据模式
}EN_NLSS_AUDIOIN_TYPE;

/**
*  直播推流流格式：FLV，RTMP
*/
typedef enum enum_NLSS_OUTFORMAT{
    EN_NLSS_OUTFORMAT_FLV,                    //!< FLV流对象输出
    EN_NLSS_OUTFORMAT_RTMP					//!< RTMP流对象输出
}EN_NLSS_OUTFORMAT;

/**
*  直播推流流内容：音视频流
*/
typedef enum enum_NLSS_OUTCONTENT{
    EN_NLSS_OUTCONTENT_AUDIO = 0x01,            //!< 发送音频流
    EN_NLSS_OUTCONTENT_VIDEO = 0x02,			//!< 发送视频流
    EN_NLSS_OUTCONTENT_AV = 0x03			    //!< 发送音视频流
}EN_NLSS_OUTCONTENT;

/**
*  直播视频编码格式
*/
typedef enum enum_NLSS_VIDEOOUT_CODEC{
    EN_NLSS_VIDEOOUT_CODEC_OPENH264,
    EN_NLSS_VIDEOOUT_CODEC_X264,
    EN_NLSS_VIDEOOUT_CODEC_VP9,
    EN_NLSS_VIDEOOUT_CODEC_HEVC
}EN_NLSS_VIDEOOUT_CODEC;

/**
*  直播音频编码格式
*/
typedef enum enum_NLSS_AUDIOOUT_CODEC{
    EN_NLSS_AUDIOOUT_CODEC_AAC,
    EN_NLSS_AUDIOOUT_CODEC_GIPS
}EN_NLSS_AUDIOOUT_CODEC;

/**
*  直播视频流质量
*/
typedef enum enum_NLSS_VIDEOQUALITY_LVL{
    EN_NLSS_VIDEOQUALITY_LOW,                    //!< 视频分辨率：低清.
    EN_NLSS_VIDEOQUALITY_MIDDLE,                 //!< 视频分辨率：标清.
    EN_NLSS_VIDEOQUALITY_HIGH,                   //!< 视频分辨率：高清.
    EN_NLSS_VIDEOQUALITY_SUPER,                  //!< 视频分辨率：超清.
    EN_NLSS_VIDEOQUALITY_INVALID                 //!< 视频分辨率：无效值
}EN_NLSS_VIDEOQUALITY_LVL;

/**
*  当视频流为用户采集时，即EN_NLSS_AUDIOIN_RAWDATA时，输入的视频流格式
*/
typedef enum enum_NLSS_VIDEOIN_FMT{
    EN_NLSS_VIDEOIN_FMT_NV12 = 0,
    EN_NLSS_VIDEOIN_FMT_NV21,
    EN_NLSS_VIDEOIN_FMT_I420,
    EN_NLSS_VIDEOIN_FMT_BGRA32,
    EN_NLSS_VIDEOIN_FMT_ARGB32,
    EN_NLSS_VIDEOIN_FMT_YUY2,
    EN_NLSS_VIDEOIN_FMT_BGR24,
    EN_NLSS_VIDEOIN_FMT_BGR24FLIP,
    EN_NLSS_VIDEOIN_FMT_INVALID
}EN_NLSS_VIDEOIN_FMT;//custom videoin rawdata input source format

/**
*  当音频流为用户采集时，即EN_NLSS_AUDIOIN_RAWDATA时，输入的音频流格式
*/
typedef enum enum_NLSS_AUDIOIN_FMT{
    EN_NLSS_AUDIOIN_FMT_NONE = -1,
    EN_NLSS_AUDIOIN_FMT_U8,          ///< unsigned 8 bits
    EN_NLSS_AUDIOIN_FMT_S16,         ///< signed 16 bits
    EN_NLSS_AUDIOIN_FMT_S32,         ///< signed 32 bits
    EN_NLSS_AUDIOIN_FMT_FLT,         ///< float
    EN_NLSS_AUDIOIN_FMT_DBL,         ///< double

    EN_NLSS_AUDIOIN_FMT_U8P,         ///< unsigned 8 bits, planar
    EN_NLSS_AUDIOIN_FMT_S16P,        ///< signed 16 bits, planar
    EN_NLSS_AUDIOIN_FMT_S32P,        ///< signed 32 bits, planar
    EN_NLSS_AUDIOIN_FMT_FLTP,        ///< float, planar
    EN_NLSS_AUDIOIN_FMT_DBLP,        ///< double, planar

    EN_NLSS_AUDIOIN_FMT_NB           ///< Number of sample formats. DO NOT USE if linking dynamically
}EN_NLSS_AUDIOIN_FMT; //custom audioin rawdata input source format

/**
*  直播视频源为摄像头模式时，即：EN_NLSS_VIDEOIN_CAMERA，输入参数
*/
typedef struct struct_NLSS_CAMERA_PARAM
{
    char               *paDevicePath;    //!< camera对象.
    EN_NLSS_VIDEOQUALITY_LVL  enLvl;           //!< 视频分辨率
} ST_NLSS_CAMERA_PARAM;

typedef struct struct_NLSS_CAMERA_CAPTURE_PARAM
{
	int                 iWidth;       //!<采集的宽
	int                 iHeight;      //!<采集的高
	int                 iFps;         //!<采集的帧率
	EN_NLSS_VIDEOIN_FMT enFmt;        //!<当输入源为yuv数据时，视频格式
} ST_NLSS_CAMERA_CAPTURE_PARAM;

/**
*  直播视频源为任意屏幕区域模式时，即：EN_NLSS_VIDEOIN_RECTSCREEN，输入参数
*/
typedef struct struct_NLSS_RECTSCREEN_PARAM
{
    int iRectLeft;                            //!<针对任意区域截屏模式，设置截屏区域的点位置
    int iRectRight;
    int iRectTop;
    int iRectBottom;
} ST_NLSS_RECTSCREEN_PARAM;


typedef struct struct_NLSS_APPVIDEO_PARAM
{
    char    *paAppPath;    //!< App对象.
} ST_NLSS_APPVIDEO_PARAM;

typedef struct struct_NLSS_PNG_PARAM
{
    char    *paPngPath;    //!< png path目录.
} ST_NLSS_PNG_PARAM;

/**
*  直播视频源为视频裸数据模式时，即：EN_NLSS_VIDEOIN_RAWDATA，输入参数
*/
typedef struct struct_NLSS_CUSTOMVIDEO_PARAM
{
    int                 iInWidth;            //!<输入源的宽
    int                 iInHeight;           //!<输入源的高
    EN_NLSS_VIDEOIN_FMT enVideoInFmt;        //!<当输入源为yuv数据时，视频格式
} ST_NLSS_CUSTOMVIDEO_PARAM;

/**
*  水印参数
*/
typedef struct stru_NLSS_VIDEO_WATER_PARAM{
    char                *pucFilePath;  //!<水印的文件路径
    unsigned int         uiStartx;     //!<水印的起始X坐标
    unsigned int         uiStarty;     //!<水印的起始Y坐标
} ST_NLSS_VIDEO_WATER_PARAM;

/**
*  直播推流视频输出参数
*/
typedef struct struct_NLSS_VIDEOOUT_PARAM
{
    int                           iOutWidth;           //!< 视频的输出宽.要求是4的倍数
    int                           iOutHeight;          //!< 视频的输出高.要求是4的倍数
    int                           iOutFps;             //!< 视频的帧率.
    int                           iOutBitrate;         //!< 码率.
    EN_NLSS_VIDEOOUT_CODEC        enOutCodec;          //!< 视频编码器.可以选择X264，Openh264
    bool                          bHardEncode;         //!< 是否使用视频硬件编码
	bool                          bQosAutoChangeRatio; //!< 是否自动调整分辨率                          
} ST_NLSS_VIDEOOUT_PARAM;

/**
*  直播推流视频输入参数
*/
typedef struct struct_NLSS_VIDEOIN_PARAM
{
    EN_NLSS_VIDEOIN_TYPE          enInType;          //!< 视频源类型
    int                           iCaptureFps;       //!< 采集fps
    union
    {
        ST_NLSS_CAMERA_PARAM      stInCamera;
        ST_NLSS_RECTSCREEN_PARAM  stInRectScreen;
        ST_NLSS_APPVIDEO_PARAM    stInApp;
        ST_NLSS_CUSTOMVIDEO_PARAM stInCustomVideo;
        ST_NLSS_PNG_PARAM         stInPng;
    }u;
} ST_NLSS_VIDEOIN_PARAM;

/**
*  直播推流音频输出参数
*/
typedef struct struct_NLSS_AUDIOOUT_PARAM
{
    EN_NLSS_AUDIOOUT_CODEC enOutcodec;            //!< 音频编码器.
    int                    iOutBitrate;           //!< 音频编码码率. 参考值：64000
    bool                   bHardEncode;           //!< 是否使用视频硬件编码 
} ST_NLSS_AUDIOOUT_PARAM;

/**
*  直播推流音频输入参数
*/
typedef struct struct_NLSS_AUDIOIN_PARAM
{
    EN_NLSS_AUDIOIN_TYPE   enInType;              //!< 音频推流采集源
    char                   *paaudioDeviceName;    //!< 当音频推流采集源麦克风时，EN_NLSS_AUDIOIN_MIC，需设置，即为麦克风设备名称，通过
    int                    iInSamplerate;         //!< 音频的样本采集率. 参考值：44100
    int                    iInNumOfChannels;      //!< 音频采集的通道数：单声道，双声道. 参考值：1
    int                    iInFrameSize;          //!< 音频采集的每帧大小. 参考值：2048
    int                    iInBitsPerSample;      //!< 音频单样本位数  
    EN_NLSS_AUDIOIN_FMT    enInFmt;               //!< 音频输入格式，参考值：EN_NLSS_AUDIOIN_FMT_S16
} ST_NLSS_AUDIOIN_PARAM;

/**
*  直播推流音频参数
*/
typedef struct struct_NLSS_AUDIO_PARAM
{
    ST_NLSS_AUDIOIN_PARAM  stIn;
    ST_NLSS_AUDIOOUT_PARAM stOut;
} ST_NLSS_AUDIO_PARAM;

/**
*  直播推流参数
*/
typedef struct struct_NLSS_PARAM
{
    EN_NLSS_OUTCONTENT        enOutContent;       //!< 推流流内容：音视频，视频，音频.
    EN_NLSS_OUTFORMAT         enOutFormat;        //!< 推流流的格式：FLV，RTMP.
    char                      *paOutUrl;          //!< 直播地址对象
    ST_NLSS_VIDEOOUT_PARAM    stVideoParam;       //!< 推流视频输出相关参数.
    ST_NLSS_AUDIO_PARAM       stAudioParam;       //!< 推流音频相关参数.
} ST_NLSS_PARAM;

/**
* 视频截图的结构体参数
*/
typedef struct struct_NLSS_VIDEO_SAMPLER
{
    int           iWidth;                        //!< 视频截图图像的宽度.
    int           iHeight;                       //!< 视频截图图像的高度.
    int           iFormat;                       //!< 视频截图图像的格式.
    int           iDataSize;                     //!< 视频截图图像的数据大小.
    unsigned char *puaData;                      //!< 视频截图图像的数据指针.
    int           *piRef;                        //!< 无滤镜.
}ST_NLSS_VIDEO_SAMPLER;

/**
* 设备信息
*/
typedef struct struct_NLSS_INDEVICE_INF
{
    const char  *paPath;
    const char  *paFriendlyName;
}ST_NLSS_INDEVICE_INF;

typedef struct struct_NLSS_STATS{
	unsigned int uiVSendFrameRate;     //!< 视频发送帧率信息
	unsigned int uiVSendBitRate;	   //!< 视频发送码率信息
	unsigned int uiVSendWidth;	       //!< 视频宽度信息
	unsigned int uiVSendHeight;	       //!< 视频高度信息
	unsigned int uiVSetFrameRate;	   //!< 视频设置的帧率信息
	unsigned int uiVSetBitRate;	       //!< 视频设置的码率信息
	unsigned int uiVSetWidth;		   //!< 视频设置的宽度信息
	unsigned int uiVSetHeight;	       //!< 视频设置的高度信息
	unsigned int uiASendBitRate;       //!< 音频发送码率信息
}ST_NLSS_STATS;

typedef enum enum_NLSS_ERRCODE{
    EN_NLSS_ERR_NO          = 0,           //!< 错误码：正确
    EN_NLSS_ERR_AUDIOINIT   = 2001,		   //!< 错误码：音频初始化
    EN_NLSS_ERR_AUDIOSTART  = 2002,		   //!< 错误码：音频开始传输失败

    EN_NLSS_ERR_VIDEOINIT   = 3001,		   //!< 错误码：视频初始化
    EN_NLSS_ERR_VIDEOSTART  = 3002,		   //!< 错误码：视频开始传输失败

    EN_NLSS_ERR_NETTIMEOUT  = 4001,		   //!< 错误码：错误
    EN_NLSS_ERR_URLINVALID  = 4002         //!< 错误码：url地址无效
}EN_NLSS_ERRCODE;	

/**
*  @brief 直播发生错误回调，当直播过程中发生错误，通知应用层，应用层可以做相应的处理
*
*  @param  hNLSService: 直播推流实例
*  @param enStatus:  直播状态
*  @param enErrCode: 错误码
*/
typedef void(*PFN_NLSS_STATUS_NTY)(_HNLSSERVICE hNLSService, EN_NLSS_STATUS enStatus, EN_NLSS_ERRCODE enErrCode);

/**
*  @brief 获取最新一帧合并子视频画面后的视频截图后的回调
*
*  @param  hNLSService: 直播推流实例
*  @param pstSampler 最新一帧合并子视频画面后的视频截图的结构体参数指针
*/
typedef void(*PFN_NLSS_MERGED_VIDEO_SAMPLER_CB)(_HNLSSERVICE hNLSService, ST_NLSS_VIDEO_SAMPLER *pstSampler);

/**
*  @brief 获取单个子视频截图后的回调
*
*  @param  hNLSSChild: 子视频对象
*  @param pstSampler 最新一帧单个子视频截图的结构体参数指针
*/
typedef void(*PFN_NLSS_CHILD_VIDEO_SAMPLER_CB)(_HNLSSCHILDSERVICE hNLSSChild, ST_NLSS_VIDEO_SAMPLER *pstSampler);


_HNLSSCHILDSERVICE Nlss_GetChildVideo(_HNLSSERVICE hNlssService, void *pNlssChildID);

#ifdef __cplusplus
}
#endif

#endif//_LS_MEDIALIVESTREAMING_H_
