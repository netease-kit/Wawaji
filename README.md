# 云信娃娃机解决方案

## 方案概述

网易云信技术研发团队在推出 4 套在线抓娃娃机解决方案（http://netease.im/clawMachine ）基础上，为帮助更多的在线娃娃机开发者，基于“深度解耦”方案完整实现了在线娃娃机的整套流程与场景，形成了可提供给开发者快速借鉴与集成的在线抓娃娃Demo。


本套方案采用 1 个娃娃机加 2 个网络摄像头，借助网易云信大型直播、实时音视频能力，实现了在线抓娃娃场景中观众观看抓娃娃直播、游戏者实时抓娃娃两种核心场景。大型直播能力带给观众清晰流畅的直播观看体验，实时音视频带给游戏者酣畅实时的互动游戏体验，大型直播可以长期推流进行流量承接与转化，实时音视频按需取用促进用户活跃留存与变现，在提供极致游戏体验的同时很好地控制了成本。

Demo的整体技术架构如下图所示： 

![](http://yx-web.nos.netease.com/official/default/001.jpeg)

本套方案采用 PC 主机推流模式，是目前最稳定可靠的推流方案，同时提供 iOS、安卓、Web 端实现在线抓娃娃的终端实现，Web端采用网易云信最新商用的 WebRTC 音视频方案，可以提供 PC 浏览器端无插件的在线抓娃娃体验，打开网页就可实现随时随地抓娃娃。 注：WebRTC 已经支持 Windows、macOS 系统下 Chrome 54及以上版本浏览器并将继续扩大支持范围，可在网易云信官网 （http://netease.im ）了解更多详情。

## 阅读指南

建议按照如下顺序阅读相应文档

* [解决方案概述](http://docs.netease.im/docs/product/%E9%80%9A%E7%94%A8/%E7%BD%91%E6%98%93%E4%BA%91%E4%BF%A1%E5%9C%A8%E7%BA%BF%E6%8A%93%E5%A8%83%E5%A8%83%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88Demo%E8%AF%B4%E6%98%8E%E6%96%87%E6%A1%A3)
* [Server-Windows 解决方案](./Wawaji-Server-Windows)
* [Server-AppServer 解决方案](./Wawaji-Server-AppServer)
* [Client-iOS 解决方案](./Wawaji-Client-iOS)
* [Client-Android 解决方案](./Wawaji-Client-Android)
* [Client-Web 解决方案](./Wawaji-Client-Web)




