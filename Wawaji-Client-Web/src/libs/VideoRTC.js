SDK.NIM.use(WebRTC)

class VideoRTC {
  constructor (obj) {
    let { nim, onInitSuccess, onGameStart, onGamePrepare } = obj
    this.videoContainer = null
    this._webrtcElement = null
    this._netcall = null
    this._beCalling = false
    this._beCalledInfo = null
    this._sessionConfig = {
      videoQuality: WebRTC.CHAT_VIDEO_QUALITY_480P,
      videoFrameRate: WebRTC.CHAT_VIDEO_FRAME_RATE_15
    }
    this._videoWidth = 480
    this._videoHeight = 480
    this._netcall = WebRTC.getInstance({
      debug: true,
      nim
    })
    this.__init()
    onInitSuccess = (onInitSuccess instanceof Function) ? onInitSuccess : function () { }
    onInitSuccess()
    if (onGameStart instanceof Function) {
      this.onGameStart = onGameStart
    }
    if (onGamePrepare instanceof Function) {
      this.onGamePrepare = onGamePrepare
    }
  }

  setVideoContainer (node) {
    this._webrtcElement = node
  }

  __init () {
    this._netcall.on('beCalling', obj => {
      console.log('on beCalling', obj)
      // 获取通话标识符 channelId, 每一通会话的 channelId 都不一样
      const { channelId } = obj
      // 通知对方自己已经收到此次通话的请求
      this._netcall.control({
        channelId,
        command: WebRTC.NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED
      })
      // 只有在没有通话并且没有被叫的时候才记录被叫信息, 否则直接挂断
      if (!this._netcall.calling && !this._beCalling) {
        this._beCalling = true
        this._beCalledInfo = obj
      } else {
        this._netcall.control({
          channelId: channelId,
          command: WebRTC.NETCALL_CONTROL_COMMAND_BUSY
        })
      }
      this.onGamePrepare()
    })

    this._netcall.on('callAccepted', obj => {
      this._beCalling = false
      // 接收方不需要开启设备
      console.log('on callAccepted', obj)
      this._netcall.startRtc().catch(err => {
        console.error(err)
      })
    })

    this._netcall.on('joinChannel', obj => {
      console.log('on joinChannel', obj)
      this._netcall.setVideoViewRemoteSize({
        width: this._videoWidth,
        height: this._videoHeight,
        cut: true
      })
      this._netcall.startRemoteStream({
        uid: obj.uid,
        node: this._webrtcElement
      })
      this.onWebRTCSetup()
    })

    this._netcall.on('hangup', obj => {
      this.__resetWhenHangup()
      this.onGameEnd()
    })
  }

  __resetWhenHangup () {
    this._beCalledInfo = null
    this._beCalling = false
    this._netcall.stopLocalStream()
    this._netcall.stopRemoteStream()
  }

  __hangup () {
    this._netcall.hangup()
    this.__resetWhenHangup()
  }

  __acceptRTC () {
    // 告知对方同意通话
    this._netcall.response({
      accepted: true,
      beCalledInfo: this._beCalledInfo,
      sessionConfig: this._sessionConfig
    }).catch(err => {
      this._netcall.control({
        channelId: this._beCalledInfo.channelId,
        command: WebRTC.NETCALL_CONTROL_COMMAND_BUSY
      })
      this.__hangup()
      this._beCalledInfo = null
      console.log('接听失败', err)
    })
  }

  __rejectRTC () {
    this._netcall.response({
      accepted: false,
      beCalledInfo: this._beCalledInfo,
      sessionConfig: this._sessionConfig
    }).catch(err => {
      this._netcall.control({
        channelId: this._beCalledInfo.channelId,
        command: WebRTC.NETCALL_CONTROL_COMMAND_BUSY
      })
      this.__hangup()
      this._beCalledInfo = null
      console.log('接听失败', err)
    })
  }

  endGame () {
    this.__rejectRTC()
    this.__hangup()
    this._beCalledInfo = null
    // this.onGameEnd()
  }

  startGame () {
    this.__acceptRTC()
    this.onGamePrepare()
  }

  onWebRTCSetup () {
  }

  onGamePrepare () {
  }

  onGameStart () {
  }

  onGameEnd () {
  }
}

export default VideoRTC
