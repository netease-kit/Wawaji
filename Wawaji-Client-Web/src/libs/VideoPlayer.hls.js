class VideoPlayer {
  constructor (obj) {
    const {addrs, onInitSuccess} = obj
    this._addrs = addrs // ['/test.flv', '/test2.flv'],
    this._playElement = null
    this._cameraId = 1
    this._player = null
    onInitSuccess()
  }

  setVideoContainer (node) {
    this._playElement = node
    // if (neplayer.checkFlash()) {
    //   // ...
    // } else {
    //   document.getElementById('flash-tag').style.display = ''
    //   this._playElement.style.display = 'none'
    // }
  }

  __destroyPlayer () {
    if (this._player) {
      this._player.dispose()
      this._player = null
    }
  }

  __loadPlay () {
    let address = this._addrs[this._cameraId - 1]
    console.log(address)
    if (!this._player) {
      this._player = videojs(this._playElement, {
        controls: false,
        preload: 'auto',
        autoplay: true,
        sources: [
          {
            src: address,
            type: 'application/x-mpegURL'
            // type: 'video/x-flv'
          }
        ]
      }, () => {
        console.info('初始化成功！')
      })
      this._player.on('error', (err) => {
        console.error(err)
        setTimeout(() => {
          this.resetCamera()
          this.__loadPlay()
        }, 1000)
      })
    } else {
      this._player.src({
        src: address,
        type: 'application/x-mpegURL'
        // type: 'video/x-flv'
      })
      this._player.play()
    }
  }

  changeCamera (needChange) {
    if (needChange) {
      this._cameraId = this._cameraId === 1 ? 2 : 1
    }
    this.__loadPlay()
  }

  resetCamera () {
    this.__destroyPlayer()
    var parent = document.getElementById('videoContainer')
    var node = document.createElement('video')
    // <video id="rtmp-video" class="video-player video-js" width="480" height="480">
    node.id = 'video-player'
    node.className = 'video-player video-js'
    node.width = '480'
    node.height = '480'
    parent.appendChild(node)
    this._player = null
    this._playElement = node
  }
}

export default VideoPlayer
