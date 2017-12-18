SDK.NIM.use(WhiteBoard)

class VideoH5 {
  constructor (obj) {
    const {nim, channelName, onInitSuccess, onInitFailed} = obj
    window._whiteboard = WhiteBoard.getInstance({
      nim: nim,
      container: null,
      isCustom: true,
      // 是否开启日志打印
      debug: false
    })
    window._whiteboard2 = WhiteBoard.getInstance({
      nim: nim,
      container: null,
      isCustom: true,
      // 是否开启日志打印
      debug: false
    })
    this._cameraId = 1
    this._channelPrefix = channelName // '19228060'
    window._player1 = null
    window._player2 = null
    this._playElement1 = null
    this._playElement2 = null
    this._disableGl = false
  }

  setVideoContainer (node, callback) {
    let channelName = `${this._channelPrefix}_1`
    this._playElement1 = node
    window._player1 = new JSMpeg.Player(window._whiteboard, {
      channelName,
      canvas: this._playElement1,
      disableGl: this._disableGl,
      onSetup () {
        console.log(new Date(), 'camera 1 whiteboard room joined')
        // ... 白板joinroom
      },
      onStartRender () {
        if (callback instanceof Function) {
          callback()
        }
      }
    })
    callback()
  }
  
  setVideoContainer2 (node, callback) {
    let channelName = `${this._channelPrefix}_2`
    this._playElement2 = node
    window._player2 = new JSMpeg.Player(window._whiteboard2, {
      channelName,
      disableGl: this._disableGl,
      canvas: this._playElement2,
      onSetup () {
        console.log(new Date(), 'camera 2 whiteboard room joined')
        // ... 白板joinroom
      },
      onStartRender () {
        if (callback instanceof Function) {
          callback()
        }
      }
    })
    callback()
  }

  changeCamera () {
    this._cameraId = this._cameraId === 1 ? 2 : 1
    if (this._cameraId === 1) {
      window._player1.startRender()
      window._player2.stopRender()
    } else {
      window._player1.stopRender()
      window._player2.startRender()
    }
  }

  getCameraId () {
    return this._cameraId
  }

  resetCamera () {
    this._cameraId = 1
    window._player1.startRender()
    window._player2.stopRender()
  }
}

export default VideoH5
