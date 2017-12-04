## 网易云信在线抓娃娃 iOS Demo 使用说明

* Demo 工程位于 `NIMDragonClaw` 目录
* 工程依赖 `CocoaPods`，请在工程根目录运行 `pod install`
* 在使用中有任何问题可以提 issue 联系我们

## 网易云信在线抓娃娃 iOS Demo 实现说明

### 一）终端整体业务逻辑介绍

游戏场景中分为两种角色：`普通观众`和`游戏玩家`。

观看抓娃娃画面视图根据角色的不同，使用不同的实现方法。普通观众使用直播拉流的方式，通过拉流画面观看抓娃娃。游戏玩家使用实时音视频的方法，通过实时音视频画面观看抓娃娃。
普通观众的拉流模式切换为游戏玩家的实时音视频方法，需要通过以下几个步骤进行：

1、首先显示拉流画面，进行预约排队，预约成功后会进入排队队列，等待排队通知。

2、当排队轮到你时，PC 发起音视频通话请求。

3、若点击开始游戏，则接受 PC 的音视频通话请求。若超过10s，没有点击开始游戏，表示放弃游戏，自动挂断 PC 的音视频通话请求。

4、当双方音视频通话请求建立，则显示音视频画面，隐藏拉流画面，并可进行游戏。

5、当点击下爪按钮或者达到30s游戏超时时间，会发送下爪指令给 PC, 并等待 PC 的挂断通知。

6、收到 PC 的挂断通知或20s内无法收到挂断通知，则退出音视频频道，显示拉流画面。

### 二）娃娃机场景重难点实现

#### 1. 远程控制指令的实现

远程控制指令包括**上、下、左、右四个方向指令，下爪指令以及摄像头切换指令**。iOS 端控制指令集成在 NTESControlService 中，具
体实现说明见<a href = "#demo_ctrlService">第三小节源码导读部分</a>。

#### 2. 排队场景的实现

iOS 端排队场景通过 NTESControlService 中相关指令实现，主要包含队列初始化、`开始排队`、`监听排队中队列变化`、`离开队列`、`注销队列控制`。

**1）初始化队列控制**

通过监听聊天室的登录状态，在监听中初始化队列操作。保证首次登录或者断网重连的操作下能初始化队列。

**2）开始排队**

使用 NTESControlService 中接口 `joinPendingQueue:` 进行排队。

**3）取消排队**

使用 NTESControlService 中接口 `leavePendingQueue:` 取消排队

**4）监听队列变化**

在主视图控制器注册 NTESInfoManagerDelegate 代理，监听 `onPendingUsersChanged:` 来监听队列变化，具体包括正在游戏的玩家账号、昵称信息，当前排队个数，以及自己是否在队列中等信息。

**5）注销队列控制**

在主视图控制器 `dealloc` 方法中，添加取消队列控制接口 `leavePendingQueue:`以防止未正常取消排队就退出房间的操作。
具体场景使用见<a href = "#demo_queue">第三小节源码导读相应部分</a>。

#### 3. 观众观看画面视图的实现

播放器视图包括作为观众时的直播播放器视图和游戏中的实时音视频视图两类。统一封装在 `NTESCanvas` 类中，并提供切换视图和添加视图的接口。并通过 `NIMNetCallManagerDelegate` 监听回调来决定当前视图类型以及视图渲染。

##### 普通观众观看的直播播放器的实现

在刚进入并没有开始排队的时候，demo 的娃娃机拉流画面是通过直播播放器显示，该播放器封装在 `NTESLivePlayerViewController`中。该视图控制器接入网易视频云的播放器 `NELivePlayerViewCOntroller` 和 `NELivePlayer`。

首先，通过 NELivePlayerController 的初始化接口，进行播放器的初始化，并配置播放器的播放参数，例如延时模式，是否自动播放等等。因为这里播放器只提供画面显示，因此所以配置都封装在视图控制器内，对外只留传拉流参数的接口即可。

其次，需要监听播放器状态。通过广播监听播放器的状态回调并进行相应的逻辑处理，现监听的有`NELivePlayerDidPreparedToPlayNotification` 这是播放器初始化文件完成后的通知，在该消息通知之后，播放器就可以开始播放；`NELivePlayerLoadStateChangedNotification` 监听视频加载状态，并作相应处理；`NELivePlayerPlaybackFinishedNotification` 是监听播放结束的原因，并做出对应处理，例如显示播放出错原因等。

最后针对网络情况做了监听。在无网络情况下，播放器会首先停止播放，若10秒内网络恢复，则重新尝试初始化播放器并播放；若超过10S则释放播放器相关资源，并提示播放出错。

##### 游戏中实时音视频画面的实现

进入游戏中，通过实时音视频技术显示的画面，相关实现在 `NTESGLView` 和 `NTESCanvas` 中。其中显示的视图 `NTESGLView` 是封装了开源的 ijkplayer 项目技术，进行画面渲染，具体实现封装在 `NTESGLView` 里。 


