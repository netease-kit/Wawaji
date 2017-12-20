import config from '../configs/index'

class ChatRoomAction {
  constructor (obj) {
    const {nim, chatroomId, account, imToken, nickname, onInitSuccess, onInitFailed} = obj
    this._chatroom = null
    this._nickname = nickname
    this._account = account
    this._imToken = imToken
    this._chatroomId = chatroomId
    this.__onInitSuccess = onInitSuccess
    this.__onInitFailed = onInitFailed
    this.inQueue = false
    nim.getChatroomAddress({
      chatroomId,
      done: this.__getChatroomAddressDone.bind(this)
    })
  }

  __getChatroomAddressDone (error, obj) {
    if (error) {
      this.__onInitFailed(error)
      return
    }
    let self = this
    const {address} = obj
    this._chatroom = SDK.Chatroom.getInstance({
      appKey: config.appKey,
      account: this._account,
      token: this._imToken,
      chatroomId: this._chatroomId,
      chatroomAddresses: address,
      onconnect () {
        self.__onInitSuccess()
      },
      onerror (error) {
        self.__onInitFailed(error)
      },
      ondisconnect (error) {
        self.__onInitFailed(error)
      },
      // 消息
      onmsgs: self.__onChatroomMsgs.bind(self)
    })
  }

  __onChatroomMsgs (msgs) {
    let self = this
    msgs.forEach(msg => {
      if (msg.type === 'notification') {
        let attach = msg.attach
        let qc = attach.queueChange || {}
        switch (attach.type) {
          case 'updateQueue':
            if (qc.type === 'POLL') {
              if (qc.elementKey === self._account && self.inQueue) {
                self.inQueue = false
                self.onQueueOut()
              }
            }
            self.updateQueueMember()
            break
          case 'batchUpdateQueue':
            if (qc.type === 'POLL') {
              if (qc.elementKey === self._account && self.inQueue) {
                self.inQueue = false
                self.onQueueOut()
              }
            }
            self.updateQueueMember()
            break
          case 'memberExit':
            msg.text = '离开了聊天室'
            self.onChatroomMsg(msg)
            break
          case 'memberEnter':
            msg.text = '加入了聊天室'
            self.onChatroomMsg(msg)
            break
        }
      } else {
        self.onChatroomMsg(msg)
      }
    })
  }

  sendChatroomMsg (text) {
    let self = this
    this._chatroom.sendText({
      text,
      done (err, msg) {
        if (err) {
          if (err && err.code === 'Error_Connection_Socket_State_not_Match') {
            window.alert(`您已被踢，请刷新页面！`)
            return
          }
          console.error(err)
        } else {
          self.onChatroomMsg(msg)
        }
      }
    })
  }

  waitForGame () {
    let self = this
    this._chatroom.queueOffer({
      // elementKey: 'player10020976',
      // elementValue: JSON.stringify({
      //   nick: '玩家289198',
      //   webrtc: 1
      // }),
      elementKey: this._account,
      elementValue: JSON.stringify({
        nick: this._nickname,
        webrtc: 1
      }),
      transient: true,
      done (err, obj, content) {
        if (err && err.code === 'Error_Connection_Socket_State_not_Match') {
          window.alert(`您已被踢，请刷新页面！`)
          return
        }
        self.inQueue = true
        console.log('queueOffer', err, obj, content)
      }
    })
  }

  giveUpForGame () {
    let self = this
    this._chatroom.queuePoll({
      elementKey: this._account,
      done (err, obj, content) {
        if (err && err.code === 'Error_Connection_Socket_State_not_Match') {
          window.alert(`您已被踢，请刷新页面！`)
          return
        }
        self.inQueue = false
        console.log('queuePoll', err, obj, content)
      }
    })
  }

  updateQueueMember () {
    let queueCount = null
    let currentPlayer = null
    let self = this
    this._chatroom.queueList({
      done (err, obj, content) {
        if (err) {
          console.error(err)
        }
        console.log(content)
        if (content && content.queueList) {
          queueCount = 0
          for (let i = 0; i < content.queueList.length; i++) {
            let queue = content.queueList[i]
            let currAccount = Object.keys(queue)[0]
            if (currAccount === self._account) {
              break
            }
            queueCount++
          }
          currentPlayer = content.queueList[0]
          if (currentPlayer) {
            let currAccount = Object.keys(currentPlayer)[0]
            currentPlayer = JSON.parse(currentPlayer[currAccount])
            currentPlayer = currentPlayer.nick
          }

          // console.log(content.queueList, 222222222)
          self.onUpdateQueueMember({
            currentPlayer,
            queueCount
          })
        }
      }
    })
  }

  // 更新队列人数
  onUpdateQueueMember () {

  }

  // 聊天室消息
  onChatroomMsg (msg) {

  }

  onQueueOut () {

  }
}

export default ChatRoomAction
