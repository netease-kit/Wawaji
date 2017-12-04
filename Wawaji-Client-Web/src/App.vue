<template>
  <div id="app">
    <div class="head">
      <i></i>
      <img src="./assets/logo.png" alt="网易云通讯与视频" class="logo">
      <img src="./assets/title.png" alt="可能是全球首个公开的WebRTC在线抓娃娃方案" class="title">
    </div>
    <div class="play clearfix">
      <player
        :gameState="gameState"
        :videoRTC="videoRTC"
        :videoPlayer="videoPlayer"
        :playAction="playAction"
        :roomName="roomName"
        :chatroomAction="chatroomAction"
        :onlineUserCount="onlineUserCount"
        :queueCount="queueCount"
        :currentPlayer="currentPlayer"
        :showRTC="showRTC"
        @onWaitForGame="onWaitForGame"
        @onGameStart="onGameStart"
        @onGameEnd="onGameEnd"
      ></player>
      <chatroom
        :chatroomMsgs="chatroomMsgs"
        :chatroomAction="chatroomAction"
      ></chatroom>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

import config from './configs'
import ChatRoomAction from './libs/ChatRoomAction.js'
import PlayAction from './libs/PlayAction.js'
import VideoRTC from './libs/VideoRTC.js'
import VideoPlayer from './libs/VideoPlayer.js'
import cookie from './libs/cookie.js'

import Chatroom from './components/Chatroom'
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
          console.log(this.account)
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
          onInitSuccess: resolve,
          onInitFailed: reject
        })
        this.playAction.onCommand = this.onGameFeedback
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.videoRTC = new VideoRTC({
          nim: this.playAction.nim,
          onInitSuccess: resolve
        })
        let rtcVideoNode = document.getElementById('rtc-video')
        if (rtcVideoNode) {
          this.videoRTC.setVideoContainer(rtcVideoNode)
          this.videoRTC.onGamePrepare = this.onGamePrepare
          // this.videoRTC.onGameStart = this.onGameStart
          this.videoRTC.onGameEnd = this.onGameEnd
          this.videoRTC.onWebRTCSetup = this.onWebRTCSetup
        }
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.chatroomAction = new ChatRoomAction({
          nim: this.playAction.nim,
          account: this.account,
          imToken: this.imToken,
          nickname: this.nickname,
          chatroomId: this.roomId,
          onInitSuccess: resolve,
          onInitFailed: reject
        })
        this.chatroomAction.onChatroomMsg = this.onChatroomMsg
        this.chatroomAction.onQueueOut = this.onQueueOut
      })
    }).then(() => {
      this.chatroomAction.onUpdateQueueMember = this.onUpdateQueueMember
      this.chatroomAction.updateQueueMember()
      return new Promise((resolve, reject) => {
        this.videoPlayer = new VideoPlayer({
          // addrs: [this.hlsPullUrl1, this.hlsPullUrl2],
          addrs: [this.rtmpPullUrl1, this.rtmpPullUrl2],
          onInitSuccess: resolve
        })
        let videoNode = document.getElementById('video-player')
        if (videoNode) {
          this.videoPlayer.setVideoContainer(videoNode)
          if (this.gameState === 'INIT' || this.gameState === 'QUEUE') {
            this.videoPlayer.changeCamera()
          }
        }
      })
    }).then(() => {
      console.log(`init done !`)
    }).catch(error => {
      window.alert('初始化页面失败，请刷新页面重试！')
      console.error(error)
    })
  },
  updated () {
    if (this.gameState !== 'GAMEIN') {
      this.showRTC = false
    }
  },
  data () {
    return {
      // 帐号信息
      account: '',
      nickname: '',
      imToken: '',
      // 对象实例
      playAction: null,
      videoRTC: null,
      videoPlayer: null,
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
      showRTC: false
    }
  },
  components: {
    Chatroom,
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
      this.gameStatePrev = 'QUEUE'
    },
    onGamePrepare () {
      this.playAction.resetCamera()
      this.gameState = 'PREPARE'
      this.gameStatePrev = 'PREPARE'
    },
    onGameStart () {
      this.videoPlayer.resetCamera()
      this.showRTC = true
      this.gameState = 'GAMEIN'
      this.gameStatePrev = 'GAMEIN'
    },
    onWebRTCSetup () {
      // this.videoPlayer.resetCamera()
      // this.showRTC = true
    },
    onGameEnd () {
      this.gameState = 'INIT'
      this.videoPlayer.changeCamera()
    },
    onChatroomMsg (msg) {
      this.chatroomMsgs.push(msg)
    },
    onGameFeedback (msg) {
      if (msg.type === 'result') {
        if (msg.data === 'false') {
          this.$showModal.showFail()
        } else {
          this.$showModal.showSuccess()
        }
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
  width: 1200px;
  margin: 100px auto 0;
}
</style>
