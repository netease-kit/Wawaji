(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WhiteBoard"] = factory();
	else
		root["WhiteBoard"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _constant = __webpack_require__(85);

	// api 接口和协议实现
	var api = __webpack_require__(192);
	var protocol = __webpack_require__(205);
	var Client = __webpack_require__(209);

	// 各种配置 map
	var configMapWhiteBoard = __webpack_require__(206);
	var serializeMapWhiteBoard = __webpack_require__(172);
	var unserializeMapWhiteBoard = __webpack_require__(179);

	// 这里不做单实例限制，数据通道允许多个实例的能力
	var whiteboard = _extends({}, _constant.constantBB, {
	  install: function install(NIM, options) {
	    api.install(NIM, options);
	    protocol.install(NIM, options);
	    NIM.parser.mixin({
	      configMap: configMapWhiteBoard,
	      serializeMap: serializeMapWhiteBoard,
	      unserializeMap: unserializeMapWhiteBoard
	    });
	    // Client.install(NIM, options)
	  },
	  getInstance: function getInstance(options) {
	    return new Client(options);
	  },
	  destroy: function destroy(client) {
	    if (client) {
	      client.destroy();
	      client = null;
	    }
	  }
	});

	module.exports = whiteboard;

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var platform = __webpack_require__(9);
	var io = __webpack_require__(19);
	var naturalSort = __webpack_require__(28);
	var deep = __webpack_require__(22);
	__webpack_require__(44);
	var NIMError = __webpack_require__(4);

	/**
	 * NIM util 工具方法, 通过 `NIM.util` 来获取此工具的引用
	 *
	 * @namespace util
	 */
	var util = __webpack_require__(17);
	var window = util.getGlobal();
	var regWhiteSpace = /\s+/;

	util.shouldDisplayInstallFlashHint = function () {
	  var name = platform.name.toLowerCase();
	  if (name === 'ie') {
	    var version = +platform.version || 0;
	    version = Math.floor(version);
	    return version === 7 && !io.Transport.flashsocket.check();
	  }
	  return false;
	};

	util.deduplicate = function (arr) {
	  var rtn = [];
	  arr.forEach(function (item) {
	    if (rtn.indexOf(item) === -1) {
	      rtn.push(item);
	    }
	  });
	  return rtn;
	};

	util.capFirstLetter = function (str) {
	  if (!str) {
	    return '';
	  }
	  str = '' + str;
	  return str.slice(0, 1).toUpperCase() + str.slice(1);
	};

	/**
	 * 生成一个 32 位的 [GUID](https://en.wikipedia.org/wiki/Globally_unique_identifier)/[UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)
	 *
	 * @memberOf util
	 * @method guid
	 *
	 * @return {String}   guid/uuid
	 */
	util.guid = function () {
	  var _s4 = function _s4() {
	    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	  };
	  return function () {
	    return _s4() + _s4() + _s4() + _s4() + _s4() + _s4() + _s4() + _s4();
	  };
	}();

	util.extend = function (o1, o2, override) {
	  for (var i in o2) {
	    if (typeof o1[i] === 'undefined' || override === true) {
	      o1[i] = o2[i];
	    }
	  }
	};

	util.filterObj = function (base, props) {
	  var obj = {};
	  if (util.isString(props)) {
	    props = props.split(regWhiteSpace);
	  }
	  props.forEach(function (prop) {
	    if (base.hasOwnProperty(prop)) {
	      obj[prop] = base[prop];
	    }
	  });
	  return obj;
	};

	util.simpleClone = function (obj) {
	  return JSON.parse(JSON.stringify(obj));
	};

	/**
	 * 将 target 复制到 base
	 *
	 * @private
	 * @param  {Object} target 待复制的对象
	 * @param  {Object} base   复制后的对象
	 * @return {Object}        复制后的对象
	 */
	util.copy = function (target, base) {
	  base = base || {};
	  if (!target) {
	    return base;
	  }
	  Object.keys(target).forEach(function (key) {
	    if (util.exist(target[key])) {
	      base[key] = target[key];
	    }
	  });
	  return base;
	};

	/**
	 * 将 target 复制到 base，null值也复制
	 *
	 * @private
	 * @param  {Object} target 待复制的对象
	 * @param  {Object} base   复制后的对象
	 * @return {Object}        复制后的对象
	 */
	util.copyWithNull = function (target, base) {
	  base = base || {};
	  if (!target) {
	    return base;
	  }
	  Object.keys(target).forEach(function (key) {
	    if (util.exist(target[key]) || util.isnull(target[key])) {
	      base[key] = target[key];
	    }
	  });
	  return base;
	};

	util.findObjIndexInArray = function (array, options) {
	  array = array || [];
	  var keyPath = options.keyPath || 'id';
	  var pos = -1;
	  array.some(function (obj, index) {
	    if (deep(obj, keyPath) === options.value) {
	      pos = index;
	      return true;
	    }
	  });
	  return pos;
	};

	/**
	 * 在数组里面找 keyPath 对应的属性值为 value 的元素
	 * - 数组的每一项均为对象, 并且必须有由 keyPath 指定的属性
	 *
	 * @memberOf util
	 * @method findObjInArray
	 *
	 * @param  {Object[]}   array               待查找的数组
	 * @param  {Object}     options             查找的条件
	 * @param  {String}     [options.keyPath]   keyPath, 匹配的字段, 默认为 'id'
	 * @param  {Anything}   [options.value]     匹配的值
	 * @return {Object}                         找到的元素, 或者 null
	 *
	 * @example
	 * var array = [
	 *     {name: 'tom'},
	 *     {name: 'jack'},
	 *     {name: 'dan'}
	 * ];
	 * var obj = NIM.util.findObjInArray(array, {
	 *     keyPath: 'name',
	 *     value: 'jack'
	 * });
	 * // obj 为 {name: 'jack'}
	 */
	util.findObjInArray = function (array, options) {
	  var index = util.findObjIndexInArray(array, options);
	  return index === -1 ? null : array[index];
	};

	/**
	 * 合并数组
	 * - 此方法接收不定量参数
	 *     - 最后一个参数如果是对象, 那么就是配置参数
	 *     - 除了配置参数之外, 所有其它的参数都必须是数组, 它们都会被合并
	 * - 如果两个对象`keyPath`字段对应的属性值相同, 后面的对象会被合并到前面的对象
	 *
	 * @memberOf util
	 * @method mergeObjArray
	 *
	 * @param  {Object[]}   arr1                    待合并的数组
	 * @param  {Object[]}   arr2                    待合并的数组
	 * @param  {Object}     [options]               配置参数
	 * @param  {String}     [options.keyPath='id']  `keyPath`, 去重的字段, 默认为 `id`
	 * @param  {Boolean}    [options.notSort]       是否要排序, 默认`false`要排序, 传`true`则不排序
	 * @param  {Function}   [options.compare]       决定排序的方法, 如果不提供, 那么使用 {@link NIM.naturalSort|NIM.naturalSort} 进行排序
	 * @param  {String}     [options.sortPath]      `sortPath`, 排序用的字段, 默认为 `keyPath`
	 * @param  {Boolean}    [options.insensitive]   排序时是否不区分大小写, 默认区分
	 * @param  {Boolean}    [options.desc]          是否逆序, 默认正序
	 * @return {Object[]}                           合并并排序后的数组
	 *
	 * @example
	 * var arr1 = [
	 *     {
	 *         account: 'tom',
	 *         name: 'T'
	 *     }
	 * ];
	 * var arr2 = [
	 *     {
	 *         account: 'adam'
	 *     },
	 *     {
	 *         account: 'tom',
	 *         name: 'T-new'
	 *     }
	 * ];
	 * var options = {
	 *     keyPath: 'account'
	 * };
	 * var resultArray = NIM.util.mergeObjArray(arr1, arr2, options);
	 * // resultArray为
	 * // [
	 * //     {account: 'adam'},
	 * //     {account: 'tom', name: 'T-new'},
	 * // ]
	 */
	util.mergeObjArray = function () {
	  var base = [];
	  // 截取除了最后一个之外的参数, 这些就是待合并的数组
	  var arrays = [].slice.call(arguments, 0, -1);
	  // 最后一个参数是 options, 如果它是数组, 那么它也是待合并的数组
	  var options = arguments[arguments.length - 1];
	  if (util.isArray(options)) {
	    arrays.push(options);
	    options = {};
	  }
	  // options
	  var keyPath = options.keyPath = options.keyPath || 'id';
	  options.sortPath = options.sortPath || keyPath;
	  // 如果 base 的长度为 0, 那么直接拷贝后一个数组里面的所有元素
	  while (!base.length && !!arrays.length) {
	    base = arrays.shift() || [];
	    base = base.slice(0);
	  }
	  // 合并所有的数组
	  var index;
	  arrays.forEach(function (array) {
	    if (!array) {
	      return;
	    }
	    array.forEach(function (item) {
	      index = util.findObjIndexInArray(base, {
	        keyPath: keyPath,
	        value: deep(item, keyPath)
	      });
	      if (index !== -1) {
	        // 不修改原有的对象, 生成新的
	        base[index] = util.merge({}, base[index], item);
	      } else {
	        base.push(item);
	      }
	    });
	  });
	  // 排序
	  if (!options.notSort) {
	    base = util.sortObjArray(base, options);
	  }
	  return base;
	};

	/**
	 * 从数组里面去除某些项
	 *
	 * @memberOf util
	 * @method cutObjArray
	 *
	 * @param  {Array}      base                    基数组
	 * @param  {Object[]}   arr1                    待去除的数组
	 * @param  {Object[]}   arr2                    待去除的数组
	 * @param  {Object}     options                 配置参数
	 * @param  {String}     [options.keyPath='id']  `keyPath`, 去重的字段, 默认为 `id`
	 * @return {Array}                              去除后的数组
	 *
	 * @example
	 * var olds = [
	 *     { account: 'a' },
	 *     { account: 'b' },
	 *     { account: 'c' }
	 * ];
	 * var invalids = [
	 *     { account: 'b' }
	 * ];
	 * var options = {
	 *     keyPath: 'account'
	 * };
	 * var array = NIM.util.cutObjArray(olds, invalids, options);
	 * // array 为
	 * // [
	 * //     { account: 'a' },
	 * //     { account: 'c' }
	 * // ]
	 */
	util.cutObjArray = function (base) {
	  var rtn = base.slice(0);
	  var argsLength = arguments.length;
	  // 截取除了第一个和最后一个之外的参数, 这些就是待删除的数组
	  var arrays = [].slice.call(arguments, 1, argsLength - 1);
	  // 最后一个参数是 options, 如果它不是对象, 那么它也是待删除的数组
	  var options = arguments[argsLength - 1];
	  if (!util.isObject(options)) {
	    arrays.push(options);
	    options = {};
	  }
	  // keyPath
	  var keyPath = options.keyPath = options.keyPath || 'id';
	  // 删除
	  var index;
	  arrays.forEach(function (cuts) {
	    if (!util.isArray(cuts)) {
	      cuts = [cuts];
	    }
	    cuts.forEach(function (cut) {
	      if (!cut) {
	        return;
	      }
	      options.value = deep(cut, keyPath);
	      index = util.findObjIndexInArray(rtn, options);
	      if (index !== -1) {
	        rtn.splice(index, 1);
	      }
	    });
	  });
	  return rtn;
	};

	/**
	 * 返回排序后的数组
	 * - 数组的每一项都为 `Object`, 并且必须有由 `sortPath` 指定的属性
	 *
	 * @memberOf util
	 * @method sortObjArray
	 *
	 * @param  {Object[]}   array                   待排序的数组
	 * @param  {Object}     [options]               配置参数
	 * @param {Function}    [options.compare]       决定排序的方法, 如果不提供, 那么使用 {@link NIM.naturalSort|NIM.naturalSort} 进行排序
	 * @param  {String}     [options.sortPath]      `sortPath`, 排序用的字段, 默认为 `id`
	 * @param  {Boolean}    [options.insensitive]   排序时是否不区分大小写, 默认区分
	 * @param  {Boolean}    [options.desc]          是否逆序, 默认正序
	 * @return {Object[]}                           排序后的数组
	 *
	 * @example
	 * var array = [
	 *     { account: 'b' },
	 *     { account: 'a' }
	 * ];
	 * var options = {
	 *     sortPath: 'account'
	 * };
	 * NIM.util.sortObjArray(array, options);
	 * // array 为
	 * //[
	 * //    { account: 'a' },
	 * //    { account: 'b' }
	 * //]
	 */
	util.sortObjArray = function (array, options) {
	  options = options || {};
	  var sortPath = options.sortPath || 'id';
	  naturalSort.insensitive = !!options.insensitive;
	  var desc = !!options.desc;
	  var pa, pb;
	  var compare;
	  if (util.isFunction(options.compare)) {
	    compare = options.compare;
	  } else {
	    compare = function compare(a, b) {
	      pa = deep(a, sortPath);
	      pb = deep(b, sortPath);
	      if (desc) {
	        return naturalSort(pb, pa);
	      } else {
	        return naturalSort(pa, pb);
	      }
	    };
	  }
	  return array.sort(compare);
	};

	util.emptyFunc = function () {};

	util.isEmptyFunc = function (func) {
	  return func === util.emptyFunc;
	};

	util.notEmptyFunc = function (func) {
	  return func !== util.emptyFunc;
	};

	util.splice = function (obj, start, end) {
	  return [].splice.call(obj, start, end);
	};

	// 重新切分数据，将一维数组切分成每列num个元素的二维数组
	util.reshape2d = function (obj, num) {
	  if (Array.isArray(obj)) {
	    util.verifyParamType('type', num, 'number');
	    var len = obj.length;
	    if (len <= num) {
	      return [obj];
	    } else {
	      var count = Math.ceil(len / num);
	      var result = [];
	      for (var i = 0; i < count; i++) {
	        result.push(obj.slice(i * num, (i + 1) * num));
	      }
	      return result;
	    }
	  }
	  // 如果不是数组则不做任何处理
	  return obj;
	};

	// 扁平化数据，将2d数组转化为一维数组
	util.flatten2d = function (obj) {
	  if (Array.isArray(obj)) {
	    var _ret = function () {
	      var result = [];
	      obj.forEach(function (item) {
	        result = result.concat(item);
	      });
	      return {
	        v: result
	      };
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }
	  return obj;
	};

	// 数组去重
	util.dropArrayDuplicates = function (arr) {
	  if (Array.isArray(arr)) {
	    var map = {};
	    var result = [];
	    while (arr.length > 0) {
	      var item = arr.shift();
	      map[item] = true;
	    }
	    for (var key in map) {
	      if (map[key] === true) {
	        result.push(key);
	      }
	    }
	    return result;
	  }
	  return arr;
	};

	util.onError = function (msg) {
	  throw new NIMError(msg);
	};

	/*
	 * 参数处理相关 API
	 */

	util.verifyParamPresent = function (name, value, prefix) {
	  prefix = prefix || '';
	  var absent = false;
	  switch (util.typeOf(value)) {
	    case 'undefined':
	    case 'null':
	      absent = true;
	      break;
	    case 'string':
	      if (value === '') {
	        absent = true;
	      }
	      break;
	    case 'object':
	      if (!Object.keys(value).length) {
	        absent = true;
	      }
	      break;
	    case 'array':
	      if (!value.length) {
	        absent = true;
	      } else {
	        value.some(function (item) {
	          if (util.notexist(item)) {
	            absent = true;
	            return true;
	          }
	        });
	      }
	      break;
	    default:
	      break;
	  }
	  if (absent) {
	    util.onParamAbsent(prefix + name);
	  }
	};

	util.onParamAbsent = function (name) {
	  util.onParamError('缺少参数"' + name + '", 请确保参数不是 空字符串、空对象、空数组、null或undefined, 或者数组的内容不是 null/undefined');
	};

	util.verifyParamAbsent = function (name, value, prefix) {
	  prefix = prefix || '';
	  if (value !== undefined) {
	    util.onParamPresent(prefix + name);
	  }
	};

	util.onParamPresent = function (name) {
	  util.onParamError('多余的参数"' + name + '"');
	};

	util.verifyParamType = function (name, value, validTypes) {
	  var type = util.typeOf(value).toLowerCase();
	  if (!util.isArray(validTypes)) {
	    validTypes = [validTypes];
	  }
	  validTypes = validTypes.map(function (type) {
	    return type.toLowerCase();
	  });
	  var valid = true;
	  if (validTypes.indexOf(type) === -1) {
	    valid = false;
	  }
	  switch (type) {
	    case 'number':
	      if (isNaN(value)) {
	        valid = false;
	      }
	      break;
	    default:
	      break;
	  }
	  if (!valid) {
	    util.onParamInvalidType(name, validTypes);
	  }
	};

	util.onParamInvalidType = function (name, validTypes, prefix) {
	  prefix = prefix || '';
	  if (util.isArray(validTypes)) {
	    validTypes = validTypes.map(function (type) {
	      return '"' + type + '"';
	    });
	    validTypes = validTypes.join(', ');
	  } else {
	    validTypes = '"' + validTypes + '"';
	  }
	  util.onParamError('参数"' + prefix + name + '"类型错误, 合法的类型包括: [' + validTypes + ']');
	};

	util.verifyParamValid = function (name, value, validValues) {
	  if (!util.isArray(validValues)) {
	    validValues = [validValues];
	  }
	  if (validValues.indexOf(value) === -1) {
	    util.onParamInvalidValue(name, validValues);
	  }
	};

	util.onParamInvalidValue = function (name, validValues) {
	  if (!util.isArray(validValues)) {
	    validValues = [validValues];
	  }
	  validValues = validValues.map(function (value) {
	    return '"' + value + '"';
	  });
	  if (util.isArray(validValues)) {
	    validValues = validValues.join(', ');
	  }
	  util.onParamError('参数"' + name + '"值错误, 合法的值包括: [' + validValues + ']');
	};

	util.verifyParamMin = function (name, value, min) {
	  if (value < min) {
	    util.onParamError('参数' + name + '的值不能小于' + min);
	  }
	};

	util.verifyParamMax = function (name, value, max) {
	  if (value > max) {
	    util.onParamError('参数' + name + '的值不能大于' + max);
	  }
	};

	util.verifyArrayMax = function (name, value, max) {
	  if (value.length > max) {
	    util.onParamError('参数' + name + '的长度不能大于' + max);
	  }
	};

	util.verifyEmail = function () {
	  var reg = /^\S+@\S+$/;
	  return function (name, value) {
	    if (!reg.test(value)) {
	      util.onParamError('参数' + name + '邮箱格式错误, 合法格式必须包含@符号, @符号前后至少要各有一个字符');
	    }
	  };
	}();

	util.verifyTel = function () {
	  var reg = /^[+\-()\d]+$/;
	  return function (name, value) {
	    if (!reg.test(value)) {
	      util.onParamError('参数' + name + '电话号码格式错误, 合法字符包括+、-、英文括号和数字');
	    }
	  };
	}();

	util.verifyBirth = function () {
	  var reg = /^(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
	  return function (name, value) {
	    if (!reg.test(value)) {
	      util.onParamError('参数' + name + '生日格式错误, 合法为"yyyy-MM-dd"');
	    }
	  };
	}();

	util.onParamError = function (msg) {
	  util.onError(msg);
	};

	/**
	 * 验证options及其属性是否存在
	 *
	 * @private
	 * @param  {Object}       options       配置参数
	 * @param  {String|Array} params        属性列表
	 * @param  {Boolean}      shouldPresent 是否应该存在
	 * @return {Void}
	 */
	util.verifyOptions = function (options, params, shouldPresent, prefix) {
	  options = options || {};
	  // util.verifyParamPresent('options', options)
	  if (params) {
	    if (util.isString(params)) {
	      params = params.split(regWhiteSpace);
	    }
	    if (util.isArray(params)) {
	      shouldPresent = shouldPresent === undefined ? true : !!shouldPresent;
	      var func = shouldPresent ? util.verifyParamPresent : util.verifyParamAbsent;
	      params.forEach(function (param) {
	        func.call(util, param, options[param], prefix);
	      });
	    }
	  }
	  return options;
	};

	util.verifyParamAtLeastPresentOne = function (options, params) {
	  if (params) {
	    if (util.isString(params)) {
	      params = params.split(regWhiteSpace);
	    }
	    if (util.isArray(params)) {
	      var presentOne = params.some(function (param) {
	        return util.exist(options[param]);
	      });
	      if (!presentOne) {
	        util.onParamError('以下参数[' + params.join(', ') + ']至少需要传入一个');
	      }
	    }
	  }
	};

	util.verifyParamPresentJustOne = function (options, params) {
	  if (params) {
	    if (util.isString(params)) {
	      params = params.split(regWhiteSpace);
	    }
	    if (util.isArray(params)) {
	      var counter = params.reduce(function (p, param) {
	        if (util.exist(options[param])) {
	          p++;
	        }
	        return p;
	      }, 0);
	      if (counter !== 1) {
	        util.onParamError('以下参数[' + params.join(', ') + ']必须且只能传入一个');
	      }
	    }
	  }
	};

	util.verifyBooleanWithDefault = function (options, name, defaultValue, prefix) {
	  if (util.undef(defaultValue)) {
	    defaultValue = true;
	  }
	  if (regWhiteSpace.test(name)) {
	    name = name.split(regWhiteSpace);
	  }
	  if (util.isArray(name)) {
	    name.forEach(function (n) {
	      util.verifyBooleanWithDefault(options, n, defaultValue, prefix);
	    });
	  } else {
	    if (typeof options[name] === 'undefined') {
	      options[name] = defaultValue;
	    } else if (!util.isBoolean(options[name])) {
	      util.onParamInvalidType(name, 'boolean', prefix);
	    }
	  }
	};

	util.verifyFileInput = function (fileInput) {
	  util.verifyParamPresent('fileInput', fileInput);
	  if (util.isString(fileInput)) {
	    fileInput = document.getElementById(fileInput);
	    if (!fileInput) {
	      util.onParamError('找不到要上传的文件对应的input, 请检查fileInput id');
	    }
	  }
	  if (!fileInput.tagName || fileInput.tagName.toLowerCase() !== 'input' || fileInput.type.toLowerCase() !== 'file') {
	    util.onParamError('请提供正确的 fileInput, 必须为 file 类型的 input 节点');
	  }
	  return fileInput;
	};

	/**
	 * 验证是否是合法的文件类型
	 *
	 * @private
	 * @param  {type} type 待验证的文件类型
	 * @return {bool}      是否是合法的文件类型
	 */
	util.verifyFileType = function (type) {
	  util.verifyParamValid('type', type, util.validFileTypes);
	};

	util.verifyCallback = function (options, name) {
	  if (regWhiteSpace.test(name)) {
	    name = name.split(regWhiteSpace);
	  }
	  if (util.isArray(name)) {
	    name.forEach(function (n) {
	      util.verifyCallback(options, n);
	    });
	  } else {
	    if (!options[name]) {
	      options[name] = util.emptyFunc;
	    } else if (!util.isFunction(options[name])) {
	      util.onParamInvalidType(name, 'function');
	    }
	  }
	};

	util.verifyFileUploadCallback = function (options) {
	  util.verifyCallback(options, 'uploadprogress uploaddone uploaderror uploadcancel');
	};

	/*
	 * 文件相关 API
	 */

	util.validFileTypes = ['image', 'audio', 'video', 'file'];

	util.validFileExts = {
	  image: ['bmp', 'gif', 'jpg', 'jpeg', 'jng', 'png', 'webp'],
	  audio: ['mp3', 'wav', 'aac', 'wma', 'wmv', 'amr', 'mp2', 'flac', 'vorbis', 'ac3'],
	  video: ['mp4', 'rm', 'rmvb', 'wmv', 'avi', 'mpg', 'mpeg']
	};

	util.filterFiles = function (files, targetType) {
	  targetType = targetType.toLowerCase();
	  var anyfile = targetType === 'file';
	  var arr = [];
	  var ext;
	  var mime;
	  var type;
	  //   var subtype
	  [].forEach.call(files, function (file) {
	    if (anyfile) {
	      arr.push(file);
	    } else {
	      ext = file.name.slice(file.name.lastIndexOf('.') + 1);
	      mime = file.type.split('/');
	      if (!!mime[0] && !!mime[1]) {
	        type = mime[0].toLowerCase();
	        // subtype = mime[1].toLowerCase()
	        var match = false;
	        if (type === targetType) {
	          match = true;
	        } else {
	          match = util.validFileExts[targetType].indexOf(ext) !== -1;
	        }
	        if (match) {
	          arr.push(file);
	        }
	      } else {
	        // unknow mime
	      }
	    }
	  });
	  return arr;
	};

	var supportFormData = util.supportFormData = util.notundef(window.FormData);
	util.getFileName = function () {
	  return function (fileInput) {
	    fileInput = util.verifyFileInput(fileInput);
	    if (supportFormData) {
	      return fileInput.files[0].name;
	    } else {
	      return fileInput.value.slice(fileInput.value.lastIndexOf('\\') + 1);
	    }
	  };
	}();

	util.sizeText = function () {
	  var sizeUnit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'BB'];
	  return function (size) {
	    var text;
	    var index = 0;
	    do {
	      size = Math.floor(size * 100) / 100;
	      var unit = sizeUnit[index];
	      text = size + unit;
	      size /= 1024;
	      index++;
	    } while (size > 1);
	    return text;
	  };
	}();

	util.promises2cmds = function (promises) {
	  return promises.map(function (promise) {
	    return promise.cmd;
	  });
	};

	util.objs2accounts = function (objs) {
	  return objs.map(function (obj) {
	    return obj.account;
	  });
	};

	util.teams2ids = function (teams) {
	  return teams.map(function (team) {
	    return team.teamId;
	  });
	};

	util.objs2ids = function (objs) {
	  return objs.map(function (obj) {
	    return obj.id;
	  });
	};

	util.getMaxUpdateTime = function (array) {
	  var timetags = array.map(function (item) {
	    return +item.updateTime;
	  });
	  return Math.max.apply(Math, timetags);
	};

	util.genCheckUniqueFunc = function (keyPath, size) {
	  var array = [];
	  var set = {};
	  keyPath = keyPath || 'id';
	  size = size || 1000;
	  return function (obj) {
	    var id;
	    if (array.length >= size) {
	      id = array.shift();
	      delete set[id];
	    }
	    id = deep(obj, keyPath);
	    if (!set[id]) {
	      set[id] = true;
	      array.push(id);
	      return true;
	    } else {
	      return false;
	    }
	  };
	};

	module.exports = util;

	__webpack_require__(45);

/***/ },

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

	var require;/* WEBPACK VAR INJECTION */(function(process, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   4.0.5
	 */

	(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    (global.ES6Promise = factory());
	}(this, (function () { 'use strict';

	function objectOrFunction(x) {
	  return typeof x === 'function' || typeof x === 'object' && x !== null;
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}

	var _isArray = undefined;
	if (!Array.isArray) {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	} else {
	  _isArray = Array.isArray;
	}

	var isArray = _isArray;

	var len = 0;
	var vertxNext = undefined;
	var customSchedulerFn = undefined;

	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};

	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}

	function setAsap(asapFn) {
	  asap = asapFn;
	}

	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}

	// vertx
	function useVertxTimer() {
	  if (typeof vertxNext !== 'undefined') {
	    return function () {
	      vertxNext(flush);
	    };
	  }

	  return useSetTimeout();
	}

	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });

	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}

	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}

	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}

	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];

	    callback(arg);

	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }

	  len = 0;
	}

	function attemptVertx() {
	  try {
	    var r = require;
	    var vertx = __webpack_require__(47);
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}

	var scheduleFlush = undefined;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && "function" === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}

	function then(onFulfillment, onRejection) {
	  var _arguments = arguments;

	  var parent = this;

	  var child = new this.constructor(noop);

	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }

	  var _state = parent._state;

	  if (_state) {
	    (function () {
	      var callback = _arguments[_state - 1];
	      asap(function () {
	        return invokeCallback(_state, child, callback, parent._result);
	      });
	    })();
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }

	  return child;
	}

	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.resolve(1);

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve(object) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }

	  var promise = new Constructor(noop);
	  _resolve(promise, object);
	  return promise;
	}

	var PROMISE_ID = Math.random().toString(36).substring(16);

	function noop() {}

	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	var GET_THEN_ERROR = new ErrorObject();

	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}

	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}

	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    GET_THEN_ERROR.error = error;
	    return GET_THEN_ERROR;
	  }
	}

	function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}

	function handleForeignThenable(promise, thenable, then) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        _resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;

	      _reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));

	    if (!sealed && error) {
	      sealed = true;
	      _reject(promise, error);
	    }
	  }, promise);
	}

	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    _reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return _resolve(promise, value);
	    }, function (reason) {
	      return _reject(promise, reason);
	    });
	  }
	}

	function handleMaybeThenable(promise, maybeThenable, then$$) {
	  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$ === GET_THEN_ERROR) {
	      _reject(promise, GET_THEN_ERROR.error);
	    } else if (then$$ === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$)) {
	      handleForeignThenable(promise, maybeThenable, then$$);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}

	function _resolve(promise, value) {
	  if (promise === value) {
	    _reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}

	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }

	  publish(promise);
	}

	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }

	  promise._result = value;
	  promise._state = FULFILLED;

	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}

	function _reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;

	  asap(publishRejection, promise);
	}

	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;

	  parent._onerror = null;

	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;

	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}

	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;

	  if (subscribers.length === 0) {
	    return;
	  }

	  var child = undefined,
	      callback = undefined,
	      detail = promise._result;

	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];

	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }

	  promise._subscribers.length = 0;
	}

	function ErrorObject() {
	  this.error = null;
	}

	var TRY_CATCH_ERROR = new ErrorObject();

	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}

	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = undefined,
	      error = undefined,
	      succeeded = undefined,
	      failed = undefined;

	  if (hasCallback) {
	    value = tryCatch(callback, detail);

	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value = null;
	    } else {
	      succeeded = true;
	    }

	    if (promise === value) {
	      _reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }

	  if (promise._state !== PENDING) {
	    // noop
	  } else if (hasCallback && succeeded) {
	      _resolve(promise, value);
	    } else if (failed) {
	      _reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      _reject(promise, value);
	    }
	}

	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      _resolve(promise, value);
	    }, function rejectPromise(reason) {
	      _reject(promise, reason);
	    });
	  } catch (e) {
	    _reject(promise, e);
	  }
	}

	var id = 0;
	function nextId() {
	  return id++;
	}

	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}

	function Enumerator(Constructor, input) {
	  this._instanceConstructor = Constructor;
	  this.promise = new Constructor(noop);

	  if (!this.promise[PROMISE_ID]) {
	    makePromise(this.promise);
	  }

	  if (isArray(input)) {
	    this._input = input;
	    this.length = input.length;
	    this._remaining = input.length;

	    this._result = new Array(this.length);

	    if (this.length === 0) {
	      fulfill(this.promise, this._result);
	    } else {
	      this.length = this.length || 0;
	      this._enumerate();
	      if (this._remaining === 0) {
	        fulfill(this.promise, this._result);
	      }
	    }
	  } else {
	    _reject(this.promise, validationError());
	  }
	}

	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	};

	Enumerator.prototype._enumerate = function () {
	  var length = this.length;
	  var _input = this._input;

	  for (var i = 0; this._state === PENDING && i < length; i++) {
	    this._eachEntry(_input[i], i);
	  }
	};

	Enumerator.prototype._eachEntry = function (entry, i) {
	  var c = this._instanceConstructor;
	  var resolve$$ = c.resolve;

	  if (resolve$$ === resolve) {
	    var _then = getThen(entry);

	    if (_then === then && entry._state !== PENDING) {
	      this._settledAt(entry._state, i, entry._result);
	    } else if (typeof _then !== 'function') {
	      this._remaining--;
	      this._result[i] = entry;
	    } else if (c === Promise) {
	      var promise = new c(noop);
	      handleMaybeThenable(promise, entry, _then);
	      this._willSettleAt(promise, i);
	    } else {
	      this._willSettleAt(new c(function (resolve$$) {
	        return resolve$$(entry);
	      }), i);
	    }
	  } else {
	    this._willSettleAt(resolve$$(entry), i);
	  }
	};

	Enumerator.prototype._settledAt = function (state, i, value) {
	  var promise = this.promise;

	  if (promise._state === PENDING) {
	    this._remaining--;

	    if (state === REJECTED) {
	      _reject(promise, value);
	    } else {
	      this._result[i] = value;
	    }
	  }

	  if (this._remaining === 0) {
	    fulfill(promise, this._result);
	  }
	};

	Enumerator.prototype._willSettleAt = function (promise, i) {
	  var enumerator = this;

	  subscribe(promise, undefined, function (value) {
	    return enumerator._settledAt(FULFILLED, i, value);
	  }, function (reason) {
	    return enumerator._settledAt(REJECTED, i, reason);
	  });
	};

	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```

	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```

	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}

	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.

	  Example:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```

	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```

	  An example real-world use case is implementing timeouts:

	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```

	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}

	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  _reject(promise, reason);
	  return promise;
	}

	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}

	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}

	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.

	  Terminology
	  -----------

	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.

	  A promise can be in one of three states: pending, fulfilled, or rejected.

	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.

	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.


	  Basic Usage:
	  ------------

	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);

	    // on failure
	    reject(reason);
	  });

	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Advanced Usage:
	  ---------------

	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.

	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();

	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();

	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }

	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Unlike callbacks, promises are great composable primitives.

	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON

	    return values;
	  });
	  ```

	  @class Promise
	  @param {function} resolver
	  Useful for tooling.
	  @constructor
	*/
	function Promise(resolver) {
	  this[PROMISE_ID] = nextId();
	  this._result = this._state = undefined;
	  this._subscribers = [];

	  if (noop !== resolver) {
	    typeof resolver !== 'function' && needsResolver();
	    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	  }
	}

	Promise.all = all;
	Promise.race = race;
	Promise.resolve = resolve;
	Promise.reject = reject;
	Promise._setScheduler = setScheduler;
	Promise._setAsap = setAsap;
	Promise._asap = asap;

	Promise.prototype = {
	  constructor: Promise,

	  /**
	    The primary way of interacting with a promise is through its `then` method,
	    which registers callbacks to receive either a promise's eventual value or the
	    reason why the promise cannot be fulfilled.
	  
	    ```js
	    findUser().then(function(user){
	      // user is available
	    }, function(reason){
	      // user is unavailable, and you are given the reason why
	    });
	    ```
	  
	    Chaining
	    --------
	  
	    The return value of `then` is itself a promise.  This second, 'downstream'
	    promise is resolved with the return value of the first promise's fulfillment
	    or rejection handler, or rejected if the handler throws an exception.
	  
	    ```js
	    findUser().then(function (user) {
	      return user.name;
	    }, function (reason) {
	      return 'default name';
	    }).then(function (userName) {
	      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	      // will be `'default name'`
	    });
	  
	    findUser().then(function (user) {
	      throw new Error('Found user, but still unhappy');
	    }, function (reason) {
	      throw new Error('`findUser` rejected and we're unhappy');
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	    });
	    ```
	    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	  
	    ```js
	    findUser().then(function (user) {
	      throw new PedagogicalException('Upstream error');
	    }).then(function (value) {
	      // never reached
	    }).then(function (value) {
	      // never reached
	    }, function (reason) {
	      // The `PedgagocialException` is propagated all the way down to here
	    });
	    ```
	  
	    Assimilation
	    ------------
	  
	    Sometimes the value you want to propagate to a downstream promise can only be
	    retrieved asynchronously. This can be achieved by returning a promise in the
	    fulfillment or rejection handler. The downstream promise will then be pending
	    until the returned promise is settled. This is called *assimilation*.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // The user's comments are now available
	    });
	    ```
	  
	    If the assimliated promise rejects, then the downstream promise will also reject.
	  
	    ```js
	    findUser().then(function (user) {
	      return findCommentsByAuthor(user);
	    }).then(function (comments) {
	      // If `findCommentsByAuthor` fulfills, we'll have the value here
	    }, function (reason) {
	      // If `findCommentsByAuthor` rejects, we'll have the reason here
	    });
	    ```
	  
	    Simple Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let result;
	  
	    try {
	      result = findResult();
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	    findResult(function(result, err){
	      if (err) {
	        // failure
	      } else {
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findResult().then(function(result){
	      // success
	    }, function(reason){
	      // failure
	    });
	    ```
	  
	    Advanced Example
	    --------------
	  
	    Synchronous Example
	  
	    ```javascript
	    let author, books;
	  
	    try {
	      author = findAuthor();
	      books  = findBooksByAuthor(author);
	      // success
	    } catch(reason) {
	      // failure
	    }
	    ```
	  
	    Errback Example
	  
	    ```js
	  
	    function foundBooks(books) {
	  
	    }
	  
	    function failure(reason) {
	  
	    }
	  
	    findAuthor(function(author, err){
	      if (err) {
	        failure(err);
	        // failure
	      } else {
	        try {
	          findBoooksByAuthor(author, function(books, err) {
	            if (err) {
	              failure(err);
	            } else {
	              try {
	                foundBooks(books);
	              } catch(reason) {
	                failure(reason);
	              }
	            }
	          });
	        } catch(error) {
	          failure(err);
	        }
	        // success
	      }
	    });
	    ```
	  
	    Promise Example;
	  
	    ```javascript
	    findAuthor().
	      then(findBooksByAuthor).
	      then(function(books){
	        // found books
	    }).catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method then
	    @param {Function} onFulfilled
	    @param {Function} onRejected
	    Useful for tooling.
	    @return {Promise}
	  */
	  then: then,

	  /**
	    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	    as the catch block of a try/catch statement.
	  
	    ```js
	    function findAuthor(){
	      throw new Error('couldn't find that author');
	    }
	  
	    // synchronous
	    try {
	      findAuthor();
	    } catch(reason) {
	      // something went wrong
	    }
	  
	    // async with promises
	    findAuthor().catch(function(reason){
	      // something went wrong
	    });
	    ```
	  
	    @method catch
	    @param {Function} onRejection
	    Useful for tooling.
	    @return {Promise}
	  */
	  'catch': function _catch(onRejection) {
	    return this.then(null, onRejection);
	  }
	};

	function polyfill() {
	    var local = undefined;

	    if (typeof global !== 'undefined') {
	        local = global;
	    } else if (typeof self !== 'undefined') {
	        local = self;
	    } else {
	        try {
	            local = Function('return this')();
	        } catch (e) {
	            throw new Error('polyfill failed because global object is unavailable in this environment');
	        }
	    }

	    var P = local.Promise;

	    if (P) {
	        var promiseToString = null;
	        try {
	            promiseToString = Object.prototype.toString.call(P.resolve());
	        } catch (e) {
	            // silently ignored
	        }

	        if (promiseToString === '[object Promise]' && !P.cast) {
	            return;
	        }
	    }

	    local.Promise = Promise;
	}

	// Strange compat..
	Promise.polyfill = polyfill;
	Promise.Promise = Promise;

	return Promise;

	})));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), (function() { return this; }())))

/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	/*** IMPORTS FROM imports-loader ***/
	var hash = "'213270133cd38b48a3c0fcc5a55805a529e969eb";
	var shortHash = "2132701'";
	var version = "4.5.7";
	var agentVersion = "2.2.0.1013";
	var nrtcVersion = "3.5.0";
	var sdkVersion = "40";
	var protocolVersion = 1;
	var lbsUrl = "https://lbs.netease.im/lbs/webconf.jsp";

	/* globals hash:false, shortHash:false, version:false, agentVersion:false, nrtcVersion:fale, sdkVersion:false, protocolVersion:false, lbsUrl:true */
	// those globals will be injected via webpack, @see ./build/webpack.config.js

	var theAnswerToEverything = process.env.NODE_ENV === 'development' ? 6 * 1000 : 42 * 1000;

	// console.log('nrtcVersion', nrtcVersion)
	var config = {
	  info: {
	    hash: hash,
	    shortHash: shortHash,
	    version: version,
	    sdkVersion: sdkVersion,
	    nrtcVersion: nrtcVersion,
	    protocolVersion: protocolVersion
	  },
	  agentVersion: agentVersion,
	  lbsUrl: lbsUrl,
	  // lbs 最大重试次数, 当所有 lbs 地址都不可用的时候, 会尝试重新获取 lbs 地址, 目前只重试一次
	  // lbsMaxRetryCount: 1,
	  // 连接超时时间
	  connectTimeout: theAnswerToEverything,
	  // xhr 超时时间
	  xhrTimeout: theAnswerToEverything,
	  // socket 超时时间
	  socketTimeout: theAnswerToEverything,
	  // 重连间隔和最大间隔
	  reconnectionDelay: 656.25,
	  reconnectionDelayMax: theAnswerToEverything,
	  reconnectionJitter: 0.1,

	  // 心跳间隔
	  heartbeatInterval: 3 * 60 * 1000,

	  // 协议超时时间
	  cmdTimeout: theAnswerToEverything
	};

	// =============================
	// socket 服务器地址相关
	// =============================
	// 格式化
	config.formatSocketUrl = function (_ref) {
	  var url = _ref.url,
	      secure = _ref.secure;

	  var prefix = secure ? 'https' : 'http';
	  if (url.indexOf('http') === -1) {
	    return prefix + '://' + url;
	  }
	  return url;
	};

	// =====================================
	// nos 相关
	// =====================================
	config.fileServerUrl = 'https://nos.netease.com';
	config.replaceUrl = 'http://nos.netease.im';
	// 上传地址本来应该是 http://bucket.nos.netease.com, 但是 nos nginx 处理有点问题, 所以放在后面
	config.genUploadUrl = function (bucket) {
	  if (config.uploadUrl) {
	    return config.uploadUrl + '/' + bucket;
	  }
	  return config.fileServerUrl + '/' + bucket;
	};

	// 下载地址把 bucket 提到前面, 可以 CDN 加速（wj：老大说没有申请cdn 不知道这注释怎么来的）
	config.genDownloadUrl = function (bucket, object) {
	  if (config.downloadUrl) {
	    return config.replaceUrl + '/' + bucket + '/' + object;
	  } else {
	    return config.fileServerUrl + '/' + bucket + '/' + object;
	  }
	};

	module.exports = config;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },

/***/ 4:
/***/ function(module, exports) {

	'use strict';

	/**
	 * 错误
	 *
	 * @constructor
	 * @param {String} message  错误消息
	 * @param {Number} code     错误码
	 */
	function NIMError(message, code) {
	  var self = this;
	  self.message = message;
	  self.code = code;
	  self.time = new Date();
	  self.timetag = +self.time;
	}
	NIMError.prototype = Object.create(Error.prototype);
	NIMError.prototype.name = 'NIMError';

	NIMError.prototype.appendMessage = function (message) {
	  var self = this;
	  if (!self.message) {
	    self.message = message;
	  } else if (message) {
	    self.message += '(' + message + ')';
	  }
	};

	/**
	 * 错误码错误信息表
	 *
	 * @memberOf NIMError
	 * @readOnly
	 * @enum {String}
	 */
	var codeMap = {
	  201: '客户端版本不对, 需升级sdk',
	  302: '用户名或密码错误, 请检查appKey和token是否有效, account和token是否匹配',
	  403: '非法操作或没有权限',
	  404: '对象(用户/群/聊天室)不存在',
	  405: '参数长度过长',
	  408: '客户端请求超时',
	  414: '参数错误',
	  415: '服务不可用/没有聊天室服务器可分配',
	  // http://doc.hz.netease.com/pages/viewpage.action?pageId=60393173
	  416: '频率控制',
	  417: '重复操作',
	  422: '帐号被禁用',
	  500: '服务器内部错误',
	  501: '数据库操作失败',
	  503: '服务器繁忙',
	  508: '删除有效期过了',
	  509: '已失效',
	  7101: '被拉黑',
	  801: '群人数达到上限',
	  802: '没有权限',
	  803: '群不存在或未发生变化',
	  804: '用户不在群里面',
	  805: '群类型不匹配',
	  806: '创建群数量达到限制',
	  807: '群成员状态不对',
	  809: '已经在群里',
	  813: '因群数量限制，部分拉人成功',
	  997: '协议已失效',
	  998: '解包错误',
	  999: '打包错误',
	  9102: '通道失效',
	  9103: '已经在其他端接听/拒绝过这通电话',
	  11001: '对方离线, 通话不可送达',
	  13002: '聊天室状态异常',
	  13003: '在黑名单中',
	  13004: '在禁言名单中',
	  13006: '聊天室处于整体禁言状态,只有管理员能发言',
	  // 请确保flash版本号大于10
	  'Connect_Failed': '无法建立连接, 请确保能 ping/telnet 到云信服务器; 如果是IE8/9, 请确保项目部署在 HTTPS 环境下',
	  'Error_Internet_Disconnected': '网断了',
	  'Error_Connection_is_not_Established': '连接未建立',
	  'Error_Connection_Socket_State_not_Match': 'socket状态不对',
	  'Error_Timeout': '超时',
	  'Param_Error': '参数错误',
	  'No_File_Selected': '请选择文件',
	  'Wrong_File_Type': '文件类型错误',
	  'File_Too_Large': '文件过大',
	  'Cross_Origin_Iframe': '不能获取跨域Iframe的内容',
	  'Not_Support': '不支持',
	  'NO_DB': '无数据库',
	  'DB': '数据库错误',
	  'Still_In_Team': '还在群里',
	  'Session_Exist': '会话已存在',
	  'Session_Not_Exist': '会话不存在',
	  'Error_Unknown': '未知错误',
	  'Operation_Canceled': '操作取消'
	};

	// 200 成功
	// 406 未发生变化
	// 808 申请成功
	// 810 邀请成功
	[200, 406, 808, 810].forEach(function (code) {
	  codeMap[code] = null;
	});

	NIMError.genError = function (code) {
	  var msg = codeMap[code];
	  if (msg === undefined) {
	    msg = '操作失败';
	  }
	  if (msg === null) {
	    return null;
	  } else {
	    return new NIMError(msg, code);
	  }
	};

	NIMError.multiInstance = function () {
	  return new NIMError('不允许初始化多个实例', 'Not_Allow_Multi_Instance');
	};

	NIMError.newNetworkError = function () {
	  var code = 'Error_Internet_Disconnected';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.newConnectError = function (message) {
	  var code = 'Connect_Failed';
	  return new NIMError(codeMap[code] || message, code);
	};

	NIMError.newConnectionError = function () {
	  var code = 'Error_Connection_is_not_Established';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.newSocketStateError = function () {
	  var code = 'Error_Connection_Socket_State_not_Match';
	  return new NIMError(codeMap[code], code);
	};
	NIMError.newTimeoutError = function () {
	  var code = 'Error_Timeout';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.newFrequencyControlError = function () {
	  var code = 416;
	  var error = new NIMError(codeMap[code], code);
	  // 表明此错误是由客户端生成的，此字段只是用于自动化测试
	  error.from = 'local';
	  return error;
	};

	NIMError.newParamError = function (message) {
	  var code = 'Param_Error';
	  return new NIMError(message || codeMap[code], code);
	};

	NIMError.newNoFileError = function (message) {
	  var code = 'No_File_Selected';
	  return new NIMError(message || codeMap[code], code);
	};

	NIMError.newWrongFileTypeError = function (message) {
	  var code = 'Wrong_File_Type';
	  return new NIMError(message || codeMap[code], code);
	};

	NIMError.newFileTooLargeError = function (message) {
	  var code = 'File_Too_Large';
	  return new NIMError(message || codeMap[code], code);
	};

	NIMError.newCORSIframeError = function () {
	  var code = 'Cross_Origin_Iframe';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.newSupportError = function (msg, code) {
	  return new NIMError('不支持' + msg, 'Not_Support_' + code);
	};

	NIMError.newSupportDBError = function () {
	  return NIMError.newSupportError('数据库', 'DB');
	};

	NIMError.noDBError = function () {
	  var code = 'NO_DB';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.newDBError = function () {
	  var code = 'DB';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.newUnknownError = function () {
	  var code = 'Error_Unknown';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.stillInTeamError = function () {
	  var code = 'Still_In_Team';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.sessionExist = function () {
	  var code = 'Session_Exist';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.sessionNotExist = function () {
	  var code = 'Session_Not_Exist';
	  return new NIMError(codeMap[code], code);
	};

	NIMError.cancel = function () {
	  var code = 'Operation_Canceled';
	  return new NIMError(codeMap[code], code);
	};

	// 自定义错误类型
	NIMError.customError = function (message, code) {
	  code = code || 'Other_Error';
	  return new NIMError(message, code);
	};

	module.exports = NIMError;

/***/ },

/***/ 7:
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var has = Object.prototype.hasOwnProperty
	  , prefix = '~';

	/**
	 * Constructor to create a storage for our `EE` objects.
	 * An `Events` instance is a plain object whose properties are event names.
	 *
	 * @constructor
	 * @api private
	 */
	function Events() {}

	//
	// We try to not inherit from `Object.prototype`. In some engines creating an
	// instance in this way is faster than calling `Object.create(null)` directly.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// character to make sure that the built-in object properties are not
	// overridden or used as an attack vector.
	//
	if (Object.create) {
	  Events.prototype = Object.create(null);

	  //
	  // This hack is needed because the `__proto__` property is still inherited in
	  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
	  //
	  if (!new Events().__proto__) prefix = false;
	}

	/**
	 * Representation of a single event listener.
	 *
	 * @param {Function} fn The listener function.
	 * @param {Mixed} context The context to invoke the listener with.
	 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	 * @constructor
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal `EventEmitter` interface that is molded against the Node.js
	 * `EventEmitter` interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() {
	  this._events = new Events();
	  this._eventsCount = 0;
	}

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var names = []
	    , events
	    , name;

	  if (this._eventsCount === 0) return names;

	  for (name in (events = this._events)) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return the listeners registered for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Boolean} exists Only check if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events[evt];

	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];

	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }

	  return ee;
	};

	/**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if (listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Add a listener for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {Mixed} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
	  else if (!this._events[evt].fn) this._events[evt].push(listener);
	  else this._events[evt] = [this._events[evt], listener];

	  return this;
	};

	/**
	 * Add a one-time listener for a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {Mixed} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
	  else if (!this._events[evt].fn) this._events[evt].push(listener);
	  else this._events[evt] = [this._events[evt], listener];

	  return this;
	};

	/**
	 * Remove the listeners of a given event.
	 *
	 * @param {String|Symbol} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {Mixed} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return this;
	  if (!fn) {
	    if (--this._eventsCount === 0) this._events = new Events();
	    else delete this._events[evt];
	    return this;
	  }

	  var listeners = this._events[evt];

	  if (listeners.fn) {
	    if (
	         listeners.fn === fn
	      && (!once || listeners.once)
	      && (!context || listeners.context === context)
	    ) {
	      if (--this._eventsCount === 0) this._events = new Events();
	      else delete this._events[evt];
	    }
	  } else {
	    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
	      if (
	           listeners[i].fn !== fn
	        || (once && !listeners[i].once)
	        || (context && listeners[i].context !== context)
	      ) {
	        events.push(listeners[i]);
	      }
	    }

	    //
	    // Reset the array, or remove it completely if we have no more listeners.
	    //
	    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
	    else if (--this._eventsCount === 0) this._events = new Events();
	    else delete this._events[evt];
	  }

	  return this;
	};

	/**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {String|Symbol} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  var evt;

	  if (event) {
	    evt = prefix ? prefix + event : event;
	    if (this._events[evt]) {
	      if (--this._eventsCount === 0) this._events = new Events();
	      else delete this._events[evt];
	    }
	  } else {
	    this._events = new Events();
	    this._eventsCount = 0;
	  }

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Allow `EventEmitter` to be imported as module namespace.
	//
	EventEmitter.EventEmitter = EventEmitter;

	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },

/***/ 9:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*!
	 * Platform.js <https://mths.be/platform>
	 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
	 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
	 * Available under MIT license <https://mths.be/mit>
	 */
	;(function() {
	  'use strict';

	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  /** Used as a reference to the global object. */
	  var root = (objectTypes[typeof window] && window) || this;

	  /** Backup possible global object. */
	  var oldRoot = root;

	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[typeof exports] && exports;

	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
	  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /**
	   * Used as the maximum length of an array-like object.
	   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	   * for more details.
	   */
	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  /** Regular expression to detect Opera. */
	  var reOpera = /\bOpera/;

	  /** Possible global object. */
	  var thisBinding = this;

	  /** Used for native method references. */
	  var objectProto = Object.prototype;

	  /** Used to check for own properties of an object. */
	  var hasOwnProperty = objectProto.hasOwnProperty;

	  /** Used to resolve the internal `[[Class]]` of values. */
	  var toString = objectProto.toString;

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Capitalizes a string value.
	   *
	   * @private
	   * @param {string} string The string to capitalize.
	   * @returns {string} The capitalized string.
	   */
	  function capitalize(string) {
	    string = String(string);
	    return string.charAt(0).toUpperCase() + string.slice(1);
	  }

	  /**
	   * A utility function to clean up the OS name.
	   *
	   * @private
	   * @param {string} os The OS name to clean up.
	   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
	   * @param {string} [label] A label for the OS.
	   */
	  function cleanupOS(os, pattern, label) {
	    // Platform tokens are defined at:
	    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    var data = {
	      '10.0': '10',
	      '6.4':  '10 Technical Preview',
	      '6.3':  '8.1',
	      '6.2':  '8',
	      '6.1':  'Server 2008 R2 / 7',
	      '6.0':  'Server 2008 / Vista',
	      '5.2':  'Server 2003 / XP 64-bit',
	      '5.1':  'XP',
	      '5.01': '2000 SP1',
	      '5.0':  '2000',
	      '4.0':  'NT',
	      '4.90': 'ME'
	    };
	    // Detect Windows version from platform tokens.
	    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
	        (data = data[/[\d.]+$/.exec(os)])) {
	      os = 'Windows ' + data;
	    }
	    // Correct character case and cleanup string.
	    os = String(os);

	    if (pattern && label) {
	      os = os.replace(RegExp(pattern, 'i'), label);
	    }

	    os = format(
	      os.replace(/ ce$/i, ' CE')
	        .replace(/\bhpw/i, 'web')
	        .replace(/\bMacintosh\b/, 'Mac OS')
	        .replace(/_PowerPC\b/i, ' OS')
	        .replace(/\b(OS X) [^ \d]+/i, '$1')
	        .replace(/\bMac (OS X)\b/, '$1')
	        .replace(/\/(\d)/, ' $1')
	        .replace(/_/g, '.')
	        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
	        .replace(/\bx86\.64\b/gi, 'x86_64')
	        .replace(/\b(Windows Phone) OS\b/, '$1')
	        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
	        .split(' on ')[0]
	    );

	    return os;
	  }

	  /**
	   * An iteration utility for arrays and objects.
	   *
	   * @private
	   * @param {Array|Object} object The object to iterate over.
	   * @param {Function} callback The function called per iteration.
	   */
	  function each(object, callback) {
	    var index = -1,
	        length = object ? object.length : 0;

	    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
	      while (++index < length) {
	        callback(object[index], index, object);
	      }
	    } else {
	      forOwn(object, callback);
	    }
	  }

	  /**
	   * Trim and conditionally capitalize string values.
	   *
	   * @private
	   * @param {string} string The string to format.
	   * @returns {string} The formatted string.
	   */
	  function format(string) {
	    string = trim(string);
	    return /^(?:webOS|i(?:OS|P))/.test(string)
	      ? string
	      : capitalize(string);
	  }

	  /**
	   * Iterates over an object's own properties, executing the `callback` for each.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} callback The function executed per own property.
	   */
	  function forOwn(object, callback) {
	    for (var key in object) {
	      if (hasOwnProperty.call(object, key)) {
	        callback(object[key], key, object);
	      }
	    }
	  }

	  /**
	   * Gets the internal `[[Class]]` of a value.
	   *
	   * @private
	   * @param {*} value The value.
	   * @returns {string} The `[[Class]]`.
	   */
	  function getClassOf(value) {
	    return value == null
	      ? capitalize(value)
	      : toString.call(value).slice(8, -1);
	  }

	  /**
	   * Host objects can return type values that are different from their actual
	   * data type. The objects we are concerned with usually return non-primitive
	   * types of "object", "function", or "unknown".
	   *
	   * @private
	   * @param {*} object The owner of the property.
	   * @param {string} property The property to check.
	   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
	   */
	  function isHostType(object, property) {
	    var type = object != null ? typeof object[property] : 'number';
	    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
	      (type == 'object' ? !!object[property] : true);
	  }

	  /**
	   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
	   *
	   * @private
	   * @param {string} string The string to qualify.
	   * @returns {string} The qualified string.
	   */
	  function qualify(string) {
	    return String(string).replace(/([ -])(?!$)/g, '$1?');
	  }

	  /**
	   * A bare-bones `Array#reduce` like utility function.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} callback The function called per iteration.
	   * @returns {*} The accumulated result.
	   */
	  function reduce(array, callback) {
	    var accumulator = null;
	    each(array, function(value, index) {
	      accumulator = callback(accumulator, value, index, array);
	    });
	    return accumulator;
	  }

	  /**
	   * Removes leading and trailing whitespace from a string.
	   *
	   * @private
	   * @param {string} string The string to trim.
	   * @returns {string} The trimmed string.
	   */
	  function trim(string) {
	    return String(string).replace(/^ +| +$/g, '');
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Creates a new platform object.
	   *
	   * @memberOf platform
	   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
	   *  context object.
	   * @returns {Object} A platform object.
	   */
	  function parse(ua) {

	    /** The environment context object. */
	    var context = root;

	    /** Used to flag when a custom context is provided. */
	    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

	    // Juggle arguments.
	    if (isCustomContext) {
	      context = ua;
	      ua = null;
	    }

	    /** Browser navigator object. */
	    var nav = context.navigator || {};

	    /** Browser user agent string. */
	    var userAgent = nav.userAgent || '';

	    ua || (ua = userAgent);

	    /** Used to flag when `thisBinding` is the [ModuleScope]. */
	    var isModuleScope = isCustomContext || thisBinding == oldRoot;

	    /** Used to detect if browser is like Chrome. */
	    var likeChrome = isCustomContext
	      ? !!nav.likeChrome
	      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

	    /** Internal `[[Class]]` value shortcuts. */
	    var objectClass = 'Object',
	        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
	        enviroClass = isCustomContext ? objectClass : 'Environment',
	        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
	        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

	    /** Detect Java environments. */
	    var java = /\bJava/.test(javaClass) && context.java;

	    /** Detect Rhino. */
	    var rhino = java && getClassOf(context.environment) == enviroClass;

	    /** A character to represent alpha. */
	    var alpha = java ? 'a' : '\u03b1';

	    /** A character to represent beta. */
	    var beta = java ? 'b' : '\u03b2';

	    /** Browser document object. */
	    var doc = context.document || {};

	    /**
	     * Detect Opera browser (Presto-based).
	     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
	     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
	     */
	    var opera = context.operamini || context.opera;

	    /** Opera `[[Class]]`. */
	    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
	      ? operaClass
	      : (opera = null);

	    /*------------------------------------------------------------------------*/

	    /** Temporary variable used over the script's lifetime. */
	    var data;

	    /** The CPU architecture. */
	    var arch = ua;

	    /** Platform description array. */
	    var description = [];

	    /** Platform alpha/beta indicator. */
	    var prerelease = null;

	    /** A flag to indicate that environment features should be used to resolve the platform. */
	    var useFeatures = ua == userAgent;

	    /** The browser/environment version. */
	    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

	    /** A flag to indicate if the OS ends with "/ Version" */
	    var isSpecialCasedOS;

	    /* Detectable layout engines (order is important). */
	    var layout = getLayout([
	      { 'label': 'EdgeHTML', 'pattern': 'Edge' },
	      'Trident',
	      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
	      'iCab',
	      'Presto',
	      'NetFront',
	      'Tasman',
	      'KHTML',
	      'Gecko'
	    ]);

	    /* Detectable browser names (order is important). */
	    var name = getName([
	      'Adobe AIR',
	      'Arora',
	      'Avant Browser',
	      'Breach',
	      'Camino',
	      'Epiphany',
	      'Fennec',
	      'Flock',
	      'Galeon',
	      'GreenBrowser',
	      'iCab',
	      'Iceweasel',
	      'K-Meleon',
	      'Konqueror',
	      'Lunascape',
	      'Maxthon',
	      { 'label': 'Microsoft Edge', 'pattern': 'Edge' },
	      'Midori',
	      'Nook Browser',
	      'PaleMoon',
	      'PhantomJS',
	      'Raven',
	      'Rekonq',
	      'RockMelt',
	      'SeaMonkey',
	      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Sleipnir',
	      'SlimBrowser',
	      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
	      'Sunrise',
	      'Swiftfox',
	      'WebPositive',
	      'Opera Mini',
	      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
	      'Opera',
	      { 'label': 'Opera', 'pattern': 'OPR' },
	      'Chrome',
	      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
	      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
	      { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' },
	      { 'label': 'IE', 'pattern': 'IEMobile' },
	      { 'label': 'IE', 'pattern': 'MSIE' },
	      'Safari'
	    ]);

	    /* Detectable products (order is important). */
	    var product = getProduct([
	      { 'label': 'BlackBerry', 'pattern': 'BB10' },
	      'BlackBerry',
	      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
	      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
	      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
	      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
	      'Google TV',
	      'Lumia',
	      'iPad',
	      'iPod',
	      'iPhone',
	      'Kindle',
	      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Nexus',
	      'Nook',
	      'PlayBook',
	      'PlayStation 3',
	      'PlayStation 4',
	      'PlayStation Vita',
	      'TouchPad',
	      'Transformer',
	      { 'label': 'Wii U', 'pattern': 'WiiU' },
	      'Wii',
	      'Xbox One',
	      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
	      'Xoom'
	    ]);

	    /* Detectable manufacturers. */
	    var manufacturer = getManufacturer({
	      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
	      'Archos': {},
	      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
	      'Asus': { 'Transformer': 1 },
	      'Barnes & Noble': { 'Nook': 1 },
	      'BlackBerry': { 'PlayBook': 1 },
	      'Google': { 'Google TV': 1, 'Nexus': 1 },
	      'HP': { 'TouchPad': 1 },
	      'HTC': {},
	      'LG': {},
	      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
	      'Motorola': { 'Xoom': 1 },
	      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
	      'Nokia': { 'Lumia': 1 },
	      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
	      'Sony': { 'PlayStation 4': 1, 'PlayStation 3': 1, 'PlayStation Vita': 1 }
	    });

	    /* Detectable operating systems (order is important). */
	    var os = getOS([
	      'Windows Phone',
	      'Android',
	      'CentOS',
	      { 'label': 'Chrome OS', 'pattern': 'CrOS' },
	      'Debian',
	      'Fedora',
	      'FreeBSD',
	      'Gentoo',
	      'Haiku',
	      'Kubuntu',
	      'Linux Mint',
	      'OpenBSD',
	      'Red Hat',
	      'SuSE',
	      'Ubuntu',
	      'Xubuntu',
	      'Cygwin',
	      'Symbian OS',
	      'hpwOS',
	      'webOS ',
	      'webOS',
	      'Tablet OS',
	      'Linux',
	      'Mac OS X',
	      'Macintosh',
	      'Mac',
	      'Windows 98;',
	      'Windows '
	    ]);

	    /*------------------------------------------------------------------------*/

	    /**
	     * Picks the layout engine from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected layout engine.
	     */
	    function getLayout(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the manufacturer from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An object of guesses.
	     * @returns {null|string} The detected manufacturer.
	     */
	    function getManufacturer(guesses) {
	      return reduce(guesses, function(result, value, key) {
	        // Lookup the manufacturer by product or scan the UA for the manufacturer.
	        return result || (
	          value[product] ||
	          value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
	          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
	        ) && key;
	      });
	    }

	    /**
	     * Picks the browser name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected browser name.
	     */
	    function getName(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the OS name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected OS name.
	     */
	    function getOS(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
	            )) {
	          result = cleanupOS(result, pattern, guess.label || guess);
	        }
	        return result;
	      });
	    }

	    /**
	     * Picks the product name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected product name.
	     */
	    function getProduct(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
	              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
	            )) {
	          // Split by forward slash and append product version if needed.
	          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
	            result[0] += ' ' + result[1];
	          }
	          // Correct character case and cleanup string.
	          guess = guess.label || guess;
	          result = format(result[0]
	            .replace(RegExp(pattern, 'i'), guess)
	            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
	            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
	        }
	        return result;
	      });
	    }

	    /**
	     * Resolves the version using an array of UA patterns.
	     *
	     * @private
	     * @param {Array} patterns An array of UA patterns.
	     * @returns {null|string} The detected version.
	     */
	    function getVersion(patterns) {
	      return reduce(patterns, function(result, pattern) {
	        return result || (RegExp(pattern +
	          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
	      });
	    }

	    /**
	     * Returns `platform.description` when the platform object is coerced to a string.
	     *
	     * @name toString
	     * @memberOf platform
	     * @returns {string} Returns `platform.description` if available, else an empty string.
	     */
	    function toStringPlatform() {
	      return this.description || '';
	    }

	    /*------------------------------------------------------------------------*/

	    // Convert layout to an array so we can add extra details.
	    layout && (layout = [layout]);

	    // Detect product names that contain their manufacturer's name.
	    if (manufacturer && !product) {
	      product = getProduct([manufacturer]);
	    }
	    // Clean up Google TV.
	    if ((data = /\bGoogle TV\b/.exec(product))) {
	      product = data[0];
	    }
	    // Detect simulators.
	    if (/\bSimulator\b/i.test(ua)) {
	      product = (product ? product + ' ' : '') + 'Simulator';
	    }
	    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
	    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
	      description.push('running in Turbo/Uncompressed mode');
	    }
	    // Detect IE Mobile 11.
	    if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
	      data = parse(ua.replace(/like iPhone OS/, ''));
	      manufacturer = data.manufacturer;
	      product = data.product;
	    }
	    // Detect iOS.
	    else if (/^iP/.test(product)) {
	      name || (name = 'Safari');
	      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
	        ? ' ' + data[1].replace(/_/g, '.')
	        : '');
	    }
	    // Detect Kubuntu.
	    else if (name == 'Konqueror' && !/buntu/i.test(os)) {
	      os = 'Kubuntu';
	    }
	    // Detect Android browsers.
	    else if ((manufacturer && manufacturer != 'Google' &&
	        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) ||
	        (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
	      name = 'Android Browser';
	      os = /\bAndroid\b/.test(os) ? os : 'Android';
	    }
	    // Detect Silk desktop/accelerated modes.
	    else if (name == 'Silk') {
	      if (!/\bMobi/i.test(ua)) {
	        os = 'Android';
	        description.unshift('desktop mode');
	      }
	      if (/Accelerated *= *true/i.test(ua)) {
	        description.unshift('accelerated');
	      }
	    }
	    // Detect PaleMoon identifying as Firefox.
	    else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
	      description.push('identifying as Firefox ' + data[1]);
	    }
	    // Detect Firefox OS and products running Firefox.
	    else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
	      os || (os = 'Firefox OS');
	      product || (product = data[1]);
	    }
	    // Detect false positives for Firefox/Safari.
	    else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
	      // Escape the `/` for Firefox 1.
	      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
	        // Clear name of false positives.
	        name = null;
	      }
	      // Reassign a generic name.
	      if ((data = product || manufacturer || os) &&
	          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
	        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
	      }
	    }
	    // Detect non-Opera (Presto-based) versions (order is important).
	    if (!version) {
	      version = getVersion([
	        '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|Silk(?!/[\\d.]+$))',
	        'Version',
	        qualify(name),
	        '(?:Firefox|Minefield|NetFront)'
	      ]);
	    }
	    // Detect stubborn layout engines.
	    if ((data =
	          layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' ||
	          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
	          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' ||
	          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') ||
	          layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront'
	        )) {
	      layout = [data];
	    }
	    // Detect Windows Phone 7 desktop mode.
	    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
	      name += ' Mobile';
	      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
	      description.unshift('desktop mode');
	    }
	    // Detect Windows Phone 8.x desktop mode.
	    else if (/\bWPDesktop\b/i.test(ua)) {
	      name = 'IE Mobile';
	      os = 'Windows Phone 8.x';
	      description.unshift('desktop mode');
	      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
	    }
	    // Detect IE 11.
	    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
	      if (name) {
	        description.push('identifying as ' + name + (version ? ' ' + version : ''));
	      }
	      name = 'IE';
	      version = data[1];
	    }
	    // Leverage environment features.
	    if (useFeatures) {
	      // Detect server-side environments.
	      // Rhino has a global function while others have a global object.
	      if (isHostType(context, 'global')) {
	        if (java) {
	          data = java.lang.System;
	          arch = data.getProperty('os.arch');
	          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
	        }
	        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
	          os || (os = data[0].os || null);
	          try {
	            data[1] = context.require('ringo/engine').version;
	            version = data[1].join('.');
	            name = 'RingoJS';
	          } catch(e) {
	            if (data[0].global.system == context.system) {
	              name = 'Narwhal';
	            }
	          }
	        }
	        else if (
	          typeof context.process == 'object' && !context.process.browser &&
	          (data = context.process)
	        ) {
	          name = 'Node.js';
	          arch = data.arch;
	          os = data.platform;
	          version = /[\d.]+/.exec(data.version)[0];
	        }
	        else if (rhino) {
	          name = 'Rhino';
	        }
	      }
	      // Detect Adobe AIR.
	      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
	        name = 'Adobe AIR';
	        os = data.flash.system.Capabilities.os;
	      }
	      // Detect PhantomJS.
	      else if (getClassOf((data = context.phantom)) == phantomClass) {
	        name = 'PhantomJS';
	        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
	      }
	      // Detect IE compatibility modes.
	      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
	        // We're in compatibility mode when the Trident version + 4 doesn't
	        // equal the document mode.
	        version = [version, doc.documentMode];
	        if ((data = +data[1] + 4) != version[1]) {
	          description.push('IE ' + version[1] + ' mode');
	          layout && (layout[1] = '');
	          version[1] = data;
	        }
	        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
	      }
	      os = os && format(os);
	    }
	    // Detect prerelease phases.
	    if (version && (data =
	          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
	          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
	          /\bMinefield\b/i.test(ua) && 'a'
	        )) {
	      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
	      version = version.replace(RegExp(data + '\\+?$'), '') +
	        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
	    }
	    // Detect Firefox Mobile.
	    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
	      name = 'Firefox Mobile';
	    }
	    // Obscure Maxthon's unreliable version.
	    else if (name == 'Maxthon' && version) {
	      version = version.replace(/\.[\d.]+/, '.x');
	    }
	    // Detect Xbox 360 and Xbox One.
	    else if (/\bXbox\b/i.test(product)) {
	      os = null;
	      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
	        description.unshift('mobile mode');
	      }
	    }
	    // Add mobile postfix.
	    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
	        (os == 'Windows CE' || /Mobi/i.test(ua))) {
	      name += ' Mobile';
	    }
	    // Detect IE platform preview.
	    else if (name == 'IE' && useFeatures && context.external === null) {
	      description.unshift('platform preview');
	    }
	    // Detect BlackBerry OS version.
	    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
	    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
	          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
	          version
	        )) {
	      data = [data, /BB10/.test(ua)];
	      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
	      version = null;
	    }
	    // Detect Opera identifying/masking itself as another browser.
	    // http://www.opera.com/support/kb/view/843/
	    else if (this != forOwn && product != 'Wii' && (
	          (useFeatures && opera) ||
	          (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
	          (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
	          (name == 'IE' && (
	            (os && !/^Win/.test(os) && version > 5.5) ||
	            /\bWindows XP\b/.test(os) && version > 8 ||
	            version == 8 && !/\bTrident\b/.test(ua)
	          ))
	        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
	      // When "identifying", the UA contains both Opera and the other browser's name.
	      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
	      if (reOpera.test(name)) {
	        if (/\bIE\b/.test(data) && os == 'Mac OS') {
	          os = null;
	        }
	        data = 'identify' + data;
	      }
	      // When "masking", the UA contains only the other browser's name.
	      else {
	        data = 'mask' + data;
	        if (operaClass) {
	          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
	        } else {
	          name = 'Opera';
	        }
	        if (/\bIE\b/.test(data)) {
	          os = null;
	        }
	        if (!useFeatures) {
	          version = null;
	        }
	      }
	      layout = ['Presto'];
	      description.push(data);
	    }
	    // Detect WebKit Nightly and approximate Chrome/Safari versions.
	    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	      // Correct build number for numeric comparison.
	      // (e.g. "532.5" becomes "532.05")
	      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
	      // Nightly builds are postfixed with a "+".
	      if (name == 'Safari' && data[1].slice(-1) == '+') {
	        name = 'WebKit Nightly';
	        prerelease = 'alpha';
	        version = data[1].slice(0, -1);
	      }
	      // Clear incorrect browser versions.
	      else if (version == data[1] ||
	          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	        version = null;
	      }
	      // Use the full Chrome version when available.
	      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
	      // Detect Blink layout engine.
	      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
	        layout = ['Blink'];
	      }
	      // Detect JavaScriptCore.
	      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
	      if (!useFeatures || (!likeChrome && !data[1])) {
	        layout && (layout[1] = 'like Safari');
	        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
	      } else {
	        layout && (layout[1] = 'like Chrome');
	        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
	      }
	      // Add the postfix of ".x" or "+" for approximate versions.
	      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
	      // Obscure version for some Safari 1-2 releases.
	      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
	        version = data;
	      }
	    }
	    // Detect Opera desktop modes.
	    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
	      name += ' ';
	      description.unshift('desktop mode');
	      if (data == 'zvav') {
	        name += 'Mini';
	        version = null;
	      } else {
	        name += 'Mobile';
	      }
	      os = os.replace(RegExp(' *' + data + '$'), '');
	    }
	    // Detect Chrome desktop mode.
	    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
	      description.unshift('desktop mode');
	      name = 'Chrome Mobile';
	      version = null;

	      if (/\bOS X\b/.test(os)) {
	        manufacturer = 'Apple';
	        os = 'iOS 4.3+';
	      } else {
	        os = null;
	      }
	    }
	    // Strip incorrect OS versions.
	    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
	        ua.indexOf('/' + data + '-') > -1) {
	      os = trim(os.replace(data, ''));
	    }
	    // Add layout engine.
	    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
	        /Browser|Lunascape|Maxthon/.test(name) ||
	        name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) ||
	        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Sleipnir|Web)/.test(name) && layout[1])) {
	      // Don't add layout details to description if they are falsey.
	      (data = layout[layout.length - 1]) && description.push(data);
	    }
	    // Combine contextual information.
	    if (description.length) {
	      description = ['(' + description.join('; ') + ')'];
	    }
	    // Append manufacturer to description.
	    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
	      description.push('on ' + manufacturer);
	    }
	    // Append product to description.
	    if (product) {
	      description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
	    }
	    // Parse the OS into an object.
	    if (os) {
	      data = / ([\d.+]+)$/.exec(os);
	      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
	      os = {
	        'architecture': 32,
	        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
	        'version': data ? data[1] : null,
	        'toString': function() {
	          var version = this.version;
	          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
	        }
	      };
	    }
	    // Add browser/OS architecture.
	    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
	      if (os) {
	        os.architecture = 64;
	        os.family = os.family.replace(RegExp(' *' + data), '');
	      }
	      if (
	          name && (/\bWOW64\b/i.test(ua) ||
	          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
	      ) {
	        description.unshift('32-bit');
	      }
	    }
	    // Chrome 39 and above on OS X is always 64-bit.
	    else if (
	        os && /^OS X/.test(os.family) &&
	        name == 'Chrome' && parseFloat(version) >= 39
	    ) {
	      os.architecture = 64;
	    }

	    ua || (ua = null);

	    /*------------------------------------------------------------------------*/

	    /**
	     * The platform object.
	     *
	     * @name platform
	     * @type Object
	     */
	    var platform = {};

	    /**
	     * The platform description.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.description = ua;

	    /**
	     * The name of the browser's layout engine.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.layout = layout && layout[0];

	    /**
	     * The name of the product's manufacturer.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.manufacturer = manufacturer;

	    /**
	     * The name of the browser/environment.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.name = name;

	    /**
	     * The alpha/beta release indicator.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.prerelease = prerelease;

	    /**
	     * The name of the product hosting the browser.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.product = product;

	    /**
	     * The browser's user agent string.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.ua = ua;

	    /**
	     * The browser/environment version.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.version = name && version;

	    /**
	     * The name of the operating system.
	     *
	     * @memberOf platform
	     * @type Object
	     */
	    platform.os = os || {

	      /**
	       * The CPU architecture the OS is built for.
	       *
	       * @memberOf platform.os
	       * @type number|null
	       */
	      'architecture': null,

	      /**
	       * The family of the OS.
	       *
	       * Common values include:
	       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
	       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
	       * "Android", "iOS" and "Windows Phone"
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'family': null,

	      /**
	       * The version of the OS.
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'version': null,

	      /**
	       * Returns the OS string.
	       *
	       * @memberOf platform.os
	       * @returns {string} The OS string.
	       */
	      'toString': function() { return 'null'; }
	    };

	    platform.parse = parse;
	    platform.toString = toStringPlatform;

	    if (platform.version) {
	      description.unshift(version);
	    }
	    if (platform.name) {
	      description.unshift(name);
	    }
	    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
	      description.push(product ? '(' + os + ')' : 'on ' + os);
	    }
	    if (description.length) {
	      platform.description = description.join(' ');
	    }
	    return platform;
	  }

	  /*--------------------------------------------------------------------------*/

	  // Export platform.
	  var platform = parse();

	  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
	  if (true) {
	    // Expose platform on the global object to prevent errors when platform is
	    // loaded by a script tag in the presence of an AMD loader.
	    // See http://requirejs.org/docs/errors.html#mismatch for more details.
	    root.platform = platform;

	    // Define as an anonymous module so platform can be aliased through path mapping.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return platform;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for CommonJS support.
	    forOwn(platform, function(value, key) {
	      freeExports[key] = value;
	    });
	  }
	  else {
	    // Export to the global object.
	    root.platform = platform;
	  }
	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module), (function() { return this; }())))

/***/ },

/***/ 14:
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["ZoroBase"] = factory();
		else
			root["ZoroBase"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		exports.__esModule = true;
		
		var _blob = __webpack_require__(1);
		
		var blob = _interopRequireWildcard(_blob);
		
		var _css = __webpack_require__(3);
		
		var css = _interopRequireWildcard(_css);
		
		var _const = __webpack_require__(4);
		
		var consts = _interopRequireWildcard(_const);
		
		var _date = __webpack_require__(5);
		
		var date = _interopRequireWildcard(_date);
		
		var _dom = __webpack_require__(6);
		
		var dom = _interopRequireWildcard(_dom);
		
		var _forOwn = __webpack_require__(8);
		
		var _forOwn2 = _interopRequireDefault(_forOwn);
		
		var _getGlobal = __webpack_require__(2);
		
		var _getGlobal2 = _interopRequireDefault(_getGlobal);
		
		var _id = __webpack_require__(9);
		
		var id = _interopRequireWildcard(_id);
		
		var _json = __webpack_require__(10);
		
		var json = _interopRequireWildcard(_json);
		
		var _mixin = __webpack_require__(11);
		
		var _mixin2 = _interopRequireDefault(_mixin);
		
		var _object = __webpack_require__(12);
		
		var object = _interopRequireWildcard(_object);
		
		var _type = __webpack_require__(7);
		
		var type = _interopRequireWildcard(_type);
		
		var _url = __webpack_require__(13);
		
		var url = _interopRequireWildcard(_url);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
		
		function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
		
		var obj = object.merge({}, blob, css, consts, date, dom, {
		  forOwn: _forOwn2['default'],
		  getGlobal: _getGlobal2['default']
		}, id, json, {
		  mixin: _mixin2['default']
		}, object, type, url);
		
		// TODO obj.__esModule ???
		/**
		* @Author: Yingya Zhang <zyy>
		* @Date:   2016-06-23 13:45:00
		* @Email:  zyy7259@gmail.com
		* @Last modified by:   zyy
		* @Last modified time: 2016-07-13T12:13:51+08:00
		*/
		
		delete obj.__esModule;
		
		exports['default'] = obj;
		module.exports = exports['default'];

	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		exports.__esModule = true;
		exports.blobFromDataURL = blobFromDataURL;
		exports.blobFromCanvas = blobFromCanvas;
		
		var _getGlobal = __webpack_require__(2);
		
		var _getGlobal2 = _interopRequireDefault(_getGlobal);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
		
		function blobFromDataURL(dataURL) {
		  var window = (0, _getGlobal2['default'])();
		  // convert base64/URLEncoded data component to raw binary data held in a string
		  var byteString = void 0;
		  if (dataURL.split(',')[0].indexOf('base64') >= 0) {
		    byteString = window.atob(dataURL.split(',')[1]);
		  } else {
		    byteString = window.decodeURIComponent(dataURL.split(',')[1]);
		  }
		
		  // separate out the mime component
		  var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
		
		  // write the bytes of the string to a typed array
		  var ia = new Uint8Array(byteString.length);
		  for (var i = 0; i < byteString.length; i++) {
		    ia[i] = byteString.charCodeAt(i);
		  }
		
		  return new window.Blob([ia], { type: mimeString });
		} /**
		  * @Author: Yingya Zhang <zyy>
		  * @Date:   2016-07-08 11:29:00
		  * @Email:  zyy7259@gmail.com
		  * @Last modified by:   zyy
		  * @Last modified time: 2016-07-10 12:42:13
		  */
		
		function blobFromCanvas(canvas, cb) {
		  var mimeType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'image/jpeg';
		  var quality = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
		
		  if (canvas.toBlob) {
		    canvas.toBlob(cb, mimeType, quality);
		  } else {
		    var dataURL = canvas.toDataURL(mimeType, quality);
		    cb(blobFromDataURL(dataURL));
		  }
		}

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		/* WEBPACK VAR INJECTION */(function(global) {'use strict';
		
		exports.__esModule = true;
		
		exports['default'] = function () {
		  if (typeof window !== 'undefined') {
		    return window;
		  }
		  if (typeof self !== 'undefined') {
		    return self;
		  }
		  if (typeof global !== 'undefined') {
		    return global;
		  }
		  return {};
		};
		
		module.exports = exports['default'];
		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		'use strict';
		
		exports.__esModule = true;
		exports.detectCSSFeature = detectCSSFeature;
		/*
		* @Author: Zhang Yingya(hzzhangyingya)
		* @Date:   2016-03-30 16:52:45
		* @Last modified by:   zyy
		* @Last modified time: 2016-07-10 12:57:03
		*/
		
		function detectCSSFeature(featurename) {
		  var feature = false;
		  var domPrefixes = 'Webkit Moz ms O'.split(' ');
		  var elm = document.createElement('div');
		  var featurenameCapital = null;
		
		  featurename = featurename.toLowerCase();
		
		  if (elm.style[featurename] !== undefined) {
		    feature = true;
		  }
		
		  if (feature === false) {
		    featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
		    for (var i = 0; i < domPrefixes.length; i++) {
		      if (elm.style[domPrefixes[i] + featurenameCapital] !== undefined) {
		        feature = true;
		        break;
		      }
		    }
		  }
		  return feature;
		}

	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		"use strict";
		
		exports.__esModule = true;
		/**
		* @Author: Yingya Zhang <zyy>
		* @Date:   2016-07-10 12:47:00
		* @Email:  zyy7259@gmail.com
		* @Last modified by:   zyy
		* @Last modified time: 2016-07-10 12:48:49
		*/
		
		var o = exports.o = {};
		var emptyObj = exports.emptyObj = {};
		
		var f = exports.f = function f() {};
		var emptyFunc = exports.emptyFunc = function emptyFunc() {};
		
		var regBlank = exports.regBlank = /\s+/ig;
		var regWhiteSpace = exports.regWhiteSpace = /\s+/ig;

	/***/ },
	/* 5 */
	/***/ function(module, exports) {

		'use strict';
		
		exports.__esModule = true;
		exports.fix = fix;
		exports.getYearStr = getYearStr;
		exports.getMonthStr = getMonthStr;
		exports.getDayStr = getDayStr;
		exports.getHourStr = getHourStr;
		exports.getMinuteStr = getMinuteStr;
		exports.getSecondStr = getSecondStr;
		exports.getMillisecondStr = getMillisecondStr;
		exports.dateFromDateTimeLocal = dateFromDateTimeLocal;
		/**
		* @Author: Yingya Zhang <zyy>
		* @Date:   2016-06-23 13:40:00
		* @Email:  zyy7259@gmail.com
		* @Last modified by:   zyy
		* @Last modified time: 2016-07-10 13:03:62
		*/
		
		function fix(number, count) {
		  count = count || 2;
		  var str = '' + number;
		  while (str.length < count) {
		    str = '0' + str;
		  }
		  return str;
		}
		
		function getYearStr(date) {
		  return '' + date.getFullYear();
		}
		
		function getMonthStr(date) {
		  return fix(date.getMonth() + 1);
		}
		
		function getDayStr(date) {
		  return fix(date.getDate());
		}
		
		function getHourStr(date) {
		  return fix(date.getHours());
		}
		
		function getMinuteStr(date) {
		  return fix(date.getMinutes());
		}
		
		function getSecondStr(date) {
		  return fix(date.getSeconds());
		}
		
		function getMillisecondStr(date) {
		  return fix(date.getMilliseconds(), 3);
		}
		
		var format = exports.format = function () {
		  var reg = /yyyy|MM|dd|hh|mm|ss|SSS/g;
		  var mappers = {
		    yyyy: getYearStr,
		    MM: getMonthStr,
		    dd: getDayStr,
		    hh: getHourStr,
		    mm: getMinuteStr,
		    ss: getSecondStr,
		    SSS: getMillisecondStr
		  };
		  return function (date, format) {
		    date = new Date(date);
		    if (isNaN(+date)) {
		      return 'invalid date';
		    }
		    format = format || 'yyyy-MM-dd';
		    return format.replace(reg, function (match) {
		      return mappers[match](date);
		    });
		  };
		}();
		
		function dateFromDateTimeLocal(str) {
		  str = '' + str;
		  return new Date(str.replace(/-/g, '/').replace('T', ' '));
		}

	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		exports.__esModule = true;
		exports.off = exports.removeEventListener = exports.on = exports.addEventListener = undefined;
		exports.containsNode = containsNode;
		exports.calcHeight = calcHeight;
		exports.remove = remove;
		exports.dataset = dataset;
		exports.target = target;
		exports.createIframe = createIframe;
		exports.html2node = html2node;
		exports.scrollTop = scrollTop;
		
		var _type = __webpack_require__(7);
		
		function containsNode(parent, child) {
		  if (parent === child) {
		    return true;
		  }
		  while (child.parentNode) {
		    if (child.parentNode === parent) {
		      return true;
		    }
		    child = child.parentNode;
		  }
		  return false;
		} /**
		  * @Author: Yingya Zhang <zyy>
		  * @Date:   2016-07-08 11:29:00
		  * @Email:  zyy7259@gmail.com
		  * @Last modified by:   zyy
		  * @Last modified time: 2016-07-12T16:49:46+08:00
		  */
		
		function calcHeight(node) {
		  var parent = node.parentNode || document.body;
		  node = node.cloneNode(true);
		  node.style.display = 'block';
		  node.style.opacity = 0;
		  node.style.height = 'auto';
		  parent.appendChild(node);
		  var height = node.offsetHeight;
		  parent.removeChild(node);
		  return height;
		}
		
		function remove(node) {
		  if (node.parentNode) {
		    node.parentNode.removeChild(node);
		  }
		}
		
		function dataset(node, key, value) {
		  if ((0, _type.exist)(value)) {
		    node.setAttribute('data-' + key, value);
		  } else {
		    return node.getAttribute('data-' + key);
		  }
		}
		
		var addEventListener = exports.addEventListener = function addEventListener(node, type, callback) {
		  if (node.addEventListener) {
		    node.addEventListener(type, callback, false);
		  } else if (node.attachEvent) {
		    node.attachEvent('on' + type, callback);
		  }
		};
		var on = exports.on = addEventListener;
		
		var removeEventListener = exports.removeEventListener = function removeEventListener(node, type, callback) {
		  if (node.removeEventListener) {
		    node.removeEventListener(type, callback, false);
		  } else if (node.detachEvent) {
		    node.detachEvent('on' + type, callback);
		  }
		};
		var off = exports.off = removeEventListener;
		
		function target(event) {
		  return event.target || event.srcElement;
		}
		
		function createIframe(options) {
		  options = options || {};
		  var iframe;
		  if (options.name) {
		    try {
		      iframe = document.createElement('<iframe name="' + options.name + '"></iframe>');
		      iframe.frameBorder = 0;
		    } catch (error) {
		      iframe = document.createElement('iframe');
		      iframe.name = options.name;
		    }
		  } else {
		    iframe = document.createElement('iframe');
		  }
		  if (!options.visible) {
		    iframe.style.display = 'none';
		  }
		  // on load
		  function onIframeLoad(event) {
		    if (!iframe.src) {
		      return;
		    }
		    if (!options.multi) {
		      off(iframe, 'load', onIframeLoad);
		    }
		    options.onload(event);
		  }
		  if ((0, _type.isFunction)(options.onload)) {
		    on(iframe, 'load', onIframeLoad);
		  }
		  // will trigger onload
		  var parent = options.parent;
		  (parent || document.body).appendChild(iframe);
		  // ensure trigger onload async
		  var src = options.src || 'about:blank';
		  setTimeout(function () {
		    iframe.src = src;
		  }, 0);
		  return iframe;
		}
		
		function html2node(html) {
		  var div = document.createElement('div');
		  div.innerHTML = html;
		  var children = [];
		  var i = void 0;
		  var l = void 0;
		  if (div.children) {
		    for (i = 0, l = div.children.length; i < l; i++) {
		      children.push(div.children[i]);
		    }
		  } else {
		    for (i = 0, l = div.childNodes.length; i < l; i++) {
		      var child = div.childNodes[i];
		      if (child.nodeType === 1) {
		        children.push(child);
		      }
		    }
		  }
		  return children.length > 1 ? div : children[0];
		}
		
		function scrollTop(top) {
		  if ((0, _type.exist)(top)) {
		    document.documentElement.scrollTop = document.body.scrollTop = top;
		  }
		  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		}

	/***/ },
	/* 7 */
	/***/ function(module, exports) {

		'use strict';
		
		exports.__esModule = true;
		exports.getClass = getClass;
		exports.typeOf = typeOf;
		exports.isString = isString;
		exports.isNumber = isNumber;
		exports.isBoolean = isBoolean;
		exports.isArray = isArray;
		exports.isFunction = isFunction;
		exports.isDate = isDate;
		exports.isRegExp = isRegExp;
		exports.isError = isError;
		exports.isnull = isnull;
		exports.notnull = notnull;
		exports.undef = undef;
		exports.notundef = notundef;
		exports.exist = exist;
		exports.notexist = notexist;
		exports.isObject = isObject;
		exports.isEmpty = isEmpty;
		/**
		* @Author: Yingya Zhang <zyy>
		* @Date:   2016-06-30 09:54:00
		* @Email:  zyy7259@gmail.com
		* @Last modified by:   zyy
		* @Last modified time: 2016-07-10 12:33:38
		*/
		
		/*
		 * 类型相关 API
		 */
		
		function getClass(obj) {
		  return Object.prototype.toString.call(obj).slice(8, -1);
		}
		
		function typeOf(obj) {
		  return getClass(obj).toLowerCase();
		}
		
		function isString(obj) {
		  return typeOf(obj) === 'string';
		}
		
		function isNumber(obj) {
		  return typeOf(obj) === 'number';
		}
		
		function isBoolean(obj) {
		  return typeOf(obj) === 'boolean';
		}
		
		function isArray(obj) {
		  return typeOf(obj) === 'array';
		}
		
		function isFunction(obj) {
		  return typeOf(obj) === 'function';
		}
		
		function isDate(obj) {
		  return typeOf(obj) === 'date';
		}
		
		function isRegExp(obj) {
		  return typeOf(obj) === 'regexp';
		}
		
		function isError(obj) {
		  return typeOf(obj) === 'error';
		}
		
		function isnull(obj) {
		  return obj === null;
		}
		
		function notnull(obj) {
		  return obj !== null;
		}
		
		// 需要用 typeof 来比较，兼容性好
		function undef(obj) {
		  return typeof obj === 'undefined';
		}
		
		function notundef(obj) {
		  return typeof obj !== 'undefined';
		}
		
		function exist(obj) {
		  return notundef(obj) && notnull(obj);
		}
		
		function notexist(obj) {
		  return undef(obj) || isnull(obj);
		}
		
		function isObject(obj) {
		  return exist(obj) && typeOf(obj) === 'object';
		}
		
		/**
		 * 是否是空值
		 * @param  {Object}  obj 待检查的对象
		 * @return {Boolean}     如果是 null/undefined/''/[] 返回 true
		 */
		function isEmpty(obj) {
		  return notexist(obj) || (isString(obj) || isArray(obj)) && obj.length === 0;
		}

	/***/ },
	/* 8 */
	/***/ function(module, exports) {

		"use strict";
		
		exports.__esModule = true;
		
		exports["default"] = function () {
		  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
		  var that = arguments[2];
		
		  for (var key in obj) {
		    if (obj.hasOwnProperty(key)) {
		      callback.call(that, key, obj[key]);
		    }
		  }
		};
		
		module.exports = exports["default"]; /**
		                                     * @Author: Yingya Zhang <zyy>
		                                     * @Date:   2016-07-10 11:22:00
		                                     * @Email:  zyy7259@gmail.com
		                                     * @Last modified by:   zyy
		                                     * @Last modified time: 2016-07-10 11:25:33
		                                     */

	/***/ },
	/* 9 */
	/***/ function(module, exports) {

		'use strict';
		
		exports.__esModule = true;
		/**
		* @Author: Yingya Zhang <zyy>
		* @Date:   2016-07-08 11:29:00
		* @Email:  zyy7259@gmail.com
		* @Last modified by:   zyy
		* @Last modified time: 2016-07-10 12:35:03
		*/
		
		var uniqueID = exports.uniqueID = function () {
		  var id = 0;
		  return function () {
		    return '' + id++;
		  };
		}();

	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		exports.__esModule = true;
		exports.isJSON = isJSON;
		exports.parseJSON = parseJSON;
		
		var _forOwn = __webpack_require__(8);
		
		var _forOwn2 = _interopRequireDefault(_forOwn);
		
		var _type = __webpack_require__(7);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
		
		function isJSON(str) {
		  return (0, _type.isString)(str) && str.indexOf('{') === 0 && str.lastIndexOf('}') === str.length - 1;
		}
		
		function parseJSON(obj) {
		  try {
		    if (isJSON(obj)) {
		      obj = JSON.parse(obj);
		    }
		    if ((0, _type.isObject)(obj)) {
		      (0, _forOwn2['default'])(obj, function (key, value) {
		        switch ((0, _type.typeOf)(value)) {
		          case 'string':
		          case 'object':
		            obj[key] = parseJSON(value);
		            break;
		        }
		      });
		    }
		  } catch (error) {
		    console.error(error);
		  }
		  return obj;
		}

	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		exports.__esModule = true;
		
		var _forOwn = __webpack_require__(8);
		
		var _forOwn2 = _interopRequireDefault(_forOwn);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
		
		exports['default'] = function (target, source) {
		  (0, _forOwn2['default'])(source, function (key, value) {
		    target[key] = value;
		  });
		}; /**
		   * @Author: Yingya Zhang <zyy>
		   * @Date:   2016-07-08 11:29:00
		   * @Email:  zyy7259@gmail.com
		   * @Last modified by:   zyy
		   * @Last modified time: 2016-07-10 11:27:24
		   */

		module.exports = exports['default'];

	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		exports.__esModule = true;
		exports.simpleClone = simpleClone;
		exports.merge = merge;
		exports.fillUndef = fillUndef;
		exports.checkWithDefault = checkWithDefault;
		exports.fetch = fetch;
		exports.string2object = string2object;
		exports.object2string = object2string;
		
		var _mixin = __webpack_require__(11);
		
		var _mixin2 = _interopRequireDefault(_mixin);
		
		var _forOwn = __webpack_require__(8);
		
		var _forOwn2 = _interopRequireDefault(_forOwn);
		
		var _type = __webpack_require__(7);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
		
		function simpleClone(obj) {
		  return JSON.parse(JSON.stringify(obj));
		}
		
		/**
		 * mock Object.assign
		 * - 将 sources 的 enumerable own properties 拷贝到 target
		 * @param  {Object} target={}  目标对象
		 * @param  {Object} ...sources 待拷贝的对象
		 * @return {Object}            目标对象
		 */
		/**
		* @Author: Yingya Zhang <zyy>
		* @Date:   2016-01-07 22:16:00
		* @Email:  zyy7259@gmail.com
		* @Last modified by:   zyy
		* @Last modified time: 2016-08-04T12:05:07+08:00
		*/
		
		function merge() {
		  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		
		  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		    sources[_key - 1] = arguments[_key];
		  }
		
		  sources.forEach(function (source) {
		    (0, _mixin2['default'])(target, source);
		  });
		  return target;
		}
		
		/**
		 * 对于 source 的 enumerable own properties, 如果 target 没有此属性, 将 source 的值赋给 target
		 * @param  {Object} target 目标对象
		 * @param  {Object} source 源对象
		 * @return {Object}        目标对象
		 */
		function fillUndef(target, source) {
		  (0, _forOwn2['default'])(source, function (key, value) {
		    if ((0, _type.undef)(target[key])) {
		      target[key] = value;
		    }
		  });
		  return target;
		}
		
		/**
		 * 如果 target 没有 key 对应的属性, 那么将 value 赋给他
		 * @param  {Object} target 目标对象
		 * @param  {String} key    属性名
		 * @param  {Object} value  属性值
		 * @return {Object}        属性值
		 */
		function checkWithDefault(target, key, value) {
		  var v = target[key] || target[key.toLowerCase()];
		  if ((0, _type.notexist)(v)) {
		    v = value;
		    target[key] = v;
		  }
		  return v;
		}
		
		/**
		 * 对于 target 的 enumerable own properties, 如果 source 存在对应的值, 将其赋给 target
		 * @param  {Object} target 目标对象
		 * @param  {Object} source 源对象
		 * @return {Object}        目标对象
		 */
		function fetch(target, source) {
		  (0, _forOwn2['default'])(target, function (key, value) {
		    if ((0, _type.exist)(source[key])) {
		      target[key] = source[key];
		    }
		  });
		  return target;
		}
		
		function string2object() {
		  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
		
		  var obj = {};
		  string.split(sep).forEach(function (pair) {
		    var arr = pair.split('=');
		    var key = arr.shift();
		    if (!key) {
		      return;
		    }
		    obj[decodeURIComponent(key)] = decodeURIComponent(arr.join('='));
		  });
		  return obj;
		}
		
		function object2string(obj, sep, encode) {
		  if (!obj) {
		    return '';
		  }
		  var arr = [];
		  (0, _forOwn2['default'])(obj, function (key, value) {
		    if ((0, _type.isFunction)(value)) {
		      return;
		    }
		    if ((0, _type.isDate)(value)) {
		      value = value.getTime();
		    } else if ((0, _type.isArray)(value)) {
		      value = value.join(',');
		    } else if ((0, _type.isObject)(value)) {
		      value = JSON.stringify(value);
		    }
		    if (encode) {
		      value = encodeURIComponent(value);
		    }
		    arr.push(encodeURIComponent(key) + '=' + value);
		  });
		  return arr.join(sep || ',');
		}

	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';
		
		exports.__esModule = true;
		exports.url2origin = undefined;
		exports.genUrlSep = genUrlSep;
		exports.object2query = object2query;
		
		var _object = __webpack_require__(12);
		
		function genUrlSep(url) {
		  return url.indexOf('?') < 0 ? '?' : '&';
		} /**
		  * @Author: Yingya Zhang <zyy>
		  * @Date:   2016-07-08 11:29:00
		  * @Email:  zyy7259@gmail.com
		  * @Last modified by:   zyy
		  * @Last modified time: 2016-07-10 12:41:71
		  */
		
		function object2query(obj) {
		  return (0, _object.object2string)(obj, '&', true);
		}
		
		var url2origin = exports.url2origin = function () {
		  var reg = /^([\w]+?:\/\/.*?(?=\/|$))/i;
		  return function (url) {
		    if (reg.test(url || '')) {
		      return RegExp.$1.toLowerCase();
		    }
		    return '';
		  };
		}();

	/***/ }
	/******/ ])
	});
	;


/***/ },

/***/ 19:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/**
	* @Author: Yingya Zhang <zyy>
	* @Date:   2016-06-29 17:32:00
	* @Email:  zyy7259@gmail.com
	* @Last modified by:   zyy
	* @Last modified time: 2016-06-29 19:16:39
	*/

	/*! Socket.IO.js build:0.9.11, development. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */

	var io = ( false ? {} : module.exports);

	// 将 io 挂在 window 上, 低版本 IE 要用到
	if (!window.io) {
	  window.io = io;
	} else {
	  if (module) {
	    module.exports = io = window.io
	  }
	}

	(function() {

	/**
	 * socket.io io
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, global) {

	  /**
	   * IO namespace.
	   *
	   * @namespace
	   */

	  var io = exports;

	  /**
	   * Socket.IO version
	   *
	   * @api public
	   */

	  io.version = '0.9.11';

	  /**
	   * Protocol implemented.
	   *
	   * @api public
	   */

	  io.protocol = 1;

	  /**
	   * Available transports, these will be populated with the available transports
	   *
	   * @api public
	   */

	  io.transports = [];

	  /**
	   * Keep track of jsonp callbacks.
	   *
	   * @api private
	   */

	  io.j = [];

	  /**
	   * Keep track of our io.Sockets
	   *
	   * @api private
	   */
	  io.sockets = {};


	  /**
	   * Manages connections to hosts.
	   *
	   * @param {String} uri
	   * @Param {Boolean} force creation of new socket (defaults to false)
	   * @api public
	   */

	  io.connect = function (host, details) {
	    var uri = io.util.parseUri(host)
	      , uuri
	      , socket;

	    if (global && global.location) {
	      uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
	      uri.host = uri.host || (global.document
	        ? global.document.domain : global.location.hostname);
	      uri.port = uri.port || global.location.port;
	    }

	    uuri = io.util.uniqueUri(uri);

	    var options = {
	        host: uri.host
	      , secure: 'https' == uri.protocol
	      , port: uri.port || ('https' == uri.protocol ? 443 : 80)
	      , query: uri.query || ''
	    };

	    io.util.merge(options, details);

	    if (options['force new connection'] || !io.sockets[uuri]) {
	      socket = new io.Socket(options);
	    }

	    if (!options['force new connection'] && socket) {
	      io.sockets[uuri] = socket;
	    }

	    socket = socket || io.sockets[uuri];

	    // if path is different from '' or /
	    return socket.of(uri.path.length > 1 ? uri.path : '');
	  };

	})( true ? module.exports : io, window);
	/**
	 * socket.io util
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, global) {

	  /**
	   * Utilities namespace.
	   *
	   * @namespace
	   */

	  var util = exports.util = {};

	  /**
	   * Parses an URI
	   *
	   * @author Steven Levithan <stevenlevithan.com> (MIT license)
	   * @api public
	   */

	  var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

	  var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password',
	               'host', 'port', 'relative', 'path', 'directory', 'file', 'query',
	               'anchor'];

	  util.parseUri = function (str) {
	    var m = re.exec(str || '')
	      , uri = {}
	      , i = 14;

	    while (i--) {
	      uri[parts[i]] = m[i] || '';
	    }

	    return uri;
	  };

	  /**
	   * Produces a unique url that identifies a Socket.IO connection.
	   *
	   * @param {Object} uri
	   * @api public
	   */

	  util.uniqueUri = function (uri) {
	    var protocol = uri.protocol
	      , host = uri.host
	      , port = uri.port;

	    if ('document' in global) {
	      host = host || document.domain;
	      port = port || (protocol == 'https'
	        && document.location.protocol !== 'https:' ? 443 : document.location.port);
	    } else {
	      host = host || 'localhost';

	      if (!port && protocol == 'https') {
	        port = 443;
	      }
	    }

	    return (protocol || 'http') + '://' + host + ':' + (port || 80);
	  };

	  /**
	   * Mergest 2 query strings in to once unique query string
	   *
	   * @param {String} base
	   * @param {String} addition
	   * @api public
	   */

	  util.query = function (base, addition) {
	    var query = util.chunkQuery(base || '')
	      , components = [];

	    util.merge(query, util.chunkQuery(addition || ''));
	    for (var part in query) {
	      if (query.hasOwnProperty(part)) {
	        components.push(part + '=' + query[part]);
	      }
	    }

	    return components.length ? '?' + components.join('&') : '';
	  };

	  /**
	   * Transforms a querystring in to an object
	   *
	   * @param {String} qs
	   * @api public
	   */

	  util.chunkQuery = function (qs) {
	    var query = {}
	      , params = qs.split('&')
	      , i = 0
	      , l = params.length
	      , kv;

	    for (; i < l; ++i) {
	      kv = params[i].split('=');
	      if (kv[0]) {
	        query[kv[0]] = kv[1];
	      }
	    }

	    return query;
	  };

	  /**
	   * Executes the given function when the page is loaded.
	   *
	   *     io.util.load(function () { console.log('page loaded'); });
	   *
	   * @param {Function} fn
	   * @api public
	   */

	  var pageLoaded = false;

	  util.load = function (fn) {
	    if ('document' in global && document.readyState === 'complete' || pageLoaded) {
	      return fn();
	    }

	    util.on(global, 'load', fn, false);
	  };

	  /**
	   * Adds an event.
	   *
	   * @api private
	   */

	  util.on = function (element, event, fn, capture) {
	    if (element.attachEvent) {
	      element.attachEvent('on' + event, fn);
	    } else if (element.addEventListener) {
	      element.addEventListener(event, fn, capture);
	    }
	  };

	  /**
	   * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
	   *
	   * @param {Boolean} [xdomain] Create a request that can be used cross domain.
	   * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest.
	   * @api private
	   */

	  util.request = function (xdomain) {

	    if (xdomain && 'undefined' != typeof XDomainRequest && !util.ua.hasCORS) {
	      return new XDomainRequest();
	    }

	    if ('undefined' != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
	      return new XMLHttpRequest();
	    }

	    if (!xdomain) {
	      try {
	        return new window[(['Active'].concat('Object').join('X'))]('Microsoft.XMLHTTP');
	      } catch(e) { }
	    }

	    return null;
	  };

	  /**
	   * XHR based transport constructor.
	   *
	   * @constructor
	   * @api public
	   */

	  /**
	   * Change the internal pageLoaded value.
	   */

	  if ('undefined' != typeof window) {
	    util.load(function () {
	      pageLoaded = true;
	    });
	  }

	  /**
	   * Defers a function to ensure a spinner is not displayed by the browser
	   *
	   * @param {Function} fn
	   * @api public
	   */

	  util.defer = function (fn) {
	    if (!util.ua.webkit || 'undefined' != typeof importScripts) {
	      return fn();
	    }

	    util.load(function () {
	      setTimeout(fn, 100);
	    });
	  };

	  /**
	   * Merges two objects.
	   *
	   * @api public
	   */

	  util.merge = function merge (target, additional, deep, lastseen) {
	    var seen = lastseen || []
	      , depth = typeof deep == 'undefined' ? 2 : deep
	      , prop;

	    for (prop in additional) {
	      if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
	        if (typeof target[prop] !== 'object' || !depth) {
	          target[prop] = additional[prop];
	          seen.push(additional[prop]);
	        } else {
	          util.merge(target[prop], additional[prop], depth - 1, seen);
	        }
	      }
	    }

	    return target;
	  };

	  /**
	   * Merges prototypes from objects
	   *
	   * @api public
	   */

	  util.mixin = function (ctor, ctor2) {
	    util.merge(ctor.prototype, ctor2.prototype);
	  };

	  /**
	   * Shortcut for prototypical and static inheritance.
	   *
	   * @api private
	   */

	  util.inherit = function (ctor, ctor2) {
	    function f() {};
	    f.prototype = ctor2.prototype;
	    ctor.prototype = new f;
	  };

	  /**
	   * Checks if the given object is an Array.
	   *
	   *     io.util.isArray([]); // true
	   *     io.util.isArray({}); // false
	   *
	   * @param Object obj
	   * @api public
	   */

	  util.isArray = Array.isArray || function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	  };

	  /**
	   * Intersects values of two arrays into a third
	   *
	   * @api public
	   */

	  util.intersect = function (arr, arr2) {
	    var ret = []
	      , longest = arr.length > arr2.length ? arr : arr2
	      , shortest = arr.length > arr2.length ? arr2 : arr;

	    for (var i = 0, l = shortest.length; i < l; i++) {
	      if (~util.indexOf(longest, shortest[i]))
	        ret.push(shortest[i]);
	    }

	    return ret;
	  };

	  /**
	   * Array indexOf compatibility.
	   *
	   * @see bit.ly/a5Dxa2
	   * @api public
	   */

	  util.indexOf = function (arr, o, i) {

	    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0;
	         i < j && arr[i] !== o; i++) {}

	    return j <= i ? -1 : i;
	  };

	  /**
	   * Converts enumerables to array.
	   *
	   * @api public
	   */

	  util.toArray = function (enu) {
	    var arr = [];

	    for (var i = 0, l = enu.length; i < l; i++)
	      arr.push(enu[i]);

	    return arr;
	  };

	  /**
	   * UA / engines detection namespace.
	   *
	   * @namespace
	   */

	  util.ua = {};

	  /**
	   * Whether the UA supports CORS for XHR.
	   *
	   * @api public
	   */

	  util.ua.hasCORS = 'undefined' != typeof XMLHttpRequest && (function () {
	    try {
	      var a = new XMLHttpRequest();
	    } catch (e) {
	      return false;
	    }

	    return a.withCredentials != undefined;
	  })();

	  /**
	   * Detect webkit.
	   *
	   * @api public
	   */

	  util.ua.webkit = 'undefined' != typeof navigator
	    && /webkit/i.test(navigator.userAgent);

	   /**
	   * Detect iPad/iPhone/iPod.
	   *
	   * @api public
	   */

	  util.ua.iDevice = 'undefined' != typeof navigator
	      && /iPad|iPhone|iPod/i.test(navigator.userAgent);

	})('undefined' != typeof io ? io : module.exports, window);
	/**
	 * socket.io EventEmitter
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io) {

	  /**
	   * Expose constructor.
	   */

	  exports.EventEmitter = EventEmitter;

	  /**
	   * Event emitter constructor.
	   *
	   * @api public.
	   */

	  function EventEmitter () {};

	  /**
	   * Adds a listener
	   *
	   * @api public
	   */

	  EventEmitter.prototype.on = function (name, fn) {
	    if (!this.$events) {
	      this.$events = {};
	    }

	    if (!this.$events[name]) {
	      this.$events[name] = fn;
	    } else if (io.util.isArray(this.$events[name])) {
	      this.$events[name].push(fn);
	    } else {
	      this.$events[name] = [this.$events[name], fn];
	    }

	    return this;
	  };

	  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	  /**
	   * Adds a volatile listener.
	   *
	   * @api public
	   */

	  EventEmitter.prototype.once = function (name, fn) {
	    var self = this;

	    function on () {
	      self.removeListener(name, on);
	      fn.apply(this, arguments);
	    };

	    on.listener = fn;
	    this.on(name, on);

	    return this;
	  };

	  /**
	   * Removes a listener.
	   *
	   * @api public
	   */

	  EventEmitter.prototype.removeListener = function (name, fn) {
	    if (this.$events && this.$events[name]) {
	      var list = this.$events[name];

	      if (io.util.isArray(list)) {
	        var pos = -1;

	        for (var i = 0, l = list.length; i < l; i++) {
	          if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
	            pos = i;
	            break;
	          }
	        }

	        if (pos < 0) {
	          return this;
	        }

	        list.splice(pos, 1);

	        if (!list.length) {
	          delete this.$events[name];
	        }
	      } else if (list === fn || (list.listener && list.listener === fn)) {
	        delete this.$events[name];
	      }
	    }

	    return this;
	  };

	  /**
	   * Removes all listeners for an event.
	   *
	   * @api public
	   */

	  EventEmitter.prototype.removeAllListeners = function (name) {
	    if (name === undefined) {
	      this.$events = {};
	      return this;
	    }

	    if (this.$events && this.$events[name]) {
	      this.$events[name] = null;
	    }

	    return this;
	  };

	  /**
	   * Gets all listeners for a certain event.
	   *
	   * @api publci
	   */

	  EventEmitter.prototype.listeners = function (name) {
	    if (!this.$events) {
	      this.$events = {};
	    }

	    if (!this.$events[name]) {
	      this.$events[name] = [];
	    }

	    if (!io.util.isArray(this.$events[name])) {
	      this.$events[name] = [this.$events[name]];
	    }

	    return this.$events[name];
	  };

	  /**
	   * Emits an event.
	   *
	   * @api public
	   */

	  EventEmitter.prototype.emit = function (name) {
	    if (!this.$events) {
	      return false;
	    }

	    var handler = this.$events[name];

	    if (!handler) {
	      return false;
	    }

	    var args = Array.prototype.slice.call(arguments, 1);

	    if ('function' == typeof handler) {
	      handler.apply(this, args);
	    } else if (io.util.isArray(handler)) {
	      var listeners = handler.slice();

	      for (var i = 0, l = listeners.length; i < l; i++) {
	        listeners[i].apply(this, args);
	      }
	    } else {
	      return false;
	    }

	    return true;
	  };

	})(
	    'undefined' != typeof io ? io : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	);

	/**
	 * socket.io JSON
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	/**
	 * Based on JSON2 (http://www.JSON.org/js.html).
	 */

	(function (exports, nativeJSON) {
	  "use strict";

	  // use native JSON if it's available
	  if (nativeJSON && nativeJSON.parse){
	    return exports.JSON = {
	      parse: nativeJSON.parse
	    , stringify: nativeJSON.stringify
	    };
	  }

	  var JSON = exports.JSON = {};

	  function f(n) {
	      // Format integers to have at least two digits.
	      return n < 10 ? '0' + n : n;
	  }

	  function date(d, key) {
	    return isFinite(d.valueOf()) ?
	        d.getUTCFullYear()     + '-' +
	        f(d.getUTCMonth() + 1) + '-' +
	        f(d.getUTCDate())      + 'T' +
	        f(d.getUTCHours())     + ':' +
	        f(d.getUTCMinutes())   + ':' +
	        f(d.getUTCSeconds())   + 'Z' : null;
	  };

	  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	      gap,
	      indent,
	      meta = {    // table of character substitutions
	          '\b': '\\b',
	          '\t': '\\t',
	          '\n': '\\n',
	          '\f': '\\f',
	          '\r': '\\r',
	          '"' : '\\"',
	          '\\': '\\\\'
	      },
	      rep;


	  function quote(string) {

	      // If the string contains no control characters, no quote characters, and no
	      // backslash characters, then we can safely slap some quotes around it.
	      // Otherwise we must also replace the offending characters with safe escape
	      // sequences.

	      escapable.lastIndex = 0;
	      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	          var c = meta[a];
	          return typeof c === 'string' ? c :
	              '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	      }) + '"' : '"' + string + '"';
	  }


	  function str(key, holder) {

	      // Produce a string from holder[key].

	      var i,          // The loop counter.
	          k,          // The member key.
	          v,          // The member value.
	          length,
	          mind = gap,
	          partial,
	          value = holder[key];

	      // If the value has a toJSON method, call it to obtain a replacement value.

	      if (value instanceof Date) {
	          value = date(key);
	      }

	      // If we were called with a replacer function, then call the replacer to
	      // obtain a replacement value.

	      if (typeof rep === 'function') {
	          value = rep.call(holder, key, value);
	      }

	      // What happens next depends on the value's type.

	      switch (typeof value) {
	      case 'string':
	          return quote(value);

	      case 'number':

	          // JSON numbers must be finite. Encode non-finite numbers as null.

	          return isFinite(value) ? String(value) : 'null';

	      case 'boolean':
	      case 'null':

	          // If the value is a boolean or null, convert it to a string. Note:
	          // typeof null does not produce 'null'. The case is included here in
	          // the remote chance that this gets fixed someday.

	          return String(value);

	      // If the type is 'object', we might be dealing with an object or an array or
	      // null.

	      case 'object':

	          // Due to a specification blunder in ECMAScript, typeof null is 'object',
	          // so watch out for that case.

	          if (!value) {
	              return 'null';
	          }

	          // Make an array to hold the partial results of stringifying this object value.

	          gap += indent;
	          partial = [];

	          // Is the value an array?

	          if (Object.prototype.toString.apply(value) === '[object Array]') {

	              // The value is an array. Stringify every element. Use null as a placeholder
	              // for non-JSON values.

	              length = value.length;
	              for (i = 0; i < length; i += 1) {
	                  partial[i] = str(i, value) || 'null';
	              }

	              // Join all of the elements together, separated with commas, and wrap them in
	              // brackets.

	              v = partial.length === 0 ? '[]' : gap ?
	                  '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                  '[' + partial.join(',') + ']';
	              gap = mind;
	              return v;
	          }

	          // If the replacer is an array, use it to select the members to be stringified.

	          if (rep && typeof rep === 'object') {
	              length = rep.length;
	              for (i = 0; i < length; i += 1) {
	                  if (typeof rep[i] === 'string') {
	                      k = rep[i];
	                      v = str(k, value);
	                      if (v) {
	                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                      }
	                  }
	              }
	          } else {

	              // Otherwise, iterate through all of the keys in the object.

	              for (k in value) {
	                  if (Object.prototype.hasOwnProperty.call(value, k)) {
	                      v = str(k, value);
	                      if (v) {
	                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                      }
	                  }
	              }
	          }

	          // Join all of the member texts together, separated with commas,
	          // and wrap them in braces.

	          v = partial.length === 0 ? '{}' : gap ?
	              '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	              '{' + partial.join(',') + '}';
	          gap = mind;
	          return v;
	      }
	  }

	  // If the JSON object does not yet have a stringify method, give it one.

	  JSON.stringify = function (value, replacer, space) {

	      // The stringify method takes a value and an optional replacer, and an optional
	      // space parameter, and returns a JSON text. The replacer can be a function
	      // that can replace values, or an array of strings that will select the keys.
	      // A default replacer method can be provided. Use of the space parameter can
	      // produce text that is more easily readable.

	      var i;
	      gap = '';
	      indent = '';

	      // If the space parameter is a number, make an indent string containing that
	      // many spaces.

	      if (typeof space === 'number') {
	          for (i = 0; i < space; i += 1) {
	              indent += ' ';
	          }

	      // If the space parameter is a string, it will be used as the indent string.

	      } else if (typeof space === 'string') {
	          indent = space;
	      }

	      // If there is a replacer, it must be a function or an array.
	      // Otherwise, throw an error.

	      rep = replacer;
	      if (replacer && typeof replacer !== 'function' &&
	              (typeof replacer !== 'object' ||
	              typeof replacer.length !== 'number')) {
	          throw new Error('JSON.stringify');
	      }

	      // Make a fake root object containing our value under the key of ''.
	      // Return the result of stringifying the value.

	      return str('', {'': value});
	  };

	  // If the JSON object does not yet have a parse method, give it one.

	  JSON.parse = function (text, reviver) {
	      // The parse method takes a text and an optional reviver function, and returns
	      // a JavaScript value if the text is a valid JSON text.

	      var j;

	      function walk(holder, key) {

	          // The walk method is used to recursively walk the resulting structure so
	          // that modifications can be made.

	          var k, v, value = holder[key];
	          if (value && typeof value === 'object') {
	              for (k in value) {
	                  if (Object.prototype.hasOwnProperty.call(value, k)) {
	                      v = walk(value, k);
	                      if (v !== undefined) {
	                          value[k] = v;
	                      } else {
	                          delete value[k];
	                      }
	                  }
	              }
	          }
	          return reviver.call(holder, key, value);
	      }


	      // Parsing happens in four stages. In the first stage, we replace certain
	      // Unicode characters with escape sequences. JavaScript handles many characters
	      // incorrectly, either silently deleting them, or treating them as line endings.

	      text = String(text);
	      cx.lastIndex = 0;
	      if (cx.test(text)) {
	          text = text.replace(cx, function (a) {
	              return '\\u' +
	                  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	          });
	      }

	      // In the second stage, we run the text against regular expressions that look
	      // for non-JSON patterns. We are especially concerned with '()' and 'new'
	      // because they can cause invocation, and '=' because it can cause mutation.
	      // But just to be safe, we want to reject all unexpected forms.

	      // We split the second stage into 4 regexp operations in order to work around
	      // crippling inefficiencies in IE's and Safari's regexp engines. First we
	      // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	      // replace all simple value tokens with ']' characters. Third, we delete all
	      // open brackets that follow a colon or comma or that begin the text. Finally,
	      // we look to see that the remaining characters are only whitespace or ']' or
	      // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

	      if (/^[\],:{}\s]*$/
	              .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                  .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

	          // In the third stage we use the eval function to compile the text into a
	          // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	          // in JavaScript: it can begin a block or an object literal. We wrap the text
	          // in parens to eliminate the ambiguity.

	          j = eval('(' + text + ')');

	          // In the optional fourth stage, we recursively walk the new structure, passing
	          // each name/value pair to a reviver function for possible transformation.

	          return typeof reviver === 'function' ?
	              walk({'': j}, '') : j;
	      }

	      // If the text is not JSON parseable, then a SyntaxError is thrown.

	      throw new SyntaxError('JSON.parse');
	  };

	})(
	    'undefined' != typeof io ? io : module.exports
	  , typeof JSON !== 'undefined' ? JSON : undefined
	);

	/**
	 * socket.io parser
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io) {

	  /**
	   * Parser namespace.
	   *
	   * @namespace
	   */

	  var parser = exports.parser = {};

	  /**
	   * Packet types.
	   */

	  var packets = parser.packets = [
	      'disconnect'
	    , 'connect'
	    , 'heartbeat'
	    , 'message'
	    , 'json'
	    , 'event'
	    , 'ack'
	    , 'error'
	    , 'noop'
	  ];

	  /**
	   * Errors reasons.
	   */

	  var reasons = parser.reasons = [
	      'transport not supported'
	    , 'client not handshaken'
	    , 'unauthorized'
	  ];

	  /**
	   * Errors advice.
	   */

	  var advice = parser.advice = [
	      'reconnect'
	  ];

	  /**
	   * Shortcuts.
	   */

	  var JSON = io.JSON
	    , indexOf = io.util.indexOf;

	  /**
	   * Encodes a packet.
	   *
	   * @api private
	   */

	  parser.encodePacket = function (packet) {
	    var type = indexOf(packets, packet.type)
	      , id = packet.id || ''
	      , endpoint = packet.endpoint || ''
	      , ack = packet.ack
	      , data = null;

	    switch (packet.type) {
	      case 'error':
	        var reason = packet.reason ? indexOf(reasons, packet.reason) : ''
	          , adv = packet.advice ? indexOf(advice, packet.advice) : '';

	        if (reason !== '' || adv !== '')
	          data = reason + (adv !== '' ? ('+' + adv) : '');

	        break;

	      case 'message':
	        if (packet.data !== '')
	          data = packet.data;
	        break;

	      case 'event':
	        var ev = { name: packet.name };

	        if (packet.args && packet.args.length) {
	          ev.args = packet.args;
	        }

	        data = JSON.stringify(ev);
	        break;

	      case 'json':
	        data = JSON.stringify(packet.data);
	        break;

	      case 'connect':
	        if (packet.qs)
	          data = packet.qs;
	        break;

	      case 'ack':
	        data = packet.ackId
	          + (packet.args && packet.args.length
	              ? '+' + JSON.stringify(packet.args) : '');
	        break;
	    }

	    // construct packet with required fragments
	    var encoded = [
	        type
	      , id + (ack == 'data' ? '+' : '')
	      , endpoint
	    ];

	    // data fragment is optional
	    if (data !== null && data !== undefined)
	      encoded.push(data);

	    return encoded.join(':');
	  };

	  /**
	   * Encodes multiple messages (payload).
	   *
	   * @param {Array} messages
	   * @api private
	   */

	  parser.encodePayload = function (packets) {
	    var decoded = '';

	    if (packets.length == 1)
	      return packets[0];

	    for (var i = 0, l = packets.length; i < l; i++) {
	      var packet = packets[i];
	      decoded += '\ufffd' + packet.length + '\ufffd' + packets[i];
	    }

	    return decoded;
	  };

	  /**
	   * Decodes a packet
	   *
	   * @api private
	   */

	  var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;

	  parser.decodePacket = function (data) {
	    var pieces = data.match(regexp);

	    if (!pieces) return {};

	    var id = pieces[2] || ''
	      , data = pieces[5] || ''
	      , packet = {
	            type: packets[pieces[1]]
	          , endpoint: pieces[4] || ''
	        };

	    // whether we need to acknowledge the packet
	    if (id) {
	      packet.id = id;
	      if (pieces[3])
	        packet.ack = 'data';
	      else
	        packet.ack = true;
	    }

	    // handle different packet types
	    switch (packet.type) {
	      case 'error':
	        var pieces = data.split('+');
	        packet.reason = reasons[pieces[0]] || '';
	        packet.advice = advice[pieces[1]] || '';
	        break;

	      case 'message':
	        packet.data = data || '';
	        break;

	      case 'event':
	        try {
	          var opts = JSON.parse(data);
	          packet.name = opts.name;
	          packet.args = opts.args;
	        } catch (e) { }

	        packet.args = packet.args || [];
	        break;

	      case 'json':
	        try {
	          packet.data = JSON.parse(data);
	        } catch (e) { }
	        break;

	      case 'connect':
	        packet.qs = data || '';
	        break;

	      case 'ack':
	        var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
	        if (pieces) {
	          packet.ackId = pieces[1];
	          packet.args = [];

	          if (pieces[3]) {
	            try {
	              packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
	            } catch (e) { }
	          }
	        }
	        break;

	      case 'disconnect':
	      case 'heartbeat':
	        break;
	    };

	    return packet;
	  };

	  /**
	   * Decodes data payload. Detects multiple messages
	   *
	   * @return {Array} messages
	   * @api public
	   */

	  parser.decodePayload = function (data) {
	    // IE doesn't like data[i] for unicode chars, charAt works fine
	    var _findEndChar = function(_start,_data){
	      var l=0;
	      for(var i=_start;i<_data.length;i++){
	        if(_data.charAt(i)=='\ufffd'){
	          return l;
	          break;
	        }
	        else
	          l++;
	      }
	      return l;
	    }
	    if (data.charAt(0) == '\ufffd') {
	      var ret = [];
	      for (var i = 1, length = ''; i < data.length; i++) {
	        if (data.charAt(i) == '\ufffd') {
	          var _data = data.substr(i + 1).substr(0, length);
	          if(data.charAt(i + 1+Number(length))!='\ufffd'&&(i + 1+Number(length))!=data.length){
	            var _len = Number(length)
	            l = _findEndChar(i+_len+1,data);
	            _data = data.substr(i + 1).substr(0, _len+l);
	            i+=l;
	          }
	          ret.push(parser.decodePacket(_data));
	          i += Number(length) + 1;
	          length = '';
	        } else {
	          length += data.charAt(i);
	        }
	      }

	      return ret;
	    } else {
	      return [parser.decodePacket(data)];
	    }
	  };

	})(
	    'undefined' != typeof io ? io : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	);
	/**
	 * socket.io Transport template
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io) {

	  /**
	   * Expose constructor.
	   */

	  exports.Transport = Transport;

	  /**
	   * This is the transport template for all supported transport methods.
	   *
	   * @constructor
	   * @api public
	   */

	  function Transport (socket, sessid) {
	    this.socket = socket;
	    this.sessid = sessid;
	  };

	  /**
	   * Apply EventEmitter mixin.
	   */

	  io.util.mixin(Transport, io.EventEmitter);


	  /**
	   * Indicates whether heartbeats is enabled for this transport
	   *
	   * @api private
	   */

	  Transport.prototype.heartbeats = function () {
	    return true;
	  };

	  /**
	   * Handles the response from the server. When a new response is received
	   * it will automatically update the timeout, decode the message and
	   * forwards the response to the onMessage function for further processing.
	   *
	   * @param {String} data Response from the server.
	   * @api private
	   */

	  Transport.prototype.onData = function (data) {
	    // 当一个 transport 超时之后, 会尝试连接下一个 transport
	    // 但是有可能第一个 transport 还是连上了
	    // 那么这里加一个判断, 如果 this 不是当前的 transport, 那么直接返回 @hzzhangyingya
	    if (this !== this.socket.transport) {return this;}
	    this.clearCloseTimeout();

	    // If the connection in currently open (or in a reopening state) reset the close
	    // timeout since we have just received data. This check is necessary so
	    // that we don't reset the timeout on an explicitly disconnected connection.
	    if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
	      this.setCloseTimeout();
	    }

	    if (data !== '') {
	      // todo: we should only do decodePayload for xhr transports
	      var msgs = io.parser.decodePayload(data);

	      if (msgs && msgs.length) {
	        for (var i = 0, l = msgs.length; i < l; i++) {
	          this.onPacket(msgs[i]);
	        }
	      }
	    }

	    return this;
	  };

	  /**
	   * Handles packets.
	   *
	   * @api private
	   */

	  Transport.prototype.onPacket = function (packet) {
	    this.socket.setHeartbeatTimeout();

	    if (packet.type == 'heartbeat') {
	      return this.onHeartbeat();
	    }

	    if (packet.type == 'connect' && packet.endpoint == '') {
	      this.onConnect();
	    }

	    if (packet.type == 'error' && packet.advice == 'reconnect') {
	      this.isOpen = false;
	    }

	    this.socket.onPacket(packet);

	    return this;
	  };

	  /**
	   * Sets close timeout
	   *
	   * @api private
	   */

	  Transport.prototype.setCloseTimeout = function () {
	    if (!this.closeTimeout) {
	      var self = this;

	      this.closeTimeout = setTimeout(function () {
	        self.onDisconnect();
	      }, this.socket.closeTimeout);
	    }
	  };

	  /**
	   * Called when transport disconnects.
	   *
	   * @api private
	   */

	  Transport.prototype.onDisconnect = function () {
	    if (this.isOpen) this.close();
	    this.clearTimeouts();
	    // 如果当前 socket 的 transport 不是自己, 那么不管 @hzzhangyingya
	    if (this.socket.transport === this) {
	      this.socket.onDisconnect();
	    } else {
	      this.socket.setBuffer(false)
	    }
	    return this;
	  };

	  /**
	   * Called when transport connects
	   *
	   * @api private
	   */

	  Transport.prototype.onConnect = function () {
	    this.socket.onConnect();
	    return this;
	  };

	  /**
	   * Clears close timeout
	   *
	   * @api private
	   */

	  Transport.prototype.clearCloseTimeout = function () {
	    if (this.closeTimeout) {
	      clearTimeout(this.closeTimeout);
	      this.closeTimeout = null;
	    }
	  };

	  /**
	   * Clear timeouts
	   *
	   * @api private
	   */

	  Transport.prototype.clearTimeouts = function () {
	    this.clearCloseTimeout();

	    if (this.reopenTimeout) {
	      clearTimeout(this.reopenTimeout);
	    }
	  };

	  /**
	   * Sends a packet
	   *
	   * @param {Object} packet object.
	   * @api private
	   */

	  Transport.prototype.packet = function (packet) {
	    this.send(io.parser.encodePacket(packet));
	  };

	  /**
	   * Send the received heartbeat message back to server. So the server
	   * knows we are still connected.
	   *
	   * @param {String} heartbeat Heartbeat response from the server.
	   * @api private
	   */

	  Transport.prototype.onHeartbeat = function (heartbeat) {
	    this.packet({ type: 'heartbeat' });
	  };

	  /**
	   * Called when the transport opens.
	   *
	   * @api private
	   */

	  Transport.prototype.onOpen = function () {
	    this.isOpen = true;
	    this.clearCloseTimeout();
	    this.socket.onOpen();
	  };

	  /**
	   * Notifies the base when the connection with the Socket.IO server
	   * has been disconnected.
	   *
	   * @api private
	   */

	  Transport.prototype.onClose = function () {
	    var self = this;

	    /* FIXME: reopen delay causing a infinit loop
	    this.reopenTimeout = setTimeout(function () {
	      self.open();
	    }, this.socket.options['reopen delay']);*/

	    this.isOpen = false;
	    // 如果当前 socket 的 transport 不是自己, 那么不管 @hzzhangyingya
	    if (this.socket.transport === this) {
	      this.socket.onClose();
	    } else {
	      this.socket.setBuffer(false)
	    }
	    this.onDisconnect();
	  };

	  /**
	   * Generates a connection url based on the Socket.IO URL Protocol.
	   * See <https://github.com/learnboost/socket.io-node/> for more details.
	   *
	   * @returns {String} Connection url
	   * @api private
	   */

	  Transport.prototype.prepareUrl = function () {
	    var options = this.socket.options;

	    return this.scheme() + '://'
	      + options.host + ':' + options.port + '/'
	      + options.resource + '/' + io.protocol
	      + '/' + this.name + '/' + this.sessid;
	  };

	  /**
	   * Checks if the transport is ready to start a connection.
	   *
	   * @param {Socket} socket The socket instance that needs a transport
	   * @param {Function} fn The callback
	   * @api private
	   */

	  Transport.prototype.ready = function (socket, fn) {
	    fn.call(this);
	  };
	})(
	    'undefined' != typeof io ? io : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	);
	/**
	 * socket.io Socket
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io, global) {

	  /**
	   * Expose constructor.
	   */

	  exports.Socket = Socket;

	  /**
	   * Create a new `Socket.IO client` which can establish a persistent
	   * connection with a Socket.IO enabled server.
	   *
	   * @api public
	   */

	  function Socket (options) {
	    this.options = {
	        port: 80
	      , secure: false
	      , document: 'document' in global ? document : false
	      , resource: 'socket.io'
	      , transports: options.transports || io.transports
	      , 'connect timeout': 10000
	      , 'try multiple transports': true
	      , 'reconnect': true
	      , 'reconnection delay': 500
	      , 'reconnection limit': Infinity
	      , 'reopen delay': 3000
	      , 'max reconnection attempts': 10
	      , 'sync disconnect on unload': false
	      , 'auto connect': true
	      , 'flash policy port': 10843
	      , 'manualFlush': false
	    };

	    io.util.merge(this.options, options);

	    this.connected = false;
	    this.open = false;
	    this.connecting = false;
	    this.reconnecting = false;
	    this.namespaces = {};
	    this.buffer = [];
	    this.doBuffer = false;

	    if (this.options['sync disconnect on unload'] &&
	        (!this.isXDomain() || io.util.ua.hasCORS)) {
	      var self = this;
	      io.util.on(global, 'beforeunload', function () {
	        self.disconnectSync();
	      }, false);
	    }

	    if (this.options['auto connect']) {
	      this.connect();
	    }
	  };

	  /**
	   * Apply EventEmitter mixin.
	   */

	  io.util.mixin(Socket, io.EventEmitter);

	  /**
	   * Returns a namespace listener/emitter for this socket
	   *
	   * @api public
	   */

	  Socket.prototype.of = function (name) {
	    if (!this.namespaces[name]) {
	      this.namespaces[name] = new io.SocketNamespace(this, name);

	      if (name !== '') {
	        this.namespaces[name].packet({ type: 'connect' });
	      }
	    }

	    return this.namespaces[name];
	  };

	  /**
	   * Emits the given event to the Socket and all namespaces
	   *
	   * @api private
	   */

	  Socket.prototype.publish = function () {
	    this.emit.apply(this, arguments);

	    var nsp;

	    for (var i in this.namespaces) {
	      if (this.namespaces.hasOwnProperty(i)) {
	        nsp = this.of(i);
	        nsp.$emit.apply(nsp, arguments);
	      }
	    }
	  };

	  /**
	   * Performs the handshake
	   *
	   * @api private
	   */

	  function empty () { };

	  Socket.prototype.handshake = function (fn) {
	    var self = this
	      , options = this.options;

	    function complete (data) {
	      if (data instanceof Error) {
	        self.connecting = false;
	        self.onError(data.message);
	      } else {
	        console.log('D handshake success ' + data)
	        fn.apply(null, data.split(':'));
	      }
	    };

	    var url = [
	          'http' + (options.secure ? 's' : '') + ':/'
	        , options.host + ':' + options.port
	        , options.resource
	        , io.protocol
	        , io.util.query(this.options.query, 't=' + +new Date)
	      ].join('/');
	    if (this.isXDomain() && !io.util.ua.hasCORS) {
	      var insertAt = document.getElementsByTagName('script')[0]
	        , script = document.createElement('script');

	      script.src = url + '&jsonp=' + io.j.length;
	      // https://github.com/Automattic/socket.io/issues/1020#issuecomment-9684494
	      // when script failed to load, trigger onError which will trigger reconnecting
	      script.onreadystatechange = function() {
	        // debugger
	        // 'loaded' means failed (yeah, I know)
	        // github上说loaded的时候是脚本失败了, 但是我发现在IE下, 脚本成功执行, 最后状态也是loaded
	        // 所以再加一个条件, 在此 script 没有被移除的情况下才算失败
	        if(this.readyState == 'loaded' && !!script.parentNode){
	          script.parentNode.removeChild(script);
	          self.connecting = false;
	          !self.reconnecting && self.onError('Server down or port not open');
	          // 注意, 下面这行代码是云信业务专用的, 云信是不自动重连, 需要手动控制重连的逻辑, 在这里通知外部握手失败, 这样就处理重连逻辑
	          self.publish('handshake_failed');
	        }
	      };
	      insertAt.parentNode.insertBefore(script, insertAt);

	      io.j.push(function (data) {
	        complete(data);
	        script.parentNode.removeChild(script);
	      });
	    } else {
	      var xhr = io.util.request();
	      xhr.timeout = 10000; 
	      xhr.open('GET', url, true);
	      if (this.isXDomain()) {
	        xhr.withCredentials = true;
	      }
	      xhr.onreadystatechange = function () {
	        // debugger
	        if (xhr.readyState == 4) {
	          xhr.onreadystatechange = empty;

	          if (xhr.status == 200) {
	            complete(xhr.responseText);
	          } else if (xhr.status == 403) {
	            self.onError(xhr.responseText);
	            // 注意, 下面这行代码是云信业务专用的, 云信是不自动重连, 需要手动控制重连的逻辑, 在这里通知外部握手失败, 这样就处理重连逻辑
	            self.publish('handshake_failed');
	          } else {
	            self.connecting = false;
	            !self.reconnecting && self.onError(xhr.responseText);
	            // 注意, 下面这行代码是云信业务专用的, 云信是不自动重连, 需要手动控制重连的逻辑, 在这里通知外部握手失败, 这样就处理重连逻辑
	            self.publish('handshake_failed');
	          }
	        }
	      };
	      xhr.ontimeout = function (e) {
	        // XMLHttpRequest 超时。在此做某事。
	        self.connecting = false;
	        !self.reconnecting && self.onError(xhr.responseText);
	        self.publish('handshake_failed');
	      };
	      xhr.send(null);
	    }
	  };

	  /**
	   * Connects to the server.
	   *
	   * @param {Function} [fn] Callback.
	   * @returns {io.Socket}
	   * @api public
	   */

	  Socket.prototype.connect = function (fn) {
	    if (this.connecting) {
	      return this;
	    }

	    var self = this;
	    self.connecting = true;

	    this.handshake(function (sid, heartbeat, close, transports) {
	      self.sessionid = sid;
	      self.closeTimeout = close * 1000;
	      self.heartbeatTimeout = heartbeat * 1000;
	      if(!self.transports)
	          self.transports = self.origTransports = (transports ? io.util.intersect(
	              transports.split(',')
	            , self.options.transports
	          ) : self.options.transports);

	      console.log('D options transports: ' + self.options.transports)
	      console.log('D transports: ' + self.transports)

	      self.setHeartbeatTimeout();

	      self.once('connect', function (){
	        clearTimeout(self.connectTimeoutTimer);
	        self.connectTimeoutTimer = null;

	        fn && typeof fn == 'function' && fn();
	      });

	      self.doConnect();
	    });

	    return this;
	  };

	  Socket.prototype.doConnect = function() {
	    var self = this;

	    if (self.transport) self.transport.clearTimeouts();

	    self.transport = self.getTransport(self.transports);

	    if (!self.transport) return self.publish('connect_failed');

	    // once the transport is ready
	    self.transport.ready(self, function () {
	      self.connecting = true;
	      self.publish('connecting', self.transport.name);
	      self.transport.open();

	      if (self.options['connect timeout']) {
	        if (self.connectTimeoutTimer) { clearTimeout(self.connectTimeoutTimer); }
	        self.connectTimeoutTimer = setTimeout(self.tryNextTransport.bind(self), self.options['connect timeout']);
	      }
	    });
	  };

	  /**
	   * Find an available transport based on the options supplied in the constructor.
	   *
	   * @api private
	   */

	  Socket.prototype.getTransport = function (override) {
	    var transports = override || this.transports, match;

	    for (var i = 0, transport; transport = transports[i]; i++) {
	      console.log('D check ' + transport + ' ' + io.Transport[transport].check(this) + ' , cors ' + io.Transport[transport].xdomainCheck(this))
	      if (io.Transport[transport]
	        && io.Transport[transport].check(this)
	        && (!this.isXDomain() || io.Transport[transport].xdomainCheck(this))) {
	      var result = new io.Transport[transport](this, this.sessionid);
	        return result;
	      }
	    }

	    return null;
	  };

	  Socket.prototype.tryNextTransport = function() {
	    console.log('D try next transport')
	    var self = this;
	    if (!self.connected) {
	      self.connecting = false;

	      if (self.options['try multiple transports']) {
	        var remaining = self.transports;

	        while (remaining.length > 0 && remaining.splice(0,1)[0] !=
	               self.transport.name) {}

	        if (remaining.length){
	          self.doConnect();
	        } else {
	          self.publish('connect_failed');
	        }

	      }
	    }
	  };

	  /**
	   * Clears and sets a new heartbeat timeout using the value given by the
	   * server during the handshake.
	   *
	   * @api private
	   */

	  Socket.prototype.setHeartbeatTimeout = function () {
	    clearTimeout(this.heartbeatTimeoutTimer);
	    if(this.transport && !this.transport.heartbeats()) return;

	    var self = this;
	    this.heartbeatTimeoutTimer = setTimeout(function () {
	      self.transport && self.transport.onClose();
	    }, this.heartbeatTimeout);
	  };

	  /**
	   * Sends a message.
	   *
	   * @param {Object} data packet.
	   * @returns {io.Socket}
	   * @api public
	   */

	  Socket.prototype.packet = function (data) {
	    if (this.connected && !this.doBuffer) {
	      this.transport.packet(data);
	    } else {
	      this.buffer.push(data);
	    }

	    return this;
	  };

	  /**
	   * Sets buffer state
	   *
	   * @api private
	   */

	  Socket.prototype.setBuffer = function (v) {
	    this.doBuffer = v;

	    if (!v && this.connected && this.buffer.length) {
	      if (!this.options['manualFlush']) {
	        this.flushBuffer();
	      }
	    }
	  };

	  /**
	   * Flushes the buffer data over the wire.
	   * To be invoked manually when 'manualFlush' is set to true.
	   *
	   * @api public
	   */

	  Socket.prototype.flushBuffer = function() {
	    this.transport.payload(this.buffer);
	    this.buffer = [];
	  };


	  /**
	   * Disconnect the established connect.
	   *
	   * @returns {io.Socket}
	   * @api public
	   */

	  Socket.prototype.disconnect = function () {
	    if (this.connected || this.connecting) {
	      if (this.open) {
	        this.of('').packet({ type: 'disconnect' });
	      }

	      // handle disconnection immediately
	      this.onDisconnect('booted');
	    }

	    return this;
	  };

	  /**
	   * Disconnects the socket with a sync XHR.
	   *
	   * @api private
	   */

	  Socket.prototype.disconnectSync = function () {
	    // ensure disconnection
	    var xhr = io.util.request();
	    var uri = [
	        'http' + (this.options.secure ? 's' : '') + ':/'
	      , this.options.host + ':' + this.options.port
	      , this.options.resource
	      , io.protocol
	      , ''
	      , this.sessionid
	    ].join('/') + '/?disconnect=1';

	    xhr.open('GET', uri, false);
	    xhr.send(null);

	    // handle disconnection immediately
	    this.onDisconnect('booted');
	  };

	  /**
	   * Check if we need to use cross domain enabled transports. Cross domain would
	   * be a different port or different domain name.
	   *
	   * @returns {Boolean}
	   * @api private
	   */

	  Socket.prototype.isXDomain = function () {

	    var port = global.location.port ||
	      ('https:' == global.location.protocol ? 443 : 80);

	    return this.options.host !== global.location.hostname
	      || this.options.port != port;
	  };

	  /**
	   * Called upon handshake.
	   *
	   * @api private
	   */

	  Socket.prototype.onConnect = function () {
	    if (!this.connected) {
	      this.connected = true;
	      this.connecting = false;
	      if (!this.doBuffer) {
	        // make sure to flush the buffer
	        this.setBuffer(false);
	      }
	      this.emit('connect');
	    }
	  };

	  /**
	   * Called when the transport opens
	   *
	   * @api private
	   */

	  Socket.prototype.onOpen = function () {
	    this.open = true;
	  };

	  /**
	   * Called when the transport closes.
	   *
	   * @api private
	   */

	  Socket.prototype.onClose = function () {
	    this.open = false;
	    clearTimeout(this.heartbeatTimeoutTimer);
	  };

	  /**
	   * Called when the transport first opens a connection
	   *
	   * @param text
	   */

	  Socket.prototype.onPacket = function (packet) {
	    this.of(packet.endpoint).onPacket(packet);
	  };

	  /**
	   * Handles an error.
	   *
	   * @api private
	   */

	  Socket.prototype.onError = function (err) {
	    if (err && err.advice) {
	      if (err.advice === 'reconnect' && (this.connected || this.connecting)) {
	        this.disconnect();
	        if (this.options.reconnect) {
	          this.reconnect();
	        }
	      }
	    }

	    this.publish('error', err && err.reason ? err.reason : err);
	  };

	  /**
	   * Called when the transport disconnects.
	   *
	   * @api private
	   */

	  Socket.prototype.onDisconnect = function (reason) {
	    var wasConnected = this.connected
	      , wasConnecting = this.connecting;

	    this.connected = false;
	    this.connecting = false;
	    this.open = false;

	    if (wasConnected || wasConnecting) {
	      this.transport.close();
	      this.transport.clearTimeouts();
	      if (wasConnected) {
	        this.publish('disconnect', reason);

	        if ('booted' != reason && this.options.reconnect && !this.reconnecting) {
	          this.reconnect();
	        }
	      }
	      // 安卓微信有些机器, 在尝试 WS 方式时会直接 WS.prototype.onClose, 然后会走到这里
	      // 此时 connectTimeoutTimer 还未触发, 所以手动尝试下一个 transport
	      if (wasConnecting) {
	        this.tryNextTransport();
	      }
	    }
	  };

	  /**
	   * Called upon reconnection.
	   *
	   * @api private
	   */

	  Socket.prototype.reconnect = function () {
	    this.reconnecting = true;
	    this.reconnectionAttempts = 0;
	    this.reconnectionDelay = this.options['reconnection delay'];

	    var self = this
	      , maxAttempts = this.options['max reconnection attempts']
	      , tryMultiple = this.options['try multiple transports']
	      , limit = this.options['reconnection limit'];

	    function reset () {
	      if (self.connected) {
	        for (var i in self.namespaces) {
	          if (self.namespaces.hasOwnProperty(i) && '' !== i) {
	              self.namespaces[i].packet({ type: 'connect' });
	          }
	        }
	        self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
	      }

	      clearTimeout(self.reconnectionTimer);

	      self.removeListener('connect_failed', maybeReconnect);
	      self.removeListener('connect', maybeReconnect);

	      self.reconnecting = false;

	      delete self.reconnectionAttempts;
	      delete self.reconnectionDelay;
	      delete self.reconnectionTimer;
	      delete self.redoTransports;

	      self.options['try multiple transports'] = tryMultiple;
	    };

	    function maybeReconnect () {
	      if (!self.reconnecting) {
	        return;
	      }

	      if (self.connected) {
	        return reset();
	      };

	      if (self.connecting && self.reconnecting) {
	        return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
	      }

	      if (self.reconnectionAttempts++ >= maxAttempts) {
	        if (!self.redoTransports) {
	          self.on('connect_failed', maybeReconnect);
	          self.options['try multiple transports'] = true;
	          self.transports = self.origTransports;
	          self.transport = self.getTransport();
	          self.redoTransports = true;
	          self.connect();
	        } else {
	          self.publish('reconnect_failed');
	          reset();
	        }
	      } else {
	        if (self.reconnectionDelay < limit) {
	          self.reconnectionDelay *= 2; // exponential back off
	        }

	        self.connect();
	        self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
	        self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
	      }
	    };

	    this.options['try multiple transports'] = false;
	    this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

	    this.on('connect', maybeReconnect);
	  };

	})(
	    'undefined' != typeof io ? io : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	  , window
	);
	/**
	 * socket.io SocketNamespace
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io) {

	  /**
	   * Expose constructor.
	   */

	  exports.SocketNamespace = SocketNamespace;

	  /**
	   * Socket namespace constructor.
	   *
	   * @constructor
	   * @api public
	   */

	  function SocketNamespace (socket, name) {
	    this.socket = socket;
	    this.name = name || '';
	    this.flags = {};
	    this.json = new Flag(this, 'json');
	    this.ackPackets = 0;
	    this.acks = {};
	  };

	  /**
	   * Apply EventEmitter mixin.
	   */

	  io.util.mixin(SocketNamespace, io.EventEmitter);

	  /**
	   * Copies emit since we override it
	   *
	   * @api private
	   */

	  SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

	  /**
	   * Creates a new namespace, by proxying the request to the socket. This
	   * allows us to use the synax as we do on the server.
	   *
	   * @api public
	   */

	  SocketNamespace.prototype.of = function () {
	    return this.socket.of.apply(this.socket, arguments);
	  };

	  /**
	   * Sends a packet.
	   *
	   * @api private
	   */

	  SocketNamespace.prototype.packet = function (packet) {
	    packet.endpoint = this.name;
	    this.socket.packet(packet);
	    this.flags = {};
	    return this;
	  };

	  /**
	   * Sends a message
	   *
	   * @api public
	   */

	  SocketNamespace.prototype.send = function (data, fn) {
	    var packet = {
	        type: this.flags.json ? 'json' : 'message'
	      , data: data
	    };

	    if ('function' == typeof fn) {
	      packet.id = ++this.ackPackets;
	      packet.ack = true;
	      this.acks[packet.id] = fn;
	    }

	    return this.packet(packet);
	  };

	  /**
	   * Emits an event
	   *
	   * @api public
	   */

	  SocketNamespace.prototype.emit = function (name) {
	    var args = Array.prototype.slice.call(arguments, 1)
	      , lastArg = args[args.length - 1]
	      , packet = {
	            type: 'event'
	          , name: name
	        };

	    if ('function' == typeof lastArg) {
	      packet.id = ++this.ackPackets;
	      packet.ack = 'data';
	      this.acks[packet.id] = lastArg;
	      args = args.slice(0, args.length - 1);
	    }

	    packet.args = args;

	    return this.packet(packet);
	  };

	  /**
	   * Disconnects the namespace
	   *
	   * @api private
	   */

	  SocketNamespace.prototype.disconnect = function () {
	    if (this.name === '') {
	      this.socket.disconnect();
	    } else {
	      this.packet({ type: 'disconnect' });
	      this.$emit('disconnect');
	    }

	    return this;
	  };

	  /**
	   * Handles a packet
	   *
	   * @api private
	   */

	  SocketNamespace.prototype.onPacket = function (packet) {
	    var self = this;

	    function ack () {
	      self.packet({
	          type: 'ack'
	        , args: io.util.toArray(arguments)
	        , ackId: packet.id
	      });
	    };

	    switch (packet.type) {
	      case 'connect':
	        this.$emit('connect');
	        break;

	      case 'disconnect':
	        if (this.name === '') {
	          this.socket.onDisconnect(packet.reason || 'booted');
	        } else {
	          this.$emit('disconnect', packet.reason);
	        }
	        break;

	      case 'message':
	      case 'json':
	        var params = ['message', packet.data];

	        if (packet.ack == 'data') {
	          params.push(ack);
	        } else if (packet.ack) {
	          this.packet({ type: 'ack', ackId: packet.id });
	        }

	        this.$emit.apply(this, params);
	        break;

	      case 'event':
	        var params = [packet.name].concat(packet.args);

	        if (packet.ack == 'data')
	          params.push(ack);

	        this.$emit.apply(this, params);
	        break;

	      case 'ack':
	        if (this.acks[packet.ackId]) {
	          this.acks[packet.ackId].apply(this, packet.args);
	          delete this.acks[packet.ackId];
	        }
	        break;

	      case 'error':
	        if (packet.advice){
	          this.socket.onError(packet);
	        } else {
	          if (packet.reason == 'unauthorized') {
	            this.$emit('connect_failed', packet.reason);
	          } else {
	            this.$emit('error', packet.reason);
	          }
	        }
	        break;
	    }
	  };

	  /**
	   * Flag interface.
	   *
	   * @api private
	   */

	  function Flag (nsp, name) {
	    this.namespace = nsp;
	    this.name = name;
	  };

	  /**
	   * Send a message
	   *
	   * @api public
	   */

	  Flag.prototype.send = function () {
	    this.namespace.flags[this.name] = true;
	    this.namespace.send.apply(this.namespace, arguments);
	  };

	  /**
	   * Emit an event
	   *
	   * @api public
	   */

	  Flag.prototype.emit = function () {
	    this.namespace.flags[this.name] = true;
	    this.namespace.emit.apply(this.namespace, arguments);
	  };

	})(
	    'undefined' != typeof io ? io : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	);

	/**
	 * socket.io WebSocket
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io, global) {

	  /**
	   * Expose constructor.
	   */

	  exports.websocket = WS;

	  /**
	   * The WebSocket transport uses the HTML5 WebSocket API to establish an
	   * persistent connection with the Socket.IO server. This transport will also
	   * be inherited by the FlashSocket fallback as it provides a API compatible
	   * polyfill for the WebSockets.
	   *
	   * @constructor
	   * @extends {io.Transport}
	   * @api public
	   */

	  function WS (socket) {
	    io.Transport.apply(this, arguments);
	  };

	  /**
	   * Inherits from Transport.
	   */

	  io.util.inherit(WS, io.Transport);

	  /**
	   * Transport name
	   *
	   * @api public
	   */

	  WS.prototype.name = 'websocket';

	  /**
	   * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
	   * all the appropriate listeners to handle the responses from the server.
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  WS.prototype.open = function () {
	    var query = io.util.query(this.socket.options.query)
	      , self = this
	      , Socket


	    if (!Socket) {
	      Socket = global.MozWebSocket || global.WebSocket;
	    }

	    this.websocket = new Socket(this.prepareUrl() + query);

	    this.websocket.onopen = function () {
	      self.onOpen();
	      self.socket.setBuffer(false);
	    };
	    this.websocket.onmessage = function (ev) {
	      self.onData(ev.data);
	    };
	    this.websocket.onclose = function () {
	      // 先 setBuffer, 然后 onClose, 在 onClose 里面可能会再次调用 setBuffer @hzzhangyingya
	      self.socket.setBuffer(true);
	      self.onClose();
	    };
	    this.websocket.onerror = function (e) {
	      self.onError(e);
	    };

	    return this;
	  };

	  /**
	   * Send a message to the Socket.IO server. The message will automatically be
	   * encoded in the correct message format.
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  // Do to a bug in the current IDevices browser, we need to wrap the send in a
	  // setTimeout, when they resume from sleeping the browser will crash if
	  // we don't allow the browser time to detect the socket has been closed
	  if (io.util.ua.iDevice) {
	    WS.prototype.send = function (data) {
	      var self = this;
	      setTimeout(function() {
	         self.websocket.send(data);
	      },0);
	      return this;
	    };
	  } else {
	    WS.prototype.send = function (data) {
	      this.websocket.send(data);
	      return this;
	    };
	  }

	  /**
	   * Payload
	   *
	   * @api private
	   */

	  WS.prototype.payload = function (arr) {
	    for (var i = 0, l = arr.length; i < l; i++) {
	      this.packet(arr[i]);
	    }
	    return this;
	  };

	  /**
	   * Disconnect the established `WebSocket` connection.
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  WS.prototype.close = function () {
	    this.websocket.close();
	    return this;
	  };

	  /**
	   * Handle the errors that `WebSocket` might be giving when we
	   * are attempting to connect or send messages.
	   *
	   * @param {Error} e The error.
	   * @api private
	   */

	  WS.prototype.onError = function (e) {
	    this.socket.onError(e);
	  };

	  /**
	   * Returns the appropriate scheme for the URI generation.
	   *
	   * @api private
	   */
	  WS.prototype.scheme = function () {
	    return this.socket.options.secure ? 'wss' : 'ws';
	  };

	  /**
	   * Checks if the browser has support for native `WebSockets` and that
	   * it's not the polyfill created for the FlashSocket transport.
	   *
	   * @return {Boolean}
	   * @api public
	   */

	  WS.check = function () {
	    return ('WebSocket' in global && !('__addTask' in WebSocket))
	          || 'MozWebSocket' in global;
	  };

	  /**
	   * Check if the `WebSocket` transport support cross domain communications.
	   *
	   * @returns {Boolean}
	   * @api public
	   */

	  WS.xdomainCheck = function () {
	    return true;
	  };

	  /**
	   * Add the transport to your public io.transports array.
	   *
	   * @api private
	   */

	  io.transports.push('websocket');

	})(
	    'undefined' != typeof io ? io.Transport : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	  , window
	);

	/**
	 * socket.io Flashsocket
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io) {

	  /**
	   * Expose constructor.
	   */

	  exports.flashsocket = Flashsocket;

	  /**
	   * The FlashSocket transport. This is a API wrapper for the HTML5 WebSocket
	   * specification. It uses a .swf file to communicate with the server. If you want
	   * to serve the .swf file from a other server than where the Socket.IO script is
	   * coming from you need to use the insecure version of the .swf. More information
	   * about this can be found on the github page.
	   *
	   * @constructor
	   * @extends {io.Transport.websocket}
	   * @api public
	   */

	  function Flashsocket () {
	    io.Transport.websocket.apply(this, arguments);
	  };

	  /**
	   * Inherits from Transport.
	   */

	  io.util.inherit(Flashsocket, io.Transport.websocket);

	  /**
	   * Transport name
	   *
	   * @api public
	   */

	  Flashsocket.prototype.name = 'flashsocket';

	  /**
	   * Disconnect the established `FlashSocket` connection. This is done by adding a
	   * new task to the FlashSocket. The rest will be handled off by the `WebSocket`
	   * transport.
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  Flashsocket.prototype.open = function () {
	    var self = this
	      , args = arguments;

	    WebSocket.__addTask(function () {
	      io.Transport.websocket.prototype.open.apply(self, args);
	    });
	    return this;
	  };

	  /**
	   * Sends a message to the Socket.IO server. This is done by adding a new
	   * task to the FlashSocket. The rest will be handled off by the `WebSocket`
	   * transport.
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  Flashsocket.prototype.send = function () {
	    var self = this, args = arguments;
	    WebSocket.__addTask(function () {
	      io.Transport.websocket.prototype.send.apply(self, args);
	    });
	    return this;
	  };

	  /**
	   * Disconnects the established `FlashSocket` connection.
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  Flashsocket.prototype.close = function () {
	    WebSocket.__tasks.length = 0;
	    io.Transport.websocket.prototype.close.call(this);
	    return this;
	  };

	  /**
	   * The WebSocket fall back needs to append the flash container to the body
	   * element, so we need to make sure we have access to it. Or defer the call
	   * until we are sure there is a body element.
	   *
	   * @param {Socket} socket The socket instance that needs a transport
	   * @param {Function} fn The callback
	   * @api private
	   */

	  Flashsocket.prototype.ready = function (socket, fn) {
	    function init () {
	      var options = socket.options
	        , port = options['flash policy port']
	        , path = [
	              'http' + (options.secure ? 's' : '') + ':/'
	            , options.host + ':' + options.port
	            , options.resource
	            , 'static/flashsocket'
	            , 'WebSocketMain' + (socket.isXDomain() ? 'Insecure' : '') + '.swf'
	          ];

	      // Only start downloading the swf file when the checked that this browser
	      // actually supports it
	      if (!Flashsocket.loaded) {
	        if (typeof WEB_SOCKET_SWF_LOCATION === 'undefined') {
	          // Set the correct file based on the XDomain settings
	          WEB_SOCKET_SWF_LOCATION = path.join('/');
	        }

	        if (port !== 843) {
	          WebSocket.loadFlashPolicyFile('xmlsocket://' + options.host + ':' + port);
	        }

	        WebSocket.__initialize();
	        Flashsocket.loaded = true;
	      }

	      fn.call(self);
	    }

	    var self = this;
	    if (document.body) return init();

	    io.util.load(init);
	  };

	  /**
	   * Check if the FlashSocket transport is supported as it requires that the Adobe
	   * Flash Player plug-in version `10.0.0` or greater is installed. And also check if
	   * the polyfill is correctly loaded.
	   *
	   * @returns {Boolean}
	   * @api public
	   */

	  Flashsocket.check = function () {
	    if (
	        typeof WebSocket == 'undefined'
	      || !('__initialize' in WebSocket) || !swfobject
	    ) return false;

	    return swfobject.getFlashPlayerVersion().major >= 10;
	  };

	  /**
	   * Check if the FlashSocket transport can be used as cross domain / cross origin
	   * transport. Because we can't see which type (secure or insecure) of .swf is used
	   * we will just return true.
	   *
	   * @returns {Boolean}
	   * @api public
	   */

	  Flashsocket.xdomainCheck = function () {
	    return true;
	  };

	  /**
	   * Disable AUTO_INITIALIZATION
	   */

	  if (typeof window != 'undefined') {
	    window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = true;
	  }

	  /**
	   * Add the transport to your public io.transports array.
	   *
	   * @api private
	   */

	  io.transports.push('flashsocket');
	})(
	    'undefined' != typeof io ? io.Transport : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	);
	/*  SWFObject v2.2 <http://code.google.com/p/swfobject/>
	  is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
	*/
	if ('undefined' != typeof window && 'undefined' != typeof window.document) {
	var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O[(['Active'].concat('Object').join('X'))]!=D){try{var ad=new window[(['Active'].concat('Object').join('X'))](W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?(['Active'].concat('').join('X')):"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
	}
	// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
	// License: New BSD License
	// Reference: http://dev.w3.org/html5/websockets/
	// Reference: http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol

	(function() {

	  if ('undefined' == typeof window || window.WebSocket) return;

	  var console = window.console;
	  if (!console || !console.log || !console.error) {
	    console = {log: function(){ }, error: function(){ }};
	  }

	  if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
	    console.error("Flash Player >= 10.0.0 is required.");
	    return;
	  }
	  if (location.protocol == "file:") {
	    console.error(
	      "WARNING: web-socket-js doesn't work in file:///... URL " +
	      "unless you set Flash Security Settings properly. " +
	      "Open the page via Web server i.e. http://...");
	  }

	  /**
	   * This class represents a faux web socket.
	   * @param {string} url
	   * @param {array or string} protocols
	   * @param {string} proxyHost
	   * @param {int} proxyPort
	   * @param {string} headers
	   */
	  WebSocket = function(url, protocols, proxyHost, proxyPort, headers) {
	    var self = this;
	    self.__id = WebSocket.__nextId++;
	    WebSocket.__instances[self.__id] = self;
	    self.readyState = WebSocket.CONNECTING;
	    self.bufferedAmount = 0;
	    self.__events = {};
	    if (!protocols) {
	      protocols = [];
	    } else if (typeof protocols == "string") {
	      protocols = [protocols];
	    }
	    // Uses setTimeout() to make sure __createFlash() runs after the caller sets ws.onopen etc.
	    // Otherwise, when onopen fires immediately, onopen is called before it is set.
	    setTimeout(function() {
	      WebSocket.__addTask(function() {
	        WebSocket.__flash.create(
	            self.__id, url, protocols, proxyHost || null, proxyPort || 0, headers || null);
	      });
	    }, 0);
	  };

	  /**
	   * Send data to the web socket.
	   * @param {string} data  The data to send to the socket.
	   * @return {boolean}  True for success, false for failure.
	   */
	  WebSocket.prototype.send = function(data) {
	    if (this.readyState == WebSocket.CONNECTING) {
	      throw "INVALID_STATE_ERR: Web Socket connection has not been established";
	    }
	    // We use encodeURIComponent() here, because FABridge doesn't work if
	    // the argument includes some characters. We don't use escape() here
	    // because of this:
	    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Functions#escape_and_unescape_Functions
	    // But it looks decodeURIComponent(encodeURIComponent(s)) doesn't
	    // preserve all Unicode characters either e.g. "\uffff" in Firefox.
	    // Note by wtritch: Hopefully this will not be necessary using ExternalInterface.  Will require
	    // additional testing.
	    var result = WebSocket.__flash.send(this.__id, encodeURIComponent(data));
	    if (result < 0) { // success
	      return true;
	    } else {
	      this.bufferedAmount += result;
	      return false;
	    }
	  };

	  /**
	   * Close this web socket gracefully.
	   */
	  WebSocket.prototype.close = function() {
	    if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) {
	      return;
	    }
	    this.readyState = WebSocket.CLOSING;
	    WebSocket.__flash.close(this.__id);
	  };

	  /**
	   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
	   *
	   * @param {string} type
	   * @param {function} listener
	   * @param {boolean} useCapture
	   * @return void
	   */
	  WebSocket.prototype.addEventListener = function(type, listener, useCapture) {
	    if (!(type in this.__events)) {
	      this.__events[type] = [];
	    }
	    this.__events[type].push(listener);
	  };

	  /**
	   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
	   *
	   * @param {string} type
	   * @param {function} listener
	   * @param {boolean} useCapture
	   * @return void
	   */
	  WebSocket.prototype.removeEventListener = function(type, listener, useCapture) {
	    if (!(type in this.__events)) return;
	    var events = this.__events[type];
	    for (var i = events.length - 1; i >= 0; --i) {
	      if (events[i] === listener) {
	        events.splice(i, 1);
	        break;
	      }
	    }
	  };

	  /**
	   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
	   *
	   * @param {Event} event
	   * @return void
	   */
	  WebSocket.prototype.dispatchEvent = function(event) {
	    var events = this.__events[event.type] || [];
	    for (var i = 0; i < events.length; ++i) {
	      events[i](event);
	    }
	    var handler = this["on" + event.type];
	    if (handler) handler(event);
	  };

	  /**
	   * Handles an event from Flash.
	   * @param {Object} flashEvent
	   */
	  WebSocket.prototype.__handleEvent = function(flashEvent) {
	    if ("readyState" in flashEvent) {
	      this.readyState = flashEvent.readyState;
	    }
	    if ("protocol" in flashEvent) {
	      this.protocol = flashEvent.protocol;
	    }

	    var jsEvent;
	    if (flashEvent.type == "open" || flashEvent.type == "error") {
	      jsEvent = this.__createSimpleEvent(flashEvent.type);
	    } else if (flashEvent.type == "close") {
	      // TODO implement jsEvent.wasClean
	      jsEvent = this.__createSimpleEvent("close");
	    } else if (flashEvent.type == "message") {
	      var data = decodeURIComponent(flashEvent.message);
	      jsEvent = this.__createMessageEvent("message", data);
	    } else {
	      throw "unknown event type: " + flashEvent.type;
	    }

	    this.dispatchEvent(jsEvent);
	  };

	  WebSocket.prototype.__createSimpleEvent = function(type) {
	    if (document.createEvent && window.Event) {
	      var event = document.createEvent("Event");
	      event.initEvent(type, false, false);
	      return event;
	    } else {
	      return {type: type, bubbles: false, cancelable: false};
	    }
	  };

	  WebSocket.prototype.__createMessageEvent = function(type, data) {
	    if (document.createEvent && window.MessageEvent && !window.opera) {
	      var event = document.createEvent("MessageEvent");
	      event.initMessageEvent("message", false, false, data, null, null, window, null);
	      return event;
	    } else {
	      // IE and Opera, the latter one truncates the data parameter after any 0x00 bytes.
	      return {type: type, data: data, bubbles: false, cancelable: false};
	    }
	  };

	  /**
	   * Define the WebSocket readyState enumeration.
	   */
	  WebSocket.CONNECTING = 0;
	  WebSocket.OPEN = 1;
	  WebSocket.CLOSING = 2;
	  WebSocket.CLOSED = 3;

	  WebSocket.__flash = null;
	  WebSocket.__instances = {};
	  WebSocket.__tasks = [];
	  WebSocket.__nextId = 0;

	  /**
	   * Load a new flash security policy file.
	   * @param {string} url
	   */
	  WebSocket.loadFlashPolicyFile = function(url){
	    WebSocket.__addTask(function() {
	      WebSocket.__flash.loadManualPolicyFile(url);
	    });
	  };

	  /**
	   * Loads WebSocketMain.swf and creates WebSocketMain object in Flash.
	   */
	  WebSocket.__initialize = function() {
	    if (WebSocket.__flash) return;

	    if (WebSocket.__swfLocation) {
	      // For backword compatibility.
	      window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation;
	    }
	    if (!window.WEB_SOCKET_SWF_LOCATION) {
	      console.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
	      return;
	    }
	    var container = document.createElement("div");
	    container.id = "webSocketContainer";
	    // Hides Flash box. We cannot use display: none or visibility: hidden because it prevents
	    // Flash from loading at least in IE. So we move it out of the screen at (-100, -100).
	    // But this even doesn't work with Flash Lite (e.g. in Droid Incredible). So with Flash
	    // Lite, we put it at (0, 0). This shows 1x1 box visible at left-top corner but this is
	    // the best we can do as far as we know now.
	    container.style.position = "absolute";
	    if (WebSocket.__isFlashLite()) {
	      container.style.left = "0px";
	      container.style.top = "0px";
	    } else {
	      container.style.left = "-100px";
	      container.style.top = "-100px";
	    }
	    var holder = document.createElement("div");
	    holder.id = "webSocketFlash";
	    container.appendChild(holder);
	    document.body.appendChild(container);
	    // See this article for hasPriority:
	    // http://help.adobe.com/en_US/as3/mobile/WS4bebcd66a74275c36cfb8137124318eebc6-7ffd.html
	    swfobject.embedSWF(
	      WEB_SOCKET_SWF_LOCATION,
	      "webSocketFlash",
	      "1" /* width */,
	      "1" /* height */,
	      "10.0.0" /* SWF version */,
	      null,
	      null,
	      {hasPriority: true, swliveconnect : true, allowScriptAccess: "always"},
	      null,
	      function(e) {
	        if (!e.success) {
	          console.error("[WebSocket] swfobject.embedSWF failed");
	        }
	      });
	  };

	  /**
	   * Called by Flash to notify JS that it's fully loaded and ready
	   * for communication.
	   */
	  WebSocket.__onFlashInitialized = function() {
	    // We need to set a timeout here to avoid round-trip calls
	    // to flash during the initialization process.
	    setTimeout(function() {
	      WebSocket.__flash = document.getElementById("webSocketFlash");
	      WebSocket.__flash.setCallerUrl(location.href);
	      WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
	      for (var i = 0; i < WebSocket.__tasks.length; ++i) {
	        WebSocket.__tasks[i]();
	      }
	      WebSocket.__tasks = [];
	    }, 0);
	  };

	  /**
	   * Called by Flash to notify WebSockets events are fired.
	   */
	  WebSocket.__onFlashEvent = function() {
	    setTimeout(function() {
	      try {
	        // Gets events using receiveEvents() instead of getting it from event object
	        // of Flash event. This is to make sure to keep message order.
	        // It seems sometimes Flash events don't arrive in the same order as they are sent.
	        var events = WebSocket.__flash.receiveEvents();
	        for (var i = 0; i < events.length; ++i) {
	          WebSocket.__instances[events[i].webSocketId].__handleEvent(events[i]);
	        }
	      } catch (e) {
	        console.error(e);
	      }
	    }, 0);
	    return true;
	  };

	  var getNowStr = function () {
	    var formatTimeUnit = function(num, count) {
	        count = count || 2;
	        var str = '' + num;
	        while (str.length < count) {
	            str = '0' + str;
	        }
	        return str;
	    };
	    var date = new Date();
	    var dateStr = date.getFullYear() + '-' + formatTimeUnit((date.getMonth()+1)) + '-' + formatTimeUnit(date.getDate()) + ' ' + formatTimeUnit(date.getHours()) + ':' + formatTimeUnit(date.getMinutes()) + ':' + formatTimeUnit(date.getSeconds()) + ':' + formatTimeUnit(date.getMilliseconds(), 3);
	    return dateStr
	  }

	  // Called by Flash.
	  WebSocket.__log = function(message) {
	    console.log(getNowStr(), decodeURIComponent(message));
	  };

	  // Called by Flash.
	  WebSocket.__error = function(message) {
	    console.error(getNowStr(), decodeURIComponent(message));
	  };

	  WebSocket.__addTask = function(task) {
	    if (WebSocket.__flash) {
	      task();
	    } else {
	      WebSocket.__tasks.push(task);
	    }
	  };

	  /**
	   * Test if the browser is running flash lite.
	   * @return {boolean} True if flash lite is running, false otherwise.
	   */
	  WebSocket.__isFlashLite = function() {
	    if (!window.navigator || !window.navigator.mimeTypes) {
	      return false;
	    }
	    var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
	    if (!mimeType || !mimeType.enabledPlugin || !mimeType.enabledPlugin.filename) {
	      return false;
	    }
	    return mimeType.enabledPlugin.filename.match(/flashlite/i) ? true : false;
	  };

	  if (!window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION) {
	    if (window.addEventListener) {
	      window.addEventListener("load", function(){
	        WebSocket.__initialize();
	      }, false);
	    } else {
	      window.attachEvent("onload", function(){
	        WebSocket.__initialize();
	      });
	    }
	  }

	})();

	/**
	 * socket.io XHR
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io, global) {

	  /**
	   * Expose constructor.
	   *
	   * @api public
	   */

	  exports.XHR = XHR;

	  /**
	   * XHR constructor
	   *
	   * @costructor
	   * @api public
	   */

	  function XHR (socket) {
	    if (!socket) return;

	    io.Transport.apply(this, arguments);
	    this.sendBuffer = [];
	  };

	  /**
	   * Inherits from Transport.
	   */

	  io.util.inherit(XHR, io.Transport);

	  /**
	   * Establish a connection
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  XHR.prototype.open = function () {
	    this.socket.setBuffer(false);
	    this.onOpen();
	    this.get();

	    // we need to make sure the request succeeds since we have no indication
	    // whether the request opened or not until it succeeded.
	    this.setCloseTimeout();

	    return this;
	  };

	  /**
	   * Check if we need to send data to the Socket.IO server, if we have data in our
	   * buffer we encode it and forward it to the `post` method.
	   *
	   * @api private
	   */

	  XHR.prototype.payload = function (payload) {
	    var msgs = [];

	    for (var i = 0, l = payload.length; i < l; i++) {
	      msgs.push(io.parser.encodePacket(payload[i]));
	    }

	    this.send(io.parser.encodePayload(msgs));
	  };

	  /**
	   * Send data to the Socket.IO server.
	   *
	   * @param data The message
	   * @returns {Transport}
	   * @api public
	   */

	  XHR.prototype.send = function (data) {
	    this.post(data);
	    return this;
	  };

	  /**
	   * Posts a encoded message to the Socket.IO server.
	   *
	   * @param {String} data A encoded message.
	   * @api private
	   */

	  function empty () { };

	  XHR.prototype.post = function (data) {
	    var self = this;
	    this.socket.setBuffer(true);

	    function stateChange () {
	      if (this.readyState == 4) {
	        this.onreadystatechange = empty;
	        self.posting = false;

	        if (this.status == 200){
	          self.socket.setBuffer(false);
	        } else {
	          self.onClose();
	        }
	      }
	    }

	    function onload () {
	      this.onload = empty;
	      self.socket.setBuffer(false);
	    };

	    this.sendXHR = this.request('POST');

	    if (global.XDomainRequest && this.sendXHR instanceof XDomainRequest) {
	      this.sendXHR.onload = this.sendXHR.onerror = onload;
	    } else {
	      this.sendXHR.onreadystatechange = stateChange;
	    }

	    this.sendXHR.send(data);
	  };

	  /**
	   * Disconnects the established `XHR` connection.
	   *
	   * @returns {Transport}
	   * @api public
	   */

	  XHR.prototype.close = function () {
	    this.onClose();
	    return this;
	  };

	  /**
	   * Generates a configured XHR request
	   *
	   * @param {String} url The url that needs to be requested.
	   * @param {String} method The method the request should use.
	   * @returns {XMLHttpRequest}
	   * @api private
	   */

	  XHR.prototype.request = function (method) {
	    var req = io.util.request(this.socket.isXDomain())
	      , query = io.util.query(this.socket.options.query, 't=' + +new Date);

	    req.open(method || 'GET', this.prepareUrl() + query, true);

	    if (method == 'POST') {
	      try {
	        if (req.setRequestHeader) {
	          req.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
	        } else {
	          // XDomainRequest
	          req.contentType = 'text/plain';
	        }
	      } catch (e) {}
	    }

	    return req;
	  };

	  /**
	   * Returns the scheme to use for the transport URLs.
	   *
	   * @api private
	   */

	  XHR.prototype.scheme = function () {
	    return this.socket.options.secure ? 'https' : 'http';
	  };

	  /**
	   * Check if the XHR transports are supported
	   *
	   * @param {Boolean} xdomain Check if we support cross domain requests.
	   * @returns {Boolean}
	   * @api public
	   */

	  XHR.check = function (socket, xdomain) {
	    try {
	      var request = io.util.request(xdomain),
	          usesXDomReq = (global.XDomainRequest && request instanceof XDomainRequest),
	          socketProtocol = (socket && socket.options && socket.options.secure ? 'https:' : 'http:'),
	          isXProtocol = (global.location && socketProtocol != global.location.protocol);
	      if (request && !(usesXDomReq && isXProtocol)) {
	        return true;
	      }
	    } catch(e) {}

	    return false;
	  };

	  /**
	   * Check if the XHR transport supports cross domain requests.
	   *
	   * @returns {Boolean}
	   * @api public
	   */

	  XHR.xdomainCheck = function (socket) {
	    return XHR.check(socket, true);
	  };

	})(
	    'undefined' != typeof io ? io.Transport : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	  , window
	);
	/**
	 * socket.io HTMLFile
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io) {

	  /**
	   * Expose constructor.
	   */

	  exports.htmlfile = HTMLFile;

	  /**
	   * The HTMLFile transport creates a `forever iframe` based transport
	   * for Internet Explorer. Regular forever iframe implementations will
	   * continuously trigger the browsers buzy indicators. If the forever iframe
	   * is created inside a `htmlfile` these indicators will not be trigged.
	   *
	   * @constructor
	   * @extends {io.Transport.XHR}
	   * @api public
	   */

	  function HTMLFile (socket) {
	    io.Transport.XHR.apply(this, arguments);
	  };

	  /**
	   * Inherits from XHR transport.
	   */

	  io.util.inherit(HTMLFile, io.Transport.XHR);

	  /**
	   * Transport name
	   *
	   * @api public
	   */

	  HTMLFile.prototype.name = 'htmlfile';

	  /**
	   * Creates a new Ac...eX `htmlfile` with a forever loading iframe
	   * that can be used to listen to messages. Inside the generated
	   * `htmlfile` a reference will be made to the HTMLFile transport.
	   *
	   * @api private
	   */

	  HTMLFile.prototype.get = function () {
	    this.doc = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
	    this.doc.open();
	    this.doc.write('<html></html>');
	    this.doc.close();
	    this.doc.parentWindow.s = this;

	    var iframeC = this.doc.createElement('div');
	    iframeC.className = 'socketio';

	    this.doc.body.appendChild(iframeC);
	    this.iframe = this.doc.createElement('iframe');

	    iframeC.appendChild(this.iframe);

	    var self = this
	      , query = io.util.query(this.socket.options.query, 't='+ +new Date);

	    this.iframe.src = this.prepareUrl() + query;

	    io.util.on(window, 'unload', function () {
	      self.destroy();
	    });
	  };

	  /**
	   * The Socket.IO server will write script tags inside the forever
	   * iframe, this function will be used as callback for the incoming
	   * information.
	   *
	   * @param {String} data The message
	   * @param {document} doc Reference to the context
	   * @api private
	   */

	  HTMLFile.prototype._ = function (data, doc) {
	    this.onData(data);
	    try {
	      var script = doc.getElementsByTagName('script')[0];
	      script.parentNode.removeChild(script);
	    } catch (e) { }
	  };

	  /**
	   * Destroy the established connection, iframe and `htmlfile`.
	   * And calls the `CollectGarbage` function of Internet Explorer
	   * to release the memory.
	   *
	   * @api private
	   */

	  HTMLFile.prototype.destroy = function () {
	    if (this.iframe){
	      try {
	        this.iframe.src = 'about:blank';
	      } catch(e){}

	      this.doc = null;
	      this.iframe.parentNode.removeChild(this.iframe);
	      this.iframe = null;

	      CollectGarbage();
	    }
	  };

	  /**
	   * Disconnects the established connection.
	   *
	   * @returns {Transport} Chaining.
	   * @api public
	   */

	  HTMLFile.prototype.close = function () {
	    this.destroy();
	    return io.Transport.XHR.prototype.close.call(this);
	  };

	  /**
	   * Checks if the browser supports this transport. The browser
	   * must have an `Ac...eXObject` implementation.
	   *
	   * @return {Boolean}
	   * @api public
	   */

	  HTMLFile.check = function (socket) {
	    if (typeof window != "undefined" && (['Active'].concat('Object').join('X')) in window){
	      try {
	        var a = new window[(['Active'].concat('Object').join('X'))]('htmlfile');
	        return a && io.Transport.XHR.check(socket);
	      } catch(e){}
	    }
	    return false;
	  };

	  /**
	   * Check if cross domain requests are supported.
	   *
	   * @returns {Boolean}
	   * @api public
	   */

	  HTMLFile.xdomainCheck = function () {
	    // we can probably do handling for sub-domains, we should
	    // test that it's cross domain but a subdomain here
	    return false;
	  };

	  /**
	   * Add the transport to your public io.transports array.
	   *
	   * @api private
	   */

	  io.transports.push('htmlfile');

	})(
	    'undefined' != typeof io ? io.Transport : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	);

	/**
	 * socket.io XHRPolling
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io, global) {

	  /**
	   * Expose constructor.
	   */

	  exports['xhr-polling'] = XHRPolling;

	  /**
	   * The XHR-polling transport uses long polling XHR requests to create a
	   * "persistent" connection with the server.
	   *
	   * @constructor
	   * @api public
	   */

	  function XHRPolling () {
	    io.Transport.XHR.apply(this, arguments);
	  };

	  /**
	   * Inherits from XHR transport.
	   */

	  io.util.inherit(XHRPolling, io.Transport.XHR);

	  /**
	   * Merge the properties from XHR transport
	   */

	  io.util.merge(XHRPolling, io.Transport.XHR);

	  /**
	   * Transport name
	   *
	   * @api public
	   */

	  XHRPolling.prototype.name = 'xhr-polling';

	  /**
	   * Indicates whether heartbeats is enabled for this transport
	   *
	   * @api private
	   */

	  XHRPolling.prototype.heartbeats = function () {
	    return false;
	  };

	  /**
	   * Establish a connection, for iPhone and Android this will be done once the page
	   * is loaded.
	   *
	   * @returns {Transport} Chaining.
	   * @api public
	   */

	  XHRPolling.prototype.open = function () {
	    var self = this;

	    io.Transport.XHR.prototype.open.call(self);
	    return false;
	  };

	  /**
	   * Starts a XHR request to wait for incoming messages.
	   *
	   * @api private
	   */

	  function empty () {};

	  XHRPolling.prototype.get = function () {
	    if (!this.isOpen) return;

	    var self = this;

	    function stateChange () {
	      if (this.readyState == 4) {
	        this.onreadystatechange = empty;

	        if (this.status == 200) {
	          self.onData(this.responseText);
	          self.get();
	        } else {
	          self.onClose();
	        }
	      }
	    };

	    function onload () {
	      this.onload = empty;
	      this.onerror = empty;
	      self.retryCounter = 1;
	      self.onData(this.responseText);
	      self.get();
	    };

	    function onerror () {
	      self.retryCounter ++;
	      if(!self.retryCounter || self.retryCounter > 3) {
	        self.onClose();
	      } else {
	        self.get();
	      }
	    };

	    this.xhr = this.request();

	    if (global.XDomainRequest && this.xhr instanceof XDomainRequest) {
	      this.xhr.onload = onload;
	      this.xhr.onerror = onerror;
	    } else {
	      this.xhr.onreadystatechange = stateChange;
	    }

	    this.xhr.send(null);
	  };

	  /**
	   * Handle the unclean close behavior.
	   *
	   * @api private
	   */

	  XHRPolling.prototype.onClose = function () {
	    io.Transport.XHR.prototype.onClose.call(this);

	    if (this.xhr) {
	      this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = empty;
	      try {
	        this.xhr.abort();
	      } catch(e){}
	      this.xhr = null;
	    }
	  };

	  /**
	   * Webkit based browsers show a infinit spinner when you start a XHR request
	   * before the browsers onload event is called so we need to defer opening of
	   * the transport until the onload event is called. Wrapping the cb in our
	   * defer method solve this.
	   *
	   * @param {Socket} socket The socket instance that needs a transport
	   * @param {Function} fn The callback
	   * @api private
	   */

	  XHRPolling.prototype.ready = function (socket, fn) {
	    var self = this;

	    io.util.defer(function () {
	      fn.call(self);
	    });
	  };

	  /**
	   * Add the transport to your public io.transports array.
	   *
	   * @api private
	   */

	  io.transports.push('xhr-polling');

	})(
	    'undefined' != typeof io ? io.Transport : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	  , window
	);

	/**
	 * socket.io JSONPPolling
	 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
	 * MIT Licensed
	 */

	(function (exports, io, global) {
	  /**
	   * There is a way to hide the loading indicator in Firefox. If you create and
	   * remove a iframe it will stop showing the current loading indicator.
	   * Unfortunately we can't feature detect that and UA sniffing is evil.
	   *
	   * @api private
	   */

	  var indicator = global.document && "MozAppearance" in
	    global.document.documentElement.style;

	  /**
	   * Expose constructor.
	   */

	  exports['jsonp-polling'] = JSONPPolling;

	  /**
	   * The JSONP transport creates an persistent connection by dynamically
	   * inserting a script tag in the page. This script tag will receive the
	   * information of the Socket.IO server. When new information is received
	   * it creates a new script tag for the new data stream.
	   *
	   * @constructor
	   * @extends {io.Transport.xhr-polling}
	   * @api public
	   */

	  function JSONPPolling (socket) {
	    io.Transport['xhr-polling'].apply(this, arguments);

	    this.index = io.j.length;

	    var self = this;

	    io.j.push(function (msg) {
	      self._(msg);
	    });
	  };

	  /**
	   * Inherits from XHR polling transport.
	   */

	  io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);

	  /**
	   * Transport name
	   *
	   * @api public
	   */

	  JSONPPolling.prototype.name = 'jsonp-polling';

	  /**
	   * Posts a encoded message to the Socket.IO server using an iframe.
	   * The iframe is used because script tags can create POST based requests.
	   * The iframe is positioned outside of the view so the user does not
	   * notice it's existence.
	   *
	   * @param {String} data A encoded message.
	   * @api private
	   */

	  JSONPPolling.prototype.post = function (data) {
	    var self = this
	      , query = io.util.query(
	             this.socket.options.query
	          , 't='+ (+new Date) + '&i=' + this.index
	        );

	    if (!this.form) {
	      var form = document.createElement('form')
	        , area = document.createElement('textarea')
	        , id = this.iframeId = 'socketio_iframe_' + this.index
	        , iframe;

	      form.className = 'socketio';
	      form.style.position = 'absolute';
	      form.style.top = '0px';
	      form.style.left = '0px';
	      form.style.display = 'none';
	      form.target = id;
	      form.method = 'POST';
	      form.setAttribute('accept-charset', 'utf-8');
	      area.name = 'd';
	      form.appendChild(area);
	      document.body.appendChild(form);

	      this.form = form;
	      this.area = area;
	    }

	    this.form.action = this.prepareUrl() + query;

	    function complete () {
	      initIframe();
	      self.socket.setBuffer(false);
	    };

	    function initIframe () {
	      if (self.iframe) {
	        self.form.removeChild(self.iframe);
	      }

	      try {
	        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	        iframe = document.createElement('<iframe name="'+ self.iframeId +'">');
	      } catch (e) {
	        iframe = document.createElement('iframe');
	        iframe.name = self.iframeId;
	      }

	      iframe.id = self.iframeId;

	      self.form.appendChild(iframe);
	      self.iframe = iframe;
	    };

	    initIframe();

	    // we temporarily stringify until we figure out how to prevent
	    // browsers from turning `\n` into `\r\n` in form inputs
	    this.area.value = io.JSON.stringify(data);

	    try {
	      this.form.submit();
	    } catch(e) {}

	    if (this.iframe.attachEvent) {
	      iframe.onreadystatechange = function () {
	        if (self.iframe.readyState == 'complete') {
	          complete();
	        }
	      };
	    } else {
	      this.iframe.onload = complete;
	    }

	    this.socket.setBuffer(true);
	  };

	  /**
	   * Creates a new JSONP poll that can be used to listen
	   * for messages from the Socket.IO server.
	   *
	   * @api private
	   */

	  JSONPPolling.prototype.get = function () {
	    var self = this
	      , script = document.createElement('script')
	      , query = io.util.query(
	             this.socket.options.query
	          , 't='+ (+new Date) + '&i=' + this.index
	        );

	    if (this.script) {
	      this.script.parentNode.removeChild(this.script);
	      this.script = null;
	    }

	    script.async = true;
	    script.src = this.prepareUrl() + query;
	    script.onerror = function () {
	      self.onClose();
	    };

	    var insertAt = document.getElementsByTagName('script')[0];
	    insertAt.parentNode.insertBefore(script, insertAt);
	    this.script = script;

	    if (indicator) {
	      setTimeout(function () {
	        var iframe = document.createElement('iframe');
	        document.body.appendChild(iframe);
	        document.body.removeChild(iframe);
	      }, 100);
	    }
	  };

	  /**
	   * Callback function for the incoming message stream from the Socket.IO server.
	   *
	   * @param {String} data The message
	   * @api private
	   */

	  JSONPPolling.prototype._ = function (msg) {
	    this.onData(msg);
	    if (this.isOpen) {
	      this.get();
	    }
	    return this;
	  };

	  /**
	   * The indicator hack only works after onload
	   *
	   * @param {Socket} socket The socket instance that needs a transport
	   * @param {Function} fn The callback
	   * @api private
	   */

	  JSONPPolling.prototype.ready = function (socket, fn) {
	    var self = this;
	    if (!indicator) return fn.call(this);

	    io.util.load(function () {
	      fn.call(self);
	    });
	  };

	  /**
	   * Checks if browser supports this transport.
	   *
	   * @return {Boolean}
	   * @api public
	   */

	  JSONPPolling.check = function () {
	    return 'document' in global;
	  };

	  /**
	   * Check if cross domain requests are supported
	   *
	   * @returns {Boolean}
	   * @api public
	   */

	  JSONPPolling.xdomainCheck = function () {
	    return true;
	  };

	  /**
	   * Add the transport to your public io.transports array.
	   *
	   * @api private
	   */

	  io.transports.push('jsonp-polling');

	})(
	    'undefined' != typeof io ? io.Transport : module.exports
	  , 'undefined' != typeof io ? io : module.parent.exports
	  , window
	);

	if (true) {
	  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return io;
	  }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module)))

/***/ },

/***/ 22:
/***/ function(module, exports) {

	module.exports = deep;

	function deep (obj, prop) {
	  var segs = prop.split('.');
	  while (segs.length) {
	    var seg = segs.shift();
	    var existential = false;
	    if (seg[seg.length - 1] == '?') {
	      seg = seg.slice(0, -1);
	      existential = true;
	    }
	    obj = obj[seg];
	    if (!obj && existential) return obj;
	  }
	  return obj;
	}


/***/ },

/***/ 28:
/***/ function(module, exports) {

	/*
	 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
	 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
	 */
	/*jshint unused:false */
	module.exports = function naturalSort (a, b) {
		"use strict";
		var re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
			sre = /(^[ ]*|[ ]*$)/g,
			dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
			hre = /^0x[0-9a-f]+$/i,
			ore = /^0/,
			i = function(s) { return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s; },
			// convert all to strings strip whitespace
			x = i(a).replace(sre, '') || '',
			y = i(b).replace(sre, '') || '',
			// chunk/tokenize
			xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
			yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
			// numeric, hex or date detection
			xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
			yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
			oFxNcL, oFyNcL;
		// first try and sort Hex codes or Dates
		if (yD) {
			if ( xD < yD ) { return -1; }
			else if ( xD > yD ) { return 1; }
		}
		// natural sorting through split numeric strings and default strings
		for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
			// find floats not starting with '0', string or 0 if not defined (Clint Priest)
			oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
			oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
			// handle numeric vs string comparison - number < string - (Kyle Adams)
			if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
			// rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
			else if (typeof oFxNcL !== typeof oFyNcL) {
				oFxNcL += '';
				oFyNcL += '';
			}
			if (oFxNcL < oFyNcL) { return -1; }
			if (oFxNcL > oFyNcL) { return 1; }
		}
		return 0;
	};


/***/ },

/***/ 33:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (option) {
	  if (!option.url || !option.data) {
	    return Promise.reject('参数不完整，无法发起请求');
	  }

	  var param = {
	    method: option.type || 'get',
	    url: option.url,
	    responseType: option.dataType || 'json'
	  };

	  if (/^get$/gi.test(param.method)) {
	    param.params = option.data;
	  }
	  if (/^post$/gi.test(param.method)) {
	    param.data = option.data;
	  }

	  return (0, _axios2['default'])(param);
	};

	var _axios = __webpack_require__(72);

	var _axios2 = _interopRequireDefault(_axios);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/** 异步请求api */
	module.exports = exports['default'];

	/**
	 * 异步请求方法
	 *
	 * @param {any} option
	 * @param {string} [option.type=get] 请求方式: GET / POST
	 * @param {string} [option.dataType=json] 数据传递方式: json / 其他
	 * @param {string} option.url 请求地址
	 * @param {data} option.data 请求数据
	 */

/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	if (typeof window !== 'undefined') {
	  // 微信里面不要 shim console
	  if (!window.console && !process.env.WEIXIN_APP) {
	    window.console = {
	      log: function log() {},
	      info: function info() {},
	      warn: function warn() {},
	      error: function error() {}
	    };
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },

/***/ 45:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(1);

	util.fillPropertyWithDefault = function (obj, name, defaultValue) {
	    if (util.undef(obj[name])) {
	        obj[name] = defaultValue;
	        return true;
	    }
	    return false;
	};

/***/ },

/***/ 47:
/***/ function(module, exports) {

	/* (ignored) */

/***/ },

/***/ 55:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (_ref) {
	  var util = _ref.util;

	  notundef = util.notundef;
	  return PushConfig;
	};

	var notundef = void 0;

	function PushConfig(options) {
	  if (notundef(options.enable)) {
	    this.enable = options.enable ? 1 : 0;
	  }
	  if (notundef(options.needBadge)) {
	    this.needBadge = options.needBadge ? 1 : 0;
	  }
	  if (notundef(options.needPushNick)) {
	    this.needPushNick = options.needPushNick ? 1 : 0;
	  }
	  if (notundef(options.pushContent)) {
	    this.pushContent = '' + options.pushContent;
	  }
	  if (notundef(options.custom)) {
	    this.custom = '' + options.custom;
	  }
	  if (notundef(options.pushPayload)) {
	    this.pushPayload = '' + options.pushPayload;
	  }
	  if (notundef(options.sound)) {
	    this.sound = '' + options.sound;
	  }
	  if (notundef(options.webrtcEnable)) {
	    this.webrtcEnable = options.webrtcEnable ? 1 : 0;
	  }
	}

	module.exports = exports['default'];

/***/ },

/***/ 67:
/***/ function(module, exports) {

	'use strict';

	var element = {};

	/**
	 * 将HTML字符串转化为node节点
	 *
	 * @param  {String} html HTML字符串
	 * @return {Node}      节点
	 */
	element.html2node = function (html) {
	  var div = document.createElement('div');
	  div.innerHTML = html;
	  var children = [],
	      i,
	      l;
	  // ie8 不支持[].slice, 所以只能遍历了
	  if (div.children) {
	    for (i = 0, l = div.children.length; i < l; i++) {
	      children.push(div.children[i]);
	    }
	  } else {
	    for (i = 0, l = div.childNodes.length; i < l; i++) {
	      var child = div.childNodes[i];
	      if (child.nodeType === 1) {
	        children.push(child);
	      }
	    }
	  }
	  return children.length > 1 ? div : children[0];
	};

	/**
	 * jquery对象 转原生dom
	 *
	 * @param  {Node} node节点
	 * @return {Node} 原生node节点, 验证失败，返回null
	 */
	element.n2node = function (node) {
	  if (!node) return null;
	  if (/HTML.+Element/gi.test(node)) {
	    return node;
	  }
	  if (node[0] && /HTML.+Element/gi.test(node[0])) {
	    return node[0];
	  }
	  return null;
	};

	module.exports = element;

/***/ },

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/* axios v0.15.3 | (c) 2016 by Matt Zabriskie */
	!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.axios=t():e.axios=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function r(e){var t=new i(e),n=s(i.prototype.request,t);return o.extend(n,i.prototype,t),o.extend(n,t),n}var o=n(2),s=n(3),i=n(4),a=n(5),u=r(a);u.Axios=i,u.create=function(e){return r(o.merge(a,e))},u.Cancel=n(22),u.CancelToken=n(23),u.isCancel=n(19),u.all=function(e){return Promise.all(e)},u.spread=n(24),e.exports=u,e.exports.default=u},function(e,t,n){"use strict";function r(e){return"[object Array]"===C.call(e)}function o(e){return"[object ArrayBuffer]"===C.call(e)}function s(e){return"undefined"!=typeof FormData&&e instanceof FormData}function i(e){var t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function a(e){return"string"==typeof e}function u(e){return"number"==typeof e}function c(e){return"undefined"==typeof e}function f(e){return null!==e&&"object"==typeof e}function p(e){return"[object Date]"===C.call(e)}function d(e){return"[object File]"===C.call(e)}function l(e){return"[object Blob]"===C.call(e)}function h(e){return"[object Function]"===C.call(e)}function m(e){return f(e)&&h(e.pipe)}function y(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams}function w(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}function g(){return"undefined"!=typeof window&&"undefined"!=typeof document&&"function"==typeof document.createElement}function v(e,t){if(null!==e&&"undefined"!=typeof e)if("object"==typeof e||r(e)||(e=[e]),r(e))for(var n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.call(null,e[s],s,e)}function x(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=x(t[n],e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)v(arguments[n],e);return t}function b(e,t,n){return v(t,function(t,r){n&&"function"==typeof t?e[r]=E(t,n):e[r]=t}),e}var E=n(3),C=Object.prototype.toString;e.exports={isArray:r,isArrayBuffer:o,isFormData:s,isArrayBufferView:i,isString:a,isNumber:u,isObject:f,isUndefined:c,isDate:p,isFile:d,isBlob:l,isFunction:h,isStream:m,isURLSearchParams:y,isStandardBrowserEnv:g,forEach:v,merge:x,extend:b,trim:w}},function(e,t){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t,n){"use strict";function r(e){this.defaults=e,this.interceptors={request:new i,response:new i}}var o=n(5),s=n(2),i=n(16),a=n(17),u=n(20),c=n(21);r.prototype.request=function(e){"string"==typeof e&&(e=s.merge({url:arguments[0]},arguments[1])),e=s.merge(o,this.defaults,{method:"get"},e),e.baseURL&&!u(e.url)&&(e.url=c(e.baseURL,e.url));var t=[a,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},s.forEach(["delete","get","head"],function(e){r.prototype[e]=function(t,n){return this.request(s.merge(n||{},{method:e,url:t}))}}),s.forEach(["post","put","patch"],function(e){r.prototype[e]=function(t,n,r){return this.request(s.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=r},function(e,t,n){"use strict";function r(e,t){!s.isUndefined(e)&&s.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}function o(){var e;return"undefined"!=typeof XMLHttpRequest?e=n(7):"undefined"!=typeof process&&(e=n(7)),e}var s=n(2),i=n(6),a=/^\)\]\}',?\n/,u={"Content-Type":"application/x-www-form-urlencoded"},c={adapter:o(),transformRequest:[function(e,t){return i(t,"Content-Type"),s.isFormData(e)||s.isArrayBuffer(e)||s.isStream(e)||s.isFile(e)||s.isBlob(e)?e:s.isArrayBufferView(e)?e.buffer:s.isURLSearchParams(e)?(r(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):s.isObject(e)?(r(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e){e=e.replace(a,"");try{e=JSON.parse(e)}catch(e){}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};c.headers={common:{Accept:"application/json, text/plain, */*"}},s.forEach(["delete","get","head"],function(e){c.headers[e]={}}),s.forEach(["post","put","patch"],function(e){c.headers[e]=s.merge(u)}),e.exports=c},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(2),o=n(8),s=n(11),i=n(12),a=n(13),u=n(9),c="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||n(14);e.exports=function(e){return new Promise(function(t,f){var p=e.data,d=e.headers;r.isFormData(p)&&delete d["Content-Type"];var l=new XMLHttpRequest,h="onreadystatechange",m=!1;if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in l||a(e.url)||(l=new window.XDomainRequest,h="onload",m=!0,l.onprogress=function(){},l.ontimeout=function(){}),e.auth){var y=e.auth.username||"",w=e.auth.password||"";d.Authorization="Basic "+c(y+":"+w)}if(l.open(e.method.toUpperCase(),s(e.url,e.params,e.paramsSerializer),!0),l.timeout=e.timeout,l[h]=function(){if(l&&(4===l.readyState||m)&&(0!==l.status||l.responseURL&&0===l.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in l?i(l.getAllResponseHeaders()):null,r=e.responseType&&"text"!==e.responseType?l.response:l.responseText,s={data:r,status:1223===l.status?204:l.status,statusText:1223===l.status?"No Content":l.statusText,headers:n,config:e,request:l};o(t,f,s),l=null}},l.onerror=function(){f(u("Network Error",e)),l=null},l.ontimeout=function(){f(u("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED")),l=null},r.isStandardBrowserEnv()){var g=n(15),v=(e.withCredentials||a(e.url))&&e.xsrfCookieName?g.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in l&&r.forEach(d,function(e,t){"undefined"==typeof p&&"content-type"===t.toLowerCase()?delete d[t]:l.setRequestHeader(t,e)}),e.withCredentials&&(l.withCredentials=!0),e.responseType)try{l.responseType=e.responseType}catch(e){if("json"!==l.responseType)throw e}"function"==typeof e.onDownloadProgress&&l.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&l.upload&&l.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){l&&(l.abort(),f(e),l=null)}),void 0===p&&(p=null),l.send(p)})}},function(e,t,n){"use strict";var r=n(9);e.exports=function(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n)):e(n)}},function(e,t,n){"use strict";var r=n(10);e.exports=function(e,t,n,o){var s=new Error(e);return r(s,t,n,o)}},function(e,t){"use strict";e.exports=function(e,t,n,r){return e.config=t,n&&(e.code=n),e.response=r,e}},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var o=n(2);e.exports=function(e,t,n){if(!t)return e;var s;if(n)s=n(t);else if(o.isURLSearchParams(t))s=t.toString();else{var i=[];o.forEach(t,function(e,t){null!==e&&"undefined"!=typeof e&&(o.isArray(e)&&(t+="[]"),o.isArray(e)||(e=[e]),o.forEach(e,function(e){o.isDate(e)?e=e.toISOString():o.isObject(e)&&(e=JSON.stringify(e)),i.push(r(t)+"="+r(e))}))}),s=i.join("&")}return s&&(e+=(e.indexOf("?")===-1?"?":"&")+s),e}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e){var t,n,o,s={};return e?(r.forEach(e.split("\n"),function(e){o=e.indexOf(":"),t=r.trim(e.substr(0,o)).toLowerCase(),n=r.trim(e.substr(o+1)),t&&(s[t]=s[t]?s[t]+", "+n:n)}),s):s}},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(o.setAttribute("href",t),t=o.href),o.setAttribute("href",t),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");return t=e(window.location.href),function(n){var o=r.isString(n)?e(n):n;return o.protocol===t.protocol&&o.host===t.host}}():function(){return function(){return!0}}()},function(e,t){"use strict";function n(){this.message="String contains an invalid character"}function r(e){for(var t,r,s=String(e),i="",a=0,u=o;s.charAt(0|a)||(u="=",a%1);i+=u.charAt(63&t>>8-a%1*8)){if(r=s.charCodeAt(a+=.75),r>255)throw new n;t=t<<8|r}return i}var o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";n.prototype=new Error,n.prototype.code=5,n.prototype.name="InvalidCharacterError",e.exports=r},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){return{write:function(e,t,n,o,s,i){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(s)&&a.push("domain="+s),i===!0&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()},function(e,t,n){"use strict";function r(){this.handlers=[]}var o=n(2);r.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){o.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=r},function(e,t,n){"use strict";function r(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var o=n(2),s=n(18),i=n(19),a=n(5);e.exports=function(e){r(e),e.headers=e.headers||{},e.data=s(e.data,e.headers,e.transformRequest),e.headers=o.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),o.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]});var t=e.adapter||a.adapter;return t(e).then(function(t){return r(e),t.data=s(t.data,t.headers,e.transformResponse),t},function(t){return i(t)||(r(e),t&&t.response&&(t.response.data=s(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t){"use strict";e.exports=function(e,t){return e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,"")}},function(e,t){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,n){"use strict";function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new o(e),t(n.reason))})}var o=n(22);r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e,t=new r(function(t){e=t});return{token:t,cancel:e}},e.exports=r},function(e,t){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}}])});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },

/***/ 85:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _mapRtc$deviceTypeMap, _mapRtc$deviceTypeMap2, _frame, _frameRate;

	var util = __webpack_require__(17);
	/**
	 * 音视频通用配置参数
	 */
	var mapControl = {
	  /**
	   *  控制指令
	   *
	   *  - WhiteBoard.CONTROL_COMMAND_NOTIFY_AUDIO_ON 通知对方自己打开了音频
	   *  - WhiteBoard.CONTROL_COMMAND_NOTIFY_AUDIO_OFF 通知对方自己关闭了音频
	   *  - WhiteBoard.CONTROL_COMMAND_NOTIFY_VIDEO_ON 通知对方自己打开了视频
	   *  - WhiteBoard.CONTROL_COMMAND_NOTIFY_VIDEO_OFF 通知对方自己关闭了视频
	   *  - WhiteBoard.CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO 请求从音频切换到视频
	   *  - WhiteBoard.CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE 同意从音频切换到视频
	   *  - WhiteBoard.CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT 拒绝从音频切换到视频
	   *  - WhiteBoard.CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO 从视频切换到音频
	   *  - WhiteBoard.CONTROL_COMMAND_BUSY 占线
	   *  - WhiteBoard.CONTROL_COMMAND_SELF_CAMERA_INVALID 自己的摄像头不可用
	   *  - WhiteBoard.CONTROL_COMMAND_SELF_AUDIO_INVALID 自己的麦克风不可用
	   *  - WhiteBoard.CONTROL_COMMAND_SELF_ON_BACKGROUND 自己处于后台
	   *  - WhiteBoard.CONTROL_COMMAND_START_NOTIFY_RECEIVED 告诉发送方自己已经收到请求了（用于通知发送方开始播放提示音）
	   *  - WhiteBoard.CONTROL_COMMAND_NOTIFY_RECORD_START 告诉对方自己开始录制视频了
	   *  - WhiteBoard.CONTROL_COMMAND_NOTIFY_RECORD_STOP 告诉对方自己结束录制视频了
	   *
	   *  @memberOf WhiteBoard
	   *  @name WB_CONTROL_COMMAND_*
	   *  @readOnly
	   */
	  CONTROL_COMMAND_NOTIFY_AUDIO_ON: 1,
	  CONTROL_COMMAND_NOTIFY_AUDIO_OFF: 2,
	  CONTROL_COMMAND_NOTIFY_VIDEO_ON: 3,
	  CONTROL_COMMAND_NOTIFY_VIDEO_OFF: 4,
	  CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO: 5,
	  CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE: 6,
	  CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT: 7,
	  CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO: 8,
	  CONTROL_COMMAND_BUSY: 9,
	  CONTROL_COMMAND_SELF_CAMERA_INVALID: 10,
	  CONTROL_COMMAND_SELF_AUDIO_INVALID: 11,
	  CONTROL_COMMAND_SELF_ON_BACKGROUND: 12,
	  CONTROL_COMMAND_START_NOTIFY_RECEIVED: 13,
	  CONTROL_COMMAND_NOTIFY_RECORD_START: 14,
	  CONTROL_COMMAND_NOTIFY_RECORD_STOP: 15
	};
	var mapOnHangup = {
	  /**
	   *  通话挂断对方的退出方式
	   *
	   *  - WebRTC.HANGUP_TYPE_NORMAL 正常挂断
	   *  - WebRTC.HANGUP_TYPE_TIMEOUT 超时挂断
	   *
	   *  @memberOf WebRTC
	   *  @name HANGUP_*
	   *  @readOnly
	   */
	  HANGUP_TYPE_NORMAL: 0,
	  HANGUP_TYPE_TIMEOUT: -1
	};

	var mapRtc = {
	  /**
	   *  音视频通话类型
	   *
	   *  - WebRTC.NETCALL_TYPE_AUDIO 音频
	   *  - WebRTC.NETCALL_TYPE_VIDEO 视频
	   *
	   *  @memberOf WebRTC
	   *  @name NETCALL_TYPE_*
	   *  @readOnly
	   */
	  NETCALL_TYPE_AUDIO: 1,
	  NETCALL_TYPE_VIDEO: 2,

	  /**
	   *  设备类型
	   *
	   *  - WebRTC.DEVICE_TYPE_AUDIO_IN 麦克风
	   *  - WebRTC.DEVICE_TYPE_AUDIO_OUT_LOCAL 用于播放自己声音的设备
	   *  - WebRTC.DEVICE_TYPE_AUDIO_OUT_CHAT 播放对方声音的扬声器
	   *  - WebRTC.DEVICE_TYPE_VIDEO 摄像头
	   *  - WebRTC.DEVICE_TYPE_DESKTOP_SCREEN 屏幕共享：桌面(备注，目前仅支持firefox)
	   *  - WebRTC.DEVICE_TYPE_DESKTOP_WINDOW 屏幕共享：窗口(备注，目前仅支持firefox)
	   *
	   *  @memberOf WebRTC
	   *  @name DEVICE_TYPE_*
	   *  @readOnly
	   */
	  DEVICE_TYPE_AUDIO_IN: 0,
	  DEVICE_TYPE_AUDIO_OUT_LOCAL: 1,
	  DEVICE_TYPE_AUDIO_OUT_CHAT: 2,
	  DEVICE_TYPE_VIDEO: 3,
	  DEVICE_TYPE_DESKTOP_SCREEN: 4,
	  DEVICE_TYPE_DESKTOP_WINDOW: 5,

	  /**
	   *  视频通话分辨率
	   *
	   *  - WebRTC.CHAT_VIDEO_QUALITY_NORMAL 视频默认分辨率 480x320
	   *  - WebRTC.CHAT_VIDEO_QUALITY_LOW 视频低分辨率 176x144
	   *  - WebRTC.CHAT_VIDEO_QUALITY_MEDIUM 视频中分辨率 352x288
	   *  - WebRTC.CHAT_VIDEO_QUALITY_HIGH 视频高分辨率 480x320
	   *  - WebRTC.CHAT_VIDEO_QUALITY_480P 视频480p分辨率 640x480
	   *  - WebRTC.CHAT_VIDEO_QUALITY_540P 视频540p分辨率 960x540
	   *  - WebRTC.CHAT_VIDEO_QUALITY_720P 用于桌面分享级别的分辨率 1280x720 ，需要使用高清摄像头并指定对应的分辨率，或者自定义通道传输
	   *
	   *  @memberOf WebRTC
	   *  @name CHAT_VIDEO_QUALITY_*
	   *  @readOnly
	   */
	  CHAT_VIDEO_QUALITY_NORMAL: 0,
	  CHAT_VIDEO_QUALITY_LOW: 1,
	  CHAT_VIDEO_QUALITY_MEDIUM: 2,
	  CHAT_VIDEO_QUALITY_HIGH: 3,
	  CHAT_VIDEO_QUALITY_480P: 4,
	  CHAT_VIDEO_QUALITY_540P: 5,
	  CHAT_VIDEO_QUALITY_720P: 6,

	  /**
	   *  视频通话帧率，实际帧率因画面采集频率和机器性能限制可能达不到期望值
	   *
	   *  - WebRTC.CHAT_VIDEO_FRAME_RATE_NORMAL 视频通话帧率默认值 最大取每秒15帧
	   *  - WebRTC.CHAT_VIDEO_FRAME_RATE_5 视频通话帧率 最大取每秒5帧
	   *  - WebRTC.CHAT_VIDEO_FRAME_RATE_10 视频通话帧率 最大取每秒10帧
	   *  - WebRTC.CHAT_VIDEO_FRAME_RATE_15 视频通话帧率 最大取每秒15帧
	   *  - WebRTC.CHAT_VIDEO_FRAME_RATE_20 视频通话帧率 最大取每秒20帧
	   *  - WebRTC.CHAT_VIDEO_FRAME_RATE_25 视频通话帧率 最大取每秒25帧
	   *
	   *  @memberOf WebRTC
	   *  @name CHAT_VIDEO_FRAME_RATE_*
	   *  @readOnly
	   */
	  CHAT_VIDEO_FRAME_RATE_NORMAL: 0,
	  CHAT_VIDEO_FRAME_RATE_5: 1,
	  CHAT_VIDEO_FRAME_RATE_10: 2,
	  CHAT_VIDEO_FRAME_RATE_15: 3,
	  CHAT_VIDEO_FRAME_RATE_20: 4,
	  CHAT_VIDEO_FRAME_RATE_25: 5,

	  /**
	   *  直播推流布局
	   *
	   *  - WebRTC.LAYOUT_SPLITBOTTOMHORFLOATING 底部横排浮窗
	   *  - WebRTC.LAYOUT_SPLITTOPHORFLOATING 顶部横排浮窗
	   *  - WebRTC.LAYOUT_SPLITLATTICETILE 平铺
	   *  - WebRTC.LAYOUT_SPLITLATTICECUTTINGTILE 裁剪平铺
	   *  - WebRTC.LAYOUT_SPLITCUSTOM 自定义平铺(需要多传一个自定义布局的值)
	   *
	   *  @memberOf WebRTC
	   *  @name LAYOUT_*
	   *  @readOnly
	   */
	  LAYOUT_SPLITBOTTOMHORFLOATING: 0,
	  LAYOUT_SPLITTOPHORFLOATING: 1,
	  LAYOUT_SPLITLATTICETILE: 2,
	  LAYOUT_SPLITLATTICECUTTINGTILE: 3,
	  LAYOUT_SPLITCUSTOM: 4
	};

	var mapBB = {
	  /**
	   *  音视频通话类型
	   *
	   *  - WhiteBoard.WB_TYPE_TCP TCP通道白板
	   *  - WhiteBoard.WB_TYPE_UDP UDP通道白板
	   *
	   *  @memberOf WhiteBoard
	   *  @name WB_TYPE_*
	   *  @readOnly
	   */
	  WB_TYPE_TCP: 2,
	  WB_TYPE_UDP: 3,

	  /**
	   * 白板通话类型追加
	   *  - WhiteBoard.CALL_TYPE_NONE 不需要音视频
	   *  - WhiteBoard.CALL_TYPE_AUDIO 需要音频
	   */
	  CALL_TYPE_NONE: 0,
	  CALL_TYPE_AUDIO: 1,
	  // CALL_TYPE_VIDEO: 2,

	  /**
	   *  通话挂断对方的退出方式
	   *
	   *  - WhiteBoard.HANGUP_TYPE_NORMAL 正常挂断
	   *  - WhiteBoard.HANGUP_TYPE_TIMEOUT 超时挂断
	   *
	   *  @memberOf WhiteBoard
	   *  @name HANGUP_*
	   *  @readOnly
	   */
	  HANGUP_TYPE_NORMAL: 0,
	  HANGUP_TYPE_TIMEOUT: -1
	};

	mapRtc.deviceTypeMap = (_mapRtc$deviceTypeMap = {}, _mapRtc$deviceTypeMap[mapRtc.DEVICE_TYPE_AUDIO_IN] = 'audioIn', _mapRtc$deviceTypeMap[mapRtc.DEVICE_TYPE_AUDIO_OUT_CHAT] = 'audioOut', _mapRtc$deviceTypeMap[mapRtc.DEVICE_TYPE_VIDEO] = 'video', _mapRtc$deviceTypeMap);

	mapRtc.deviceTypeMap = (_mapRtc$deviceTypeMap2 = {}, _mapRtc$deviceTypeMap2[mapRtc.DEVICE_TYPE_AUDIO_IN] = 'audioIn', _mapRtc$deviceTypeMap2[mapRtc.DEVICE_TYPE_AUDIO_OUT_LOCAL] = 'audioOut', _mapRtc$deviceTypeMap2[mapRtc.DEVICE_TYPE_AUDIO_OUT_CHAT] = 'audioOut', _mapRtc$deviceTypeMap2[mapRtc.DEVICE_TYPE_VIDEO] = 'video', _mapRtc$deviceTypeMap2);

	mapRtc.videoMap = {
	  frame: (_frame = {}, _frame[mapRtc.CHAT_VIDEO_QUALITY_NORMAL] = '480x320', _frame[mapRtc.CHAT_VIDEO_QUALITY_LOW] = '176x144', _frame[mapRtc.CHAT_VIDEO_QUALITY_MEDIUM] = '352x288', _frame[mapRtc.CHAT_VIDEO_QUALITY_HIGH] = '480x320', _frame[mapRtc.CHAT_VIDEO_QUALITY_480P] = '640x480', _frame[mapRtc.CHAT_VIDEO_QUALITY_540P] = '960x540', _frame[mapRtc.CHAT_VIDEO_QUALITY_720P] = '1280x720', _frame),
	  frameRate: (_frameRate = {}, _frameRate[mapRtc.CHAT_VIDEO_FRAME_RATE_NORMAL] = 15, _frameRate[mapRtc.CHAT_VIDEO_FRAME_RATE_5] = 5, _frameRate[mapRtc.CHAT_VIDEO_FRAME_RATE_10] = 10, _frameRate[mapRtc.CHAT_VIDEO_FRAME_RATE_15] = 15, _frameRate[mapRtc.CHAT_VIDEO_FRAME_RATE_20] = 20, _frameRate[mapRtc.CHAT_VIDEO_FRAME_RATE_25] = 25, _frameRate)
	};

	var constantTool = {
	  // 根据参数获取宽高和帧率
	  getVideoSessionConfig: function getVideoSessionConfig() {
	    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var _option$quality = option.quality,
	        quality = _option$quality === undefined ? mapRtc.CHAT_VIDEO_QUALITY_NORMAL : _option$quality,
	        _option$frameRate = option.frameRate,
	        frameRate = _option$frameRate === undefined ? mapRtc.CHAT_VIDEO_FRAME_RATE_NORMAL : _option$frameRate;

	    var result = {};
	    var frame = mapRtc.videoMap.frame[quality];
	    result.frameRate = mapRtc.videoMap.frameRate[frameRate];
	    result.width = +frame.split('x')[0];
	    result.height = +frame.split('x')[1];
	    return result;
	  },
	  getDeviceTypeStr: function getDeviceTypeStr(type) {
	    return mapRtc.deviceTypeMap[type];
	  },
	  getDeviceTypeMap: function getDeviceTypeMap(type) {
	    return mapRtc.deviceTypeMap[type];
	  }
	};
	var constantRtc = util.merge(mapRtc, mapControl, mapOnHangup);
	var constantBB = util.merge(mapBB, mapControl, mapOnHangup);

	exports.constantTool = constantTool;
	exports.constantRtc = constantRtc;
	exports.constantBB = constantBB;

/***/ },

/***/ 145:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _monitor = __webpack_require__(175);

	Object.defineProperty(exports, 'monitor', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_monitor)['default'];
	  }
	});

	var _signal = __webpack_require__(176);

	Object.defineProperty(exports, 'signal', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_signal)['default'];
	  }
	});

	var _configMap = __webpack_require__(195);

	Object.defineProperty(exports, 'configMap', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_configMap)['default'];
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ },

/***/ 172:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  "pushConfig": {
	    "enable": 1,
	    "needBadge": 2,
	    "needPushNick": 3,
	    "pushContent": 4,
	    "custom": 5,
	    "pushPayload": 6,
	    "sound": 7,
	    "webrtcEnable": 10
	  },
	  "liveOption": {
	    "liveEnable": 1,
	    "webrtcEnable": 2
	  },
	  "turnInfoTag": {
	    "channelId": 0,
	    "tunnelServer": 1,
	    "proxyServer": 2,
	    "stunServer": 3,
	    "type": 4,
	    "dispatchServer": 5
	  },
	  "gateWay": {
	    "login": 1,
	    "loginAck": 2,
	    "join": 3,
	    "keep_alive": 4,
	    "keep_alive_ack": 5,
	    "keep_alive_node": 6,
	    "broadcast": 7,
	    "toUser": 8,
	    "logout": 9
	  }
	};

/***/ },

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _dataApi = __webpack_require__(197);

	var _dataApi2 = _interopRequireDefault(_dataApi);

	var _dataRtc = __webpack_require__(198);

	var _dataRtc2 = _interopRequireDefault(_dataRtc);

	var _dataStats = __webpack_require__(199);

	var _dataStats2 = _interopRequireDefault(_dataStats);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// Monitor.init = function (appkey) {
	//   this.dataApi = new DataApi(appkey)
	//   this.dataRtc = neStats(appkey)
	// }

	// export default Monitor
	exports['default'] = {
	  DataApi: function DataApi(appkey) {
	    return new _dataApi2['default'](appkey);
	  },
	  DataRtc: function DataRtc(appkey) {
	    return new _dataRtc2['default'](appkey);
	  },
	  DataStats: function DataStats(appkey) {
	    return new _dataStats2['default'](appkey);
	  }
	}; /**
	    * SDK数据监听处理类功能模块
	    * created by hzzouhuan
	    * 1. 数据上报(v3.4.0)
	    * 2. 接口调用上报(v3.5.0)
	    *
	    * 调用方式:
	    * import sdkData from '../monitor'
	    *
	    * rtc数据上报:
	    * 1. sdkData.dataRtc.startInfo(option) // 开始上报的准备工作，每次通讯开始，需要传入与会者, sdp等协议信息供基准分析使用
	    * 2. sdkData.dataRtc.stopInfo() //停止上报
	    * 3. sdkData.dataRtc.updateInfo(data) // 推送上报内容
	    * 4. sdkData.dataRtc.updateInfoOnce(data) // 上报一次的数据，不开定时器
	    * 5. sdkData.dataRtc.updateLocalVolumn(volumn) // 更新本地音频音量
	    * -- 详细参数请参照对应脚本说明
	    *
	    * api数据上报:
	    * -- 详细参数请参照对应脚本说明
	    *
	    */

	module.exports = exports['default'];

/***/ },

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _modules = __webpack_require__(145);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * 通信协议
	 * 连接信令服务器的各种操作
	 * 目前支持 webrtc / 白板
	 * 断网重连逻辑: 3次，间隔5s
	 */

	var EventEmitter = __webpack_require__(8);
	/** 浏览器平台检测插件 */
	var platform = __webpack_require__(9);

	var Promise = __webpack_require__(2).Promise;

	var util = __webpack_require__(17);


	var serializeWb = __webpack_require__(172);
	// const unserializeWb = require('protocolMap/unserializeMapWhiteBoard')

	/**
	 * {object} option 配置参数对象
	 * {bool} option.autoReconnect 是否自动重连
	 */

	var Signal = function (_EventEmitter) {
	  _inherits(Signal, _EventEmitter);

	  function Signal() {
	    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Signal);

	    // 合并参数
	    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

	    util.merge(_this.info, option);
	    _this.init();
	    _this.logger = option.logger || window.console;
	    _this.autoReconnect = option.autoReconnect || true;
	    // 是否已经销毁
	    _this.isDestroy = false;
	    // 重连次数
	    _this.reConnectCount = 0;
	    // 重连的wss地址
	    _this.wssUrl = null;
	    return _this;
	  }

	  return Signal;
	}(EventEmitter);

	var fn = Signal.prototype;

	fn.init = function () {
	  this.reset();
	};

	fn.reset = function () {
	  this.imInfo = {};
	};
	/**
	 * 开启信令连接
	 * @param {obj} option 配置项
	 * @param {string} option.url 服务器信令链接地址, 如果传入的地址为空，向上抛错
	 * @param {string} option.uid 当前登录uid
	 * @param {string} option.cid 当前会话cid
	 */
	fn.connect = function () {
	  var _this2 = this;

	  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var _option$url = option.url,
	      url = _option$url === undefined ? this.wssUrl : _option$url,
	      imInfo = option.imInfo;

	  this.imInfo = imInfo || this.imInfo;
	  // 暂时写死
	  // url = 'webrtcgatewaytest02.netease.im'
	  if (!url) return Promise.reject('信令地址缺失');
	  return new Promise(function (resolve, reject) {
	    _this2.url = url;
	    var ws = void 0;
	    try {
	      (function () {
	        ws = _this2.ws = new WebSocket('wss://' + url);
	        var that = _this2;
	        ws.onopen = function (event) {
	          _this2.wssUrl = url;
	          // 事件注册
	          that.initSignal();
	          that.signalConnected = true;
	          that.emit('signalConnected');
	          resolve(that);
	          // 开启心跳
	          _this2.heartbeat();
	        };
	        ws.onclose = ws.onerror = function (event) {
	          that.signalConnected = false;
	          reject(event);
	        };
	      })();
	    } catch (e) {
	      _this2.logger.error('信令连接建立失败', e);
	      reject(e);
	    }
	  });
	};

	/** websocket连接成功后的通信机制 */
	fn.initSignal = function () {
	  var _this3 = this;

	  var ws = this.ws;
	  var send = ws.send;
	  // 包装send方法
	  ws.send = function (data) {
	    send.call(this, JSON.stringify(data));
	  };
	  ws.onmessage = function (wsMessage) {
	    // this.logger.log('socket receive:', wsMessage.data)
	    var message = JSON.parse(wsMessage.data || null);
	    if (!message) return;
	    /** 心跳机制的检测 */
	    if (_this3.isHeartBeating && (message.type === 'keep_alive_ack' || message.type === serializeWb.gateWay['keep_alive_ack'])) {
	      _this3.onHeartBeat(message);
	      return;
	    }
	    _this3.emit('message', message);
	  };
	  ws.onclose = function (event) {
	    _this3.signalConnected = false;
	    // this.logger.log('socket Closed')
	    // 外抛心跳超时
	    _this3.emit('signalTimeout', event);
	  };
	  ws.onerror = function (err) {
	    _this3.signalConnected = false;
	    // this.logger.log('socket error', err)
	    _this3.emit('signalError', err);
	  };
	};

	/** 发起websocket连接 */
	fn.send = function (data) {
	  var _this4 = this;

	  // 打印心跳日志
	  // this.logger.log('socket send:', data)
	  if (data.type !== 'keep_alive') {
	    // this.logger.log('socket send:', data)
	    // this.logger.log('send signal cmd', data)
	  }
	  if (this.ws && this.signalConnected && this.ws.readyState === this.ws.OPEN) {
	    data.browser = {};
	    data.browser.name = platform.name;
	    data.browser.version = platform.version;
	    this.ws.send(data);
	  } else {
	    // socket连接中或者重新连接中
	    this.once('signalConnected', function () {
	      _this4.send(data);
	    });
	  }
	};

	/**
	 * 新增心跳机制，实时检测socket连接状态
	 * 注意！心跳不要一连接上就发，一定要登录成功，有回包之后才开始发送心跳
	 * @param {Object} data 心跳包数据
	 * @param {String} data.uid uid
	 * @param {String} data.cid cid
	 */
	fn.heartbeat = function () {
	  this.socketData = this.socketData || {
	    uid: this.imInfo.uid,
	    cid: this.imInfo.cid
	  };
	  // this.logger.log('socket connect success, start heartbeat')
	  // if (this.isHeartBeating) return
	  this.heartBeatList = [];
	  this.bindHearBeat(5);

	  // 测试心跳服务包, 仅用于开发debug
	  // this.heartBeatCount = 1
	  // this.heartBeatTimer = setInterval(() => {
	  //   // this.heartBeatCount++
	  //   this.logger.log(this.heartBeatCount++)
	  // }, 1000)
	};

	/** 心跳机制的接收检测 */
	fn.onHeartBeat = function (data) {
	  // this.logger.log(data)
	  this.heartBeatList.shift();
	  this.bindHearBeat(5);
	};

	/** 心跳处理 */
	fn.heartBeatHandler = function () {
	  var data = this.socketData;
	  var heartBeatList = this.heartBeatList;
	  if (!heartBeatList) return;
	  var current = Date.now();
	  var timestamps = current;
	  // 白板的时间戳只需要精确到秒
	  if (_modules.configMap.CURRENT.SDK_TYPE === _modules.configMap.SDK_TYPE.WHITEBOARD) {
	    timestamps = +current.toString().slice(0, -3);
	  }
	  if (heartBeatList.constructor === Array && heartBeatList.length === 0) {
	    heartBeatList.push(current);
	    var param = this.getContentData({
	      type: 'keep_alive',
	      uid: _modules.configMap.CURRENT.SDK_TYPE === _modules.configMap.SDK_TYPE.WHITEBOARD ? +data.uid : data.uid + '',
	      cid: _modules.configMap.CURRENT.SDK_TYPE === _modules.configMap.SDK_TYPE.WHITEBOARD ? +data.cid : data.cid + ''
	    }, timestamps);
	    this.send(param);
	    this.bindHearBeat(5);
	    return;
	  }

	  var now = Date.now() - heartBeatList[0];
	  if (now > 30 * 1000) {
	    this.logger.error('socket error: heartbeat timeout');
	    // 外抛心跳超时
	    this.emit('signalTimeout');
	  } else if (now > 2 * 1000 && now < 30 * 1000) {
	    this.logger.warn('socket error: no response, keep heartbeat');
	    heartBeatList.push(current);
	    var _param = this.getContentData({
	      type: 'keep_alive',
	      uid: data.uid,
	      cid: data.cid
	    }, timestamps);
	    this.send(_param);
	    this.bindHearBeat(2);
	  }
	};

	// 根据平台生成不一样的包内容
	fn.getContentData = function () {
	  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var timestamps = arguments[1];

	  // 白板协议的type需要转成数字
	  if (_modules.configMap.CURRENT.SDK_TYPE === _modules.configMap.SDK_TYPE.WHITEBOARD) {
	    data.version = 31;
	    data.type = serializeWb.gateWay[data.type];
	    data.content = {
	      params: {
	        timestamp: +timestamps
	      }
	    };
	  } else {
	    data.params = {
	      content: {
	        timestamp: timestamps + ''
	      }
	    };
	  }
	  return data;
	};

	/**
	 * 绑定心跳间隔时间
	 * second: 秒
	 */
	fn.bindHearBeat = function (second) {
	  if (this.isHeartBeating) clearTimeout(this.isHeartBeating);
	  this.isHeartBeating = setTimeout(this.heartBeatHandler.bind(this), second * 1000);
	};

	/** 停止心跳 */
	fn.stopHeartBeat = function () {
	  if (this.isHeartBeating) {
	    clearTimeout(this.isHeartBeating);
	    clearInterval(this.heartBeatTimer);
	    this.isHeartBeating = null;
	    this.heartBeatTimer = null;
	    this.heartBeatList = null;
	    this.heartBeatCount = 0;
	  }
	};

	/** 通知网关自己已经登出 */
	fn.logout = function () {
	  var data = this.socketData;
	  var timestamps = Date.now().toString();
	  var param = this.getContentData({
	    type: 'logout',
	    uid: data.uid,
	    cid: data.cid
	  }, timestamps);
	  this.send(param);
	};

	/** 销毁 */
	fn.destroy = function () {
	  this.logger.log('signal close -> signal.js');
	  this.stopHeartBeat();
	  this.isDestroy = true;
	  // this.logout()
	  if (this.ws) {
	    this.ws.onopen = null;
	    this.ws.onmessage = null;
	    this.ws.onerror = null;
	    this.ws.onclose = null;
	    if (this.ws.readyState === WebSocket.OPEN) {
	      this.ws.close();
	    }
	    this.ws = null;
	  }
	};

	exports['default'] = Signal;
	module.exports = exports['default'];

/***/ },

/***/ 179:
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  "pushConfig": {
	    "1": "enable",
	    "2": "needBadge",
	    "3": "needPushNick",
	    "4": "pushContent",
	    "5": "custom",
	    "6": "pushPayload",
	    "7": "sound",
	    "10": "webrtcEnable"
	  },
	  "liveOption": {
	    "1": "liveEnable",
	    "2": "webrtcEnable"
	  },
	  "turnInfoTag": {
	    "0": "channelId",
	    "1": "tunnelServer",
	    "2": "proxyServer",
	    "3": "stunServer",
	    "4": "type",
	    "5": "dispatchServer"
	  },
	  "gateWay": {
	    "1": "login",
	    "2": "loginAck",
	    "3": "join",
	    "4": "keep_alive",
	    "5": "keep_alive_ack",
	    "6": "keep_alive_node",
	    "7": "broadcast",
	    "8": "toUser",
	    "9": "logout"
	  }
	};

/***/ },

/***/ 190:
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// https://github.com/developit/mitt
	// The MIT License (MIT)
	// Copyright (c) 2017 Jason Miller
	// Modified by ukabuer <ukabuer@live.com> at 2017.11.3

	var _class = function () {
	  function _class(all) {
	    _classCallCheck(this, _class);

	    this.all = all || Object.create(null);
	  }

	  _class.prototype.on = function on(type, handler) {
	    (this.all[type] || (this.all[type] = [])).push(handler);
	  };

	  _class.prototype.off = function off(type, handler) {
	    if (this.all[type]) {
	      this.all[type].splice(this.all[type].indexOf(handler) >>> 0, 1);
	    }
	  };

	  _class.prototype.emit = function emit(type, evt) {
	    (this.all[type] || []).map(function (handler) {
	      handler(evt);
	    });(this.all['*'] || []).map(function (handler) {
	      handler(type, evt);
	    });
	  };

	  return _class;
	}();

	exports['default'] = _class;
	module.exports = exports['default'];

/***/ },

/***/ 191:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(190);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Draw = function (_EventEmitter) {
	  _inherits(Draw, _EventEmitter);

	  /**
	   * 创建一个展示用的Canvas以及用户实际操作的Canvas
	   * TODO 把一些私有方法移出class
	   * @param {HTMLElment} container 容器节点
	   * @param {{UID: string, height: number, width: number, zIndex: number}} opt 自定义配置，可选
	   * @constructor
	   */
	  function Draw(container) {
	    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Draw);

	    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

	    if (_this.displayCtx) _this.destory(); // 如果先前的画板没有销毁
	    _this.users = {};
	    _this.UID = opt.UID || 0; // 本地用户的UID
	    _this.shapes = []; // 所有用户绘制内容的列表
	    _this.visible = 0; // 可见绘制内容的个数，撤销后并没有把绘制内容从数组移除而是设置不可见
	    if (!(container instanceof window.HTMLElement)) throw new Error('画板容器不是HTMLElement实例');
	    _this.container = container;

	    var displayCanvas = document.createElement('canvas');
	    _this.displayCtx = displayCanvas.getContext('2d');
	    container.style.position = 'relative';
	    displayCanvas.style.position = 'relative';
	    displayCanvas.style.boxSizing = 'content-box';
	    displayCanvas.style.zIndex = opt.zIndex || 0;
	    displayCanvas.style.cursor = 'crosshair';

	    _this.width = opt.width || 800;
	    _this.height = opt.height || 500;
	    if (typeof _this.width !== 'number') throw new Error('画板宽度不是数字');
	    if (typeof _this.height !== 'number') throw new Error('画板高度不是数字');
	    _this.displayCtx.canvas.width = _this.width;
	    _this.displayCtx.canvas.height = _this.height;
	    _this.displayCtx.lineCap = _this.displayCtx.lineJoin = 'round';

	    var user = _this.addUser(_this.UID);

	    container.appendChild(displayCanvas);
	    container.appendChild(user.ctx.canvas);

	    _this.dispatcher = _this.dispatcher.bind(_this);
	    _this.switchEventListener(true); // 绑定事件
	    return _this;
	  }

	  /**
	   * 获取或者设置操作模式
	   * @param {string} value 'free', 'erase', 'fill', 'select'
	   * @param {string} UID 进行操作的用户的ID
	   * @public
	   */


	  Draw.prototype.mode = function mode(value) {
	    var UID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.UID;

	    var user = this.users[UID];
	    if (!value) return user.mode;
	    if (typeof value !== 'string') {
	      throw new Error('操作模式不是字符串');
	    }
	    var v = value.split(':');
	    user.mode = v[0];
	    user.type = v[1] || 'free';
	    this.emit('action', { UID: UID, op: 'mode', value: value });
	  };

	  /**
	   * 获取或者设置笔&橡皮擦的大小
	   * @param {number} value 笔&橡皮擦的大小
	   * @param {string} UID 进行操作的用户的ID
	   * @public
	   */


	  Draw.prototype.size = function size(value) {
	    var UID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.UID;

	    var user = this.users[UID];
	    if (!value) return user.size;
	    if (typeof value !== 'number') {
	      throw new Error('Type Error: size');
	    }
	    user.size = value;
	    this.emit('action', { UID: UID, op: 'size', value: value });
	  };

	  /**
	   * 获取或者设置笔的颜色
	   * @param {number} value 笔的颜色
	   * @param {string} UID 进行操作的用户的ID
	   * @public
	   */


	  Draw.prototype.color = function color(value) {
	    var UID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.UID;

	    var user = this.users[UID];
	    if (!value) return user.color;
	    user.color = value;
	    this.emit('action', { UID: UID, op: 'color', value: value });
	  };

	  /**
	   * 增加或移除事件监听
	   * @param {Boolean} add 是否增加事件监听
	   * @private
	   */


	  Draw.prototype.switchEventListener = function switchEventListener(add) {
	    var op = add ? 'add' : 'remove';
	    var canvas = [this.users[this.UID].ctx.canvas, this.displayCtx.canvas];
	    var d = this.dispatcher;
	    canvas.forEach(function (c) {
	      c[op + 'EventListener']('mousedown', d);
	      c[op + 'EventListener']('mousemove', d);
	      c[op + 'EventListener']('touchmove', d);
	      c[op + 'EventListener']('touchstart', d);
	    });
	    document[op + 'EventListener']('mouseup', d);
	    document[op + 'EventListener']('touchend', d);
	  };

	  /**
	   * 鼠标按下&开始触摸时的处理函数
	   * @param {Point} offset 当前位置坐标
	   * @param {string} UID 进行操作的用户的ID
	   */


	  Draw.prototype.mousedown = function mousedown(offset) {
	    var UID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.UID;

	    var shape = void 0;
	    var user = this.users[UID];
	    var start = user.start;
	    var oldMid = user.oldMid;
	    var end = user.end;
	    user.isMouseDown = true;
	    var workCtx = user.ctx;
	    if (user.type === 'free') {
	      workCtx.canvas.style.visibility = 'hidden';
	    } else {
	      workCtx.canvas.style.visibility = 'visible';
	    }
	    applyState(this.displayCtx, user);
	    switch (user.mode) {
	      case 'draw':
	      case 'erase':
	        shape = new Shape(user.mode, user.type, user.size, user.color, new Point(offset.x, offset.y));
	        user.activeShape = shape;
	        this.shapes.push(shape);
	        user.shapes.push(this.shapes.length - 1);
	        switch (user.type) {
	          case 'free':
	            // 用三个点画二次曲线，使笔迹光滑，降低锯齿感
	            Point.set(start, offset.x, offset.y);
	            Point.set(oldMid, start.x, start.y);
	            Point.set(end, start.x, start.y);
	            break;
	          default:
	            Point.set(start, offset.x, offset.y);
	            break;
	        }
	        break;
	      case 'fill':
	        shape = new Shape(user.mode, user.type, user.size, user.color, new Point(offset.x, offset.y));
	        this.shapes.push(shape);
	        user.shapes.push(this.shapes.length - 1);
	        fill(this.displayCtx, offset);
	        break;
	      case 'select':
	        break;
	    }
	    if (user.mode !== 'select') {
	      // linear undo model
	      user.available = ++user.visible;
	      this.visible++;
	    }
	    this.emit('action', { UID: UID, op: 'mousedown', value: offset });
	  };

	  /**
	   * 鼠标移动&触摸移动时的处理函数
	   * @param {Point} offset 当前位置坐标
	   * @param {string} UID 进行操作的用户的ID
	   */


	  Draw.prototype.mousemove = function mousemove(offset) {
	    var UID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.UID;

	    var user = this.users[UID];
	    if (!user.isMouseDown) return;

	    var start = user.start;
	    var oldMid = user.oldMid;
	    var end = user.end;
	    var workCtx = user.ctx;
	    var displayCtx = this.displayCtx;
	    switch (user.mode) {
	      case 'draw':
	      case 'erase':
	        applyState(displayCtx, user);
	        switch (user.type) {
	          case 'free':
	            var mid = new Point((end.x + offset.x) / 2, (end.y + offset.y) / 2);
	            free(workCtx, oldMid, end, mid);
	            free(displayCtx, oldMid, end, mid);
	            Point.set(oldMid, mid.x, mid.y);
	            Point.set(end, offset.x, offset.y);
	            break;
	          case 'line':
	            Point.set(end, offset.x, offset.y);
	            workCtx.clearRect(0, 0, workCtx.canvas.width, workCtx.canvas.height);
	            line(workCtx, start, end);
	            break;
	          case 'rect':
	            Point.set(end, offset.x, offset.y);
	            workCtx.clearRect(0, 0, workCtx.canvas.width, workCtx.canvas.height);
	            rect(workCtx, start, end.x - start.x, end.y - start.y);
	            break;
	          case 'roundRect':
	            Point.set(end, offset.x, offset.y);
	            workCtx.clearRect(0, 0, workCtx.canvas.width, workCtx.canvas.height);
	            roundRect(workCtx, start, end.x - start.x, end.y - start.y, 30);
	            break;
	          case 'circle':
	            Point.set(end, offset.x, offset.y);
	            workCtx.clearRect(0, 0, workCtx.canvas.width, workCtx.canvas.height);
	            circle(workCtx, start, Math.abs(offset.x - start.x));
	            break;
	        }
	        var corner = user.activeShape.corner;
	        // 需要在移动时找到绘图范围的最左上角和右下角以确定绘图范围
	        if (user.type === 'circle') {
	          var radius = Math.abs(offset.x - start.x);
	          corner[0].x = start.x - radius;
	          corner[0].y = start.y - radius;
	          corner[1].x = start.x + radius;
	          corner[1].y = start.y + radius;
	        } else {
	          corner[0].x = Math.min(end.x, corner[0].x);
	          corner[0].y = Math.min(end.y, corner[0].y);
	          corner[1].x = Math.max(end.x, corner[1].x);
	          corner[1].y = Math.max(end.y, corner[1].y);
	        }
	        break;
	      case 'fill':
	        break;
	      case 'select':
	        break;
	    }
	    this.emit('action', { UID: UID, op: 'mousemove', value: offset });
	  };

	  /**
	   * 鼠标松开&触摸结束时的处理函数
	   * @param {Point} offset 当前位置坐标
	   * @param {string} UID 进行操作的用户的ID
	   * @private
	   */


	  Draw.prototype.mouseup = function mouseup(offset) {
	    var UID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.UID;

	    var user = this.users[UID];
	    if (!user.isMouseDown) return;
	    user.isMouseDown = false;
	    var start = user.start;
	    var oldMid = user.oldMid;
	    var end = user.end;
	    var workCtx = user.ctx;
	    var displayCtx = this.displayCtx;
	    switch (user.mode) {
	      case 'draw':
	      case 'erase':
	        applyState(displayCtx, user);
	        switch (user.type) {
	          case 'free':
	            var mid = new Point((end.x + offset.x) / 2, (end.y + offset.y) / 2);
	            free(workCtx, oldMid, end, mid);
	            free(displayCtx, oldMid, end, mid);
	            Point.set(oldMid, mid.x, mid.y);
	            Point.set(end, offset.x, offset.y);
	            break;
	          case 'line':
	            Point.set(end, offset.x, offset.y);
	            line(workCtx, start, end);
	            break;
	          case 'rect':
	            Point.set(end, offset.x, offset.y);
	            rect(workCtx, start, end.x - start.x, end.y - start.y);
	            break;
	          case 'roundRect':
	            Point.set(end, offset.x, offset.y);
	            roundRect(workCtx, start, end.x - start.x, end.y - start.y, 30);
	            break;
	          case 'circle':
	            Point.set(end, offset.x, offset.y);
	            circle(workCtx, start, Math.abs(offset.x - start.x));
	            break;
	        }
	        var corner = user.activeShape.corner;
	        var ctx = user.activeShape.ctx;
	        corner[0].x -= this.size();
	        corner[0].y -= this.size();
	        corner[1].x += this.size();
	        corner[1].y += this.size();
	        ctx.canvas.width = Math.ceil(corner[1].x - corner[0].x);
	        ctx.canvas.height = Math.ceil(corner[1].y - corner[0].y);
	        ctx.lineCap = ctx.lineJoin = user.ctx.lineCap;
	        ctx.lineWidth = user.ctx.lineWidth;
	        var imgData = workCtx.getImageData(corner[0].x, corner[0].y, ctx.canvas.width, ctx.canvas.height);
	        ctx.putImageData(imgData, 0, 0);
	        // document.body.appendChild(ctx.canvas)
	        if (user.type !== 'free') displayCtx.drawImage(ctx.canvas, corner[0].x, corner[0].y);
	        workCtx.clearRect(0, 0, this.displayCtx.canvas.width, this.displayCtx.canvas.height);
	        break;
	      case 'fill':
	        break;
	      case 'select':
	        break;
	    }
	    this.emit('action', { UID: UID, op: 'mouseup', value: offset });
	  };

	  /**
	   * 撤销绘制，本地撤销模型，即只能撤销自己的绘制
	   * @param {string} UID 进行操作的用户的ID
	   * @public
	   */


	  Draw.prototype.undo = function undo() {
	    var UID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.UID;

	    var user = this.users[UID];
	    if (user.visible === 0) return;

	    var discard = user.shapes.pop();
	    this.shapes[discard].visible = false;
	    user.recycle.push(discard);
	    --user.visible;
	    this._clear();
	    render(this.displayCtx, this.shapes, --this.visible);
	    this.emit('action', { UID: UID, op: 'undo', value: UID });
	  };

	  /**
	   * 撤销绘制，本地撤销模型，即只能撤销自己的绘制
	   * @param {string} UID 进行操作的用户的ID
	   * @public
	   */


	  Draw.prototype.redo = function redo() {
	    var UID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.UID;

	    var user = this.users[UID];
	    if (user.visible === user.available) return;

	    var restore = user.recycle.pop();
	    this.shapes[restore].visible = true;
	    user.shapes.push(restore);
	    ++user.visible;
	    this._clear();
	    render(this.displayCtx, this.shapes, ++this.visible);
	    this.emit('action', { UID: UID, op: 'redo', value: UID });
	  };

	  /**
	   * 清除画板或者清除某个用户的绘制
	   * @param {string} target 需要清除操作的用户ID
	   * @param {string} UID 进行操作的用户的ID
	   * @public
	   */


	  Draw.prototype.clear = function clear(target) {
	    var _this2 = this;

	    var UID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.UID;

	    this._clear();
	    if (target && this.users[target]) {
	      var user = this.users[target];
	      user.isMouseDown = false;
	      user.shapes.forEach(function (shape) {
	        if (!_this2.shapes[shape]) return;
	        _this2.shapes[shape].visible = false;
	        _this2.visible--;
	      });
	      user.shapes = [];
	      user.recycle = [];
	      user.available = 0;
	      user.visible = 0;
	      this._clear();
	      render(this.displayCtx, this.shapes, this.visible);
	      return;
	    }

	    this.shapes = [];
	    this.visible = 0;
	    for (var _UID in this.users) {
	      var _user = this.users[_UID];
	      _user.shapes = [];
	      _user.recycle = [];
	      _user.available = 0;
	      _user.visible = 0;
	      _user.isMouseDown = false;
	    }
	    this.emit('action', { UID: UID, op: 'clear', value: null });
	  };

	  /**
	   * 清除画板，包括展示用Canvas和用户自己的Canavs
	   * @private
	   */


	  Draw.prototype._clear = function _clear() {
	    this.displayCtx.clearRect(0, 0, this.width, this.height);
	    for (var _UID in this.users) {
	      var user = this.users[_UID];
	      user.ctx.clearRect(0, 0, this.width, this.height);
	    }
	  };

	  /**
	   * 收到指令后进行对应操作
	   * @param {string} UID 用户ID
	   * @param {string} op 操作
	   * @param {any} [value] 操作值
	   * @public
	   */


	  Draw.prototype.act = function act(_ref) {
	    var UID = _ref.UID,
	        op = _ref.op,
	        value = _ref.value;

	    var user = this.users[UID];
	    if (!user) this.users[UID] = this.addUser(UID);
	    this[op](value, UID);
	  };

	  /**
	   * 重新设置画布大小，等比例
	   * @param {number} width 画布宽度
	   * @public
	   */


	  Draw.prototype.resize = function resize(width) {
	    width = parseInt(width);
	    if (isNaN(width) || width <= 0) throw new Error('白板宽度应是大于0的数字');
	    var scale = width / this.width;
	    var height = this.height * scale;

	    resizeCanvas(this.displayCtx, scale);
	    for (var UID in this.users) {
	      resizeCanvas(this.users[UID].ctx, scale);
	    }this.shapes.forEach(function (shape) {
	      resizeCanvas(shape.ctx, scale);
	      shape.corner[0].x *= scale;
	      shape.corner[0].y *= scale;
	      shape.corner[1].x *= scale;
	      shape.corner[1].y *= scale;
	    });

	    this.width = width;
	    this.height = height;
	  };

	  /**
	   * 增加一个用户并初始化其canvas，已存在则直接返回
	   * @param {String | Number} UID 用户ID
	   * @return {User} 用户
	   */


	  Draw.prototype.addUser = function addUser(UID) {
	    if (this.users[UID]) return this.users[UID];
	    var user = new User(UID);
	    var canvas = user.ctx.canvas;
	    var displayCanvas = this.displayCtx.canvas;
	    canvas.style.position = 'absolute';
	    canvas.style.boxSizing = 'content-box';
	    canvas.style.top = displayCanvas.clientTop + 'px';
	    canvas.style.left = displayCanvas.clientLeft + 'px';
	    canvas.style.zIndex = displayCanvas.style.zIndex + 1;
	    canvas.style.cursor = 'crosshair';
	    canvas.style.width = this.width + 'px';
	    canvas.style.height = this.height + 'px';
	    canvas.width = this.width;
	    canvas.height = this.height;
	    user.ctx.lineCap = user.ctx.lineJoin = 'round';
	    this.users[UID] = user;
	    return this.users[UID];
	  };

	  /**
	   * 销毁白板
	   * 实际上只移除了事件监听，并将内存占用较大的对象清空，等待垃圾回收
	   * @private
	   */


	  Draw.prototype.destory = function destory() {
	    if (this.users[this.UID]) {
	      this.switchEventListener(false);
	      this.container.removeChild(this.users[this.UID].ctx.canvas);
	    }
	    this.container.removeChild(this.displayCtx.canvas);
	    this.displayCtx = null;
	    this.shapes = [];
	    this.visible = 0;
	  };

	  /**
	   * 对事件数据进行预处理，再调用对应的处理函数
	   * @param {Event} e 鼠标或触摸屏事件
	   * @private
	   */


	  Draw.prototype.dispatcher = function dispatcher(e) {
	    e.preventDefault();
	    e = e.originalEvent ? e.originalEvent : e;
	    var rect = this.displayCtx.canvas.getBoundingClientRect();
	    var x = void 0,
	        y = void 0;
	    if (e.touches && e.touches.length === 1) {
	      x = e.touches[0].clientX;
	      y = e.touches[0].clientY;
	    } else if (e.changedTouches && e.changedTouches.length === 1) {
	      x = e.changedTouches[0].clientX;
	      y = e.changedTouches[0].clientY;
	    } else {
	      x = e.clientX;
	      y = e.clientY;
	    }
	    if (!x && x !== 0) x = 0;
	    if (!y && y !== 0) y = 0;
	    var offset = new Point(x - rect.left, y - rect.top);
	    var type = e.type;
	    if (type === 'touchstart') type = 'mousedown';
	    if (type === 'touchmove') type = 'mousemove';
	    if (type === 'touchend') type = 'mouseup';
	    this[type](offset);
	  };

	  return Draw;
	}(_emitter2['default']);

	exports['default'] = Draw;

	var Point = function () {
	  function Point(x, y) {
	    _classCallCheck(this, Point);

	    this.x = x || 0;
	    this.y = y || 0;
	  }

	  Point.prototype.copy = function copy() {
	    return new Point(this.x, this.y);
	  };

	  Point.set = function set(point, x, y) {
	    point.x = x;
	    point.y = y;
	  };

	  return Point;
	}();

	/**
	 * 绘制内容
	 */


	var Shape = function Shape(mode, type, size, color, start) {
	  _classCallCheck(this, Shape);

	  this.visible = true;
	  // 在画完之后把绘制轨迹截取为图片保存在Canvas中
	  this.ctx = document.createElement('canvas').getContext('2d');
	  this.type = type;
	  this.mode = mode;
	  this.color = color;
	  this.size = size;
	  // 绘制内容保存为Canvas上所处位置
	  this.corner = [start.copy(), start.copy()];
	  this.transform = [];
	  this.path = [];
	  this.zIndex = 0;
	};

	var User = function User(UID) {
	  _classCallCheck(this, User);

	  this.UID = UID;
	  this.ctx = document.createElement('canvas').getContext('2d');
	  this.shapes = []; // 保存用户所做的可视操作的index
	  this.recycle = [];
	  this.mode = 'draw';
	  this.type = 'free';
	  this.size = 4;
	  this.color = '#000';
	  this.isMouseDown = false;
	  this.start = new Point(0, 0);
	  this.oldMid = new Point(0, 0);
	  this.end = new Point(0, 0);
	  // local undo/redo model
	  this.visible = 0;
	  this.available = 0;
	  this.activeShape = {};
	};

	/**
	 * 渲染
	 * @param {Shape[]} shapes 绘制内容数组
	 * @param {number} visibleCount 绘制个数
	 * @private
	 */


	function render(ctx, shapes, visibleCount) {
	  var count = 0;
	  shapes.forEach(function (shape) {
	    if (!shape.visible || count >= visibleCount) return;
	    applyState(ctx, shape);
	    if (shape.mode === 'fill') return fill(ctx, shape.corner[0]);
	    ctx.drawImage(shape.ctx.canvas, shape.corner[0].x, shape.corner[0].y);
	    visibleCount++;
	  });
	}

	/**
	 * 不同用户的模式、笔大小、颜色都是不同的，在对displayCtx操作时先应用状态
	 * @param {string} UID 对应用户的ID
	 * @param {number} size 笔大小
	 * @param {string} color 颜色
	 * @param {string} mode 模式
	 * @private
	 */
	function applyState(displayCtx, _ref2) {
	  var UID = _ref2.UID,
	      ctx = _ref2.ctx,
	      size = _ref2.size,
	      color = _ref2.color,
	      mode = _ref2.mode;

	  if (UID !== undefined) {
	    displayCtx.lineWidth = ctx.lineWidth = size;
	    displayCtx.strokeStyle = ctx.strokeStyle = color;
	  }
	  if (mode === 'erase') {
	    displayCtx.globalCompositeOperation = 'destination-out';
	  } else {
	    displayCtx.globalCompositeOperation = 'source-over';
	  }
	}

	/**
	 * 等比例缩放Canvas
	 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
	 * @param {number} scale 缩放比例
	 * @private
	 */
	function resizeCanvas(ctx, scale) {
	  var cvs = ctx.canvas;
	  var temp = document.createElement('canvas').getContext('2d');
	  temp.canvas.width = cvs.width;
	  temp.canvas.height = cvs.height;
	  temp.drawImage(cvs, 0, 0, cvs.width, cvs.height);
	  cvs.style.width = cvs.width * scale + 'px';
	  cvs.style.height = cvs.height * scale + 'px';
	  cvs.width = cvs.width * scale;
	  cvs.height = cvs.height * scale;
	  ctx.lineCap = ctx.lineJoin = 'round';
	  ctx.drawImage(temp.canvas, 0, 0, cvs.width, cvs.height);
	}

	/**
	 * 绘制曲线
	 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
	 * @param {Point} start 起始点
	 * @param {Point} control 控制点
	 * @param {Point} end 终止点
	 * @private
	 */
	function free(ctx, start, control, end) {
	  // 用三个点画二次曲线，使笔迹光滑，降低锯齿感
	  if (start.x === end.x && start.y === end.y) {
	    // IE下使用quadraticCurveTo无法画点
	    rect(ctx, start, 1, 1);
	    return;
	  }
	  ctx.beginPath();
	  ctx.moveTo(start.x, start.y);
	  ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
	  ctx.stroke();
	}

	/**
	 * 绘制直线
	 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
	 * @param {Point} start 起始点
	 * @param {Point} end 终止点
	 * @private
	 */
	function line(ctx, start, end) {
	  ctx.beginPath();
	  ctx.moveTo(start.x, start.y);
	  ctx.lineTo(end.x, end.y);
	  ctx.stroke();
	}

	/**
	 * 绘制矩形
	 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
	 * @param {Point} start 起始点
	 * @param {number} w 宽度，单位px
	 * @param {number} h 高度，单位px
	 * @param {boolean} fill 是否填充
	 * @private
	 */
	function rect(ctx, start, w, h) {
	  var fill = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	  if (fill) ctx.fillRect(start.x, start.y, w, h);else ctx.strokeRect(start.x, start.y, w, h);
	}

	/**
	 * 绘制圆角矩形
	 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
	 * @param {CanvasRenderingContext2D} start 起始点
	 * @param {number} w 宽度，单位px
	 * @param {number} h 高度，单位px
	 * @param {*} radius 圆角半径，单位px
	 * @param {boolean} fill 是否填充
	 * @private
	 */
	function roundRect(ctx, start, w, h, radius) {
	  var fill = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	  var sx = start.x;
	  var sy = start.y;
	  var radiusX = w < 0 ? -radius : radius;
	  var radiusY = h < 0 ? -radius : radius;
	  ctx.beginPath();
	  ctx.moveTo(sx + radiusX, sy);
	  ctx.lineTo(sx + w - radiusX, sy);
	  ctx.quadraticCurveTo(sx + w, sy, sx + w, sy + radiusY);
	  ctx.lineTo(sx + w, sy + h - radiusY);
	  ctx.quadraticCurveTo(sx + w, sy + h, sx + w - radiusX, sy + h);
	  ctx.lineTo(sx + radiusX, sy + h);
	  ctx.quadraticCurveTo(sx, sy + h, sx, sy + h - radiusY);
	  ctx.lineTo(sx, sy + radiusY);
	  ctx.quadraticCurveTo(sx, sy, sx + radiusX, sy);
	  ctx.stroke();
	  if (fill) ctx.fill();
	}

	/**
	 * 绘制圆形
	 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
	 * @param {CanvasRenderingContext2D} center 圆心
	 * @param {number} radius 半径，单位px
	 * @param {boolean} fill 是否填充
	 * @private
	 */
	function circle(ctx, center, radius) {
	  var fill = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	  ctx.beginPath();
	  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
	  ctx.stroke();
	  if (fill) ctx.fill();
	}

	/**
	 * 为封闭区域填充颜色
	 * TODO 为IE做Typed Array的polyfill
	 * @param {Point} s 起始点
	 * @param {String|Number} UID 执行此次操作的用户ID
	 * @private
	 */
	function fill(ctx, s) {
	  var sx = s.x;
	  var sy = s.y;
	  var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	  var X = 0;
	  var Y = 1;

	  var stroke = ctx.strokeStyle;
	  var r = parseInt(stroke.substr(1, 2), 16);
	  var g = parseInt(stroke.substr(3, 2), 16);
	  var b = parseInt(stroke.substr(5, 2), 16);
	  // >>> 0 运算转换为无符号32位整数
	  var fillColor = (255 << 24 | b << 16 | g << 8 | r) >>> 0;
	  var start = [sx, sy];
	  var buf = new ArrayBuffer(img.data.length);
	  var buf8 = new Uint8ClampedArray(buf);
	  buf8.set(img.data);
	  var data = new Uint32Array(buf);

	  var startColor = data[sy * img.width + sx];
	  if (startColor === fillColor) {
	    return;
	  }
	  var queue = [start];
	  var pixel = void 0;
	  var maxX = img.width - 1;
	  var maxY = img.height - 1;

	  function compare(color) {
	    return color === startColor || (color & 0xFF000000) >>> 0 < 0xFF000000;
	  }

	  while (pixel = queue.pop()) {
	    var pos = pixel[Y] * img.width + pixel[X];
	    var x = pixel[X];
	    var y = pixel[Y];

	    while (y-- >= 0 && compare(data[pos])) {
	      pos -= img.width;
	    }
	    pos += img.width;
	    y++;

	    var reachLeft = false;
	    var reachRight = false;
	    while (y++ < maxY && compare(data[pos])) {
	      data[pos] = fillColor;
	      if (x > 0) {
	        if (compare(data[pos - 1])) {
	          if (!reachLeft) {
	            queue.push([x - 1, y]);
	            reachLeft = true;
	          }
	        } else if (reachLeft) {
	          reachLeft = false;
	        }
	      }

	      if (x < maxX) {
	        if (compare(data[pos + 1])) {
	          if (!reachRight) {
	            queue.push([x + 1, y]);
	            reachRight = true;
	          }
	        } else if (reachRight) {
	          reachRight = false;
	        }
	      }
	      pos += img.width;
	    }
	  }

	  img.data.set(buf8);
	  ctx.putImageData(img, 0, 0);
	}
	module.exports = exports['default'];

/***/ },

/***/ 192:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var pushConfigModule = __webpack_require__(55);

	var whiteboard = {};

	whiteboard.install = function (NIM) {
	  var NIMFn = NIM.fn;
	  var util = NIM.util;
	  var PushConfig = pushConfigModule({ util: util });

	  NIMFn.initWhiteBoard = function (options) {
	    util.verifyOptions(options, 'type accounts');
	    // 下面两个参数统一合并到 pushConfig 里面
	    options.pushContent = '';
	    options.custom = '';
	    if (!options.pushConfig) {
	      options.pushConfig = {};
	    }
	    options.pushConfig.webrtcEnable = options.webrtcEnable;
	    options.pushConfig = new PushConfig(options.pushConfig);
	    return this.cbAndSendCmd('initWhiteBoard', options);
	  };

	  NIMFn.wbKeepCalling = function (options) {
	    util.verifyOptions(options, 'type accounts channelId');
	    return this.cbAndSendCmd('wbKeepCalling', options);
	  };

	  NIMFn.wbCalleeAck = function (options) {
	    util.verifyOptions(options, 'account channelId type accepted');
	    return this.cbAndSendCmd('wbCalleeAck', options);
	  };

	  NIMFn.wbHangup = function (options) {
	    util.verifyOptions(options, 'channelId');
	    return this.cbAndSendCmd('wbHangup', options);
	  };

	  NIMFn.wbControl = function (options) {
	    util.verifyOptions(options, 'channelId type');
	    return this.cbAndSendCmd('wbControl', options);
	  };
	  NIMFn.wbCreateChannel = function (options) {
	    return this.cbAndSendCmd('wbCreateChannel', options);
	  };
	  NIMFn.wbJoinChannel = function (options) {
	    util.verifyOptions(options, 'channelName');
	    util.verifyBooleanWithDefault(options, 'liveEnable', false);
	    util.verifyBooleanWithDefault(options, 'webrtcEnable', false);
	    return this.cbAndSendCmd('wbJoinChannel', {
	      channelName: options.channelName,
	      liveOption: {
	        liveEnable: options.liveEnable ? 1 : 0,
	        webrtcEnable: options.webrtcEnable ? 1 : 0
	      }
	    });
	  };
	  NIMFn.wbQueryAccountUidMap = function (channelName, uids) {
	    return this.cbAndSendCmd('wbQueryAccountUidMap', {
	      channelName: channelName,
	      uids: uids
	    });
	  };
	};

	module.exports = whiteboard;

/***/ },

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * 客户端对外入口, 依赖账号体系
	 * 该文件主要管理和IM账号相关操作，并作为总的入口调用其他接口
	 * 原型：音视频
	 * 目前基类抽离做了音视频兼容性处理，但是这期只做了白板，音视频SDK未改动，无法验证
	 * 注：
	 * 2. 如果希望进行重写，请在继承该基类之后进行覆盖重写
	 */

	var element = __webpack_require__(67);
	var EventEmitter = __webpack_require__(8);

	var util = __webpack_require__(1);
	// const Promise = require('es6-promise').Promise

	/**
	 *  请使用 {@link getInstance} 来初始化白板环境.
	 *  @class
	 *  @name
	 */

	/**
	 *
	 *  @method getInstance
	 *  @memberOf WebWhiteBoard
	 *  @param {Object} options 配置参数
	 *  @param {NIM} options.nim NIM 实例
	 *  @param {Node} options.container canvas容器
	 *  @param {Boolean} [options.debug=false] 是否开启debug模式，默认不开启，debug模式下浏览器会打印log日志
	 */

	var Client = function (_EventEmitter) {
	  _inherits(Client, _EventEmitter);

	  function Client(options) {
	    _classCallCheck(this, Client);

	    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

	    options.container = element.n2node(options.container);
	    options.remoteContainer = element.n2node(options.remoteContainer);
	    util.merge(_this, options);
	    _this.init();
	    _this.util = util;

	    // 测试用
	    _this.debug = true;
	    return _this;
	  }

	  return Client;
	}(EventEmitter);

	var fn = Client.prototype;

	/** 初始化
	 * 1. 重置所有状态
	 * 2. 初始化白板通讯协议, 约定规则
	 * 3. 初始化白板操作控制
	 */
	fn.init = function () {
	  var that = this;
	  this.resetStatus();
	  window.addEventListener('beforeunload', this.beforeunload.bind(this));
	  var logger = this.nim && this.nim.logger || window.console;
	  // 日志函数
	  this.logger = {
	    log: function log() {
	      var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      if (that.debug) {
	        logger.log.apply(logger, arguments);
	      }
	    },
	    error: function error() {
	      var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      if (that.debug) {
	        logger.error.apply(logger, arguments);
	      }
	    },
	    warn: function warn() {
	      var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      if (that.debug) {
	        logger.warn.apply(logger, arguments);
	      }
	    }
	  };
	  this.log = this.logger.log;
	  this.error = this.logger.error;
	  this.warn = this.logger.warn;
	};

	/** 重置所有状态 */
	fn.resetStatus = function () {
	  // 是否建立了通道连接
	  this.signalInited = false;
	  // 频道 ID
	  this.channelId = null;
	  // 通话类型
	  this.type = null;
	  // 对方账号
	  this.target = {
	    account: null,
	    uid: null
	  };
	  // 会话配置
	  this.sessionConfig = {};
	  // 会话场景，p2p / meeting
	  this.sessionMode = null;
	  // 会话内容信息
	  this.imInfo = {};
	  // 是否正在通话中
	  this.calling = false;
	  // 是否是主叫
	  this.isCaller = false;
	  // 被叫账号
	  this.callee = null;
	  // 点对点白板通话被接受
	  this.callAccepted = false;
	  // 主叫时候的信息
	  this.callerInfo = null;
	  // 被叫时候的信息
	  this.beCalledInfo = null;
	  // 设置当前 channelId
	  if (this.nim) {
	    this.nim.protocol && this.nim.protocol.setCurrentNetcall && this.nim.protocol.setCurrentNetcall();
	    this.nim.protocol && this.nim.protocol.setCurrentWhiteBoard && this.nim.protocol.setCurrentWhiteBoard();
	  }
	  // 某些情况下，im慢了，就有可能只有uid而拿不到account，这里补充一个丢失account的队列
	  this.needQueryAccountMap = {};
	  // accid和uid映射表
	  this.accountUidMap = {};
	  // uid和accid映射表
	  this.uidAccountMap = {};
	  // 为了防止IMhangup事件丢掉，当信令层hangup事件传来时，作为检查标志
	  // 这里会有两个事件触发：IM hangup / signal leaveChannel
	  this.isOnHangup = false;
	};

	// 页面卸载事件
	fn.beforeunload = function () {
	  if (this.signalInited) {
	    if (this.callerInfo || this.beCalledInfo) {
	      this.hangup();
	    } else {
	      this.leaveChannel();
	    }
	  }
	};

	/**
	 *  获取当前登录的 IM 账号
	 *  @method getAccount
	 *  @return {String}
	 */
	fn.baseGetAccount = function () {
	  return this.nim && this.nim.account;
	};

	/**
	 * 获取当前登录的IM账号的 uid
	 */
	fn.baseGetUid = function () {
	  if (this.accountUidMap) {
	    return this.accountUidMap[this.nim.account] || '-1';
	  }
	  return '-1';
	};

	/* account uid map 相关 begin */
	fn.parseAccountUidMap = function (map) {
	  var _this2 = this;

	  Object.keys(map).forEach(function (account) {
	    _this2.addAccountUidMap({
	      account: account,
	      uid: map[account]
	    });
	  });
	};

	fn.addAccountUidMap = function (_ref) {
	  var account = _ref.account,
	      uid = _ref.uid;

	  if (!this.uidAccountMap) {
	    this.uidAccountMap = {};
	  }
	  this.uidAccountMap[uid] = account;
	  if (!this.accountUidMap) {
	    this.accountUidMap = {};
	  }
	  this.accountUidMap[account] = uid;
	};

	// 获取特定uid的账号
	fn.getAccountWithUid = function (uid) {
	  if (this.uidAccountMap) {
	    return this.uidAccountMap[uid];
	  }
	};

	// 获取特定账号的uid
	fn.getUidWithAccount = function (account) {
	  if (this.accountUidMap) {
	    return this.accountUidMap[account];
	  }
	};

	/**
	 *  是否是当前会话的 channelId
	 *  @method isCurrentChannelId
	 *  @return {Boolean}
	 */
	fn.baseIsCurrentChannelId = function () {
	  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  return this.channelId && this.channelId === obj.channelId;
	};

	/**
	 *  不是当前会话的 channelId
	 *  @method isCurrentChannelId
	 *  @memberOf WhiteBoard#
	 *  @return {Boolean}
	 */
	fn.baseNotCurrentChannelId = function (obj) {
	  return !this.baseIsCurrentChannelId(obj);
	};

	/**
	 *  响应呼叫
	 *
	 *  @method response
	 *  @param  {Object} [options={}] 配置参数
	 *  @param  {Boolean} [options.fn] response 发送
	 *  @param  {Boolean} [options.accepted=true] true 接听, false 拒绝
	 *  @param  {Object} options.beCalledInfo 被呼叫的信息, 在 beCalling 事件里可以接收到的信息
	 *  @param  {Object} [options.sessionConfig] 会话配置
	 *  @param  {Number} [options.sessionConfig.videoQuality]  {@link WebRTC.CHAT_VIDEO_QUALITY_*|视频分辨率}
	 *  @param  {Number} [options.sessionConfig.videoFrameRate] {@link WebRTC.CHAT_VIDEO_FRAME_RATE_*|视频帧率}
	 *  @param  {Boolean} [options.sessionConfig.highAudio] 是否高清语音
	 *  @return {Promise}
	 */
	fn.baseResponse = function () {
	  var _this3 = this;

	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  // 默认使用音视频呼叫应答
	  var fn = options.fn || 'calleeAck';
	  var beCalledInfo = options.beCalledInfo || this.beCalledInfo;
	  var accepted = beCalledInfo.accepted = options.accepted !== false;
	  if (accepted) {
	    this.sessionMode = 'p2p';
	    this.type = beCalledInfo.type;
	    this.channelId = beCalledInfo.channelId;
	    this.target.account = beCalledInfo.account;
	    this.calling = true;
	    this.imInfo = beCalledInfo;
	    this.imInfo.sessionMode = this.sessionMode;
	    this.setSessionConfig({ signalStartTime: Date.now() });
	  } else {
	    this.log('reject call', beCalledInfo);
	    this.packNetcallRecord({
	      type: beCalledInfo.type,
	      channelId: beCalledInfo.channelId,
	      isCaller: false,
	      target: beCalledInfo.account,
	      recordType: 'rejectNetcall'
	    });
	  }
	  return this.nim[fn](beCalledInfo).then(function () {
	    if (accepted) {
	      if (options.sessionConfig) {
	        _this3.setSessionConfig(options.sessionConfig);
	      }
	      _this3.beCalledInfo = beCalledInfo;
	      _this3.initSession({ beCalledInfo: beCalledInfo });
	    }
	  }, function (error) {
	    _this3.log(error);
	    throw error;
	  });
	};

	/**
	 *  发送通话控制指令
	 *  @method control
	 *  @memberOf WebRTC#
	 *  @param  {Object} options={} 配置参数
	 *  @param  {Boolean} [options.fn] response 发送
	 *  @param  {String} [options.channelId] 要发送指令的通话的 channelId, 如果不填那么默认为当前通话
	 *  @param  {Number} [options.command] 可选控制指令请参考 {@link WebRTC.NETCALL_CONTROL_COMMAND_*}
	 *  @return {Void}
	 */
	fn.baseControl = function () {
	  var _this4 = this;

	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  options.channelId = options.channelId || this.channelId;
	  if (options.command && options.channelId) {
	    // this.controller.sdkData.dataApi.updateApi('call_control_type')

	    // 默认使用音视频呼叫应答
	    var _fn = options.fn || 'netcallControl';
	    options.type = options.command;
	    return this.nim[_fn](options)['catch'](function (error) {
	      _this4.log(error);
	    });
	  }
	};

	/**
	 *  挂断通话
	 *  @method hangup
	 *  @memberOf WebRTC#
	 *  @param  {String} [channelId] 要挂断的通话的 channelId, 如果不填那么挂断当前通话
	 *  @return {Void}
	 */
	fn.baseHangup = function () {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  // this.controller.sdkData.dataApi.sendApi()
	  var channelId = options.channelId || this.channelId;
	  if (channelId) {
	    // 默认使用音视频呼叫应答
	    var _fn2 = options.fn || 'hangup';

	    this.nim[_fn2]({
	      channelId: channelId
	    });
	  }

	  if (channelId === this.channelId) {
	    // 如果是主叫, 并且没有等对方接通就挂断了电话, 那么拼一条消息出来
	    if (this.isCaller && !this.callAccepted) {
	      this.log('cancelWhiteBoardBeforeAccept', { channelId: channelId });
	      this.packNetcallRecord({
	        recordType: 'cancelWhiteBoardBeforeAccept'
	      });
	    }
	    // 最后重置各种状态
	    this.resetWhenHangup();
	  }
	};

	/**
	 * 开启会话连接
	 * 音视频、白板
	 * 音视频的startRTC需要继续保留以兼容老版本
	 */
	fn.baseStartSession = function () {
	  this.imInfo.cid = this.imInfo.cid || this.imInfo.channelId;
	  var sessionMode = this.sessionMode = this.sessionMode || 'p2p';
	  this.imInfo.sessionMode = sessionMode;
	  this.imInfo.sessionConfig = this.sessionConfig;
	};

	// 生成话单
	fn.packNetcallRecord = function () {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  // 以下信息当拒绝电话的时候从 options 读取, 其它情况从 this 读取
	  var recordType = options.recordType;
	  var type = util.exist(options.type) ? options.type : this.type;
	  var channelId = util.exist(options.channelId) ? options.channelId : this.channelId;
	  var duration = util.exist(options.duration) ? options.duration : 0;
	  var isCaller = util.exist(options.isCaller) ? options.isCaller : this.isCaller;
	  var targetAccount = util.exist(options.target) ? options.target : this.target.account;
	  var account = this.baseGetAccount();
	  var from = isCaller ? account : targetAccount;
	  var to = isCaller ? targetAccount : account;
	  var time = +new Date();
	  this.nim.protocol.onMsg({
	    content: {
	      msg: {
	        attach: JSON.stringify({
	          data: {
	            calltype: type,
	            channel: channelId,
	            duration: duration,
	            ids: [account, targetAccount],
	            time: time
	          },
	          id: recordType
	        }),
	        from: from,
	        // fromClientType, fromDeviceId, fromNick 先随便拼一个好了
	        fromClientType: isCaller ? 16 : 0,
	        fromDeviceId: '',
	        fromNick: '',
	        idClient: util.guid(),
	        idServer: util.guid(),
	        scene: 0,
	        time: time,
	        to: to,
	        type: 5
	      }
	    }
	  });
	};

	// 设置会话参数
	fn.setSessionConfig = function () {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  this.sessionConfig = util.merge(this.sessionConfig, config);
	};

	fn.initSignal = function () {
	  return Promise.resolve();
	};
	/*
	 * 初始化会话
	 * 如果是主叫, 那么在被叫应答之后初始化会话
	 * 如果是被叫, 那么应答之后初始化会话
	 */
	fn.initSession = function () {
	  var _this5 = this;

	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  this.sessionMode = 'p2p';
	  var obj = this.isCaller ? this.callerInfo : options.beCalledInfo;
	  this.parseAccountUidMap(obj.accountUidMap);
	  if (!obj.account && obj.uid) {
	    obj.account = this.getAccountWithUid(obj.uid);
	  }
	  this.callAccepted = true;
	  this.signalInited = true;
	  this.setSessionConfig({ signalEndTime: Date.now() });
	  // this.controller.sdkData.dataApi.startInfo({
	  //   uid: obj.uid
	  // })

	  var res = {
	    type: obj.type,
	    account: this.target && this.target.account || obj.account,
	    channelId: obj.channelId
	  };
	  if (obj.netcallType) {
	    res.netcallType = obj.netcallType;
	  }
	  this.imInfo.target = this.target;
	  setTimeout(function () {
	    _this5.emit('callAccepted', res);
	  }, 1);
	};

	/** ******************************************************回调通知************************************************************ */

	// 点对点被呼叫了
	fn.onBeCalled = function (obj) {
	  this.signalInited = true;
	  this.channelId = obj.channelId;
	  this.beCalledInfo = obj;
	  this.log('beCalling', obj);
	  this.emit('beCalling', obj);
	};

	// 来自信令层的通知 有第三方用户加入的事件监听
	fn.onUserJoin = function (obj) {
	  this.log('client on userJoined', obj);
	  // if (this.sessionMode === 'p2p') return
	  // 多人会议模式往外传
	  obj.type = obj.type || this.type;
	  obj.account = this.getAccountWithUid(obj.uid);
	  obj.mode = this.sessionMode;
	  if (obj.account === this.baseGetAccount()) return;

	  if (obj.account) {
	    this.logger.log('有人加入 ----> 来自信令层的通知', obj);
	    this.emit('joinChannel', obj);
	    return;
	  }

	  // 还没有找到account, 存入队列请求数据
	  this.needQueryAccountMap[obj.uid] = obj;
	  var queryFn = this.nim.queryAccountUidMap || this.nim.wbQueryAccountUidMap;
	  queryFn.call(this.nim, this.channelName, [obj.uid]);
	};

	// 来自信令层的通知 有第三方用户离开的事件监听
	fn.onUserLeft = function (obj) {
	  var _this6 = this;

	  if (!this.channelId) return;
	  this.logger.log('leave channel from signal');
	  if (this.imInfo.sessionMode === 'p2p') {
	    setTimeout(function () {
	      _this6.logger.log('超时处理 onUserLeft');
	      _this6.resetWhenHangup();
	    }, 1000);
	    this.emit('hangup', {
	      channelId: obj.channelId || obj.cid,
	      account: this.target.account,
	      type: obj.type || 0
	    });
	  } else {
	    this.emit('leaveChannel', {
	      channelId: obj.channelId || obj.cid,
	      account: this.getAccountWithUid(obj.uid),
	      type: obj.type || 0
	    });
	  }
	};

	// 来自IM的加入通知 有第三方用户加入的事件监听
	fn.onNotifyJoin = function (obj) {
	  this.logger.log('join channel from IM');
	  var tmp = obj.accountUidMap;
	  var needQueryAccountMap = this.needQueryAccountMap;
	  this.parseAccountUidMap(tmp);

	  for (var i in tmp) {
	    var account = i;
	    var uid = tmp[i];
	    if (uid in needQueryAccountMap) {
	      var option = needQueryAccountMap[uid];
	      option.account = account;
	      delete needQueryAccountMap[uid];
	      this.logger.log('有人加入 ----> 来自IM的通知', obj);
	      this.emit('joinChannel', option);
	    }
	  }
	};

	// 收到被叫的通知
	fn.onCalleeAck = function (obj) {
	  this.logger.log('收到被叫的通知', obj);
	  if (this.baseNotCurrentChannelId(obj)) {
	    return;
	  }
	  var account = obj.account;

	  var callInfo = this.beCalledInfo || this.callerInfo;
	  this.target.account = account;
	  this.setSessionConfig({ signalEndTime: Date.now() });
	  if (obj.accepted) {
	    this.callAccepted = true;
	    this.initSession();
	  } else {
	    this.log('call Rejected', obj);
	    this.packNetcallRecord({
	      type: obj.type,
	      channelId: obj.channelId,
	      isCaller: true,
	      target: obj.account,
	      recordType: 'netcallRejected'
	    });
	    this.resetWhenHangup();
	    this.emit('callRejected', {
	      type: callInfo.type,
	      account: account
	    });
	  }
	};

	// 点对点通话, 对方挂断
	fn.onHangup = function (obj) {
	  var _this7 = this;

	  if (!this.channelId) return;
	  this.logger.log('on hangup from IM');
	  setTimeout(function () {
	    _this7.logger.log('超时处理 onHangup');
	    _this7.resetWhenHangup();
	  }, 1000);
	  this.emit('hangup', {
	    channelId: obj.channelId,
	    account: obj.account
	  });
	};

	fn.onControl = function (obj) {
	  this.emit('control', obj);
	};

	// 在线通知被叫应答多端同步, 意思是假如你有两个设备, 别人呼叫你, 那么两个设备都会收到被叫通知
	// 当你在一个设备处理了这个通知之后, 另一个设备就会收到这个通知, 说明你在其它端处理了这个通知
	// 开发者可以调用 stopLocalStream 来停止本地视频流
	fn.onCalleeAckSync = function (obj) {
	  this.emit('callerAckSync', obj);
	  if (this.baseIsCurrentChannelId(obj)) {
	    this.resetWhenHangup();
	  }
	};

	/**
	 *  创建频道
	 *  @method createChannel
	 *  @memberOf WebRTC#
	 *  @param  {Object} options              配置参数
	 *  @param  {Number} options.channelName  频道名称
	 *  @param  {String} options.custom       扩展字端（用于上层放自定义数据，选填）
	 *  @param  {Boolean} options.webrtcEnable       是否开启WebRTC通话的支持(对于WebRTC SDK, 该字段无需传递, 默认开启)
	 *  @return {Promise}
	 */
	fn.baseCreateChannel = function (fn) {
	  var _this8 = this;

	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  util.verifyOptions(options, 'channelName');
	  options.custom = options.custom || '';
	  this.setSessionConfig({ signalStartTime: Date.now() });
	  return this.nim[fn](options).then(function (obj) {
	    return Promise.resolve(obj);
	  })['catch'](function (error) {
	    _this8.setSessionConfig({ signalEndTime: Date.now() });
	    // this.controller.updateInfoOnce({
	    //   code: error.code
	    // })
	    return Promise.reject(error);
	  });
	};

	/**
	 *  主动加入频道
	 *  @method joinChannel
	 *  @memberOf WebRTC#
	 *  @param  {Object} options      白板相关配置参数
	 *  @param  {String} options.channelName   频道名称
	 *  @param  {Number} [options.type] {@link WebRTC.NETCALL_TYPE_*|通话类型}，目前参数无用，多人会议直接使用视频
	 *  @return {Promise}
	 */

	fn.baseJoinChannel = function (fn) {
	  var _this9 = this;

	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  return this.nim[fn](options).then(function (obj) {
	    _this9.setSessionConfig({ signalEndTime: Date.now() });
	    // this.calling = true
	    _this9.signalInited = true;
	    _this9.sessionMode = obj.sessionMode = 'meeting';
	    // this.channelId = obj.channelId
	    // this.channelName = options.channelName
	    _this9.parseAccountUidMap(obj.accountUidMap);
	    obj.uid = _this9.getUidWithAccount(_this9.nim.account);
	    // obj.account = this.nim.account
	    // this.imInfo = obj

	    // this.controller.sdkData.dataApi.startInfo({
	    //   uid: obj.uid
	    // })

	    return Promise.resolve(obj);
	  })['catch'](function (error) {
	    _this9.setSessionConfig({ signalEndTime: Date.now() });
	    // this.controller.updateInfoOnce({
	    //   code: error.code
	    // })
	    return Promise.reject(error);
	  });
	};

	/** ***********************工具**************************** */
	// 数据格式化
	fn.format = function (data) {
	  if (data.rtcServerMap) {
	    data.rtcServerMap = JSON.parse(data.rtcServerMap);
	    data.rtcServerMap = data.rtcServerMap.webrtcarray || [data.rtcServerMap.webrtc] || data.rtcServerMap;
	  }
	  if (data.wbServerMap) {
	    data.wbServerMap = JSON.parse(data.wbServerMap);
	    data.wbServerMap = data.wbServerMap.webrtcarray || [data.wbServerMap.webrtc] || data.wbServerMap;
	  }
	  return data;
	};

	// 需要重写的方法
	fn.resetWhenHangup = function () {};

	module.exports = Client;

/***/ },

/***/ 195:
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = {
	  CURRENT: {
	    SDK_TYPE: null
	  },
	  SDK_TYPE: {
	    NETCALL: 1,
	    WEBRTC: 2,
	    WHITEBOARD: 3
	  }
	};
	module.exports = exports["default"];

/***/ },

/***/ 196:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _constant = __webpack_require__(85);

	var _modules = __webpack_require__(145);

	var _monitor = __webpack_require__(175);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * 中央控制器
	 * 该文件主要包含以下功能，目前在兼容了音视频的基础上做了基类抽离，但是音视频这期不做改动，无法更改和验证
	 * controller里面没有hangup说法，一律stopSession
	 * 主要功能：
	 * - 连接信令服务器
	 * - 功能指令API调度
	 * - 和client交互
	 * 注：
	 * 1. 该基类中所有的公共方法均带下划线
	 * 2. 如果希望进行重写，请在继承该基类之后进行覆盖重写
	 */

	var EventEmitter = __webpack_require__(8);
	var Signal = __webpack_require__(176);

	// configMap.CURRENT.SDK_TYPE = configMap.SDK_TYPE.WEBRTC

	var util = __webpack_require__(17);
	var Promise = __webpack_require__(2).Promise;

	/**
	 * 中央控制器构造函数, 兼容音视频和白板
	 * @class Controller
	 * @extends {EventEmitter}
	 * @param {Object} option 初始配置项 白板和音视频分别传递不同的参数
	 * @param {Object} option.appKey appkey, 数据上报使用
	 * @param {Object} option.logger 日志工具函数, 进过入口过滤是否打印
	 * // 音视频部分
	 * @param {dom} option.container 本地音视频流外显区域
	 * @param {dom} option.remoteContainer 对方音视频流外显区域
	 * @param {Object} client 本地客户端实例(client.js调用时把自己传进来)
	 */

	var Controller = function (_EventEmitter) {
	  _inherits(Controller, _EventEmitter);

	  function Controller(option) {
	    _classCallCheck(this, Controller);

	    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this, option));

	    _this.info = {};
	    _this._init(option);
	    _this._reset();
	    return _this;
	  }

	  return Controller;
	}(EventEmitter);

	exports['default'] = Controller;


	var fn = Controller.prototype;

	/**
	 * 初始化
	 */
	fn._init = function (option) {
	  // 合并参数
	  util.merge(this.info, option);
	  this.logger = option.logger || window.console;
	  this.dataApi = (0, _monitor.DataApi)(this.info.appKey);
	  this.dataRtc = (0, _monitor.DataRtc)(this.info.appKey);
	  this.dataStats = (0, _monitor.DataStats)(this.info.appKey);
	};

	/**
	 * 状态重置
	 */
	fn._reset = function () {
	  if (this.signal) {
	    this.signal.destroy();
	    this.signal = null;
	  }
	  this.sessionConfig = {};
	  this.imInfo = {};
	  this.target = {};
	  // p2p用户加入的超时判断
	  this.userJoinTimeoutId = 0;
	  // 客户端自己维护的节点状态
	  this.remoteUidStatus = {};
	  this.dataRtc.stop();
	};

	// 用于重写覆盖的方法
	fn.resetStatus = function () {
	  this._reset();
	};
	/**
	 * 开启会话连接
	 * info
	 * 流程：
	 * 1. 新建signal信道
	 * 2. signal开启连接
	 * @param {obj} info 配置内容
	 * @param {obj} info.uid 用户id
	 * @param {obj} info.cid 房间id
	 * @param {array} info.serverAddrs socket地址列表
	 */
	fn._startSession = function () {
	  var imInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  var info = this.imInfo || imInfo;
	  this.setSessionConfig(info.sessionConfig);
	  /** 记录服务器返回的网关地址URL */
	  var serverMap = info.serverMap ? JSON.parse(info.serverMap) : {};

	  info.urlArray = info.serverAddrs || serverMap.webrtcarray || [serverMap.webrtc];

	  var promise = void 0;
	  if (!this.signal) {
	    promise = this._initSignal();
	  } else {
	    promise = Promise.resolve(this.signal);
	  }
	  return promise;
	};

	/**
	*  初始化信令
	*
	*  - 在呼叫成功双方开始音视频通信时触发，建立信令连接
	*  - 当信令通道断开时, 会触发 signalClosed 事件
	*  - 20171029 改动：服务器网关地址为一个数组，需要遍历连接，连接成功不再遍历
	*  @method initSignal

	*  @return {Promise}
	*/
	fn._initSignal = function () {
	  var _this2 = this;

	  if (this.signal) {
	    return Promise.resolve();
	  }
	  //  else {
	  //   this._stopSignal()
	  // }
	  var signal = new Signal({ logger: this.logger });
	  var urlArray = this.imInfo.urlArray;


	  var url = urlArray.shift();
	  if (!url) {
	    return Promise.reject('无可用的网关服务器地址, 如果当前应用是WebRTC音视频, 请确保对方打开了WebRTC兼容开关');
	  }

	  return signal.connect({
	    url: url,
	    imInfo: this.imInfo
	  }).then(function (signal) {
	    _this2.signal = signal;
	    _this2._initSignalEvent();
	    return Promise.resolve(signal.url);
	  })['catch'](function (e) {
	    return _this2._initSignal();
	  });
	};

	/** 注册signal监听事件 */
	fn._initSignalEvent = function () {
	  var _this3 = this;

	  var signal = this.signal;
	  signal.on('signalTimeout', this.onSignalTimeout.bind(this));
	  signal.on('message', this.onSignalMessage.bind(this));
	  signal.on('signalClosed', function () {
	    // this.signal = null
	    // if (this.rtc) {
	    //   this.logger.log('信令断开，需要重新连接')
	    //   this.initSignal()
	    // }
	    _this3.emit('signalClosed');
	    _this3.resetStatus();
	    // this._stopSignal()
	    // 如果录制中，停止录制
	    // this.rtcRecorder.stop().catch()
	  });
	  this.signal.on('signalError', function (obj) {
	    _this3.emit('signalClosed');
	    _this3._stopSignal();
	  });
	};

	/**
	 *  停止信令通道
	 *  @method stopSignal
	 *  @return {Promise}
	 */
	fn._stopSignal = function () {
	  if (this.signal) {
	    // this.signal.stopSession()
	    this.signal.destroy();
	    this.signal = null;
	    // this.stopLocalStream()
	    // this.stopRemoteStream()
	  }
	};

	// 结束会话的处理
	fn._stopSession = function () {
	  // 结束会话
	  this._stopSignal();
	  this._reset();
	};

	/** 通知网关自己已登出 */
	fn._logout = function () {
	  this.signal && this.signal.logout();
	};

	/** 根据msid获取uid */
	fn.getUidByMsid = function (msid) {
	  var tmp = this.remoteUidMsidMap;
	  for (var i in tmp) {
	    if (tmp[i] === msid) return i;
	  }
	  return null;
	};

	/** 根据uid获取msid */
	fn.getMsidByUid = function (uid) {
	  return this.remoteUidMsidMap(uid);
	};

	/** 设置会话参数 */
	fn.setSessionConfig = function () {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  this.sessionConfig = util.merge(this.sessionConfig, config);
	};

	/** 消息解析, 继承的话需要重写 */
	fn.onSignalMessage = function (data) {};

	fn.onSignalTimeout = function (data) {};

	// 开始数据上报定时器
	fn.uploadDataRtcStart = function () {
	  if (!this.info.appKey) return;
	  // 只有WebRTC下面才做数据上报
	  if (_modules.configMap.CURRENT.SDK_TYPE !== _modules.configMap.SDK_TYPE.WEBRTC) return;
	  this.dataRtc.start({
	    rtcConnection: this.rtc.rtcConnection,
	    imInfo: this.imInfo,
	    remoteUidMsidMap: this.remoteUidMsidMap,
	    sessionConfig: this.sessionConfig,
	    videoConfig: this.imInfo.videoConfig,
	    uid: this.imInfo.uid
	  });
	};

	// 停止数据上报定时器
	fn.uploadDataRtcStop = function () {};

	// 一次性数据上报
	fn.uploadDataRtcOnce = function (data) {
	  // 只有WebRTC下面才做数据上报
	  if (_modules.configMap.CURRENT.SDK_TYPE !== _modules.configMap.SDK_TYPE.WEBRTC) return;
	  var videoConfig = _constant.constantTool.getVideoSessionConfig({
	    quality: this.sessionConfig.videoQuality,
	    frameRate: this.sessionConfig.videoFrameRate
	  });
	  this.dataRtc.updateOnce({
	    imInfo: data,
	    sessionConfig: this.sessionConfig,
	    videoConfig: videoConfig
	  });
	};

	// 数据上报集中方法
	fn.uploadDataRtc = function (type, data) {
	  // 只有WebRTC下面才做数据上报
	  if (_modules.configMap.CURRENT.SDK_TYPE !== _modules.configMap.SDK_TYPE.WEBRTC) return;
	  if (!this.info.appKey) return;
	  if (type === 'volume') {
	    this.dataRtc.updateLocalVolumn(data);
	    return;
	  }
	  this.dataRtc.update(type, data);
	};

	// 埋点上报集中方法
	fn.uploadDataApi = function (type, data) {
	  // 只有WebRTC下面才做数据上报
	  if (_modules.configMap.CURRENT.SDK_TYPE !== _modules.configMap.SDK_TYPE.WEBRTC) return;
	  if (!this.info.appKey) return;
	  this.dataApi[type] && this.dataApi[type](data);
	};

	fn.uploadDataRtcStart = function () {
	  this.dataStats.start();
	};

	fn.uploadDataRtcStop = function () {
	  this.dataStats.stop();
	};

	fn.uploadDataRtcNew = function (data) {
	  var param = {
	    cid: this.imInfo.cid,
	    uid: this.imInfo.uid,
	    data: data,
	    timestamp: Date.now()
	  };
	  this.dataStats.send(param);
	};
	module.exports = exports['default'];

/***/ },

/***/ 197:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _ajax = __webpack_require__(33);

	var _ajax2 = _interopRequireDefault(_ajax);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * SDK数据监听处理类功能模块
	 * created by hzzouhuan
	 * 1. 接口调用上报(v3.5.0)
	 *
	 * 调用方式：
	 * 1. let DataApi = require('./sdkData')
	 * 2. let sdkData = new DataApi() // 初始化
	 * 3. sdkData.init(option) // 初始化环境
	 * 4. sdkData.update(type, ext) // API埋点触发更新, type、ext 类型为string
	 *
	 *  -----> type值如下：
	 *  - p2p
	 *  - meeting
	 *  - bypass
	 *  - call_control_type
	 *  - self_mute
	 *  - self_mic_mute
	 *  - switch_p2p_type
	 *  - record
	 *  - audio_record
	 *  - display
	 *  - hd_audio
	 *  - video_quality
	 *  - fps
	 *
	 *  --> PC Agent 多几个
	 *  - net_detect
	 *  - video_adaptive_strategy
	 *
	 *  -----> ext为扩展字段，具体值请查看下面的代码
	 *
	 */
	// const platform = require('platform')
	var configs = __webpack_require__(3);
	var nrtcVersion = configs.info.nrtcVersion;

	var util = __webpack_require__(17);
	// console.log('sdkData --> sdkVersion', sdkVersion)


	var url = 'https://statistic.live.126.net/statistic/realtime/sdkFunctioninfo';
	// const url = 'http://106.2.44.145:8383/statistic/realtime/sdkFunctioninfo'

	/**
	 *  @param {Object} options 配置参数
	 */

	var SdkData = function SdkData(appkey, platform) {
	  _classCallCheck(this, SdkData);

	  // super()

	  this.apis = {};
	  // 上报平台，是否是WebRTC
	  this.isRtc = /WebRTC/.test(platform);
	  this.init(appkey, platform);
	  this.resetStatus();
	};

	exports['default'] = SdkData;


	var fn = SdkData.prototype;

	fn.init = function (appkey, platform) {
	  // 版本号，暂时写死1
	  util.merge(this.apis, {
	    // 当前版本号
	    ver: 1,
	    // 平台类型
	    platform: platform,
	    // sdk版本
	    sdk_ver: nrtcVersion || 'v4.4.0',
	    uid: null,
	    appkey: appkey,
	    // 发送的时候再加时间戳
	    time: null
	  });
	};

	// 开启上报时初始化一些固定值
	fn.start = function (obj) {
	  util.merge(this.apis, obj);
	};

	fn.resetStatus = function () {
	  this.calling = false;
	  /**
	   * 每个功能的参数结构为：“{key :  {value : -1/0/1 , ext : ***}}”
	   * key表示功能名，value表示功能使用情况，ext是string类型的扩展字段。
	   * value的可能值为：-1，0和1。-1表示无此功能，0表示有此功能此次通话未使用，1表示有此功能且此次通话使用。
	   */
	  util.merge(this.apis, {
	    // 是否进行过点对点音视频通话，是否调用“主叫发起通话请求”或“被叫响应通话请求”
	    p2p: { value: 0 },
	    // 是否进行过多人音视频通话, 是否调用“预定会议”或“加入会议”
	    meeting: { value: 0 },
	    // 是否创建过互动直播房间, 互动直播模式，目前的模式包括1、2、3、4（四种内置布局模式）、5（自定义布局模式）、6（纯音频互动直播模式），上报模式序号
	    bypass: { value: 0 },
	    // 使用通话控制信息
	    call_control_type: { value: 0 },
	    // 设置己端静音(不发送音频数据)
	    self_mute: { value: -1 },
	    // 设置己端麦克风静音
	    self_mic_mute: { value: -1 },
	    // 切换点对点通话模式
	    switch_p2p_type: { value: 0 },
	    // 切换扬声器和听筒
	    set_speaker: { value: -1 },
	    // 网络探测
	    net_detect: { value: this.isRtc ? -1 : 0 },
	    // 使用内置美颜
	    beautify: { value: -1 },
	    // 使用水印
	    water_mark: { value: -1 },
	    // 音频采集数据回调与发送
	    audio_samples: { value: -1 },
	    // 视频采集数据回调与发送
	    video_samples: { value: -1 },
	    // 设置视频预览镜像
	    pre_view_mirror: { value: -1 },
	    // 设置视频编码镜像
	    code_mirror: { value: -1 },
	    // 自定义音频数据输入
	    custom_audio: { value: -1 },
	    // 自定义视频数据输入
	    custom_video: { value: -1 },
	    // 是否调用“实例化混音任务, 即伴音功能
	    audio_mix: { value: -1 },
	    // 视频截图
	    snap_shot: { value: -1 },
	    // 客户端音视频录制, 是否调用“开始录制”
	    record: { value: 0 },
	    // 客户端录音, 是否调用“开始通话录音“, 混音录制
	    audio_record: { value: 0 },
	    // 预览, 是否调用“获取本地摄像头预览层”
	    display: { value: 0 },
	    // 安卓兼容性方案
	    android_compatibility: { value: -1 },
	    // 是否开启高清语音
	    hd_audio: { value: 0 },
	    // 视频分辨率调节, 视频分辨率，low=1, medium=2, high=3,480P=4,540P=5,720P=6，上报分辨率类别号码，default=0
	    video_quality: { value: 0 },
	    // 视频帧率, 最小帧率=0，5FPS=1，10FPS=2，15FPS=3，20FPS=4，25FPS=5，最大帧率=6，default=0
	    fps: { value: 0 },
	    // 期望的视频编码器, default=0,软件编解码=1，硬件编解码=2
	    prefered_video_encoder: { value: -1 },
	    // 期望的视频解码器, default=0,软件编解码=1，硬件编解码=2
	    prefered_video_decoder: { value: -1 },
	    // 用户设置的视频最大编码码率
	    video_max_encode_bitrate: { value: this.isRtc ? -1 : 0 },
	    // 音频场景选择功能, 通话为1，高清音乐为2，自适应音乐为3
	    audio_scene: { value: -1 },
	    // 视频自适应策略选择功能, 视频自适应策略分为流畅优先和清晰有限，流畅优先为1，清晰优先为2
	    video_adaptive_strategy: { value: this.isRtc ? -1 : 0 },
	    // 噪声抑制开关
	    ans: { value: -1 },
	    // 自动增益开关
	    agc: { value: -1 },
	    // DTX开关
	    dtx: { value: -1 },
	    // 回音消除开关
	    aec: { value: -1 },
	    // 啸叫抑制开关
	    awc: { value: -1 }
	  });
	};

	// api调用频率更新
	fn.update = function () {
	  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var key = option.key,
	      ext = option.ext;

	  if (this.apis[key]) {
	    this.apis[key].value = 1;
	    if (ext !== undefined) {
	      this.apis[key].ext = ext;
	    }
	    if (/(p2p|meeting)/.test(key)) {
	      this.calling = true;
	    }
	  }
	};

	// 发送api上报
	fn.send = function () {
	  var _this = this;

	  if (!this.calling) return;
	  this.calling = false;
	  this.apis.time = Date.now();
	  console.log('----- send apiData ------', this.apis);
	  // this.clearInfoData()
	  (0, _ajax2['default'])({ type: 'post', url: url, data: this.apis }).then(function (data) {
	    // console.log(data)
	    _this.resetStatus();
	  })['catch'](function (err) {
	    console.log('err', err);
	    _this.resetStatus();
	  });
	};
	module.exports = exports['default'];

/***/ },

/***/ 198:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _ajax = __webpack_require__(33);

	var _ajax2 = _interopRequireDefault(_ajax);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * SDK数据监听处理类功能模块
	 * created by hzzouhuan
	 * 1. 数据上报(v3.4.0)
	 *
	 * 调用方式：
	 * 1. let DataRtc = require('./sdkData')
	 * 2. let sdkData = new DataRtc() // 初始化
	 * 3. sdkData.startInfo(option) // 开始上报的准备工作，每次通讯开始，需要传入与会者, sdp等协议信息供基准分析使用
	 * 4. sdkData.stopInfo() //停止上报
	 * 5. sdkData.updateInfo(data) // 推送上报内容
	 * 6. sdkData.updateInfoOnce(data) // 上报一次的数据，不开定时器
	 * 7. sdkData.updateLocalVolumn(volumn) // 更新本地音频音量
	 *
	 * 数据处理流程与步骤说明
	 * 1. 初始化环境
	 * 2. 开始上报准备工作, 参数如下
	 *    - rtcConnection: 本地rtc peer
	 *    - imInfo: 音视频通信相关, 用于获取本地uid / cid / turn_ip / proxy_ip / 通信模式(p2p / meeting)
	 *    - remoteUidMsidMap: 远程uid和media id映射表, 用于从sdp里获取对应的ssrc
	 *    - sessionConfig: 互动直播和时间戳相关, 用于获取互动直播相关参数 / 默认开启音视频设备的帧率分辨率等 / 信令和网络的连接时间戳
	 *    - videoConfig: 视频采集设置
	 *
	 *    - 对以上信息进行初始格式化, 填入待发送的对象里
	 * 3. 开启定时器: 定时发送处理好的数据
	 * 4. 接收统计信息，进行管道分析处理，填入待发送的对象里
	 *
	 * 管道处理说明
	 * 1. 同时开启本地，远程数据处理准备工作
	 * 2. 根据msid 获取 ssrc, 得到uid-ssrc的map表
	 *    uidSsrcMap:{
	 *      uid: [ssrc1,ssrc2]
	 *    }
	 * 3. 根据ssrc 从 统计信息中提取 audio / video 相关参数
	 *
	 * 备注：
	 * 目前每个用户都是一条上行流，多条下行流，如果以后更改为多条上行流，会存在问题！这里先不考虑这种情况!
	 */
	var platform = __webpack_require__(9);
	var configs = __webpack_require__(3);
	var nrtcVersion = configs.info.nrtcVersion;

	var util = __webpack_require__(17);

	// console.log('sdkData --> sdkVersion', sdkVersion)


	var url = 'https://statistic.live.126.net/statistic/realtime/sdkinfo';
	/**
	 *  @param {Object} options 配置参数
	 */

	var SdkData = function SdkData(appkey) {
	  _classCallCheck(this, SdkData);

	  this.infos = {};
	  this.userlist = [];
	  this.localVolumn = 0;
	  this.local = {};
	  this.remote = {};

	  this.init(appkey);
	  this.resetStatus();
	};

	exports['default'] = SdkData;


	var fn = SdkData.prototype;

	fn.init = function (appkey) {
	  // 版本号，暂时写死1
	  util.merge(this.infos, {
	    ver: 1,
	    device: -1,
	    isp: -1,
	    platform: tool.convertPlatform(platform.os.family) + '-' + platform.os.version,
	    browser: platform.name + '-' + platform.version,
	    sdk_ver: nrtcVersion || 'v4.2.0',
	    appkey: appkey,
	    // 上报时间间隔
	    interval: 60,
	    // 采样点数
	    samples: 30,
	    // 发送的时候再加时间戳
	    time: null,
	    // QoS算法选择 1：老的，2：新开发的。通过json字段拿到，设置到网络层，用于灰度上线
	    qos_algorithm: -1,
	    // FEC算法选择 1：老的，2：新开发的。通过json字段拿到，设置到网络层，用于灰度上线
	    fec_algorithm: -1,
	    // QoS场景，例如：桌面白板、运动camera、静止camera，具体场景待定
	    qos_scene: -1,
	    // QoS策略模式，例如：流畅优先、清晰优先
	    qos_strategy: -1
	  });
	};

	fn.resetStatus = function () {
	  util.merge(this.infos, {
	    uid: null,
	    cid: null,
	    push_url: null,
	    turn_ip: null,
	    proxy_ip: null,
	    meeting: false,
	    live: false
	  });
	  this.clearInfoData();
	  this.uidSsrcMap = {};
	  this.userlist = [];
	};

	// 开启上报时初始化一些固定值
	fn.initInfoData = function (uid) {
	  var tmp = {
	    uid: uid,
	    cid: this.imInfo && this.imInfo.channelId || -1,
	    push_url: this.sessionConfig && this.sessionConfig.rtmpUrl || -1,
	    turn_ip: this.imInfo && this.imInfo.turnMap || -1,
	    proxy_ip: this.imInfo && this.imInfo.turnMap || -1,
	    meeting: /^meeting$/gi.test(this.imInfo.sessionMode),
	    live: this.sessionConfig && this.sessionConfig.liveEnable || false,
	    // 通话状态: 直连、中转
	    p2p: false,
	    // 注册网络运营商: 46001 中国联通
	    isp: -1,
	    // 网络类型: 2g、3g、4g、wifi等
	    net: -1,
	    // 频道加入状态码
	    connect_state: this.imInfo && this.imInfo.code || 200,
	    // 信令通信时长: 调用加入频道 -> IM信令成功加入后计算时差
	    signalling_time: (this.sessionConfig && this.sessionConfig.signalEndTime || 0) - (this.sessionConfig && this.sessionConfig.signalStartTime || 0),
	    // 频道加入时长: 收到IM信令 -> 网络层登录成功后计算时差
	    connect_time: (this.sessionConfig && this.sessionConfig.rtcEndTime || 0) - (this.sessionConfig && this.sessionConfig.rtcStartTime || 0)
	  };
	  util.merge(this.infos, tmp);
	  // console.log('init infoData', this.infos, this.sessionConfig)
	};

	// 数据上报一次，清空一次
	fn.clearInfoData = function () {
	  this.localVolumn = 0;
	  util.merge(this.infos, {
	    // 采样数据
	    rx: {
	      audio: [],
	      // audioSample: {
	      //   u: [],
	      //   g: [],
	      //   c: [],
	      //   bn: [],
	      //   bc: []
	      // },
	      video: []
	      // videoSample:{
	      //   u: [],
	      //   i: [],
	      //   bn: [],
	      //   bc: [],
	      //   r: [],
	      //   f: []
	      // }
	    },
	    tx: {
	      // 音频丢包百分比
	      a_lost: [],
	      // 视频丢包百分比
	      v_lost: [],
	      // 延迟
	      rtt: [],
	      // 时延抖动。
	      rtt_mdev: [],
	      // 视频设置帧率（用户设置）
	      set_v_fps: [],
	      // 视频设置帧率（QoS设置）
	      qos_v_fps: [],
	      // 视频发送帧率
	      v_fps: [],
	      // 客户端设置图像清晰度. 默认 0,低 1,中 2,高 3, 480P 4, 540P 5, 720P 6
	      set_v_quality: [],
	      // 客户端发送图像分辨率-宽度、高度wxh  e.g."640x480"
	      real_v_res: [],
	      // 客户端视频SDK编码码率
	      real_v_kbps: [],
	      // 客户端视频网络出口发送码率（含冗余包）
	      real_v_kbps_n: [],
	      // 客户端音频SDK编码码率
	      real_a_kbps: [],
	      // 客户端音频网络出口发送码率（含冗余包）
	      real_a_kbps_n: [],
	      // 客户端视频设置码率
	      set_v_kbps: [],
	      // QoS设置视频码率
	      qos_v_kbps: [],
	      // 视频流上行带宽探测值
	      tx_bw_kbps: [],
	      // 客户端发送声音声量，int16
	      a_volume: []
	    }
	  });
	};

	/**
	 * 启动数据上报定时器
	 *  @param {Object} options 配置参数
	 *  @param {object} options.imInfo 与会议相关
	 *  @param {Node} options.cid 频道id
	 */
	fn.start = function (options) {
	  var _this = this;

	  var imInfo = options.imInfo,
	      remoteUidMsidMap = options.remoteUidMsidMap,
	      sessionConfig = options.sessionConfig,
	      rtcConnection = options.rtcConnection,
	      uid = options.uid;

	  if (!imInfo || !remoteUidMsidMap || !rtcConnection) return;

	  this.imInfo = imInfo || {};
	  this.remoteUidMsidMap = remoteUidMsidMap || {};
	  this.sessionConfig = sessionConfig || {};
	  this.rtcConnection = rtcConnection;
	  this.videoConfig = options.videoConfig || {};

	  if (this.sdkInfoTimer) {
	    return;
	  }

	  this.getTurnMap();
	  this.initInfoData(uid);
	  this.format();
	  this.sdkInfoTimer = setInterval(function () {
	    _this.sendInfo();
	  }, 1000 * this.infos.interval);
	};

	// 停止数据上报
	fn.stop = function () {
	  if (!this.sdkInfoTimer) {
	    return;
	  }
	  this.resetStatus();
	};

	// sdk数据上报更新
	fn.update = function (data) {
	  this.rtcStats = data;
	  // 初始格式化
	  this.format();
	  // 更新上行信息
	  this.updateRxMediaInfo();
	  // 更新下行信息
	  this.updateTxMediaInfo();
	};

	// 一次数据上报更新, 用于通话失败的情况
	fn.updateOnce = function (options) {
	  var imInfo = options.imInfo,
	      remoteUidMsidMap = options.remoteUidMsidMap,
	      sessionConfig = options.sessionConfig,
	      rtcConnection = options.rtcConnection;

	  if (!imInfo) return;

	  this.imInfo = imInfo || {};
	  this.remoteUidMsidMap = remoteUidMsidMap || {};
	  this.sessionConfig = sessionConfig || {};
	  this.rtcConnection = rtcConnection || {};
	  this.videoConfig = options.videoConfig || {};

	  this.getTurnMap();
	  this.initInfoData();
	  this.sendInfo();
	};

	// 更新本地音量
	fn.updateLocalVolumn = function (volumn) {
	  // console.log(volumn)
	  this.localVolumn = volumn;
	};

	// 组装下行的媒体信息
	fn.updateRxMediaInfo = function () {
	  var _this2 = this;

	  var audio = {
	    u: [],
	    g: [],
	    c: [],
	    bn: [],
	    bc: []
	  };

	  var video = {
	    u: [],
	    i: [],
	    bn: [],
	    bc: [],
	    r: [],
	    f: []
	  };

	  this.userlist.map(function (uid) {
	    var tmp = _this2.getMediaStats(uid);
	    audio.u.push(tmp.audio.u);
	    audio.g.push(-1);
	    audio.c.push(-1);
	    audio.bn.push(tmp.audio.bn);
	    audio.bc.push(tmp.audio.bc);

	    video.u.push(tmp.video.u);
	    video.i.push(tmp.video.i);
	    video.bn.push(tmp.video.bn);
	    video.bc.push(tmp.video.bc);
	    video.r.push(tmp.video.r);
	    video.f.push(tmp.video.f);
	  });

	  this.infos.rx.audio.push(audio);
	  this.infos.rx.video.push(video);
	};

	// 获取具体某个下行的媒体信息
	fn.getMediaStats = function (uid) {
	  var data = this.rtcStats;
	  var result = {
	    audio: {
	      u: +uid,
	      g: -1,
	      c: -1,
	      bn: 0,
	      bc: 0
	    },
	    // 找杨迪确认
	    video: {
	      u: +uid,
	      i: -1,
	      bn: 0,
	      bc: 0,
	      r: -1,
	      f: 0
	    }
	  };
	  var tmp = {};
	  var ssrc = this.uidSsrcMap[uid];
	  // 垃圾数据丢掉
	  if (!ssrc) {
	    return result;
	  }
	  ssrc = ssrc.join('|');
	  var reg = new RegExp('(' + ssrc + ')');
	  data.results.filter(function (item) {
	    if (reg.test(item.ssrc)) {
	      tmp[item.mediaType] = item;
	    }
	    return reg.test(item);
	  });

	  if (tmp['audio']) {
	    result['audio'].bn = (tmp.audio.availableBandwidth || 0) - 0;
	    result['audio'].bc = -1;
	  }
	  if (tmp['video']) {
	    result['video'].bn = (tmp.video.availableBandwidth || 0) - 0;
	    result['video'].bc = tmp.video.googFrameWidthReceived + 'x' + tmp.video.googFrameHeightReceived;
	    result['video'].f = (tmp.video.googFrameRateDecoded || 0) - 0;
	  }
	  return result;
	};

	// 获取本地上行的媒体信息
	fn.getLocalMediaStats = function () {
	  var data = this.rtcStats;
	  var result = {
	    // 音频丢包百分比
	    a_lost: -1,
	    // 视频丢包百分比
	    v_lost: -1,
	    // 延迟
	    rtt: 0,
	    // 时延抖动。
	    rtt_mdev: -1,
	    // 视频设置帧率（用户设置）
	    set_v_fps: this.videoConfig.frameRate || 0,
	    // 视频设置帧率（QoS设置）
	    qos_v_fps: 0,
	    // 视频发送帧率
	    v_fps: 0,
	    // 客户端设置图像清晰度. 默认 0,低 1,中 2,高 3, 480P 4, 540P 5, 720P 6
	    set_v_quality: this.sessionConfig.videoQuality,
	    // 客户端发送图像分辨率-宽度、高度wxh  e.g."640x480"
	    real_v_res: 0,
	    // 客户端视频SDK编码码率
	    real_v_kbps: 0,
	    // 客户端视频网络出口发送码率（含冗余包）
	    real_v_kbps_n: 0,
	    // 客户端音频SDK编码码率
	    real_a_kbps: -1,
	    // 客户端音频网络出口发送码率（含冗余包）
	    real_a_kbps_n: 0,
	    // 客户端视频设置码率
	    set_v_kbps: -1,
	    // QoS设置视频码率
	    qos_v_kbps: 0,
	    // 视频流上行带宽探测值
	    tx_bw_kbps: 0,
	    // 客户端发送声音声量，int16
	    a_volume: 0
	  };
	  // 观众模式直接返回
	  // let medias = this.getMediaStats(this.imInfo.uid)
	  // if (!medias.audio && !medias.video) return result

	  var tmp = {};
	  var uid = this.imInfo.uid;
	  var ssrc = this.uidSsrcMap[uid];
	  // 垃圾数据丢掉
	  if (!ssrc) {
	    return result;
	  }
	  ssrc = ssrc.join('|');
	  var reg = new RegExp('(' + ssrc + ')');

	  data.results.filter(function (item) {
	    // 寻找rtt
	    if (item.localCandidateId) {
	      tmp['rtt'] = item;
	      return;
	    }
	    if (reg.test(item.ssrc)) {
	      tmp[item.mediaType] = item;
	    }
	    return reg.test(item);
	  });

	  if (tmp['audio']) {
	    result.real_a_kbps_n = (tmp.audio.availableBandwidth || data.audio.send.availableBandwidth) - 0;
	    result.a_volume = this.localVolumn - 0;
	  }
	  if (tmp['video']) {
	    result.qos_v_fps = tmp.video.googFrameRateInput - 0;
	    result.v_fps = tmp.video.googFrameRateSent - 0;
	    result.real_v_res = tmp.video.googFrameWidthSent + 'x' + tmp.video.googFrameHeightSent;
	    result.real_v_kbps = tmp.video.googEncodeUsagePercent - 0;
	    result.real_v_kbps_n = tmp.video.availableBandwidth - 0;
	  }
	  result.rtt = tmp['rtt'].googRtt - 0;
	  result.tx_bw_kbps = (data.connectionType.bitsSentPerSecond || 0) - 0;
	  return result;
	};

	// 组装上行的媒体信息
	fn.updateTxMediaInfo = function () {
	  var tmp = this.getLocalMediaStats();
	  var tx = this.infos.tx;
	  // 塞数组
	  for (var i in tmp) {
	    tx[i].push(tmp[i]);
	  }

	  // 更新其他信息
	  this.infos.net = tool.convertNetwork(this.rtcStats.connectionType.local.networkType[0]);
	};

	// turn ip
	fn.getTurnMap = function () {
	  var imInfo = this.imInfo;
	  if (imInfo.serverMap) {
	    imInfo.turnMap = JSON.parse(imInfo.serverMap || null);
	    imInfo.turnMap = imInfo.turnMap && imInfo.turnMap['turnaddrs'];
	    imInfo.turnMap = imInfo.turnMap && imInfo.turnMap[0];
	    imInfo.turnMap = imInfo.turnMap.constructor === Array ? imInfo.turnMap[0] : imInfo.turnMap;
	    imInfo.turnMap = imInfo.turnMap && imInfo.turnMap.match(/\d+\.\d+.\d+\.\d+/);
	    imInfo.turnMap = imInfo.turnMap[0];
	  }
	};

	// 获取ssrc, return [...ssrc]
	fn.getSsrc = function (msid, sdp) {
	  var arr = [];
	  var tmp = {
	    audio: this.getTypeSsrc('audio', msid, sdp),
	    video: this.getTypeSsrc('video', msid, sdp)
	  };
	  tmp.audio && arr.push(tmp.audio);
	  tmp.video && arr.push(tmp.video);
	  return arr;
	};

	// 返回的是符合条件的数组，因为可能存在修复流
	fn.getTypeSsrc = function (type, msid, sdp) {
	  var reg = void 0;
	  var tmpStr = '';
	  // 先获取audio
	  // 步骤一：先截取audio到ssrc这一段所有字符
	  reg = new RegExp(type + '[.\\r\\n\\s\\S]*ssrc:(\\d+)\\smsid:' + msid);
	  tmpStr = sdp.match(reg);
	  tmpStr = tmpStr && tmpStr[0];
	  if (!tmpStr) return;

	  // 继续寻找满足条件的所有ssrc
	  reg = new RegExp('ssrc:\\d+\\smsid:' + msid);
	  tmpStr = tmpStr.match(reg);
	  tmpStr = tmpStr.map(function (item) {
	    reg = new RegExp('ssrc:(\\d+)\\s');
	    item = item.match(reg);
	    return item[1];
	  });

	  return tmpStr;
	};
	// 格式化基准信息
	fn.format = function () {
	  this.formatLocal();
	  this.formatRemote();
	};

	// 管道处理：本地各种信息处理
	fn.formatLocal = function () {
	  this.localSdp = this.rtcConnection.localDescription;
	  this.localStream = this.rtcConnection.getLocalStreams()[0];
	  if (this.localStream) {
	    this.uidSsrcMap[this.imInfo.uid] = this.getSsrc(this.localStream.id, this.localSdp.sdp);
	    this.local.ssrc = this.uidSsrcMap[this.imInfo.uid];
	  }
	};

	fn.formatRemote = function () {
	  this.remoteSdp = this.rtcConnection.remoteDescription;
	  this.userlist = [];
	  var remoteUidMsidMap = this.remoteUidMsidMap;

	  for (var i in remoteUidMsidMap) {
	    this.userlist.push(i);
	    this.remote[i] = {};
	    this.uidSsrcMap[i] = this.getSsrc(remoteUidMsidMap[i], this.remoteSdp.sdp);
	    this.remote[i].ssrc = this.uidSsrcMap[i];
	  }
	};

	// 发送sdk数据
	fn.sendInfo = function () {
	  var _this3 = this;

	  if (!this.infos.uid || !this.infos.cid) return;
	  this.infos.time = Date.now();
	  this.infos.samples = this.infos.rx.audio.length;
	  // console.log('----- send infoData ------', this.infos)
	  // console.log(`----- > rx.audio.length: ${this.infos.rx.audio.length} rx.video.length: ${this.infos.rx.video.length}`)
	  // console.log(`----- > tx.real_a_kbps.length: ${this.infos.tx.real_a_kbps.length} tx.video.length: ${this.infos.tx.real_a_kbps.length}`)
	  // console.log(JSON.stringify(this.infos), this.rtcStats)
	  // this.clearInfoData()
	  (0, _ajax2['default'])({ type: 'post', url: url, data: this.infos }).then(function (data) {
	    // console.log(data)
	    _this3.clearInfoData();
	  })['catch'](function (err) {
	    // console.log('err', err)
	    _this3.clearInfoData();
	  });
	};

	// 数据转换工具
	var tool = {
	  convertNetwork: function convertNetwork(txt) {
	    var map = {
	      wlan: 'wifi',
	      lan: 'ethernet'
	    };
	    return map[txt] || 'unknown';
	  },
	  convertPlatform: function convertPlatform(txt) {
	    var win = /Windows/i;
	    var mac = /OS X/i;
	    var result = void 0;
	    result = win.test(txt) && 'Win' || txt;
	    result = mac.test(result) && 'Mac' || result;
	    return result;
	  }
	};
	module.exports = exports['default'];

/***/ },

/***/ 199:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _ajax = __webpack_require__(33);

	var _ajax2 = _interopRequireDefault(_ajax);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * SDK数据监听处理类功能模块, 测试用
	 * created by hzzouhuan
	 * 1. 接口调用上报(v3.5.0)
	 *
	 * 调用方式：
	 * 1. const DataStats = require('./dataStats')
	 * 2. const dataStats = new DataStats() // 初始化
	 * 4. dataStats.send(data) // 发送埋点数据
	 *
	 */
	// const platform = require('platform')
	var configs = __webpack_require__(3);
	var nrtcVersion = configs.info.nrtcVersion;

	var util = __webpack_require__(17);

	// const url = '//192.168.31.210:10002/nodeapi/postdetail'

	/**
	 *  @param {Object} options 配置参数
	 */
	var DataStats = function () {
	  function DataStats(appkey, platform) {
	    _classCallCheck(this, DataStats);

	    // super()

	    this.apis = {};
	    // 上报平台，是否是WebRTC
	    this.isRtc = /WebRTC/.test(platform);
	    this.init(appkey, platform);
	    this.resetStatus();
	  }

	  DataStats.prototype.resetStatus = function resetStatus() {};

	  DataStats.prototype.init = function init(appkey, platform) {
	    // 版本号，暂时写死1
	    util.merge(this.apis, {
	      // 当前版本号
	      ver: 1,
	      // 平台类型
	      platform: platform,
	      // sdk版本
	      sdk_ver: nrtcVersion || 'v4.4.0',
	      uid: null,
	      appkey: appkey,
	      // 发送的时候再加时间戳
	      time: null
	    });
	  };

	  // 开启上报时初始化一些固定值


	  DataStats.prototype.start = function start(obj) {
	    util.merge(this.apis, obj);
	  };

	  // 发送api上报


	  DataStats.prototype.send = function send(data) {
	    // console.log('send data', data)
	    // ajax({ type: 'post', url, data })
	    //   .then(data => {})
	    //   .catch(err => {
	    //     console.log('err', err)
	    //   })
	  };

	  return DataStats;
	}();

	exports['default'] = DataStats;
	module.exports = exports['default'];

/***/ },

/***/ 205:
/***/ function(module, exports) {

	'use strict';

	var whiteboard = {};

	whiteboard.install = function (NIM) {
	  // const util = NIM.util
	  var IMProtocolFn = NIM.Protocol.fn;

	  IMProtocolFn.processDatatun = function (packet) {
	    switch (packet.cmd) {
	      case 'initWhiteBoard':
	        this.onWbInit(packet);
	        break;
	      case 'wbBeCalled':
	        this.onWbBeCalled(packet);
	        break;
	      case 'wbKeepCalling':
	        this.onWbKeepCalling(packet);
	        break;
	      case 'wbCalleeAck':
	        // empty
	        break;
	      case 'wbNotifyCalleeAck':
	        this.onWbNotifyCalleeAck(packet);
	        break;
	      case 'wbHangup':
	        // empty
	        break;
	      case 'wbNotifyHangup':
	        this.onWbNotifyHangup(packet);
	        break;
	      case 'wbNotifyControl':
	        this.onWbControl(packet);
	        break;
	      case 'wbNotifyCalleeAckSync':
	        this.onWbNotifyCalleeAckSync(packet);
	        break;
	      case 'wbNotifyRecord':
	        // this.onMsg(packet)
	        break;
	      case 'wbCreateChannel':
	        // this.wbCreateChannel(packet)
	        break;
	      case 'wbJoinChannel':
	        this.wbJoinChannel(packet);
	        break;
	      case 'wbNotifyJoin':
	        this.onWbNotifyJoin(packet);
	        break;
	      // TODO
	      // 处理 9103
	      // 处理 9102
	      // 处理 417 提示已经创建好频道
	    }
	  };

	  // 初始化白板回包
	  IMProtocolFn.onWbInit = function (packet) {
	    if (!packet.error) {
	      var type = packet.obj.type;
	      packet.obj = packet.content;
	      packet.obj.type = type;
	      packet.obj.accounts = packet.obj.keepCallingAccounts;
	      this.setCurrentWhiteBoard(packet.obj.channelId);
	      this.wbKeepCalling(packet);
	    }
	  };

	  IMProtocolFn.setCurrentWhiteBoard = function (channelId) {
	    this.currentWhiteBoardChannelId = channelId;
	  };

	  IMProtocolFn.onWbKeepCalling = function (packet) {
	    if (!packet.error) {
	      if (packet.content.accounts.length) {
	        this.wbKeepCalling(packet);
	      }
	    }
	  };

	  IMProtocolFn.wbKeepCalling = function (packet) {
	    var _this = this;

	    var obj = packet.obj;
	    var type = obj.type,
	        accounts = obj.accounts,
	        channelId = obj.channelId;

	    if (accounts && accounts.length) {
	      setTimeout(function () {
	        if (_this.currentWhiteBoardChannelId && _this.currentWhiteBoardChannelId === channelId) {
	          _this.api.wbKeepCalling({
	            type: type,
	            accounts: accounts,
	            channelId: channelId
	          })['catch'](function () {
	            // TODO 处理失败
	          });
	        }
	      }, 3000);
	    }
	  };

	  // 被呼叫的通知
	  IMProtocolFn.onWbBeCalled = function (packet) {
	    if (!packet.error) {
	      this.emitAPI({
	        type: 'wbBeCalled',
	        obj: packet.content
	      });
	    }
	  };

	  IMProtocolFn.onWbNotifyCalleeAck = function (packet) {
	    if (!packet.error) {
	      this.emitAPI({
	        type: 'wbNotifyCalleeAck',
	        obj: packet.content
	      });
	    }
	  };

	  IMProtocolFn.onWbNotifyHangup = function (packet) {
	    if (!packet.error) {
	      this.emitAPI({
	        type: 'wbNotifyHangup',
	        obj: packet.content
	      });
	    }
	  };

	  IMProtocolFn.onWbControl = function (packet) {
	    if (!packet.error) {
	      this.emitAPI({
	        type: 'wbControl',
	        obj: packet.content
	      });
	    }
	  };

	  IMProtocolFn.onWbNotifyCalleeAckSync = function (packet) {
	    if (!packet.error) {
	      this.emitAPI({
	        type: 'wbNotifyCalleeAckSync',
	        obj: packet.content
	      });
	    }
	  };

	  IMProtocolFn.onWbNotifyJoin = function (packet) {
	    if (!packet.error) {
	      this.emitAPI({
	        type: 'wbNotifyJoin',
	        obj: packet.content
	      });
	    }
	  };
	  // 加入频道
	  IMProtocolFn.wbJoinChannel = function (packet) {
	    packet.obj = packet.content;
	  };
	};

	module.exports = whiteboard;

/***/ },

/***/ 206:
/***/ function(module, exports) {

	'use strict';

	var idDataChannel = 11;

	var idMap = {
	  wb: {
	    id: idDataChannel,
	    initWhiteBoard: 1,
	    wbKeepCalling: 2,
	    wbCalleeAck: 4,
	    wbNotifyCalleeAck: 5,
	    wbHangup: 8,
	    wbNotifyHangup: 9,
	    wbControl: 10,
	    wbNotifyControl: 11,
	    wbNotifyRecord: 12,
	    wbCreateChannel: 13,
	    wbJoinChannel: 14,
	    wbNotifyJoin: 15,
	    wbQueryAccountUidMap: 16
	  }
	};

	var cmdConfig = {
	  initWhiteBoard: {
	    sid: idDataChannel,
	    cid: idMap.wb.initWhiteBoard,
	    params: [{ type: 'StrArray', name: 'type' }, { type: 'StrArray', name: 'accounts' }, { type: 'String', name: 'pushContent' }, { type: 'String', name: 'custom' }, { type: 'Property', name: 'pushConfig' }]
	  },
	  wbKeepCalling: {
	    sid: idDataChannel,
	    cid: idMap.wb.wbKeepCalling,
	    params: [{ type: 'StrArray', name: 'accounts' }, { type: 'long', name: 'channelId' }]
	  },
	  wbCalleeAck: {
	    sid: idDataChannel,
	    cid: idMap.wb.wbCalleeAck,
	    params: [{ type: 'long', name: 'channelId' }, { type: 'bool', name: 'accepted' }]
	  },
	  wbHangup: {
	    sid: idDataChannel,
	    cid: idMap.wb.wbHangup,
	    params: [{ type: 'long', name: 'channelId' }]
	  },
	  wbControl: {
	    sid: idDataChannel,
	    cid: idMap.wb.wbControl,
	    params: [{ type: 'long', name: 'channelId' }, { type: 'byte', name: 'type' }, { type: 'string', name: 'info' }]
	  },
	  wbCreateChannel: {
	    sid: idDataChannel,
	    cid: idMap.wb.wbCreateChannel,
	    params: [{ type: 'String', name: 'channelName' }, { type: 'String', name: 'custom' }, { type: 'String', name: 'webrtcEnable' }]
	  },
	  wbJoinChannel: {
	    sid: idDataChannel,
	    cid: idMap.wb.wbJoinChannel,
	    params: [{ type: 'String', name: 'channelName' }, { type: 'Property', name: 'liveOption' }]
	  },
	  wbQueryAccountUidMap: {
	    sid: idDataChannel,
	    cid: idMap.wb.wbQueryAccountUidMap,
	    params: [{ type: 'String', name: 'channelName' }, { type: 'LongArray', name: 'uids' }]
	  }
	};

	var serviceWhiteBoard = 'datatun';
	var packetConfig = {
	  '11_1': {
	    service: serviceWhiteBoard,
	    cmd: 'initWhiteBoard',
	    response: [{ type: 'Number', name: 'timetag' }, { type: 'Number', name: 'uid' }, { type: 'Number', name: 'channelId' }, { type: 'PropertyArray', name: 'turnInfoTag' }, { type: 'StrArray', name: 'keepCallingAccounts' }, { type: 'StrLongMap', name: 'accountUidMap' }, { type: 'bool', name: 'p2p' }, { type: 'String', name: 'clientConfig' }]
	  },
	  '11_2': {
	    service: serviceWhiteBoard,
	    cmd: 'wbKeepCalling',
	    response: [{ type: 'StrArr', name: 'accounts' }]
	  },
	  '11_3': {
	    service: serviceWhiteBoard,
	    cmd: 'wbBeCalled',
	    response: [{ type: 'Number', name: 'timetag' }, { type: 'String', name: 'account' }, { type: 'Number', name: 'channelId' }, { type: 'PropertyArray', name: 'turnInfoTag' }, { type: 'StrLongMap', name: 'accountUidMap' }, { type: 'bool', name: 'p2p' }, { type: 'String', name: 'custom' }, { type: 'Number', name: 'uid' }, { type: 'String', name: 'clientConfig' }, { type: 'Property', name: 'pushConfig' }]
	  },
	  '11_4': {
	    service: serviceWhiteBoard,
	    cmd: 'wbCalleeAck',
	    response: []
	  },
	  '11_5': {
	    service: serviceWhiteBoard,
	    cmd: 'wbNotifyCalleeAck',
	    response: [{ type: 'long', name: 'channelId' }, { type: 'String', name: 'account' }, { type: 'bool', name: 'accepted' }]
	  },
	  '11_6': {
	    service: serviceWhiteBoard,
	    cmd: 'wbNotifyCalleeAckSync',
	    response: [{ type: 'String', name: 'timetag' }, { type: 'long', name: 'channelId' }, { type: 'byte', name: 'type' }, { type: 'bool', name: 'accepted' }, { type: 'byte', name: 'fromClientType' }]
	  },
	  '11_7': {
	    service: serviceWhiteBoard,
	    cmd: 'xxxx',
	    response: []
	  },
	  '11_8': {
	    service: serviceWhiteBoard,
	    cmd: 'wbHangup',
	    response: []
	  },
	  '11_9': {
	    service: serviceWhiteBoard,
	    cmd: 'wbNotifyHangup',
	    response: [{ type: 'long', name: 'timetag' }, { type: 'long', name: 'channelId' }, { type: 'String', name: 'account' }]
	  },
	  '11_10': {
	    service: serviceWhiteBoard,
	    cmd: 'wbControl',
	    response: []
	  },
	  '11_11': {
	    service: serviceWhiteBoard,
	    cmd: 'wbNotifyControl',
	    response: [{ type: 'String', name: 'account' }, { type: 'byte', name: 'type' }, { type: 'string', name: 'info' }, { type: 'long', name: 'channelId' }]
	  },
	  '11_12': {
	    service: serviceWhiteBoard,
	    cmd: 'wbNotifyRecord',
	    response: [{ type: 'Property', name: 'msg' }]
	  },
	  '11_13': {
	    service: serviceWhiteBoard,
	    cmd: 'wbCreateChannel',
	    response: [{ type: 'long', name: 'timetag' }]
	  },
	  '11_14': {
	    service: serviceWhiteBoard,
	    cmd: 'wbJoinChannel',
	    response: [{ type: 'long', name: 'timetag' }, { type: 'long', name: 'channelId' }, { type: 'StrLongMap', name: 'accountUidMap' }, { type: 'Property', name: 'turnInfoTag' },
	    // {type: 'String', name: 'clientConfig'},
	    { type: 'String', name: 'custom' }]
	  },
	  '11_15': {
	    service: serviceWhiteBoard,
	    cmd: 'wbNotifyJoin',
	    response: [{ type: 'Long', name: 'channelId' }, { type: 'StrLongMap', name: 'accountUidMap' }]
	  },
	  '11_16': {
	    service: serviceWhiteBoard,
	    cmd: 'wbQueryAccountUidMap',
	    response: []
	  }
	};

	module.exports = {
	  idMap: idMap,
	  cmdConfig: cmdConfig,
	  packetConfig: packetConfig
	};

/***/ },

/***/ 207:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _eventemitter = __webpack_require__(8);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	var _draw = __webpack_require__(191);

	var _draw2 = _interopRequireDefault(_draw);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 协议适配器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Web白板使用的通信数据形式和目前SDK定义的白板协议不同
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 因此需要做一层转化
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var LOCAL_COLOR = '#f5455e';
	var REMOTE_COLOR = '#238efa';

	var _class = function (_EventEmitter) {
	  _inherits(_class, _EventEmitter);

	  /**
	   * @param {HTMLElement} container 画板容器节点
	   * @param {String} opt.UID 当前登录用户的ID
	   * @param {NUmber} opt.width 画板宽度，单位px
	   * @param {NUmber} opt.height 画板高度，单位px
	   * @param {Number} opt.limit 频率控制，提交数据的时间间隔限制，单位为ms
	   * @param {Boolean} opt.debug 是否开启调试模式，开启后控制台输出白板协议包的编号
	   * @constructor
	   */
	  function _class(container) {
	    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, _class);

	    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

	    _this.debug = opt.debug || false;
	    _this.limit = opt.limit || 80;
	    _this.data = '';
	    _this.count = 0;

	    _this.draw = new _draw2['default'](container, opt);
	    _this.draw.size(4);
	    _this.draw.color(LOCAL_COLOR);
	    _this.draw.on('action', _this.transform.bind(_this));

	    setInterval(function () {
	      if (_this.data.length > 0) {
	        _this.emit('action', _this.data);
	        _this.data = '';
	        _this.count++;
	      }
	    }, _this.limit);
	    return _this;
	  }

	  /**
	   * 撤销操作
	   * @public
	   */


	  _class.prototype.undo = function undo() {
	    this.draw.undo();
	  };

	  /**
	   * 清空操作
	   * @public
	   */


	  _class.prototype.clear = function clear() {
	    this.draw.clear();
	  };

	  /**
	   * 等比例调整画布大小，
	   * @public
	   * @param {Number} width 画布大小
	   */


	  _class.prototype.resize = function resize(width) {
	    this.draw.resize(width);
	  };

	  /**
	   * 收到协议数据后进行白板操作
	   * @public
	   * @param {String | Number} UID 发送数据的用户ID
	   * @param {String} data 白板协议数据
	   */


	  _class.prototype.act = function act(_ref) {
	    var _this2 = this;

	    var UID = _ref.UID,
	        data = _ref.data;

	    if (UID === this.draw.UID) return;
	    if (!this.draw.users[UID]) {
	      this.draw.addUser(UID);
	      this.draw.users[UID].color = REMOTE_COLOR;
	    }
	    var ops = data.split(';');
	    var width = this.draw.width;
	    var height = this.draw.height;
	    ops.forEach(function (op) {
	      var arr = op.split(':');
	      var type = arr[0];
	      var value = arr.length > 1 ? arr[1].split(',') : [];
	      var action = {};
	      switch (type) {
	        case '1':
	          // 起始点 1:x,y,rgb
	          action.op = 'mousedown';
	          action.value = { x: Math.ceil(parseFloat(value[0]) * width), y: Math.ceil(parseFloat(value[1]) * height) };
	          break;
	        case '2':
	          // 移动点 1:x,y,rgb
	          action.op = 'mousemove';
	          action.value = { x: Math.ceil(parseFloat(value[0]) * width), y: Math.ceil(parseFloat(value[1]) * height) };
	          break;
	        case '3':
	          // 结束点 3:x,y,rgb
	          action.op = 'mouseup';
	          action.value = { x: Math.ceil(parseFloat(value[0]) * width), y: Math.ceil(parseFloat(value[1]) * height) };
	          break;
	        case '4':
	          // 上一步 4
	          action.op = 'undo';
	          action.value = UID;
	          break;
	        case '5':
	          // 包序号 5:id
	          // console.log(value[0])
	          return;
	        case '6':
	          // 清空 6
	          action.op = 'clear';
	          _this2.data += '7:0,0;';
	          break;
	        case '7':
	          // 清空响应 7
	          action.op = 'clear';
	          action.value = UID;
	          break;
	        case '8':
	          // 同步请求 8
	          break;
	        case '9':
	          // 同步 9:uid,end
	          break;
	        case '10':
	          // 同步准备 10
	          break;
	        case '11':
	          // 同步准备响应 11
	          break;
	        case '12':
	          // 标记 12:x,y,rgb
	          break;
	        case '13':
	          // 标记结束 13
	          break;
	        case '14':
	          // 文档分享 14:docId,pageCount,currentPage
	          break;
	        default:
	          return;
	      }
	      action.UID = UID;
	      _this2.draw.act(action);
	    });
	  };

	  /**
	   * 移除事件监听
	   * 清除白板创建的canvas节点和内存占用较大的对象
	   * 新建白板需要重新实例化
	   * @public
	   */


	  _class.prototype.destory = function destory() {
	    this.draw.destory();
	  };

	  /**
	   * @private
	   * @param {{ UID: String, op: String, value: any }} action 原始操作
	   * @return {void} 无返回
	   */


	  _class.prototype.transform = function transform(action) {
	    if (action.UID !== this.draw.UID) return;
	    var type = '';
	    var value = [];
	    var width = this.draw.width;
	    var height = this.draw.height;
	    switch (action.op) {
	      case 'mousedown':
	        type = '1';
	        value.push(action.value.x / width, action.value.y / height); // , parseInt(this.color, 16))
	        break;
	      case 'mousemove':
	        type = '2';
	        value.push(action.value.x / width, action.value.y / height);
	        break;
	      case 'mouseup':
	        type = '3';
	        value.push(action.value.x / width, action.value.y / height);
	        break;
	      case 'undo':
	        type = '4';
	        value.push(0, 0);
	        break;
	      case 'color':
	        this.color = parseInt(action.value.substring(1), 16);
	        return;
	      case 'clear':
	        type = '6';
	        value.push(0, 0);
	        break;
	      default:
	        return;
	    }
	    this.data += type + ':' + value.join(',') + ';';
	    if (this.debug) this.data += '5:' + this.count + ',0;';
	  };

	  return _class;
	}(_eventemitter2['default']);

	exports['default'] = _class;
	module.exports = exports['default'];

/***/ },

/***/ 208:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(1);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	exports['default'] = {
	  /**
	   *  获取当前登录的 IM 账号
	   *  @method getAccount
	   *  @memberOf WhiteBoard#
	   *  @return {String}
	   */
	  getAccount: function getAccount() {
	    return this.baseGetAccount();
	  },


	  /**
	   * 获取当前登录的IM账号的 uid
	   *  @method getUid
	   *  @memberOf WhiteBoard#
	   *  @return {String}
	   */
	  getUid: function getUid() {
	    return this.baseGetUid();
	  },


	  /**
	   *  是否是当前会话的 channelId
	   *  @method isCurrentChannelId
	   *  @memberOf WhiteBoard#
	   *  @return {Boolean}
	   */
	  isCurrentChannelId: function isCurrentChannelId() {
	    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    return this.baseIsCurrentChannelId(obj);
	  },


	  /**
	   *  不是当前会话的 channelId
	   *  @method isCurrentChannelId
	   *  @memberOf WhiteBoard#
	   *  @return {Boolean}
	   */
	  notCurrentChannelId: function notCurrentChannelId(obj) {
	    return !this.isCurrentChannelId(obj);
	  },


	  /**
	   * 开启会话连接
	   *  @method startSession
	   *  @memberOf WhiteBoard#
	   *  @return {Void}
	   */
	  startSession: function startSession() {
	    this.baseStartSession();

	    // 为了测试，这里写死一个白板网关地址
	    // this.imInfo.serverAddrs.unshift('10.240.76.159:6060')

	    return this.controller.startSession(this.imInfo);
	  },


	  /**
	   * 结束会话连接
	   *  @method stopSession
	   *  @memberOf WhiteBoard#
	   *  @return {Void}
	   */
	  stopSession: function stopSession() {
	    this.resetWhenHangup();
	    return Promise.resolve();
	  },


	  /**
	   * 离开房间
	   *  @method leaveChannel
	   *  @memberOf WhiteBoard#
	   *  @return {Void}
	   */
	  leaveChannel: function leaveChannel() {
	    this.stopSession();
	  },


	  /** ***************************************************画布的操作********************************************************* */
	  /**
	   * 撤销己方上一笔绘图
	   *  @method undo
	   *  @memberOf WhiteBoard#
	   *  @return {Void}
	   */
	  undo: function undo() {
	    this.controller.undo();
	  },


	  // 反撤销
	  redo: function redo() {
	    this.controller.redo();
	  },


	  /**
	   * 清除整个画布
	   *  @method clear
	   *  @memberOf WhiteBoard#
	   *  @return {Void}
	   */
	  clear: function clear() {
	    this.controller.clear();
	  },


	  // 画面大小设置
	  resize: function resize() {
	    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    this.controller.resize(option);
	  },
	  sendCustomData: function sendCustomData(data) {
	    this.controller.sendCustomData(data);
	  },


	  /**
	   * 发送自定义数据
	   * @param {any} data 任意格式的数据
	   */
	  send: function send(data) {
	    this.controller.send(data);
	  }
	}; /**
	    * 白板 入口封装，画布相关操作
	    * 1. 开关设备
	    * 2. 动态调整参数：音量等
	    */

	module.exports = exports['default'];

/***/ },

/***/ 209:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _modules = __webpack_require__(145);

	var _client = __webpack_require__(194);

	var _client2 = _interopRequireDefault(_client);

	var _controller = __webpack_require__(210);

	var _controller2 = _interopRequireDefault(_controller);

	var _utils = __webpack_require__(1);

	var _utils2 = _interopRequireDefault(_utils);

	var _constant = __webpack_require__(85);

	var _client3 = __webpack_require__(208);

	var _client4 = _interopRequireDefault(_client3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 白板对外入口, 依赖账号体系
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 该文件主要管理和IM账号相关，作为总的入口调用其他接口
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 注：白板支持多实例功能
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	_modules.configMap.CURRENT.SDK_TYPE = _modules.configMap.SDK_TYPE.WHITEBOARD;

	/**
	 *  请使用 {@link WhiteBoard.getInstance} 来初始化白板环境.
	 *  @class
	 *  @name WhiteBoard
	 */

	/**
	 *  @method getInstance
	 *  @memberOf WhiteBoard
	 *  @param {Object} options 配置参数
	 *  @param {NIM} options.nim NIM 实例
	 *  @param {Node} [options.isCustom = true] 是否走上层自己解析
	 *  @param {Node} [options.container] canvas容器
	 *  @param {Boolean} [options.debug=false] 是否开启debug模式，默认不开启，debug模式下浏览器会打印log日志
	 */
	var Client = function (_BaseClient) {
	  _inherits(Client, _BaseClient);

	  function Client(options) {
	    _classCallCheck(this, Client);

	    // this.name = configMap.SDK_TYPE.WHITEBOARD
	    var _this = _possibleConstructorReturn(this, _BaseClient.call(this, options));

	    _this.initWB();
	    return _this;
	  }

	  /** 初始化
	   * 1. 重置所有状态
	   * 2. 初始化白板通讯协议, 约定规则
	   * 3. 初始化白板操作控制
	   */


	  Client.prototype.initWB = function initWB() {
	    if (!this.nim) {
	      throw new Error({ error: '请传入nim实例' });
	    }
	    this.initProtocol();
	    this.initController();
	  };

	  /** 初始化白板通讯协议, 约定事件回调规则 */


	  Client.prototype.initProtocol = function initProtocol() {
	    var nim = this.nim;
	    nim.on('wbBeCalled', this.onBeCalled.bind(this));
	    nim.on('wbNotifyCalleeAck', this.onCalleeAck.bind(this));
	    nim.on('wbNotifyHangup', this.onHangup.bind(this));
	    nim.on('wbControl', this.onControl.bind(this));
	    nim.on('wbNotifyCalleeAckSync', this.onCalleeAckSync.bind(this));
	    nim.on('wbNotifyJoin', this.onNotifyJoin.bind(this));
	  };

	  /** 初始化控制器 */


	  Client.prototype.initController = function initController() {
	    var _this2 = this;

	    // console.log('client', this)
	    window.myWbContrl = this.controller = new _controller2['default']({
	      appKey: this.nim && this.nim.options.appKey,
	      debug: this.debug,
	      container: this.container,
	      logger: this.logger,
	      client: this,
	      isCustom: this.isCustom
	    });
	    this.controller.on('userJoined', this.onUserJoin.bind(this));
	    this.controller.on('signalClosed', function (obj) {
	      _this2.emit('signalClosed', obj);
	    });
	    this.controller.on('willReconnect', function (obj) {
	      _this2.emit('willReconnect', obj);
	    });
	    this.controller.on('disconnected', function (obj) {
	      _this2.emit('disconnected', obj);
	    });
	    this.controller.on('connected', function (obj) {
	      _this2.emit('connected', obj);
	    });
	    this.controller.on('leaveChannel', this.onUserLeft.bind(this));
	    this.controller.on('error', function (obj) {
	      _this2.emit('error', obj);
	    });
	    this.controller.on('customData', function (obj) {
	      _this2.emit('customData', obj);
	    });
	    this.controller.on('data', function (obj) {
	      _this2.emit('data', {
	        account: _this2.getAccountWithUid(obj.uid),
	        data: obj.data
	      });
	    });
	    window.addEventListener('beforeunload', this.beforeunload.bind(this));
	  };

	  /**
	   * 通话类型整合处理, 目前只支持音频, 这里先写死
	   * 整合成一个数组
	   */


	  Client.prototype.serializeType = function serializeType(type, netcallType) {
	    if (!netcallType || netcallType === _constant.constantBB.CALL_TYPE_NONE) {
	      return [type];
	    }
	    if (netcallType !== _constant.constantBB.CALL_TYPE_AUDIO) {
	      return [type];
	    }
	    return [netcallType, type];
	  };

	  /**
	   * 通话类型反解析, 目前只支持音频, 这里先写死
	   * 根据收到的数组进行反解析
	   */


	  Client.prototype.unserializeType = function unserializeType(arr) {
	    var tmp = {};
	    var i = -1;
	    arr.map(function (item, index) {
	      if (item === _constant.constantBB.CALL_TYPE_AUDIO) {
	        tmp.netcallType = _constant.constantBB.CALL_TYPE_AUDIO;
	        i = index;
	      }
	    });
	    if (i !== -1) {
	      arr.splice(tmp.i, 1);
	    }
	    tmp.type = arr[0];
	    return tmp;
	  };

	  /**
	   *  发起白板呼叫
	   *  @method call
	   *  @memberOf WhiteBoard#
	   *  @param  {Object} options            配置参数
	   *  @param  {Number} options.type       {@link WhiteBoard.WB_TYPE_*|白板类型}
	   *  @param  {Boolean} options.netcallType     {@link WhiteBoard.CALL_TYPE_*|音视频类型}, 默认值：0
	   *  @param  {String} options.account    对方账号
	   *  @param  {Boolean} options.webrtcEnable  是否开启WhiteBoard通话的支持
	   *  @param  {Object} [options.pushConfig] 推送配置
	   *  @param  {Boolean} [options.pushConfig.enable=true] 是否需要推送, 默认 true
	   *  @param  {Boolean} [options.pushConfig.needBadge=true] 是否需要角标计数, 默认 true
	   *  @param  {Boolean} [options.pushConfig.needPushNick=true] 是否需要推送昵称, 默认 true
	   *  @param  {String} [options.pushConfig.pushContent] 推送内容
	   *  @param  {String} [options.pushConfig.custom] 自定义通知数据
	   *  @param  {String} [options.pushConfig.pushPayload] JSON格式的推送 payload
	   *  @param  {String} [options.pushConfig.sound] 推送声音
	   *  @param  {Object} [options.sessionConfig] 会话配置
	   *  @param  {Number} [options.sessionConfig.width] 宽度
	   *  @param  {Number} [options.sessionConfig.height] 高度
	   *  @param  {Boolean} [options.sessionConfig.record=false] 服务端白板录制开关，默认关闭
	   *  @return {Void}
	   */


	  Client.prototype.call = function call() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var account = options.account,
	        type = options.type,
	        netcallType = options.netcallType,
	        pushConfig = options.pushConfig,
	        sessionConfig = options.sessionConfig,
	        webrtcEnable = options.webrtcEnable;

	    this.calling = true;
	    this.isCaller = true;
	    this.callee = account;
	    this.target.account = account;
	    if (sessionConfig) {
	      sessionConfig.signalStartTime = Date.now();
	      this.setSessionConfig(sessionConfig);
	    }
	    return this.initWhiteBoard({
	      type: type,
	      netcallType: netcallType,
	      pushConfig: pushConfig,
	      webrtcEnable: webrtcEnable
	    });
	  };

	  // 如果是主叫, 需要先初始化 Netcall 来获取 channelId 等信息


	  Client.prototype.initWhiteBoard = function initWhiteBoard() {
	    var _this3 = this;

	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var type = options.type,
	        netcallType = options.netcallType,
	        pushConfig = options.pushConfig,
	        webrtcEnable = options.webrtcEnable;

	    this.type = type;
	    this.netcallType = netcallType || _constant.constantBB.CALL_TYPE_NONE;
	    this.setSessionConfig({ signalStartTime: Date.now() });

	    var config = {
	      type: this.serializeType(this.type, this.netcallType),
	      accounts: [this.callee],
	      pushConfig: pushConfig
	    };
	    if (webrtcEnable) {
	      config.webrtcEnable = options.webrtcEnable;
	    }
	    // 通话类型处理
	    return this.nim.initWhiteBoard(config).then(function (obj) {
	      _this3.signalInited = true;
	      _this3.sessionMode = 'p2p';
	      _this3.logger.log('initWhiteBoard:', obj);
	      _this3.callerInfo = _this3.wbFormat(obj);
	      _this3.imInfo = _this3.callerInfo;
	      _this3.imInfo.sessionMode = _this3.sessionMode;
	      // 记录 channelId 作为过滤各种通知的条件, 只有当 channelId 匹配的时候才处理各种通知
	      _this3.channelId = obj.channelId;
	    })['catch'](function (error) {
	      _this3.setSessionConfig({ signalEndTime: Date.now() });
	      _this3.resetWhenHangup();
	      throw error;
	    });
	  };

	  /**
	   *  响应呼叫
	   *
	   *  @method response
	   *  @memberOf WhiteBoard#
	   *  @param  {Object} [options={}] 配置参数
	   *  @param  {Boolean} [options.accepted=true] true 接听, false 拒绝
	   *  @param  {Object} options.beCalledInfo 被呼叫的信息, 在 beCalling 事件里可以接收到的信息
	   *  @param  {Object} [options.sessionConfig] 会话配置
	   *  @param  {Number} [options.sessionConfig.width] 宽度
	   *  @param  {Number} [options.sessionConfig.height] 高度
	   *  @param  {Boolean} [options.sessionConfig.record=false] 服务端白板录制开关，默认关闭
	   *  @return {Promise}
	   */


	  Client.prototype.response = function response() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    options.fn = 'wbCalleeAck';
	    return this.baseResponse(options);
	  };

	  /**
	   *  发送音视频通话控制指令
	   *  @method control
	   *  @memberOf WhiteBoard#
	   *  @param  {Object} options={} 配置参数
	   *  @param  {String} [options.channelId] 要发送指令的通话的 channelId, 如果不填那么默认为当前通话
	   *  @param  {Number} [options.command] 可选控制指令请参考 {@link WhiteBoard.NETCALL_CONTROL_COMMAND_*}
	   *  @param  {String} [options.info] 命令信息
	   *  @return {Void}
	   */


	  Client.prototype.control = function control() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    options.info = '';
	    options.fn = 'wbControl';
	    return this.baseControl(options);
	  };

	  /**
	   *  挂断音视频通话
	   *  @method hangup
	   *  @memberOf WhiteBoard#
	   *  @param  {String} [channelId] 要挂断的通话的 channelId, 如果不填那么挂断当前通话
	   *  @return {Void}
	   */


	  Client.prototype.hangup = function hangup() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    options.fn = 'wbHangup';
	    return this.baseHangup(options);
	  };

	  /**
	   *  创建频道
	   *  @method createChannel
	   *  @memberOf WhiteBoard#
	   *  @param  {Object} options              配置参数
	   *  @param  {Number} options.channelName  频道名称
	   *  @param  {String} options.custom       扩展字端（用于上层放自定义数据，选填）
	   *  @return {Promise}
	   */


	  Client.prototype.createChannel = function createChannel(options) {
	    _utils2['default'].verifyOptions(options, 'channelName');
	    options.custom = options.custom || '';
	    return this.baseCreateChannel('wbCreateChannel', options).then(function (obj) {
	      return Promise.resolve(obj);
	    })['catch'](function (error) {
	      return Promise.reject(error);
	    });
	  };

	  /**
	   *  主动加入频道
	   *  @method joinChannel
	   *  @memberOf WhiteBoard#
	   *  @param  {Object} options      白板相关配置参数
	   *  @param  {String} options.channelName   频道名称
	   *  @param  {Object} option.sessionConfig      配置参数
	   *  @param  {Number} [options.sessionConfig.width] 宽度
	   *  @param  {Number} [options.sessionConfig.height] 高度
	   *  @param  {num} [option.sessionConfig.record] 是否录制
	   *  @return {Promise}
	   */

	  Client.prototype.joinChannel = function joinChannel(options) {
	    var _this4 = this;

	    if (this.signalInited) return Promise.reject('已经加入会议');

	    // 埋点
	    // this.controller.sdkData.dataApi.updateApi('meeting')

	    _utils2['default'].verifyOptions(options, 'channelName');
	    var sessionConfig = options.sessionConfig;
	    if (sessionConfig) {
	      _utils2['default'].merge(this, { sessionConfig: sessionConfig });
	      this.setSessionConfig(sessionConfig);
	      this.setSessionConfig({ signalStartTime: Date.now() });
	    }
	    // var type = options.type
	    return this.baseJoinChannel('wbJoinChannel', {
	      channelName: options.channelName
	    }).then(function (obj) {
	      var tmp = void 0;
	      // console.log('joinchannel', obj)
	      if (obj.turnInfoTag) {
	        tmp = obj.turnInfoTag.dispatchServer && JSON.parse(obj.turnInfoTag.dispatchServer) || obj.turnInfoTag.tunnelServer;
	      }
	      if (tmp && tmp.constructor === String) {
	        tmp = tmp.split(';');
	      }
	      if (tmp && tmp.constructor === Object) {
	        tmp = tmp.webrtcarray;
	      }

	      obj.serverAddrs = tmp || [];
	      _this4.type = obj.type = obj.type;
	      obj.account = _this4.nim.account;
	      obj.sessionConfig = sessionConfig;
	      _this4.imInfo = obj;

	      _this4.startSession(options);
	      return Promise.resolve({
	        uid: obj.uid,
	        account: _this4.nim.account,
	        type: obj.type
	      });
	    })['catch'](function (error) {
	      return Promise.reject(error);
	    });
	  };

	  /** ******************************************************IM回调通知************************************************************ */
	  // 点对点被呼叫了, 重写, 这里主要是为了兼容webrtc字段获取的一致性


	  Client.prototype.onBeCalled = function onBeCalled(obj) {
	    obj = this.wbFormat(obj);
	    if (!this.channelId) {
	      this.signalInited = true;
	      this.channelId = obj.channelId;
	      this.beCalledInfo = obj;
	      this.logger.log('beCalling', obj);
	    }

	    this.emit('beCalling', obj);
	  };

	  // 这里主要是为了兼容webrtc字段获取的一致性，数据格式统一


	  Client.prototype.wbFormat = function wbFormat(obj) {
	    var _obj = obj,
	        turnInfoTag = _obj.turnInfoTag;

	    if (!turnInfoTag || turnInfoTag.constructor !== Array) return obj;
	    turnInfoTag.map(function (item) {
	      if (/[01]/.test(item.type)) {
	        // 音视频请求
	        obj.netcallType = item.type;
	        obj.rtcServerMap = item.dispatchServer;
	        obj.serverMap = JSON.parse(JSON.stringify(item.dispatchServer));
	      } else {
	        // 白板请求
	        obj.type = item.type;
	        obj.wbServerMap = item.dispatchServer;
	      }
	    });
	    obj.netcallType = obj.netcallType || _constant.constantBB.CALL_TYPE_NONE;
	    obj = this.format(obj);

	    // SDK网关地址处理
	    obj.serverAddrs = JSON.parse(JSON.stringify(obj.wbServerMap)) || [];

	    return obj;
	  };

	  Client.prototype.resetWhenHangup = function resetWhenHangup() {
	    // 结束会话
	    this.controller.stopSession();
	    // 重置各种状态
	    this.resetStatus();
	  };

	  return Client;
	}(_client2['default']);

	var fn = Client.prototype;

	_utils2['default'].merge(fn, _client4['default']);

	exports['default'] = Client;
	module.exports = exports['default'];

/***/ },

/***/ 210:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _controller = __webpack_require__(196);

	var _controller2 = _interopRequireDefault(_controller);

	var _adapter = __webpack_require__(207);

	var _adapter2 = _interopRequireDefault(_adapter);

	var _constant = __webpack_require__(85);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 中央控制器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 该文件主要包含以下功能，目前在兼容了音视频的基础上做了基类抽离，但是音视频这期不做改动，无法更改和验证
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * controller里面没有hangup说法，一律leaveChannel
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 主要功能：
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * - 连接信令服务器
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * - 白板功能指令API调度
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * - 和client交互
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var serializeWb = __webpack_require__(172);
	var unserializeWb = __webpack_require__(179);

	var util = __webpack_require__(17);
	var Promise = __webpack_require__(2).Promise;

	// 限制重连次数
	var reConnectLimit = 3;

	// 可用地址
	var wss = null;
	/**
	 * 中央控制器构造函数
	 * @class wbController
	 * @extends {EventEmitter}
	 * @param {Object} option 初始配置项 白板和音视频分别传递不同的参数
	 * @param {Object} option.logger 日志工具函数, 进过入口过滤是否打印
	 * // 音视频部分
	 * @param {dom} option.container 本地音视频流外显区域
	 * @param {dom} option.remoteContainer 对方音视频流外显区域
	 * @param {Object} client 本地客户端实例(client.js调用时把自己传进来)
	 * @param {bool} isCustom = true 是否直接透传自定义数据
	 */

	var Controller = function (_BaseController) {
	  _inherits(Controller, _BaseController);

	  function Controller(option) {
	    _classCallCheck(this, Controller);

	    var _this = _possibleConstructorReturn(this, _BaseController.call(this, option));

	    _this.isCustom = option.isCustom || true;
	    _this.logger = option.logger || {};
	    _this.resetStatus();
	    return _this;
	  }

	  return Controller;
	}(_controller2['default']);

	exports['default'] = Controller;


	var fn = Controller.prototype;

	fn.resetStatus = function () {
	  if (this.wbAdapter) {
	    this.wbAdapter.destory();
	    this.wbAdapter = null;
	  }
	  if (this.nodeTimer) {
	    clearInterval(this.nodeTimer);
	    this.nodeTimer = null;
	  }
	  this.reConnectCount = 0;
	  this.recv_bytes = 0;
	  this.send_bytes = 0;
	};

	/**
	 * 开启会话连接
	 * info
	 * 流程：
	 * 1. 新建signal信道
	 * 2. signal开启连接
	 * @param {obj} info 配置内容
	 * @param {obj} info.uid 用户id
	 * @param {obj} info.cid 房间id
	 * @param {array} info.serverAddrs socket地址列表
	 */
	fn.startSession = function (info) {
	  var _this2 = this;

	  this.imInfo = info || this.imInfo;
	  // 测试网关地址
	  // this.imInfo.serverAddrs.unshift('10.240.76.159:6060')

	  return this.connect().then(function () {
	    // 初始化白板
	    _this2.imInfo.sessionMode === 'meeting' && _this2.initWbAdapter();
	  });
	};

	// 连接白板服务器
	fn.connect = function () {
	  var _this3 = this;

	  return this._startSession().then(function (url) {
	    wss = url;
	    // 清空
	    _this3.reConnectCount = 0;
	    // 一次性事件
	    return new Promise(function (resolve, reject) {
	      _this3.wbLogin();
	      _this3.once('LoginSuccess', function (event) {
	        _this3.logger.log('once LoginSuccess-->', event);
	        resolve(wss);
	      });
	      _this3.once('LoginFailed', function (event) {
	        _this3.logger.log('once LoginFailed-->', event);
	        reject(event);
	      });
	    });
	  });
	};

	/**
	 * 结束会话
	 * 1. 销毁RTC实例
	 * 2. 销毁signal实例
	 */
	fn.stopSession = function () {
	  this.wbLogout();
	  this._stopSession();
	  this.resetStatus();
	  return Promise.resolve();
	};

	/** 设置会话参数 */
	fn.setSessionConfig = function () {
	  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  this.sessionConfig = util.merge(this.sessionConfig, config);
	};

	/**
	 * 服务端操作
	 */
	/** **白板沟通操作 */
	fn.initWbAdapter = function () {
	  if (this.wbAdapter || !this.info.container) {
	    return;
	  }
	  this.wbAdapter = new _adapter2['default'](this.info.container, {
	    UID: this.imInfo.uid,
	    width: parseInt(this.sessionConfig.width) || 400,
	    height: parseInt(this.sessionConfig.height) || 400,
	    limit: 60,
	    debug: this.info.debug
	  });
	  this.wbAdapter.on('action', this.onWbAdapterData.bind(this));
	};

	/**
	 * 采集数据
	 * 进行转发
	 */
	fn.onWbAdapterData = function (data, isCustom) {
	  // 自定义消息
	  if (isCustom) {
	    data = JSON.stringify({
	      isCustom: 1,
	      data: data
	    });
	  }

	  this.send(data);
	};

	// 发送自定义格式数据
	fn.send = function (data) {
	  var param = {
	    data: data
	  };
	  // 发送统计
	  this.sendStats(data);

	  // 判断是多人模式还是单人模式
	  if (this.imInfo.sessionMode === 'p2p') {
	    param.dst_client_id = this.target && this.target.uid || 0;
	  }
	  var type = this.imInfo.sessionMode === 'p2p' ? serializeWb.gateWay.toUser : serializeWb.gateWay.broadcast;
	  this.sendMsg(type, param);
	};

	/** ***********服务器沟通操作 */
	// 登录
	fn.wbLogin = function () {
	  var param = {
	    token: this.imInfo.cid,
	    client_type: 2, // 客户类型  无符号整型
	    client_net: 2, // 客户网络类型  无符号整型
	    client_os: 6, // 客户端操作系统  无符号整型
	    client_support_record: ~~this.sessionConfig.record
	  };
	  this.sendMsg(serializeWb.gateWay.login, param);
	};

	// 登出
	fn.wbLogout = function () {
	  var timestamps = Date.now();
	  var param = {
	    timestamp: timestamps,
	    recv_bytes: this.recv_bytes,
	    send_bytes: this.send_bytes
	  };
	  this.sendMsg(serializeWb.gateWay.logout, param);
	};

	/**
	 * 和服务器的沟通
	 * type: 协议类型
	 * param: 协议内容
	 */
	fn.sendMsg = function (type, param) {
	  var content = {
	    type: type, // 消息类型  无符号整型
	    uid: +this.imInfo.uid, // 用户id 64位无符号整型
	    cid: +this.imInfo.cid, // 频道id   64位无符号整型
	    version: 31, // 版本号   无符号整型
	    content: {
	      params: param
	    }
	  };
	  // this.signal && this.logger.log(`sendMsg ---> ${type}`, content)
	  this.signal && this.signal.send(content);
	};

	/**
	 * 服务端消息统一解析
	 */
	fn.onSignalMessage = function (message) {
	  // socket传输过程中，uid和cid总是字符串，因为服务器限制，这里要做处理
	  if (message && message.cid && message.uid) {
	    message.cid = +message.cid;
	    message.uid = +message.uid;
	  }
	  if (message.cid !== this.imInfo.cid) {
	    return this.logger.error('websocket message not belong to this session');
	  }

	  var type = unserializeWb.gateWay[message.type];
	  // this.logger.log('服务器数据回包:', type, message)
	  this['on' + type] && this['on' + type](message);
	};

	/** **********************************网关服务器通知消息处理********************************************* */
	// 登录回调
	fn.onloginAck = function (message) {
	  var _this4 = this;

	  // 验证是否通过
	  var code = message.content.params.auth_result - 0;
	  // code = Math.random() > 0.5 ? code : 201
	  if (code !== 200) {
	    this.logger.error('服务器验证不通过, 断开连接');
	    this.emit('LoginFailed', { code: code, error: '服务器验证不通过, 断开连接' });
	    return;
	  }
	  this.logger.log('白板服务器登录成功', message);
	  this.emit('LoginSuccess');
	  // 登录成功开始p2p倒计时
	  if (this.imInfo.sessionMode === 'p2p') {
	    // 45秒钟另一方用户还没有连接上来，触发超时错误
	    this.userJoinTimeoutId = setTimeout(function () {
	      if (_this4.userJoinTimeoutId && Object.keys(_this4.remoteUidStatus).length === 0) {
	        _this4.emit('error', { error: '点对点对方登录超时, 断开连接' });
	      }
	    }, 45 * 1000);
	  }
	};

	// 有人加入房间
	fn.onjoin = function (data) {
	  this.logger.log(data);
	  var uid = data.content && data.content.params && data.content.params.client_id;
	  // 开启节点心跳状态维护
	  this.startNodeMonitor(uid);
	  if (this.imInfo.sessionMode === 'p2p') {
	    this.target = {
	      uid: uid
	    };
	    this.initWbAdapter();
	    this.userJoinTimeoutId && clearTimeout(this.userJoinTimeoutId);
	    this.userJoinTimeoutId = 0;
	  }
	  this.emit('userJoined', {
	    uid: uid,
	    cid: data.cid
	  });
	};

	// 节点状态回包，维护
	fn.onkeep_alive_node = function (obj) {
	  var uid = obj.uid;
	  var tmpStats = this.remoteUidStatus;
	  // 节点状态维护
	  tmpStats[uid] = tmpStats[uid] || { now: Date.now(), total: 45 };
	  tmpStats[uid].now = Date.now();
	  tmpStats[uid].total = 45;
	};

	// 有人离开房间
	fn.onlogout = function (obj) {
	  this.logger.log('onlogout', obj);
	  this.emit('leaveChannel', {
	    uid: obj.uid,
	    channelId: obj.cid
	  });
	};

	// p2p 模式数据传输
	fn.ontoUser = function (message) {
	  // this.logger.log('p2p 模式数据传输', message)
	  this.onData(message);
	};

	// 多人模式数据传输
	fn.onbroadcast = function (message) {
	  // this.logger.log('多人 模式数据传输', message)
	  this.onData(message);
	};

	// 接收数据处理
	fn.onData = function (message) {
	  var data = message.content && message.content.params && message.content.params.data;

	  var uid = message.uid;
	  // 接收统计
	  this.receiveStats(data);

	  var tmp = void 0;
	  try {
	    tmp = JSON.parse(data || null);
	  } catch (e) {
	    tmp = data;
	  }

	  this.onkeep_alive_node({ uid: uid });

	  // 是否直接透传
	  if (this.info.isCustom) {
	    this.emit('data', { uid: uid, data: tmp });
	    return;
	  }

	  // 判断是否是自定义数据
	  if (tmp.constructor === Object) {
	    tmp.isCustom && this.emit('customData', { UID: message.uid, data: tmp.data });
	    return;
	  }

	  this.wbAdapter && this.wbAdapter.act({ UID: message.uid, data: tmp });
	};

	// 开启节点心跳检测, 45s超时断开, 5s超时提示
	fn.startNodeMonitor = function (uid) {
	  var _this5 = this;

	  var tmpStats = this.remoteUidStatus;
	  tmpStats[uid] = tmpStats[uid] || { now: Date.now(), total: 45 };
	  tmpStats[uid].now = Date.now();
	  if (this.nodeTimer) return;
	  this.nodeTimer = setInterval(function () {
	    var now = Date.now();
	    // this.logger.log('节点巡查开始', Object.keys(tmpStats))
	    Object.keys(tmpStats).map(function (item) {
	      if (now - tmpStats[item].now > 50 * 1000 || tmpStats[item].total <= 0) {
	        _this5.logger.warn('节点45s超时离开:', item);
	        _this5.emit('leaveChannel', {
	          uid: item,
	          type: _constant.constantBB.HANGUP_TYPE_TIMEOUT,
	          channelId: _this5.imInfo.cid
	        });
	        // 删除对应的节点
	        delete tmpStats[item];
	        return;
	      }
	      if (now - tmpStats[item].now > 5 * 1000) {
	        // this.logger.warn(
	        //   `节点5s内未收到心跳包，${tmpStats[item].total}s后将超时断开:`,
	        //   item
	        // )
	        tmpStats[item].total -= 5;
	        return;
	      }
	      // this.logger.log('节点正常:', item)
	    });
	    // this.logger.log('节点巡查结束')
	  }, 5 * 1000);
	};
	/** *************** */
	// 超时重连
	fn.onSignalTimeout = function () {
	  var _this6 = this;

	  this.emit('disconnected');
	  // 启动断网重连
	  if (this.reConnectCount >= reConnectLimit) {
	    this.emit('signalClosed');
	    return;
	  }
	  this.reConnectCount++;
	  this.emit('willReconnect', this.reConnectCount);
	  this.logger.log('3s\u540E\u5C1D\u8BD5\u7B2C' + this.reConnectCount + '\u6B21\u91CD\u8FDE\u670D\u52A1\u5668');
	  this._stopSignal();
	  setTimeout(function () {
	    _this6.logger.log('\u5F00\u59CB\u7B2C' + _this6.reConnectCount + '\u6B21\u91CD\u8FDE\u670D\u52A1\u5668');
	    // this.logger.log('wss 地址', wss)
	    if (wss) {
	      _this6.imInfo.serverAddrs.unshift(wss);
	    }
	    _this6.connect().then(function () {
	      _this6.emit('connected', _this6.reConnectCount);
	    })['catch'](function (e) {
	      _this6.logger.error('reconnect error', e);
	      _this6.onSignalTimeout();
	    });
	  }, 3 * 1000);
	};

	/** ***************************************************画布的操作********************************************************* */

	// 撤销
	fn.undo = function () {
	  this.wbAdapter && this.wbAdapter.undo();
	};

	// 反撤销
	fn.redo = function () {
	  this.wbAdapter && this.wbAdapter.redo();
	};

	// 清除
	fn.clear = function () {
	  this.wbAdapter && this.wbAdapter.clear();
	};

	// 画面大小设置
	fn.resize = function () {
	  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  this.wbAdapter.resize(option.width);
	};

	// 自定义数据API
	fn.sendCustomData = function (data) {
	  this.onWbAdapterData(data, true);
	};

	// 发包统计数据
	fn.sendStats = function (data) {
	  this.send_bytes += data.length;
	  // this.logger.log('发包统计', this.send_bytes)
	};

	// 收包统计数据
	fn.receiveStats = function (data) {
	  this.recv_bytes += data.length;
	  // this.logger.log('收包统计', this.recv_bytes)
	};
	module.exports = exports['default'];

/***/ }

/******/ })
});
;