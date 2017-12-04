/*
 * NELivePlayerController.h
 * NELivePlayer
 *
 * Create by biwei on 15-9-21
 * Copyright (c) 2015年 Netease. All rights reserved
 *
 * This file is part of LivePlayer.
 *
 */

#import "NELivePlayer.h"

/*! \file */

/**
 *	@brief	log级别
 */
typedef NS_ENUM(NSInteger, NELPLogLevel)
{
    NELP_LOG_DEFAULT = 1, //!< log输出模式：输出详细
    NELP_LOG_VERBOSE = 2, //!< log输出模式：输出详细
    NELP_LOG_DEBUG   = 3, //!< log输出模式：输出调试信息
    NELP_LOG_INFO    = 4, //!< log输出模式：输出标准信息
    NELP_LOG_WARN    = 5, //!< log输出模式：输出警告
    NELP_LOG_ERROR   = 6, //!< log输出模式：输出错误
    NELP_LOG_FATAL   = 7, //!< log输出模式：一些错误信息，如头文件找不到，非法参数使用
    NELP_LOG_SILENT  = 8, //!< log输出模式：不输出
};

/**
 *	@brief	错误码
 */
typedef NS_ENUM(NSInteger, NELPPLayerErrorCode) {
    
    NELP_INIT_URL_FORMAT_ERROR = 1000, //!< 初始化的URL格式错误
    NELP_INIT_URL_ISPUSH_ERROR = 1001, //!< 初始化的URL是推流地址
    NELP_INIT_URL_PARSE_ERROR = 1002,  //!< 初始化的URL解析错误（idx文件）
    
    NELP_PLAY_HTTP_CONNECT_ERROR = -1001, //!< 播放过程中，HTTP连接失败
    NELP_PLAY_RTMP_CONNECT_ERROR = -1002, //!< 播放过程中，RTMP连接失败
    NELP_PLAY_STREAM_PARSE_ERROR = -1003, //!< 播放过程中，解析失败
    NELP_PLAY_BUFFING_ERROR    = -1004,   //!< 播放过程中，缓冲失败
    NELP_PLAY_AUDIO_OPEN_ERROR = -2001,   //!< 播放过程中，音频相关操作初始化失败
    NELP_PLAY_VIDEO_OPEN_ERROR = -2002,   //!< 播放过程中，视频相关操作初始化失败
    NELP_PLAY_STREM_IS_ERROR   = -3001,   //!< 播放过程中，没有音视频流
    NELP_PLAY_AUDIO_DECODE_ERROR = -4001, //!< 播放过程中，音频解码失败
    NELP_PLAY_VIDEO_DECODE_ERROR = -4002, //!< 播放过程中，视频解码失败
    NELP_PLAY_AUDIO_RENDER_ERROR = -5001, //!< 播放过程中，音频播放失败
    NELP_PLAY_VIDEO_RENDER_ERROR = -5002, //!< 播放过程中，视频播放失败
    NELP_PLAY_UNKNOWN_ERROR      = -10000,//!< 播放过程中，未知错误
};


/**
 *	@brief	播放器核心功能类
 */
@interface NELivePlayerController : NSObject <NELivePlayer>

/**
 *	@brief	初始化（禁用方法）
 *
 *	@return	返回nil
 */
+ (instancetype)new NS_UNAVAILABLE;

/**
 *	@brief	初始化（禁用方法）
 *
 *	@return	返回nil
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 *	@brief	初始化播放器，输入播放文件路径
 *
 *	@param 	aUrl 	播放文件的路径
 *
 *	@return	返回播放器实例
 */
- (id)initWithContentURL:(NSURL *)aUrl NS_DEPRECATED(2_0, 2_0, 2_0, 2_0, "Instead of 'initWithContentURL:error:'");

/**
 *	@brief	初始化播放器，输入播放文件路径
 *
 *	@param 	aUrl 	播放文件的路径
 *  @param 	error 	初始化错误原因
 *
 *	@return	返回播放器实例
 */
- (id)initWithContentURL:(NSURL *)aUrl error:(NSError **)error;

/**
 *	@brief	初始化播放器，输入播放文件路径
 *
 *	@param 	aUrl 	播放文件的路径
 *	@param 	isNeed 	是否需要内部配置audio session
 *
 *	@return	返回播放器实例
 */
- (id)initWithContentURL:(NSURL *)aUrl needConfigAudioSession:(BOOL)isNeed NS_DEPRECATED(2_0, 2_0, 2_0, 2_0, "Instead of 'initWithContentURL:needConfigAudioSession:error:'");

/**
 *	@brief	初始化播放器，输入播放文件路径
 *
 *	@param 	aUrl 	播放文件的路径
 *	@param 	isNeed 	是否需要内部配置audio session
 *  @param 	error 	初始化错误原因
 *
 *	@return	返回播放器实例
 */
- (id)initWithContentURL:(NSURL *)aUrl needConfigAudioSession:(BOOL)isNeed error:(NSError **)error;

/**
 *	@brief	设置log级别
 *
 *	@param 	logLevel 	log级别
 *
 */
+ (void)setLogLevel:(NELPLogLevel)logLevel;

/**
 *	@brief	获取当前SDK版本号
 *
 *	@return	SDK版本号
 */
+ (NSString *)getSDKVersion;

/**
 *	@brief	获取当前日志的路径
 *
 *  @warning 需要对日志操作，请在当前实例析构前使用日志以确保日志存在，不可删除该路径下的日志。
 *
 *	@return	SDK版本号
 */
+ (NSString *)getLogPath;

@end
