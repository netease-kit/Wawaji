<template>
  <div id="app">
    <!--div class="head">
      <i></i>
      <img src="./assets/logo.png" alt="网易云通讯与视频" class="logo">
      <img src="./assets/title.png" alt="可能是全球首个公开的WebRTC在线抓娃娃方案" class="title">
    </div-->
    <div class="play clearfix">
      <player
        :gameState="gameState"
        :videoH5="videoH5"
        :playAction="playAction"
        :roomName="roomName"
        :chatroomAction="chatroomAction"
        :onlineUserCount="onlineUserCount"
        :queueCount="queueCount"
        :currentPlayer="currentPlayer"
        :showH5="showH5"
        :showAdvertisement="showAdvertisement"
        @onWaitForGame="onWaitForGame"
        @onGameStart="onGameStart"
        @onGameEnd="onGameEnd"
      ></player>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

import config from './configs'
import ChatRoomAction from './libs/ChatRoomAction.js'
import PlayAction from './libs/PlayAction.js'
import VideoH5 from './libs/VideoH5.js'
import cookie from './libs/cookie.js'

import Player from './components/Player'

/* 页面状态包括：
  INIT 排队
  QUEUE 排队中
  PREPARE 准备中
  PREPARE_FAIL 游戏准备失败
  GAMEIN 游戏中
*/

