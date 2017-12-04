import config from '../configs'

class PlayAction {
  constructor (obj) {
    let {account, imToken, machineId, onInitSuccess, onInitFailed} = obj
    this._machineId = machineId
    this._cameraId = 1
    let self = this
    this._nim = SDK.NIM.getInstance({
      debug: true,
      appKey: config.appKey,
      account,
      db: false,
      token: imToken,
      onconnect () {
        onInitSuccess()
      },
      ondisconnect (error) {
        if (error.code === 'kicked') {
          let map = {
            PC: '电脑版',
            Web: '网页版',
            Android: '手机版',
            iOS: '手机版',
            WindowsPhone: '手机版'
          }
          let str = error.from
          let errorMsg = `你的帐号于${new Date()}被${(map[str] || '其他端')}踢出下线!`
          window.alert(errorMsg)
          return
        }
        onInitFailed(error)
      },
      onerror (error) {
        console.error(error)
        onInitFailed(error)
      },
      oncustomsysmsg (msg) {
        self._onCustomSysMsg(msg)
      }
    })
    onInitSuccess = (onInitSuccess instanceof Function) ? onInitSuccess : function () { }
    onInitFailed = (onInitFailed instanceof Function) ? onInitFailed : function () { }
  }

  get nim () {
    return this._nim
  }

  _sendCommand (command) {
    this._nim.sendCustomSysMsg({
      scene: 'p2p',
      to: this._machineId,
      content: JSON.stringify(command),
      sendToOnlineUsersOnly: true
    })
  }

  playLeft () {
    if (this._cameraId === 1) {
      this._sendCommand({
        command: 1,
        data: 'left'
      })
    } else {
      this._sendCommand({
        command: 1,
        data: 'down'
      })
    }
  }

  playRight () {
    if (this._cameraId === 1) {
      this._sendCommand({
        command: 1,
        data: 'right'
      })
    } else {
      this._sendCommand({
        command: 1,
        data: 'up'
      })
    }
  }

  playUp () {
    if (this._cameraId === 1) {
      this._sendCommand({
        command: 1,
        data: 'up'
      })
    } else {
      this._sendCommand({
        command: 1,
        data: 'left'
      })
    }
  }

  playDown () {
    if (this._cameraId === 1) {
      this._sendCommand({
        command: 1,
        data: 'down'
      })
    } else {
      this._sendCommand({
        command: 1,
        data: 'right'
      })
    }
  }

  playStop () {
    this._sendCommand({
      command: 1,
      data: 'stop'
    })
  }

  playGrab () {
    this._sendCommand({
      command: 2
    })
  }

  resetCamera () {
    this._cameraId = 1
  }

  changeCamera () {
    this._cameraId = this._cameraId === 1 ? 2 : 1
    this._sendCommand({
      command: 3,
      data: this._cameraId
    })
  }

  _onCustomSysMsg (msg) {
    if (msg.content) {
      let jsonData = JSON.parse(msg.content)
      // console.log(jsonData)
      switch (jsonData.command) {
        case 4:
          this.onCommand({
            type: 'result',
            data: jsonData.data
          })
          break
        case 5:
          this.onCommand({
            type: 'debug',
            data: jsonData.data
          })
          break
        default:
          break
      }
    }
  }

  onCommand (msg) {
    console.log(2222, msg)
  }
}

export default PlayAction
