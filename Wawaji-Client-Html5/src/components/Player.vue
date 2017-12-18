<template>
  <div class="container">
    <div class="info clearfix">
      <span class="name">{{roomName}}</span>
      <span class="total">人数: {{onlineUserCount}}</span>
    </div>
    <audio id="background-audio" src="./test.mp3" loop></audio>
    <div class="video">
      <button class="change" @click.stop.prevent="changeCamera">切换</button>
      <button class="voice" :class="{voiceclose:audioMute}" @click.stop.prevent="changeAudio">播放</button>
      <div class="video-player">
        <canvas id="h5-video" width="480" height="480"></canvas>
        <canvas id="h5-video-2" width="480" height="480"></canvas>
      </div>
      <div v-show="!showH5" class="video-player" id="videoContainer">
        <object id="flash-tag" width="480" height="480" style="display:none;" data="./3rd/video-js.swf"></object>
        <video id="video-player" class="video-player video-js" width="480" height="480"></video>
      </div>
      <img class="video-bg-img" :class="{'opacity-hide':!showAdvertisement}" src="../assets/video-bg.jpg">
    </div>
    <div v-if="gameState=='INIT'" class="control">
      <div v-if="currentPlayer" class="tip">{{currentPlayer}}正在游戏中…</div>
      <div class="queue-player">前面还有<span class="light">{{queueCount}}</span>人排队</div>
      <button v-if="showAdvertisement" class="begin" >正在初始化...</button>
      <button v-else v-show="showPrepareBtn" class="begin" @click="waitForGame">开始排队</button>
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
      <div v-if="isMobile">
        <button class="up" @touchstart.prevent="playUp">上</button>
        <button class="down" @touchstart.prevent="playDown">下</button>
        <button class="left" @touchstart.prevent="playLeft">左</button>
        <button class="right" @touchstart.prevent="playRight">右</button>
        <button class="grab" @touchstart.prevent="playGrab">go!{{gameCountDownNum}}s</button>
      </div>
      <div v-else>
        <button class="up" @click.prevent="playUp">上</button>
        <button class="down" @click.prevent="playDown">下</button>
        <button class="left" @click.prevent="playLeft">左</button>
        <button class="right" @click.prevent="playRight">右</button>
        <button class="grab" @click.prevent="playGrab">go!{{gameCountDownNum}}s</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'gameState',
    'playAction',
    'chatroomAction',
    'videoH5',
    'roomName',
    'onlineUserCount',
    'queueCount',
    'currentPlayer',
    'showH5',
    'showAdvertisement'
  ],
  mounted () {
    if (this.gameState === 'PREPARE') {
      this.countDown()
    }
    this.$nextTick(() => {
      if (this.videoH5) {
        this.videoH5.setVideoContainer(document.getElementById('rtcVideo'))
      }
    })
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
        }, 100)
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
      audioMute: true,
      showPrepareBtn: true
    }
  },
  methods: {
    changeCamera () {
      // if (this.gameState === 'GAMEIN') {
      //   this.playAction.changeCamera()
      // } else {
      // }
      this.videoH5.changeCamera(true)
      let cameraId = this.videoH5.getCameraId()
      console.log('change camera:', cameraId)
      this.playAction.setCameraId(cameraId)
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
      this.playAction.playGrab()
      clearTimeout(this.gameCountDownTimer)
      // this.gameCountDownNum = 0
    },
    waitForGame () {
      setTimeout(() => {
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
      clearTimeout(this.countDownTimer)
      this.playAction.startGame()
      this.$emit('onGameStart')
    },
    endGame () {
      clearTimeout(this.countDownTimer)
      this.playAction.endGame()
      // 真正发出放弃游戏请求以后才UI更新
      this.$emit('onGameEnd')
    }
  },
  computed: {
    isMobile () {
      return window.isMobile
    }
  }
}
</script>
<style lang="postcss" scoped>
  .container {
    position: relative;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #a2feff;
    /* border: 1px solid #00b8A5; */
    box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.12);
    border-radius: 0.5rem;
  }
  .info {
    position: absolute;
    top: -2.4rem;
    left: 0.5rem;
    width: 14rem;
    height: 2.8rem;
    box-sizing: border-box;
    background: url('../assets/room.png') no-repeat;
    background-size: 14rem 2.8rem;
    font-size: 0.9rem;
    color: #006565;
    letter-spacing: 0;
    line-height: 2.8rem;
    .name {
      float: left;
      margin-left: 2.8rem;
    }
    .total {
      float: right;
      margin-right: 1rem;
    }
  }
  .video {
    position: relative;
    width: 100%;
    height: auto;
    border-radius: 0.6rem;
    background-color: #000;
    overflow: hidden;
    z-index: 1;
    .video-bg-img {
      position: relative;
      display: block;
      width: 100%;
      height: auto;
      z-index: 1;
    }
    video {
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    button {
      border: none;
      width: 2.4rem;
      height: 2.4rem;
      font-size: 0;
      z-index: 5;
    }
    .change {
      position: absolute;
      top: 0.9rem;
      right: 4.2rem;
      background: url('../assets/change.png') no-repeat;
      background-size: 2.4rem 2.4rem;
      &:active {
        background-image: url('../assets/change_press.png');
      }
    }
    .voice {
      position: absolute;
      top: 0.9rem;
      right: 0.9rem;
      background: url('../assets/voice_open.png') no-repeat;
      background-size: 2.4rem 2.4rem;
      &:active {
        background-image: url('../assets/voice_open_press.png');
      }
    }
    .voiceclose {
      background: url('../assets/voice_close.png') no-repeat;
      background-size: 2.4rem 2.4rem;
      &:active {
        background-image: url('../assets/voice_close_press.png');
      }
    }
    .video-player {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
  .control {
    display:block;
    position: relative;
    margin-top: 10px;
    width: 100%;
    min-height: 10rem;
    background: #F1F3F5;
    background: #dddddd;
    border-radius: 12px;
    .tip {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 1rem;
      font-size: 0.9rem;
      line-height: 1rem;
      color: #333333;
    }
    .begin {
      position: absolute;
      left: 50%;
      margin-left: -5rem;
      bottom: 1rem;
      width: 10rem;
      height: 2.8rem;
      border: none;
      font-size: 0.8rem;
      color: #FFFFFF;
      letter-spacing: 0.2rem;
      background: url('../assets/begin.png') no-repeat 0 0.4rem;
      background-size: 10rem 2.4rem;
      &:active {
        background-image: url('../assets/begin_press.png');
      }
    }
    .prepare {
      position: absolute;
      left: 50%;
      margin-left: -5rem;
      bottom: 1rem;
      width: 10rem;
      height: 2.8rem;
      border: none;
      font-size: 0.8rem;
      color: #FFFFFF;
      letter-spacing: 0.2rem;
      background: url('../assets/begin.png') no-repeat 0 0.4rem;
      background-size: 10rem 2.4rem;
      cursor: auto;
    }
    .queue-player {
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 4.2rem;
      font-size: 0.9rem;
      color: #AFAFAF;
      letter-spacing: 0;
      line-height: 1rem;
      .light {
        color: #FF6D44;
      }
    }
    .up, .down, .left, .right{
      position: absolute;
      width: 3rem;
      height: 3.2rem;
      border: none;
      font-size: 0;
      background-size: 3rem 3.2rem;
    }
    .up {
      top: 0.5rem;
      left: 30%;
      margin-left: -1.5rem;
      background-image: url('../assets/up.png');
      &:active {
        background-image: url('../assets/up_press.png');
      }
    }
    .down {
      bottom: 0.5rem;
      left: 30%;
      margin-left: -1.5rem;
      background-image: url('../assets/down.png');
      &:active {
        background-image: url('../assets/down_press.png');
      }
    }
    .left {
      top: 3.2rem;
      left: 30%;
      margin-left: -4.5rem;
      background-image: url('../assets/left.png');
      &:active {
        background-image: url('../assets/left_press.png');
      }
    }
    .right {
      top: 3.2rem;
      left: 30%;
      margin-left: 1.5rem;
      background-image: url('../assets/right.png');
      &:active {
        background-image: url('../assets/right_press.png');
      }
    }
    .grab {
      position: absolute;
      right: 1rem;
      top: 2.7rem;
      width: 5.6rem;
      height: 4rem;
      border: none;
      font-size: 1rem;
      color: #FFFFFF;
      letter-spacing: 0.2rem;
      background: url('../assets/begin.png') no-repeat 0 0.4rem;
      background-size: 5.6rem 3.6rem;
      &:active {
        background-image: url('../assets/begin_press.png');
      }
    }
  }
  .opacity-hide {
    visibility: hidden;
  }
</style>


