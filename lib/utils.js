"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArgumentNotFoundError = ArgumentNotFoundError;
exports.ArgumentTypeError = ArgumentTypeError;
exports.QueryParams = exports.Utils = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Utils =
/*#__PURE__*/
function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: "isString",
    value: function isString(variable) {
      return Object.prototype.toString.call(variable) === "[object String]";
    }
  }, {
    key: "isNumber",
    value: function isNumber(variable) {
      return Object.prototype.toString.call(variable) === "[object Number]";
    }
  }, {
    key: "isRegExp",
    value: function isRegExp(variable) {
      return Object.prototype.toString.call(variable) === "[object RegExp]";
    }
  }, {
    key: "isArray",
    value: function isArray(variable) {
      return Object.prototype.toString.call(variable) === "[object Array]";
    }
  }, {
    key: "isObject",
    value: function isObject(variable) {
      return Object.prototype.toString.call(variable) === "[object Object]";
    }
  }, {
    key: "isFunction",
    value: function isFunction(variable) {
      return Object.prototype.toString.call(variable) === "[object Function]";
    }
  }, {
    key: "isBoolean",
    value: function isBoolean(variable) {
      return Object.prototype.toString.call(variable) === "[object Boolean]";
    }
  }, {
    key: "isNull",
    value: function isNull(variable) {
      return Object.prototype.toString.call(variable) === "[object Null]";
    }
  }, {
    key: "isUndefined",
    value: function isUndefined(variable) {
      return Object.prototype.toString.call(variable) === "[object Undefined]";
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(variable) {
      return this.isUndefined(variable) || this.isNull(variable) || variable === 0 || variable === false || (this.isString(variable) || this.isArray(variable)) && variable.length === 0 || this.isObject(variable) && Object.getOwnPropertyNames(variable).length === 0;
    }
  }, {
    key: "isSet",
    value: function isSet(variable) {
      return !this.isUndefined(variable) && !this.isNull(variable);
    }
  }]);

  return Utils;
}();

exports.Utils = Utils;
exports.Utils = Utils = new Utils();

function ArgumentNotFoundError(argName) {
  var name = "ArgumentNotFoundError";
  var message = Utils.isSet(argName) ? "".concat(argName, " argument is required. None found") : "Required argument was not found";
  var instance = new Error(message);
  instance.name = name;
  instance.message = message;

  instance.toString = function () {
    return instace.message;
  };

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));

  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, ArgumentNotFoundError);
  }

  return instance;
}

function ArgumentTypeError(argName, argType, argValue) {
  argType = Utils.isSet(argType) ? argType.toString() : _typeof(argType);
  var name = "ArgumentTypeError";
  var message = Utils.isSet(argName) ? "typeof ".concat(argName.toString(), " argument must be equal to ").concat(argType, ". ").concat(_typeof(argValue), " found.") : "Invalid argument type found";
  var instance = new Error(message);
  instance.name = name;
  instance.message = message;

  instance.toString = function () {
    return this.message;
  };

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));

  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, ArgumentTypeError);
  }

  return instance;
}

ArgumentNotFoundError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
ArgumentTypeError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(ArgumentNotFoundError, Error);
  Object.setPrototypeOf(ArgumentTypeError, Error);
} else {
  ArgumentNotFoundError.__proto__ = Error;
  ArgumentTypeError.__proto__ = Error;
} // QueryParams class constants


var KEYS = [];
var QUERIES = [];
var QUERY_STRING = "";
var HISTORY_MODE;

var DECODE = function DECODE(value) {
  return decodeURIComponent(value);
};

var DECODE_KEY = function DECODE_KEY(key) {
  return decodeURIComponent(key.split(' ').join(''));
};

var GET_PARAM = function GET_PARAM(key) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var param = null;

  if (index) {
    param = QUERIES[index][key];
  } else {
    QUERIES.some(function (query) {
      if (query.hasOwnProperty(key)) return param = query[key];
    });
  }

  return param;
};

