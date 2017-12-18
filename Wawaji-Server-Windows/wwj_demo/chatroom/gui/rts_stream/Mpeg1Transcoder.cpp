extern "C" {
	//ffmpeg 3.4
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>

#pragma comment(lib,"avcodec.lib")
#pragma comment(lib,"avformat.lib")
#pragma comment(lib,"avutil.lib")
//#pragma comment(lib,"swresample.lib")
}
#include "Mpeg1Transcoder.h"
#include <string.h>

// callback function for avformat_write()
int write_buffer_callback_for_avio(void *opaque, uint8_t *buf, int buf_size) {
    OpaqueIoParam *io = (OpaqueIoParam *)opaque;
    if (io->dataSize + buf_size > 1024*1024) {
        fprintf(stderr, "ERROR: IO buffer overflow\n");
        return -1;
    }
    memcpy(io->data + io->dataSize, buf, buf_size);
    io->dataSize += buf_size;
    return buf_size;
}


Mpeg1Transcoder::Mpeg1Transcoder() : m_outBuf(NULL),
                                       m_outDataSize(0),
                                       m_avformat(NULL),
                                       m_avcodec(NULL),
                                       m_avio(NULL),
                                       m_avframe(NULL),
                                       m_preTimestamp(-1),
                                       m_firstTimestamp(-1),
									   m_count(0),
                                       m_inited(false){
    m_userParam.bitrate = 0;
    m_userParam.height = 0;
    m_userParam.width = 0;
    m_userParam.maxfps = 0;
    m_io.data = new unsigned char[m_bufSize];
    m_io.dataSize = 0;
    m_outBuf = (unsigned char *)av_malloc(m_bufSize);
    av_register_all();
    avcodec_register_all();
}

Mpeg1Transcoder::~Mpeg1Transcoder() {
    if (m_avframe)
        av_frame_free((AVFrame **)&m_avframe);
    if (m_avcodec)
        avcodec_free_context((AVCodecContext **)&m_avcodec);
    if (m_avio) {
        av_free((AVIOContext *)m_avio);
        m_avio = NULL;
    }
    if (m_avformat) {
        avformat_free_context((AVFormatContext *)m_avformat);
        m_avformat = NULL;
    }

    delete [](m_io.data);
    av_freep(&m_outBuf);
}


int Mpeg1Transcoder::openMpeg1Encoder(Mpeg1Param *param) {
    AVFormatContext *fc = (AVFormatContext *)m_avformat;
	AVDictionary *dparam = NULL;
    AVCodec *codec = avcodec_find_encoder_by_name("mpeg1video");
    if (!codec) {
        fprintf(stderr, "ERROR: Cound not find encoder: mpeg1video\n");
        return -1;
    }
    AVCodecContext *cc = avcodec_alloc_context3(codec);
    if (!cc) {
        fprintf(stderr, "ERROR: Cound not alloc encoder context\n");
        return -1;
    }

    cc->thread_count = 1;
    cc->bit_rate = param->bitrate;
    cc->width = param->width;
    cc->height = param->height;
    AVRational tb = {1, param->maxfps};
    cc->time_base = tb;
    AVRational fr = {param->maxfps, 1};
    cc->framerate = fr;
	cc->gop_size = param->gop;
    cc->pix_fmt = AV_PIX_FMT_YUV420P;
    cc->refs = 1;
    cc->max_b_frames = 0;
    cc->mb_decision = 0;
	cc->qmax = 33;
	cc->qmin = 2;
    if (fc->oformat->flags & AVFMT_GLOBALHEADER)
        cc->flags |= CODEC_FLAG_GLOBAL_HEADER;
	av_dict_set(&dparam, "bf", "0", 0);
	av_dict_set(&dparam, "threads", "auto", 0);
	if (avcodec_open2(cc, codec, &dparam) < 0) {
        fprintf(stderr, "ERROR: Cound not open encoder\n");
        return -1;
    }
	av_dict_free(&dparam);
    m_avcodec = (void *)cc;
    return 0;
}


int Mpeg1Transcoder::init(Mpeg1Param *param) {
    AVFormatContext *fc = NULL;
    if (!param || !(param->bitrate) || !(param->width) || !(param->height) || !(param->maxfps))
        return -1;
    m_userParam = *param;

    /* =================== init the output context ==================== */
    avformat_alloc_output_context2(&fc, NULL, "mpegts", NULL);
    if (!fc) {
        fprintf(stderr, "ERROR: Could not create output context\n");
        return -1;
    }
    m_avformat = (void *)fc;
    AVIOContext *avio = avio_alloc_context(m_outBuf, m_bufSize, 1, &m_io, NULL, write_buffer_callback_for_avio, NULL);
    m_avio = (void *)avio;
    fc->pb = avio;
    fc->flags |= AVFMT_FLAG_CUSTOM_IO;

    if (openMpeg1Encoder(param) < 0)
        return -1;

    /* ==================== init the frame for input ================= */
    AVFrame *frame = av_frame_alloc();
    if (!frame) {
        fprintf(stderr, "ERROR: Cound not alloc the video frame for mpeg1\n");
        return -1;
    }
    frame->format = AV_PIX_FMT_YUV420P;
    frame->width = param->width;
    frame->height = param->height;
    if (av_frame_get_buffer(frame, 32) < 0) {
        fprintf(stderr, "ERROR: Cound not alloc the frame buffer for mpeg1\n");
        return -1;
    }
    m_avframe = (void *)frame;

    /* ================== create stream, ready for output =================== */
    AVStream *stream = avformat_new_stream(fc, NULL);
    if (!stream) {
        fprintf(stderr, "ERROR: Could not create output stream\n");
        return -1;
    }
    avcodec_parameters_from_context(stream->codecpar, (AVCodecContext *)m_avcodec);
    if (avformat_write_header(fc, NULL) < 0) {
        fprintf(stderr, "ERROR: Failed to write header\n");
        return -1;
    }

    m_inited = true;
    return 0;
}


