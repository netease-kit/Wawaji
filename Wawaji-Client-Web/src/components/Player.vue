<template>
  <div class="container">
    <div class="info clearfix">
      <span class="name">{{roomName}}</span>
      <span class="total">人数: {{onlineUserCount}}</span>
    </div>
    <audio id="background-audio" src="./test.mp3" autoplay loop></audio>
    <div class="video">
      <button class="change" @click="changeCamera">切换</button>
      <button class="voice" :class="{voiceclose:audioMute}" @click="changeAudio">播放</button>
      <div v-show="showRTC" id="rtc-video" class="video-player"></div>
      <div v-show="!showRTC" style="width: 100%; height: 100%;" id="videoContainer">
        <object id="flash-tag" width="480" height="480" style="display:none;" data="./3rd/video-js.swf"></object>
        <video id="video-player" class="video-player video-js" width="480" height="480">
        </video>
      </div>
    </div>
    <div v-if="gameState=='INIT'" class="control">
      <div v-if="currentPlayer" class="tip">{{currentPlayer}}正在游戏中…</div>
      <div class="queue-player">前面还有<span class="light">{{queueCount}}</span>人排队</div>
      <button v-show="showPrepareBtn" class="begin" @click="waitForGame">开始排队</button>
    </div>
    <div v-else-if="gameState=='QUEUE'" class="control">
      <div v-if="currentPlayer" class="tip">{{currentPlayer}}正在游戏中…</div>
      <div class="queue-player">前面还有<span class="light">{{queueCount}}</span>人排队</div>
      <button class="prepare" @click="giveUpForGame">放弃排队</button>
    </div>
    <div v-else-if="gameState=='PREPARE'" class="control">
      <div class="tip">准备就绪...</div>
      <button class="begin" @click="startGame">开始游戏 ({{countDownNum}}s)</button>
    </div>
    <div v-else-if="gameState=='PREPARE_FAIL'" class="control">
      <div class="tip">游戏准备失败...</div>
    </div>
    <div v-else-if="gameState=='GAMEIN'" class="control">
      <button class="up" @mousedown="playUp" @mouseup="playStop">上</button>
      <button class="down" @mousedown="playDown" @mouseup="playStop">下</button>
      <button class="left" @mousedown="playLeft" @mouseup="playStop">左</button>
      <button class="right" @mousedown="playRight" @mouseup="playStop">右</button>
      <button class="begin" @click="playGrab">go!{{gameCountDownNum}}s</button>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'gameState',
    'playAction',
    'chatroomAction',
    'videoRTC',
    'videoPlayer',
    'roomName',
    'onlineUserCount',
    'queueCount',
    'currentPlayer',
    'showRTC'
  ],
  mounted () {
    if (this.gameState === 'PREPARE') {
      this.countDown()
    }
    this.$nextTick(() => {
      if (this.videoRTC) {
        this.videoRTC.setVideoContainer(document.getElementById('rtcVideo'))
      }
    })
    // this.$showModal.showSuccess()
    // this.$showModal.showFail()
  },
  watch: {
    gameState (curVal, oldVal) {
      if (curVal === 'PREPARE') {
        this.countDownNum = 10
        this.countDown()
      } else if (curVal === 'GAMEIN') {
        this.gameCountDownNum = 30
        this.gameCountDown()
      } else if (curVal === 'INIT') {
        this.showPrepareBtn = false
        setTimeout(() => {
          this.showPrepareBtn = true
        }, 500)
      }
      console.log(curVal, oldVal)
    }
  },
  data () {
    return {
      gameCountDownNum: 30,
      gameCountDownTimer: null,
      countDownNum: 10,
      countDownTimer: null,
      audioMute: false,
      showPrepareBtn: true,
    }
  },
  methods: {
    changeCamera () {
      if (this.gameState === 'GAMEIN') {
        this.playAction.changeCamera()
      } else {
        this.videoPlayer.changeCamera(true)
      }
    },
    changeAudio () {
      this.audioMute = !this.audioMute
      if (this.audioMute) {
        document.getElementById('background-audio').pause()
      } else {
        document.getElementById('background-audio').play()
      }
    },
    playLeft () {
      this.playAction.playLeft()
    },
    playRight () {
      this.playAction.playRight()
    },
    playUp () {
      this.playAction.playUp()
    },
    playDown () {
      this.playAction.playDown()
    },
    playStop () {
      this.playAction.playStop()
    },
    playGrab () {
      clearTimeout(this.gameCountDownTimer)
      this.gameCountDownNum = 0
      this.playAction.playGrab()
    },
    waitForGame () {
      setTimeout(() => {
        console.log(new Date(), 'wait for game')
        this.chatroomAction.waitForGame()
      }, 10)
      this.$emit('onWaitForGame')
    },
    giveUpForGame () {
      setTimeout(() => {
        // UI更新以后才真正发出放弃游戏请求
        this.chatroomAction.giveUpForGame()
      }, 10)
      this.$emit('onGameEnd')
    },
    countDown () {
      this.countDownTimer = setTimeout(() => {
        this.countDownNum--
        if (this.countDownNum > 0) {
          this.countDown()
        } else {
          this.endGame()
        }
      }, 1000)
    },
    gameCountDown () {
      this.gameCountDownTimer = setTimeout(() => {
        this.gameCountDownNum--
        if (this.gameCountDownNum > 0) {
          this.gameCountDown()
        } else {
          this.playGrab()
        }
      }, 1000)
    },
    startGame () {
      if (this.countDownNum > 0) {
        clearTimeout(this.countDownTimer)
        this.videoRTC.startGame()
        this.$emit('onGameStart')
      }
    },
    endGame () {
      clearTimeout(this.countDownTimer)
      console.log(new Date(), 'end game')
      this.videoRTC.endGame()
      // 真正发出放弃游戏请求以后才UI更新
      this.$emit('onGameEnd')
    }
  },
  computed: {
    // showRTC () {
    //   if (this.gameState === 'GAMEIN') {
    //   // if (this.gameState === 'PREPARE' || this.gameState === 'GAMEIN') {
    //     return true
    //   }
    //   return false
    // }
  }
}
</script>
<style lang="postcss" scoped>
  .container {
    position: relative;
    float: left;
    width: 810px;
    height: 500px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #00b8A5;
    box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.12);
    border-radius: 20px;
  }
  .info {
    position: absolute;
    top: -41px;
    left: 20px;
    width: 225px;
    height: 40px;
    padding-top: 5px;
    box-sizing: border-box;
    background: url('../assets/room.png') no-repeat;
    font-size: 14px;
    color: #006565;
    letter-spacing: 0;
    line-height: 40px;
    .name {
      float: left;
      margin-left: 46px;
    }
    .total {
       float: right;
       margin-right: 20px;
    }
  }
  .video {
    width: 480px;
    height: 480px;
    float: left;
    position: relative;
    border-radius: 20px;
    background-color: #000;
    overflow: hidden;
    video {
      width: 100%;
      height: 100%;
    }
    button {
      border: none;
      width: 46px;
      height: 48px;
      font-size: 0;
      z-index: 5;
    }
    .change {
      position: absolute;
      top: 10px;
      right: 60px;
      background: url('../assets/change.png') no-repeat;
      &:active {
        background: url('../assets/change_press.png') no-repeat;
      }
    }
    .voice {
      position: absolute;
      top: 10px;
      right: 5px;
      background: url('../assets/voice_open.png') no-repeat;
      &:active {
        background: url('../assets/voice_open_press.png') no-repeat;
      }
    }
    .voiceclose {
      background: url('../assets/voice_close.png') no-repeat;
      &:active {
        background: url('../assets/voice_close_press.png') no-repeat;
      }
    }
    .video-player {
      positon: relative;
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .control {
    float: left;
    position: relative;
    margin-left: 10px;
    width: 298px;
    height: 100%;
    background: #F1F3F5;
    border-radius: 12px;
    .tip {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 300px;
      font-size: 16px;
      line-height: 16px;
      color: #333333;
    }
    .begin {
      position: absolute;
      left: 50%;
      margin-left: -98px;
      bottom: 20px;
      width: 196px;
      height: 66px;
      border: none;
      font-size: 18px;
      color: #FFFFFF;
      letter-spacing: 3px;
      background: url('../assets/begin.png') no-repeat 0 8px;
      &:active {
        background: url('../assets/begin_press.png') no-repeat 0 8px;
      }
    }
    .prepare {
      position: absolute;
      left: 50%;
      margin-left: -98px;
      bottom: 20px;
      width: 196px;
      height: 66px;
      border: none;
      font-size: 18px;
      color: #FFFFFF;
      letter-spacing: 3px;
      background: url('../assets/begin.png') no-repeat 0 8px;
      cursor: auto;
    }
    .queue-player {
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 90px;
      font-size: 12px;
      color: #AFAFAF;
      letter-spacing: 0;
      line-height: 12px;
      .light {
        color: #FF6D44;
      }
    }
    .up, .down, .left, .right{
      position: absolute;
      width: 58px;
      height: 62px;
      border: none;
      font-size: 0;
    }
    .up {
      top: 197px;
      left: 50%;
       margin-left: -29px;
      background: url('../assets/up.png') no-repeat;
      &:active {
        background: url('../assets/up_press.png') no-repeat;
      }
    }
    .down {
      bottom: 100px;
      left: 50%;
      margin-left: -29px;
      background: url('../assets/down.png') no-repeat;
      &:active {
        background: url('../assets/down_press.png') no-repeat;
      }
    }
    .left {
      top: 253px;
      right: 50%;
       margin-right: 28px;
      background: url('../assets/left.png') no-repeat;
      &:active {
        background: url('../assets/left_press.png') no-repeat;
      }
    }
     .right {
      top: 253px;
      left: 50%;
      margin-left: 28px;
      background: url('../assets/right.png') no-repeat;
      &:active {
        background: url('../assets/right_press.png') no-repeat;
      }
    }

  }
</style>