var QueryParams =
/*#__PURE__*/
function () {
  function QueryParams() {
    var _this = this;

    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var historyMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, QueryParams);

    QUERY_STRING = url ? url : window.location.search;
    HISTORY_MODE = window.PopStateEvent && "pushState" in window.history ? historyMode : false;

    if (HISTORY_MODE) {
      window.addEventListener("popstate", function (e) {
        var event = e.currentTarget;
        QUERY_STRING = event.location.search;
        KEYS = [];
        QUERIES = [];
        return _this.init(); // re run this class again
      });
    }

    ;
    this.init();
  }

  _createClass(QueryParams, [{
    key: "init",
    value: function init() {
      if (QUERY_STRING) {
        var queryArray = QUERY_STRING.slice(1).split("&");
        queryArray.forEach(function (query) {
          query = query.split('=');
          KEYS.push(DECODE_KEY(query[0]));
          var obj = {};
          obj[DECODE_KEY(query[0])] = query.length > 1 ? DECODE(query[1]) : true; // return true if search query has no value

          QUERIES.push(obj);
        }, this);
      }
    }
  }, {
    key: "keys",
    value: function keys() {
      return KEYS;
    }
  }, {
    key: "has",
    value: function has(key) {
      key = DECODE_KEY(key);
      return KEYS.length > 0 && GET_PARAM(key) ? true : false;
    }
  }, {
    key: "get",
    value: function get(key) {
      key = DECODE_KEY(key);
      return this.has(key) ? GET_PARAM(key) : null;
    }
  }, {
    key: "getAll",
    value: function getAll(key) {
      key = DECODE_KEY(key);
      return this.has(key) ? GET_PARAM(key).split(',') : [];
    }
  }, {
    key: "toString",
    value: function toString() {
      var string = "";

      if (QUERY_STRING) {
        string = "?";
        KEYS.forEach(function (key, index) {
          var value = GET_PARAM(key, index) === true ? '' : "=".concat(GET_PARAM(key, index));
          var newString = index === 0 ? key + value : "&".concat(key + value);
          string += newString;
        });
      }

      return string;
    }
  }, {
    key: "append",
    value: function append(key, value) {
      if (!Utils.isSet(key)) throw new ArgNotFound("key");
      key = DECODE_KEY(key);
      value = Utils.isSet(value) ? DECODE(value) : true;
      var index = KEYS.push(key) - 1;
      QUERIES[index] = _defineProperty({}, key, value);
      QUERY_STRING = QUERY_STRING ? this.toString() : true;

      if (HISTORY_MODE) {
        window.history.pushState('', '', this.toString());
      }

      return GET_PARAM(key, index);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (!Utils.isSet(key)) throw new ArgNotFound("key");
      key = DECODE_KEY(key);
      value = Utils.isSet(value) ? DECODE(value) : true;
      QUERY_STRING = QUERY_STRING ? QUERY_STRING : true;
      var index = KEYS.indexOf(key);

      if (index !== -1) {
        KEYS[index] = key; // replace the key if it exists else append new key

        QUERIES[index] = _defineProperty({}, key, value);
      } else {
        index = KEYS.push(key) - 1;
        QUERIES[index] = _defineProperty({}, key, value);
      }

      QUERY_STRING = QUERY_STRING ? this.toString() : true;

      if (HISTORY_MODE) {
        window.history.pushState('', '', this.toString());
      }

      return GET_PARAM(key, index);
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      if (!Utils.isSet(key)) throw new ArgNotFound("key");
      key = DECODE_KEY(key);
      if (!this.has(key)) return this.has(key); // definitely returns false if key doesn't exist

      var index = KEYS.indexOf(key);
      var value = QUERIES[index][key];
      KEYS.splice(index, 1);
      QUERIES.splice(index, 1);
      QUERY_STRING = QUERY_STRING ? this.toString() : true;

      if (HISTORY_MODE) {
        window.history.pushState('', '', this.toString());
      }

      return value;
    }
  }]);

  return QueryParams;
}();

exports.QueryParams = QueryParams;