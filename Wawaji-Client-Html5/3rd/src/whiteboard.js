JSMpeg.Source.WhiteBoard = (function () {
	"use strict";

	var WSSource = function (socket, options) {
		this.socketInst = socket;
		this.channelName = options.channelName
		this.stopRenderSignal = false
		
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
		this.globalArrayBuffer = new ArrayBuffer(1024 * 1024)
	};
	
	WSSource.prototype.connect = function (destination) {
		this.destination = destination;
	};
	
	WSSource.prototype.destroy = function () {
		clearTimeout(this.reconnectTimeoutId);
		this.shouldAttemptReconnect = false;
		this.established = false;
		this.socketInst.leaveChannel({
			channelName: this.channelName
		})
		this.socketInst.off('data', this.onMessage.bind(this))
		this.channelName = null
		this.socketInst = null
	};
	
	WSSource.prototype.start = function () {
		this.shouldAttemptReconnect = !!this.reconnectInterval;
		this.progress = 0;
		this.established = true;
		
		this.socketInst.joinChannel({
			channelName: this.channelName
		})
		var self = this
		this.socketInst.on('joinChannel', function (obj) {
			if (self.options.onSetup instanceof Function) {
				self.options.onSetup(obj)
			}
		})
		this.socketInst.on('data', this.onMessage.bind(this))
	};
	
	WSSource.prototype.resume = function (secondsHeadroom) {
		// Nothing to do here
	};

	WSSource.prototype.onOpen = function () {
		// opened
	};

	WSSource.prototype.onClose = function () {
		// closed
	};

	WSSource.prototype._base64ToArrayBuffer = function (base64) {
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len) // this.globalArrayBuffer, 0, len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		base64 = null
		binary_string = null
		return bytes;
	}

	WSSource.prototype.startRender = function () {
		this.stopRenderSignal = false
	}

	WSSource.prototype.stopRender = function () {
		this.stopRenderSignal = true
	}

	WSSource.prototype.onMessage = function (data) {
		if (this.stopRenderSignal) {
			data = null
			return
		}
		var strData = data.data
		var binData = this._base64ToArrayBuffer(strData).buffer
		this.destination.write(binData);
		strData = null
		binData = null
	};

	return WSSource;

})();