export default {
  created () {
    this.account = cookie.readCookie('sid') || ''
    axios({
      method: 'post',
      url: `${config.ajaxHost}/dollsCatcher/tourist`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: `sid=${this.account}`
    }).then(resp => {
      if (resp.status === 200) {
        if (resp.data.code === 200) {
          let data = resp.data.data
          this.account = data.accid
          console.log(new Date(), 'get room info done, account:', this.account)
          cookie.setCookie('sid', this.account)
          this.imToken = data.imToken
          this.nickname = data.nickname
          return Promise.resolve()
        }
        return Promise.reject(resp.data)
      } else {
        return Promise.reject(resp)
      }
    }).then(() => {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: `${config.ajaxHost}/dollsCatcher/room/list`,
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: `sid=${this.account}`
        }).then(resp => {
          if (resp.status === 200) {
            if (resp.data.code === 200) {
              let data = resp.data.data
              let room = data.list[0]
              this.machineId = room.creator
              this.roomId = room.roomId
              this.roomName = room.name
              this.onlineUserCount = room.onlineUserCount
              this.queueCount = room.queueCount
              this.httpPullUrl1 = room.httpPullUrl1
              this.httpPullUrl2 = room.httpPullUrl2
              this.rtmpPullUrl1 = room.rtmpPullUrl1
              this.rtmpPullUrl2 = room.rtmpPullUrl2
              this.hlsPullUrl1 = room.hlsPullUrl1
              this.hlsPullUrl2 = room.hlsPullUrl2
              console.log(new Date(), 'get room list done, room:', this.roomId)
              resolve()
            } else {
              reject(resp.data)
            }
          } else {
            reject(resp)
          }
        })
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.playAction = new PlayAction({
          account: this.account,
          imToken: this.imToken,
          machineId: this.machineId,
          onInitSuccess () {
            console.log(new Date(), 'im sdk connected')
            resolve()
          },
          onInitFailed: reject
        })
        this.playAction.onCommand = this.onGameFeedback
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.videoH5 = new VideoH5({
          nim: window._nim,
          channelName: this.roomId
          // onInitSuccess: resolve,
          // onInitFailed: reject
        })
        setTimeout(() => {
          let promiseList = []
          let h5VideoNode = document.getElementById('h5-video')
          if (h5VideoNode) {
            promiseList.push(new Promise((resolve, reject) => {
              this.videoH5.setVideoContainer(h5VideoNode, () => {
                console.log(new Date(), 'camera 1 inited')
                resolve()
              })
            }))
          }
          let h5VideoNode2 = document.getElementById('h5-video-2')
          if (h5VideoNode2) {
            promiseList.push(new Promise((resolve, reject) => {
              this.videoH5.setVideoContainer2(h5VideoNode2, () => {
                console.log(new Date(), 'camera 2 inited')
                resolve()
              })
            }))
          }
          Promise.all(promiseList).then(() => {
            this.videoH5.resetCamera()
            resolve()
          })
        }, 20)
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.chatroomAction = new ChatRoomAction({
          nim: window._nim,
          account: this.account,
          imToken: this.imToken,
          nickname: this.nickname,
          chatroomId: this.roomId,
          onInitSuccess () {
            console.log(new Date(), 'chatroom sdk connected')
            resolve()
          },
          onInitFailed: reject
        })
        this.chatroomAction.onChatroomMsg = this.onChatroomMsg
        this.chatroomAction.onQueueOut = this.onQueueOut
      })
    }).then(() => {
      this.showAdvertisement = false
      const audioNode = document.getElementById('background-audio')
      audioNode.autoplay = false
      audioNode.pause()
      this.chatroomAction.onUpdateQueueMember = this.onUpdateQueueMember
      this.chatroomAction.updateQueueMember()
      console.log(new Date(), 'room inited')
      return Promise.resolve()
    }).then(() => {
      console.log(`init done !`)
    }).catch(error => {
      window.alert('初始化页面失败，请刷新页面重试！')
      console.error(error)
    })
  },
  updated () {
    // if (this.gameState !== 'GAMEIN') {
    //   this.showH5 = false
    // }
  },
  data () {
    return {
      // 帐号信息
      account: '',
      nickname: '',
      imToken: '',
      // 对象实例
      playAction: null,
      videoH5: null,
      chatroomAction: null,
      chatroomMsgs: [],
      // 房间状态
      machineId: '',
      roomStatus: true,
      roomName: '',
      roomId: '',
      // 在线用户数
      onlineUserCount: 0,
      // 排队用户数
      queueCount: 0,
      currentPlayer: '',
      // 游戏状态
      gameState: 'INIT',
      gameStatePrev: 'INIT',
      showH5: true,
      showAdvertisement: true
    }
  },
  components: {
    Player
  },
  methods: {
    onUpdateQueueMember ({currentPlayer, queueCount}) {
      console.log(currentPlayer, queueCount)
      if (Object.prototype.toString.apply(currentPlayer) !== '[object Null]') {
        this.currentPlayer = currentPlayer
      }
      if (Object.prototype.toString.apply(queueCount) !== '[object Null]') {
        this.queueCount = queueCount
        if (queueCount === 0) {
          this.currentPlayer = ''
        }
      }
    },
    onQueueOut () {
      if (this.gameStatePrev === 'QUEUE') {
        window.alert('由于您之前异常操作，排队失败，请重新排队')
        this.onGameEnd()
      }
    },
    onWaitForGame () {
      this.gameState = 'QUEUE'
      setTimeout(() => {
        this.gameStatePrev = 'QUEUE'
      }, 50)
    },
    onGamePrepare () {
      // this.playAction.resetCamera()
      this.gameState = 'PREPARE'
      setTimeout(() => {
        this.gameStatePrev = 'PREPARE'
      }, 50)
    },
    onGameStart () {
      // this.showH5 = true
      this.gameState = 'GAMEIN'
      setTimeout(() => {
        this.gameStatePrev = 'GAMEIN'
      }, 50)
    },
    onGameEnd () {
      this.gameState = 'INIT'
      this.chatroomAction.updateQueueMember()
    },
    onChatroomMsg (msg) {
      this.chatroomMsgs.push(msg)
    },
    onGameFeedback (msg) {
      if (msg.type === 'result') {
        if (msg.data === 'false') {
          console.info('show failed!')
          this.$showModal.showFail()
        } else if (msg.data === 'true') {
          console.info('show success!')
          this.$showModal.showSuccess()
        }
        this.onGameEnd()
      } else if (msg.type === 'calling') {
        this.onGamePrepare()
      }
    }
  }
}
</script>
<style>
.clearfix {
  zoom:1;
}
.clearfix:after {
  display:block;
  clear:both;
  visibility:hidden;
  height:0;
  overflow:hidden;
  content:".";
}
</style>

<style lang="postcss" scoped>
#app {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
}
.head {
  width: 100%;
  height: 50px;
  background-color: #17c5b4;
  i {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  img {
    vertical-align:middle;
  }
  .logo {
    margin-left: 20px;

  }
  img + img {
    margin-left: 10px;
  }
}
.play {
  width: 96%;
  margin: 4rem auto 2rem auto;
}
</style>
