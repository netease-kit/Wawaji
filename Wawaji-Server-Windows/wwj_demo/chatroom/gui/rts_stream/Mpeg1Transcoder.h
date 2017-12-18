#ifndef MPEG1TRANSCODER_H
#define MPEG1TRANSCODER_H

typedef struct Mpeg1Param {
    int width;
    int height;
    int bitrate; // bit per second
    int maxfps;  // IMPORTANT: official mpeg1 only support 24, 25, 30, 50, 60 fps
	int gop;
} Mpeg1Param;


typedef struct YUVdataForMPEG1 {
    unsigned char *yBuf;
    int yStride;
    unsigned char *uBuf;
    int uStride;
    unsigned char *vBuf;
    int vStride;
    int width;
    int height;
} YUVdataForMPEG1;


typedef struct OpaqueIoParam {
    unsigned char *data;
    int dataSize;
} OpaqueIoParam;


class Mpeg1Transcoder {
public:
    Mpeg1Transcoder();
    ~Mpeg1Transcoder();
    int init(Mpeg1Param *param);

    /*
     * Encode one frame.
     * @yuvBuf: input yuv
     * @timestamp: millisecond
     * @outBuf: output data's address, internal memory, so do not free it
     * @outBufSize: data size
     *
     * Return: 0 if success, -1 if error
    */
    int encode(YUVdataForMPEG1 *yuvBuf, long long int timestamp, unsigned char **outBuf, int *outBufSize, bool *isKeyframe);

    /*
     * Use it when you want to change resolution or other param
    */
    int finish();

private:
    int openMpeg1Encoder(Mpeg1Param *param);

private:
    Mpeg1Param m_userParam;
    OpaqueIoParam m_io;
    unsigned char *m_outBuf;
    int m_outDataSize;
    void *m_avformat;
    void *m_avcodec;
    void *m_avio;
    void *m_avframe;
    bool m_inited;
    long long int m_preTimestamp;
    long long int m_firstTimestamp;
	int m_count;
    const int m_bufSize = 1 * 1024 * 1024;
};

#endif // MPEG1TRANSCODER_H
