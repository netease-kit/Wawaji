## 娃娃机 Web Html5 Demo 源码导读

### 体验地址
- [html5-娃娃机](https://app.netease.im/webdemo/wawajih5)
- [webrtc-娃娃机](https://app.netease.im/webdemo/wawaji)

### 工程说明

本娃娃机 Demo 工程基于以下开发

*  nodejs及npm包管理工具，[nodejs下载地址](https://nodejs.org/en/)
*  前端工程构建工具：webpack babel
*  UI开发框架：vue
*  网易云信完整版本 [NIMSDK](http://netease.im/im-sdk-demo), 版本 4.5.7 +

本娃娃机 Demo 工程所使用云信SDK能力

* `IM聊天通信能力`: 用于娃娃机操作控制、操作结果回调
* `IM聊天室能力`： 用于娃娃机排队竞争逻辑、聊天室聊天
* `云信互动白板(HTML5直播)能力`： 用于娃娃机实时抓取及围观群众观看的视频直播

本娃娃机 Demo 工程对所使用的云信SDK能力做了封装，代码在src/libs中，分别包含了：
- `PlayAction.js`     # 娃娃机操作类，封装了IM能力
- `ChatRoomAction.js` # 娃娃机聊天室类，封装了聊天室能力
- `VideoH5.js`       # 娃娃机互动直播类，封装了html5直播能力

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
    |   |    ├── VideoH5.js       # 娃娃机互动直播类，封装了HTML5能力
    |   |    └── cookie.js         # 娃娃机cookie操作方法
    │   ├── components             # UI层 - 娃娃机VUE组件
    |   |    └── Player.vue        # UI层 - 娃娃机操作界面
    │   ├── models                 # UI层 - 娃娃机弹框等组件
    │   ├── main.js                # UI层 - 娃娃机VUE入口
    │   └── App.vue                # UI层 - 娃娃机VUE入口
    ├── test.mp3                   # 背景音乐
    └── index.html                 # 娃娃机主页
```

### 代码解读

#### 娃娃机核心依赖能力
- 娃娃机实时视频直播
  - 云信互动白板(html5直播播放器)能力
- 娃娃机排队逻辑
  - 云信聊天室麦序队列
  - 云信IM自定义系统消息
- 娃娃机操作控制逻辑
  - 云信IM自定义系统消息
- 娃娃机操作结果通知
  - 云信IM自定义系统消息


#### 娃娃机初始化

进入房间后娃娃机需要依次完成以下操作进行初始化：

- ajax获取娃娃机房间信息
  - 房间信息包括：用户账号、IM登录密码、互动直播房间号、主播、在线用户数、rtmp/http/hls拉流地址等
- 连接云信IM-SDK
- 连接云信聊天室-SDK
- 初始化html5直播播放器

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
    - 切换摄像头：playerAction.setCameraId(cameraId)
    - 不同于webrtc方案，html5直播通道与操作控制相互独立，所以cameraId由直播类控制(VideoH5.js)
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

#### VideoH5.js
假设类实例化对象为videoH5
- 初始化
  - 需传入参数 `nim`, `channelName`, `onInitSuccess`, `onInitFailed`
  - `nim`, 由之前`PlayerAction.js`创建实例时生成，其本质为云信IM-SDK实例
  - `channelName`, 直播通道号前缀，云信HTML5直播的两路摄像头，其本质使用了云信互动白板能力的两路房间通道，在该类库里做了封装，即一路视频房间为`${this._channelPrefix}_1`，另一路视频房间为`${this._channelPrefix}_2`，用户可根据自己的实际情况做修改
  - `onInitSuccess`, `onInitFailed`，初始化成功或失败返还的回调
- 初始化播放器
  - 云信demo针对[MIT开源库 JSMepg](https://github.com/phoboslab/jsmpeg)做了适配、优化及封装
  - `setVideoContainer`，`setVideoContainer2` 为初始化两路流播放器
    - 第一个参数为canvas节点, 第二个参数为视频第一帧流开始渲染时的回调
    - 在第一帧流开始渲染之前，用户可以做一些诸如loading画面/广告播放等操作
  - 本质为websocket传输流及mpeg1解码器
- 切换摄像头、初始化摄像头
  - `changeCamera` 切换摄像头，摄像头id由类内部自行控制，可通过`getCameraId`方法获取
  - `resetCamera` 重置摄像头

#### 关于html5直播播放器
- 云信html5直播的本质原理，是通过云信的互动白板通道(需开通互动白板功能)，传输视频流数据，由云信优化过的播放器jsmpeg.js做渲染播放，推送的流格式为mpeg-ts
- 3rd/jsmpeg.min.js为云信经过封装与优化的直播播放器
  - 初始化参数：
    - `whiteboard` 云信的互动白板实例
    - `options` 配置参数
      - `channelName` 互动白板通道/房间号
      - `canvas` 渲染的canvas节点
      - `disableGl` 是否关闭webgl
      - `onSetup` 互动白板通道初始化已完成的回调
      - `onStartRender` 第一帧画面开始渲染的回调
  - 运行参数：
    - `startRender` 对画面做渲染，通道不断开
    - `stopRender` 停止画面渲染，通道不断开
    - `play` 播放画面
    - `destroy` 销毁实例，通道断开
- 实例代码
``` javascript
  SDK.NIM.use(WhiteBoard)
  // 初始化互动白板
  window._whiteboard = WhiteBoard.getInstance({
    nim: nim,
    container: null,
    isCustom: true,
    // 是否开启日志打印
    debug: false
  })
  // 初始化播放器
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
```
