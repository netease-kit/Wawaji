JSMpeg.Source.WebSocket = (function(){ "use strict";

var WSSource = function(url, options) {
	this.uid = options.uid
	this.cid = options.cid
  this.version = 31
  this.status = 0
  this.heartBeatTimer = null

	this.url = url;
	this.options = options;
	this.socket = null;	

	this.callbacks = {connect: [], data: []};
	this.destination = null;

	this.reconnectInterval = options.reconnectInterval !== undefined
		? options.reconnectInterval
		: 5;
	this.shouldAttemptReconnect = !!this.reconnectInterval;

	this.completed = false;
	this.established = false;
	this.progress = 0;

	this.reconnectTimeoutId = 0;
};

WSSource.prototype.parseSendData = function (status) {
	var sendData = {
		type: status,                   //消息类型  无符号整型
		uid: this.uid,                       //用户id 64位无符号整型
		cid: this.cid,                       //频道id   64位无符号整型
		version: this.version,                       //版本号   无符号整型
		content: {
			params: {}
		}
	}
	switch (status) {
		// 登录
		case 1:
			sendData.content.params = {
				client_type: 0,            //客户类型  无符号整型
				client_net: 0,             //客户网络类型  无符号整型
				client_os: 0,              //客户端操作系统  无符号整型
				client_support_record: 0   //是否支持录制  无符号整型
			}
      break
    // 心跳包
    case 4:
      sendData.content.params = {
        timestamp: Math.round(Date.parse(new Date()) / 1000)
      }
      break
  }
  return JSON.stringify(sendData)
}

WSSource.prototype.parseRecvData = function (data) {
  var recvData = JSON.parse(data)
}

WSSource.prototype.sendHeartBeat = function () {
  var self = this
  clearTimeout(this.heartBeatTimer)
  this.heartBeatTimer = setTimeout(function () {
    var sendData = self.parseSendData(4)
    self.socket.send(sendData)
  }, 5000)
}

WSSource.prototype.connect = function(destination) {
	this.destination = destination;
};

WSSource.prototype.destroy = function() {
	clearTimeout(this.reconnectTimeoutId);
	this.shouldAttemptReconnect = false;
	this.socket.close();
};

WSSource.prototype.start = function() {
	this.shouldAttemptReconnect = !!this.reconnectInterval;
	this.progress = 0;
  this.established = false;
  this.status = 1 // 待登录状态
	
	// this.socket = new WebSocket(this.url, this.options.protocols || null);
	this.socket = new WebSocket(this.url);
	this.socket.binaryType = 'arraybuffer';
	this.socket.onmessage = this.onMessage.bind(this);
	this.socket.onopen = this.onOpen.bind(this);
	this.socket.onerror = this.onClose.bind(this);
	this.socket.onclose = this.onClose.bind(this);
};

WSSource.prototype.resume = function(secondsHeadroom) {
	// Nothing to do here
};

WSSource.prototype.onOpen = function() {
	console.log('opened!')
	this.progress = 1;
  // this.established = true;
  var sendData = this.parseSendData(1)
  this.socket.send(sendData)
};

WSSource.prototype.onClose = function() {
	if (this.shouldAttemptReconnect) {
		clearTimeout(this.reconnectTimeoutId);
		this.reconnectTimeoutId = setTimeout(function(){
			this.start();	
		}.bind(this), this.reconnectInterval*1000);
	}
};

function _base64ToArrayBuffer (base64) {
	var binary_string = window.atob(base64);
	var len = binary_string.length;
	var bytes = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}

WSSource.prototype.onMessage = function(ev) {
  var recvData = JSON.parse(ev.data)
  switch (recvData.type) {
    // 登录回应
    case 2:
      this.status = 7
      this.established = true
      this.sendHeartBeat()
      break;
      // 心跳回应
    case 5:
      this.sendHeartBeat()
      break;
    case 7:
      if (this.destination) {
        var strData = recvData.content.params.data
        var binData = _base64ToArrayBuffer(strData)
        this.destination.write(binData);
      }
      break
    default:
      break;
  }
};

return WSSource;

})();

