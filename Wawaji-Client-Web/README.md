## 娃娃机 Web Demo 源码导读

### 体验地址
- [webrtc-娃娃机](https://app.netease.im/webdemo/wawaji)

### 工程说明

本娃娃机 Demo 工程基于以下开发

*  nodejs及npm包管理工具，[nodejs下载地址](https://nodejs.org/en/)
*  前端工程构建工具：webpack babel
*  UI开发框架：vue
*  网易云信完整版本 [NIMSDK](http://netease.im/im-sdk-demo), 版本 4.5.0

本娃娃机 Demo 工程所使用云信SDK能力

* `IM聊天通信能力`: 用于娃娃机操作控制、操作结果回调
* `IM聊天室能力`： 用于娃娃机排队竞争逻辑、聊天室聊天
* `WEB-RTC能力`： 用于娃娃机实时抓取过程的视频直播
* `直播拉流能力`： 用于围观群众观看娃娃机抓取视频

本娃娃机 Demo 工程对所使用的云信SDK能力做了封装，代码在src/libs中，分别包含了：
- `PlayAction.js`     # 娃娃机操作类，封装了IM能力
- `ChatRoomAction.js` # 娃娃机聊天室类，封装了聊天室能力
- `VideoRTC.js`       # 娃娃机互动直播类，封装了WebRTC能力
- `VideoPlayer.js`    # 娃娃机聊天室类，封装了聊天室能力

用户若不愿意使用`VUE`作为前端开发框架，这些组件即插即用，可以轻松整合到你们的React、Angular甚至是jquery所写的工程项目中

### 工程构建
- 开发环境
  - 下载本demo，进入相应工程目录控制台
  - npm install
  - npm run dev
  - 访问http://127.0.0.1:8080即可体验

- 线上环境
  - npm run build
  - 将index.html dist等文件拷贝到所需的线上服务器中

### 工程结构

工程结构如下

```
└── 抓娃娃工程
    ├── 3rd                        # 网易云信sdk、播放器等外部资源文件地址
    ├── dist                       # 娃娃机工程打包后最终资源文件地址
    ├── src                        # 娃娃机工程开发文件地址
    │   ├── assets                 # 娃娃机所用静态资源地址
    │   ├── configs                # 娃娃机相关配置文件
    │   ├── libs                   # demo封装的IM能力调用方法
    |   |    ├── PlayAction.js     # 娃娃机操作类，封装了IM能力
    |   |    ├── ChatRoomAction.js # 娃娃机聊天室类，封装了聊天室能力
    |   |    ├── VideoRTC.js       # 娃娃机互动直播类，封装了WebRTC能力
    |   |    ├── VideoPlayer.js    # 娃娃机聊天室类，封装了聊天室能力
    |   |    └── cookie.js         # 娃娃机cookie操作方法
    │   ├── components             # UI层 - 娃娃机VUE组件
    |   |    ├── Player.vue        # UI层 - 娃娃机操作界面
    |   |    └── Chatroom.vue      # UI层 - 娃娃机聊天室界面
    │   ├── models                 # UI层 - 娃娃机弹框等组件
    │   ├── main.js                # UI层 - 娃娃机VUE入口
    │   └── App.vue                # UI层 - 娃娃机VUE入口
    ├── test.mp3                   # 背景音乐
    └── index.html                 # 娃娃机主页
```

### 代码解读

#### 娃娃机核心依赖能力
- 娃娃机实时视频直播
  - 云信webrtc能力
- 娃娃机视频直播
  - 云信视频直播服务能力
  - neplayer播放器
- 娃娃机排队逻辑
  - 云信聊天室麦序队列
  - 云信webrtc信令通知
- 娃娃机操作控制逻辑
  - 云信IM自定义系统消息
- 娃娃机操作结果通知
  - 云信IM自定义系统消息
- 聊天室
  - 云信聊天室能力

#### 娃娃机初始化

进入房间后娃娃机需要依次完成以下操作进行初始化：

- ajax获取娃娃机房间信息
  - 房间信息包括：用户账号、IM登录密码、互动直播房间号、主播、在线用户数、rtmp/http/hls拉流地址等
- 连接云信IM-SDK
- 连接云信聊天室-SDK
- 初始化云信Web-RTC
- 初始化直播播放器

初始化代码
``` javascript
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
```

### 娃娃机能力接口暴露
#### PlayerAction.js
假设类实例化对象为playerAction
- 初始化
  - 需传入参数 `account`, `imToken`, `machineId`, `onInitSuccess`, `onInitFailed`
  - `onInitSuccess`, `onInitFailed` IM-SDK连接成功后的通知回调
- 操作控制
  - 方法及抓取为play*，例如：
    - 向左移动：playerAction.playLeft()
    - 向右移动：playerAction.playRight()
    - 抓去操作：playerAction.playGrab()
  - 操作玩家摄像头，例如：
    - 切换摄像头：playerAction.changeCamera()
    - 销毁摄像头：playerAction.resetCamera()
- 结果通知
  - `onCommand` 方法重写

#### ChatRoomAction.js
假设类实例化对象为chatroomAction
- 初始化
  - 需传入参数 `nim`, `chatroomId`, `account`, `imToken`, `nickname`, `onInitSuccess`, `onInitFailed`
- 排队操作
  - 排队： chatroomAction.waitForGame()
  - 放弃排队： chatroomAction.giveUpForGame()
  - 侦听排队状态： 重写chatroomAction.onUpdateQueueMember方法
- 聊天室操作：
  - 参考[聊天室SDK文档](http://docs.netease.im/docs/product/IM%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF/SDK%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/Web%E5%BC%80%E5%8F%91%E9%9B%86%E6%88%90/%E8%81%8A%E5%A4%A9%E5%AE%A4)

#### VideoRTC.js
假设类实例化对象为videoRTC
- 初始化
  - 需传入参数 `nim`, `onInitSuccess`, `onGameStart`, `onGamePrepare`
- 开始游戏
  - videoRTC.startGame()
  - 本质为接听webrtc
- 结束游戏
  - videoRTC.endGame()
  - 本质为挂断webrtc

#### 关于播放器
云信直播服务提供了包括rtmp/hls/http在内的多种拉流地址，用户可以根据自己的需要使用不同的web播放器。
推荐开源播放器：
- [html5直播播放器flv.js](https://github.com/Bilibili/flv.js)
- [rtmp直播播放器video.js](http://videojs.com/)