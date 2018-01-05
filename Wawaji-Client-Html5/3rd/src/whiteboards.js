JSMpeg.Source.WhiteBoards = (function () {
	"use strict";

	var WSSources = function (socket, options) {
		this.socketArray = socket;
		this.currentStreamId = options.currentStreamId || 0
		this.stopRender = false
		
		this.options = options;
		
		this.callbacks = { connect: [], data: [] };
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
	
	WSSources.prototype.connect = function (destination) {
		this.destination = destination;
	};
	
	WSSources.prototype.destroy = function () {
		clearTimeout(this.reconnectTimeoutId);
		this.shouldAttemptReconnect = false;
		this.established = false;
		for (var i = 0; i < this.socketArray.length; i++) {
			var socketInst = this.socketArray[i].nimWb
			var channelName = this.socketArray[i].channelName
			socketInst.leaveChannel({
				channelName: channelName
			})
		}
		this.socketArray = []
	};
	
	WSSources.prototype.start = function () {
		this.shouldAttemptReconnect = !!this.reconnectInterval;
		this.progress = 0;
		this.established = true;
		
		var promiseList = []
		var self = this
		for (var i = 0; i < this.socketArray.length; i++) {
			(function (id, socketObj) {
				var socketInst = socketObj.nimWb
				var channelName = socketObj.channelName
				promiseList.push(new Promise(function (resolve, reject) {
					console.log(id, channelName, 333333333333333333)
					socketInst.joinChannel({
						channelName: channelName
					})
					socketInst.on('joinChannel', function (obj) {
						resolve()
					})
					socketInst.on('data', function (data) {
						if (id === self.currentStreamId) {
							self.onMessage.call(self, data)
						}
					})
				}))
			})(i, this.socketArray[i])
		}
		Promise.all(promiseList).then(function () {
			if (self.options.onSetup instanceof Function) {
				self.options.onSetup()
			}
		})
	};
	
	WSSources.prototype.setStreamId = function (id) {
		if (this.socketArray[id]) {
			this.currentStreamId = id
		}
	}

	WSSources.prototype.resume = function (secondsHeadroom) {
		// Nothing to do here
	};

	WSSources.prototype.onOpen = function () {
		// opened
	};

	WSSources.prototype.onClose = function () {
		// closed
	};

	function _base64ToArrayBuffer(base64) {
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	WSSources.prototype.onMessage = function (data) {
		if (this.stopRender) {
			return
		}
		var strData = data.data
		var binData = _base64ToArrayBuffer(strData)
		this.destination.write(binData);
	};

	return WSSources;

})();