int Mpeg1Transcoder::encode(YUVdataForMPEG1 *yuv, long long int timestamp, unsigned char **outBuf, int *outBufSize, bool *isKeyframe) {
    AVFrame *frame = (AVFrame *)m_avframe;
    AVFormatContext *fc = (AVFormatContext *)m_avformat;
    AVCodecContext *cc = (AVCodecContext *)m_avcodec;
    int ret;
    AVPacket pkt;
    if (!m_inited) {
        fprintf(stderr, "ERROR: Calling encode() without initialization\n");
        return -1;
    }
    if (!yuv || !outBuf || !outBufSize) {
        fprintf(stderr, "ERROR: Invalid argument, yuv: %p, outBuf: %p, outBufSize: %p\n", yuv, outBuf, outBufSize);
        return -1;
    }

    av_init_packet(&pkt);
    pkt.data = NULL;
    pkt.size = 0;
    *outBuf = NULL;
    *outBufSize = 0;

    // deep copy the yuv data
    if (yuv->height != m_userParam.height || yuv->width != m_userParam.width) {
        fprintf(stderr, "ERROR: Invalid yuv input: %dx%d, required: %dx%d\n", yuv->width, yuv->height, m_userParam.width, m_userParam.height);
        return -1;
    }
    if (m_firstTimestamp < 0)
        m_firstTimestamp = timestamp;
    long long int convTs = (long long int)((timestamp - m_firstTimestamp) * 1.0 / 1000 * m_userParam.maxfps + 0.5);
    if (convTs <= m_preTimestamp) {
        fprintf(stderr, "Warning: Drop frame because invalid timestamp\n");
        return 0;
    }
    m_preTimestamp = convTs;

    if (av_frame_make_writable(frame) < 0) {
        fprintf(stderr, "ERROR: Failed to write frame\n");
        return -1;
    }
    for (int i = 0; i < cc->height && i < yuv->height; i++)
        memcpy(frame->data[0] + i * frame->linesize[0], yuv->yBuf + i * yuv->yStride, yuv->width);
    for (int i = 0; i < cc->height / 2 && i < yuv->height / 2; i++)
        memcpy(frame->data[1] + i * frame->linesize[1], yuv->uBuf + i * yuv->uStride, yuv->width/2);
    for (int i = 0; i < cc->height / 2 && i < yuv->height / 2; i++)
        memcpy(frame->data[2] + i * frame->linesize[2], yuv->vBuf + i * yuv->vStride, yuv->width/2);

    frame->pts = convTs;
    ret = avcodec_send_frame(cc, frame);
    if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF) {
        return 0;
    }
    else if (ret == AVERROR(EINVAL)) {
        fprintf(stderr, "ERROR: Failed to send frame to encoder. CODE: %d\n", ret);
        return -1;
    }

    while (1) {
        ret = avcodec_receive_packet(cc, &pkt);
        if (ret == AVERROR(EAGAIN) || (!frame && ret == AVERROR_EOF)) {
            ret = 0;
            break;
        }
        if (ret < 0) {
            fprintf(stderr, "ERROR: Encode frame failed. CODE: %d\n", ret);
            m_io.dataSize = 0;
            return -1;
        }
		*isKeyframe = pkt.flags & AV_PKT_FLAG_KEY;
        av_packet_rescale_ts(&pkt, cc->time_base, fc->streams[0]->time_base);
        pkt.stream_index = 0;
        ret = av_interleaved_write_frame(fc, &pkt);
        if (ret < 0) {
            ret = -1;
            fprintf(stderr, "Warning: av_interleaved_write_frame() failed, some data may lost\n");
        }
        av_packet_unref(&pkt);
    }
    av_packet_unref(&pkt);
	//m_count++;
	//if (m_count % m_userParam.gop) {
	//	av_write_trailer(fc);
	//	avformat_write_header(fc, NULL);
	//}
    *outBuf = m_io.data;
    *outBufSize = m_io.dataSize;
    m_io.dataSize = 0;
    return 0;
}


int Mpeg1Transcoder::finish() {
    if (m_avframe)
        av_frame_free((AVFrame **)&m_avframe);
    if (m_avcodec)
        avcodec_free_context((AVCodecContext **)&m_avcodec);
    if (m_avio) {
        av_free((AVIOContext *)m_avio);
        m_avio = NULL;
    }
    if (m_avformat) {
        avformat_free_context((AVFormatContext *)m_avformat);
        m_avformat = NULL;
    }
    m_io.dataSize = 0;
    m_firstTimestamp = m_preTimestamp = -1;
    m_inited = false;
    return 0;
}
