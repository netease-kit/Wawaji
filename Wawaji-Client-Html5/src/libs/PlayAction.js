import config from '../configs'

class PlayAction {
  constructor (obj) {
    let {account, imToken, machineId, onInitSuccess, onInitFailed} = obj
    console.log(account)
    this._machineId = machineId
    this._cameraId = 1
    this._uuid = null
    this._serial = null
    this._uuidTimer = null
    let self = this
    window._nim = SDK.NIM.getInstance({
      debug: false,
      appKey: config.appKey,
      account,
      db: false,
      token: imToken,
      syncRelations: false,
      syncFriends: false,
      syncFriendUsers: false,
      syncRoamingMsgs: false,
      syncMsgReceipts: false,
      syncTeams: false,
      syncExtraTeamInfo: false,
      onconnect () {
        onInitSuccess()
      },
      ondisconnect (error) {
        window.alert('网络状态不佳，请刷新页面，3秒后自动刷新页面')
        setTimeout(() => {
          window.location.reload()
        }, 3000)
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

  _sendCommand (command) {
    window._nim.sendCustomSysMsg({
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

  startGame () {
    this._sendCommand({
      command: 12,
      data: this._uuid,
      serial: this._serial
    })
  }

  endGame () {
    this._sendCommand({
      command: 13,
      data: this._uuid,
      serial: this._serial
    })
  }

  resetCamera () {
    this._cameraId = 1
  }

  setCameraId (cameraId) {
    this._cameraId = cameraId
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
        case 11:
          clearTimeout(this._uuidTimer)
          this._uuid = jsonData.data
          this._serial = jsonData.serial
          this.onCommand({
            type: 'calling',
            data: {
              uuid: this._data,
              serial: this._serial
            }
          })
          this._uuidTimer = setTimeout(() => {
            this._uuid = null
            this._serial = null
          }, 30000)
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