### 三）源码导读

#### 1. 工程说明

本娃娃机 Demo 工程基于以下开发

*  项目依赖管理 [CocoaPods](https://cocoapods.org/)，版本 1.3.1
*  网易云信完整版本 [NIMSDK](http://netease.im/im-sdk-demo), 版本 4.5.0
*  播放器 [NELivePlayer](http://netease.im/im-sdk-demo), 版本 2.4.0
*  日志库 [CocoaLumberjack](https://github.com/CocoaLumberjack/CocoaLumberjack) 版本 3.2.1
*  网络连接状态检测库 [RealReachability](https://github.com/dustturtle/RealReachability) 版本 1.1.9
*  加载状态 UI [SVProgressHUD](https://github.com/SVProgressHUD/SVProgressHUD) 版本 2.1.2
*  弹出提示 UI [Toast](https://github.com/scalessec/Toast) 版本 4.0.0

#### 2. 工程结构

工程结构截图如下

**目录图** 

![](http://yx-web.nos.netease.com/webdoc/default/1.jpg)

**工程图**

![](http://yx-web.nos.netease.com/webdoc/default/2.jpg)


```
└── NIMDragonClaw/Class                        # 抓娃娃工程
    ├── Service                                # 业务服务层
    │   └── Network                            # 网络层
    ├── Category                               # Category 工具
    ├── Manager                                # 管理层
    ├── Model                                  # 数据模型层
    ├── UI                                     # UI 界面层
    └── Vendors                                # 无法 pods 管理的第三方开源库
```

**层次结构**

![](http://yx-web.nos.netease.com/webdoc/default/3.jpg) 

* UI 层为界面层，本 Demo 有娃娃机列表页 `NTESDragroomListViewController` 和 娃娃机页 `NTESDragroomViewController`。另外，播放器的 UI 界面单独封装在了 `NTESLivePlayerViewController` 里，为 `NTESDragroomViewController` 的 `childViewController`，之后有章节单独介绍。

* NTESInfoManager 为管理层，主要负责娃娃机排队队列维护和人员信息维护（ Demo 只保存了自己的人员信息），并且会在恰当的时候，回调给上层一些通知，如排队队列变动或者抓取结果变动等。

* Service 为业务服务层，主要负责具体的业务逻辑，目前有三个业务：
  
  1. 登录业务 
  2. 控制业务
  3. 信息业务

* Network 为网络层，主要负责和业务服务器交互。

#### 3. 网络层 Network

网络层单例 `NTESNetwork`，通过接口

```objc
- (void)postNetworkTask:(id<NTESNetworkTask>)task
             completion:(void(^)(NSError *error, id jsonObject))completion
```

发起网络请求，网络请求被封装在实现了 `NTESNetworkTask` 协议的 task 对象中。

目前有两个网络请求

* 登录请求 NTESLoginTask

  * 请求说明

```
POST http://${Host}/dollsCatcher/tourist HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8
```

  * 参数列表

| 名称              | 类型             | 说明                 | 必填
|----------------------|--------------------|--------|-----|
| sid  | String  | 提供初始化，注册，内部管理类管理的功能 | 否 |
		
  在参数对应的sid未失效时，会返回sid对应的账号信息，并更新账号失效时间，其他情况（sid已失效或者sid不存在）会重新返回一个可用账号。.


  * 返回说明

| 参数              | 类型             | 说明                 
|----------------------|--------------------|--------|
| code  | int  | 状态码 |
| msg | String  | 错误信息|
| data | String  | 账号信息 | 	
| accid | String  | 用户账号 | 	
| nickname | String  | 用户昵称 | 	
| imToken | String  | im token | 					
		

  
  为了简化 Demo 业务，Demo 的业务服务器将登录注册合二为一，每次调用此接口时，服务器会返回一个可用的账号进行登录。
  
* 获取娃娃机列表请求 NTESFetchDragroomTask

   * 请求说明

```
POST http://${Host}/dollsCatcher/room/list HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8
```

  * 参数列表

| 名称              | 类型             | 说明                 | 必填
|----------------------|--------------------|--------|-----|
| sid  | String  | session id，即当前登陆用户的accid| 是 |
		


  * 返回说明

| 参数              | 类型             | 说明                 
|----------------------|--------------------|--------|
| code  | int  | 状态码 |
| msg | String  | 错误信息|
| data | String  | 房间信息 | 	
| list | String  | 房间列表 | 	
| total | String  | 房间总数 | 	
| roomId | String  | 聊天室房间id |        		| name  | String  | 聊天室名称 |
| creator | String  | 聊天室房主 accid ，即娃娃机|
| rtmpPullUrl1 | String  | 拉流地址1 |		| rtmpPullUrl2 | String  | 拉流地址2 | 
| roomStatus | Boolean  | 聊天室开关状态| 
| liveStatus | int  | 直播频道状态，0：空闲； 1：直播； 2：禁用； 3：直播录制 | 
| onlineUserCount | int  | 当前在线人数 | 
| queueCount | int  | 当前排队人数 | 					
 
服务器会下发多个娃娃机房间，不过目前只有一台娃娃机，只有第一个房间可用。可以用 `roomStatus` 字段判断娃娃机开关状态。
    
#### 4. 业务层 Service

业务层会调用网络层，并通过返回的数据完成业务逻辑。

目前共有三个业务：

* **登录业务 NTESLoginService**

  登录业务主要完成登录步骤：
  
  1. 调用网络层向应用层发送登录请求，拿到账号 accid 和 密码 imToken
  2. 调用云信 SDK 登录云信服务器
  3. 回调总的请求结果

* **信息业务 NTESInfoService**
  
  信息业务主要完成两件事
  
  1. 向 Demo 应用服务器请求房间列表
  2. 使用 SDK 请求聊天室队列情况

     * 队列格式约定
       
       队列 array<item> 里只需要有账号昵称信息

       item 约定为键值对: {key:value},  key 为字符串 ， value 为字典形式 json 字符串 (由于 SDK 接口限制无法直接使用字典)。

       item 具体形式约定: {"accid" : "{\"nick\":\"user_nick\"}"}
 
* **<p id = "demo_ctrlService"> 控制业务 NTESControlService </p>**

  控制业务主要用来向娃娃机对应的 PC 发送控制指令。
  
  控制指令使用 IM 自定义系统通知实现，自定义通知内容的基本形式为 {"command":int,"data":"string","serial":long}   其中 serial 为命令序列 id, 从 0 开始自增加，每条指令后都会带， PC在返回结果的时候同时把对应指令的 serial 返回。
  
  1. 娃娃机爪控制 {"command":1, "data":"left", "serial":long}   data 可为 上下左右停，  up down left right stop 
  
  2. 娃娃机下爪   {"command":2, "serial":long}   
  
  3. 娃娃机摄像头切换 {"command":3,"data":"1","serial":long}   data为摄像机编号，目前只有1，2号摄像机
  
  4. PC 结果通知 {"command":4,"data":"true"}      data 为 true false ， 这里 pc 主动返回不记 serial
  
  5. PC 操作反馈 {"command":5, "data":"ack_data","serial":long}  ack_data 为具体反馈信息，此协议供调试使用

  控制指令不发离线，忽略失败


#### 5. 界面层 NTESDragroomViewController

  抓娃娃的界面主要逻辑写在 `NTESDragroomViewController` 里。
  
  主要配置函数及相关处理如下：
  
##### `viewDidLoad` 进行如下配置
  
  1) **setupSubviews**
  
  在这个方法里进行所有子视图的添加。
  
  2) **addListener**

  在这个方法里添加 `NIM SDK` 的相关回调代理，用于监听娃娃机的各种状态反馈，键盘控制以及一些界面变更的广播通知。

  3) **setupPlayer**

  进行拉流播放器的初始化，并添加到画布，具体播放器的实现见 `NTESLivePlayerViewController` 和 `NTESCanvas`。
  
  4) **enterChatroom**

  调用 NIMSDK 进入聊天室的相关接口进入聊天室，并根据回调刷新房间观众人数，以及根据排队人数更新游戏中的展示 label 的显示更新。同时，只有进入聊天室，聊天室聊天的收发才能收到。
  
#####  <p id = "demo_queue"> 排队逻辑实现 </p>
  
  1) **addQueue**

  调用 NTESControlService 的 joinPendingQueue 接口，进行抓娃娃的排队操作。

  2) **onPendingUsersChanged**

  `NTESInfoManagerDelegate` 的一个回调，用于监听当前排队人数，可在方法里进行界面显示的更新。
  
##### 开始游戏配置

  1) **onReceive: from: type: message:**

  这个回调在正式进入游戏准备状态的时候收到，在这里本 demo 做的业务处理是进行10S倒计时准备开始游戏的界面显示。

  2) **startGame**

  在上一步进入10S倒计时之后，点击开始进入游戏界面，可以控制娃娃机进行抓娃娃。

  3) **onReceiveTryLuckResult**

  成功抓取娃娃之后的回调，用于显示成功抓取到娃娃或者未抓取到的提示。
  
#### 6. 参数配置

在 `NTESGlobalMacro.h` 文件中，进行服务器地址、appKey、落爪时间，准备进入游戏的时间等的自行配置。

```objc
//云信 APP KEY
#define NTES_APP_KEY  @"XXXX"

//Demo 应用服务器地址
#define NTES_API_HOST @"https://XX.XX.XX"

//排队轮到自己后，应答超时时间，如果超出则不进行游戏并退出排队 单位秒
#define NTES_QUEUE_RESPONSE_TIMEOUT 10

//落爪超时时间，超过时间则自动落爪 单位秒
#define NTES_TRY_LUCK_TIMEOUT 30
```

