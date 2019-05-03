"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArgumentNotFoundError = ArgumentNotFoundError;
exports.ArgumentTypeError = ArgumentTypeError;
exports.default = void 0;

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

Utils = new Utils();

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
}

var _default = Utils;
exports["default"] = _default;