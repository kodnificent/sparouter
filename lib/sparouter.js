"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SPARouter =
/*#__PURE__*/
function () {
  /**
  * Instantiates the SPARouter Class.
  * @constructor
  * @param {Object} options
  * @param {boolean} [options.caseInsensitive=true] - if set to false, uri matching will be case sensitive.
  * @param {boolean} [options.historyMode=false] - Set to true if your application uses HTML History Mode Api.  
  * If set to historyMode, SPARouter will handle popstate events by initializing the router again to update the page
  * according to the callback function set with ``SPARouter.get()`` method.
  * @example
  * const router = new SPARouter({
  * historyMode: true,
  * caseInsensitive: false
  * });
  */
  function SPARouter(options) {
    _classCallCheck(this, SPARouter);

    this.routes = [];
    this.path = this._requestPath(); //default options

    var defOptions = {
      caseInsensitive: true,
      historyMode: false
    };

    var mergedOptions = _objectSpread({}, defOptions, options);

    for (var key in mergedOptions) {
      this["_".concat(key)] = mergedOptions[key];
    }

    this._checkHistoryMode();

    this.query = new _utils.QueryParams(null, this._historyMode);
    return this;
  }
  /**
   * The get method is used in assigning routes to your application
   * @method
   * @param {string} uri route to be matched
   * @param {callback} callback a callback function to be invoked if the route has been matched.
   * @param {object} [thisArg=undefined] an argument that represents ``this`` keyword in your callback function. If empty, you will get undefined
   * if you try to use ``this`` keyword in your callback function.  
   * You can't pass the SPARouter class as ``this`` argument as it will return undefined also. The SPARouter class is already provided in the callback function
   * @example
   * // using a callback function
   * SPARouter.get("/some-page-name", (req, router)=>{
   *      console.log(this.argument); // outputs "A stored argument from my callback function" to the console
   *      console.log(req.url); // outputs "/some-page-name" to the console
   * }, {argument: "A stored argument from my callback function"}); // this ouputs "a stored argument from my callback function" to the console.
   * 
   * // using a class method
   * class SomeClass {
   *      constructor(){
   *          this.argument = "A stored argument from my class";
   *      }
   *      pageFunction(req, router){
   *          console.log(this.argument); // outputs "A stored argument from my class" to the console
   *          console.log(req.url); // outputs "/some-page-name" to the console
   *      }
   * }
   * myClass = new SomeClass();
   * SPARouter.get("/some-page-name", myClass.pageFunc, myClass);
   */

  /**
   * Callback function passed in the ```SPARouter.get()``` method.
   * @callback callback
   * @param {request} request
   * @param {router} router
   */


  _createClass(SPARouter, [{
    key: "get",
    value: function get(uri, callback, thisArg) {
      if (!_utils.Utils.isSet(uri)) throw new _utils.ArgumentNotFoundError("uri");
      if (!_utils.Utils.isSet(callback)) throw new _utils.ArgumentNotFoundError("callback");
      if (!_utils.Utils.isString(uri)) throw new _utils.ArgumentTypeError("uri", "string", uri);
      if (!_utils.Utils.isFunction(callback)) throw new _utils.ArgumentTypeError("callback", "function", callback);
      thisArg = thisArg instanceof SPARouter ? undefined : thisArg;
      var route = {
        uri: null,
        callback: null,
        thisArg: thisArg,
        parameters: null,
        regExp: null,
        name: null,
        current: false
      };

      if (this._caseInsensitive) {
        uri = uri.toLowerCase();
      }

      ;
      uri = uri.startsWith("/") ? uri : "/".concat(uri);
      this.routes.forEach(function (route) {
        if (route.uri === uri) throw new Error("Conflicting routes. The route uri ".concat(route.uri, " already exists"));
      });
      route.uri = uri;
      route.callback = callback;
      route.parameters = this._proccessParameters(route.uri);
      this.routes.push(route);
      return this;
    }
    /**
     * @method
     * Match the uri route where a parameter name matches a regular expression. This method must be chained to the
     * ``SPARouter.get()`` method.
     * @param {string} name parameter name to match
     * @param {string} regExp regular expression pattern but must be in string format, without front slashes that converts
     * it to a regExp object. E.g "0-9", "[A-Z]". See example below  
     * Special characters which you wish to escape with the backslash must be double escaped. E.g "\\\w" instead of "\w";
     * @example
     * router.get("/{page-name}/{id}",function(req, router){
     * //do something with this route
     * 
     * 
     * }).where("page-name","user").where("id","[0-9]+");
     * //this route will match my-site.com/user/10, my-site.com/user/15
     * // it won't match my-site.com/admin/10, my-site.com/user/login
     */

  }, {
    key: "where",
    value: function where(name, regExp) {
      //validate type
      if (!_utils.Utils.isSet(name)) throw new _utils.ArgumentNotFoundError("name");
      if (!_utils.Utils.isSet(regExp)) throw new _utils.ArgumentNotFoundError("regExp");
      if (!_utils.Utils.isString(name)) throw new _utils.ArgumentTypeError("name", "string", name);
      if (!_utils.Utils.isString(regExp)) throw new _utils.ArgumentTypeError("regExp", "string", regExp);
      var route = this.routes[this.routes.length - 1]; // the target route
      //if paramaters exists for this route

      if (route.parameters.length === 0) throw new Error("No Parameters Found: Could not set paramater regExpression for [".concat(route.uri, "] because the route has no parameters"));
      regExp = regExp.replace(/\(/g, "\\(");
      regExp = regExp.replace(/\)/g, "\\)");
      regExp = "(".concat(regExp, "+)");
      var parameterFound = false;
      route.parameters.forEach(function (parameter, index) {
        if (parameter[name] !== undefined) {
          parameterFound = true;
          parameter[name].regExp = regExp;
        }
      });
      if (!parameterFound) throw new Error("Invalid Parameter: Could not set paramater regExpression for [".concat(route.uri, "] because the parameter [").concat(name, "] does not exist"));
      return this;
    }
    /**
     * SPARouter supports named routes. This methods sets the name of a route and can be referrenced using the
     * `router.pathFor(name)` inside your callback function in `SPARouter.get()` method.  
     * This method must be chained to the `SPARouter.get()` method.
     * @method
     * @param {string} name route name
     * @example
     * router = new SPARouter(options)
     * router.get("/user/login", function(req, router){
     * // some functions here
     * 
     * 
     * }).setName("user-login");
     * 
     * router.get("/user/home", function(req, router){
     * console.log(router.pathFor("user-home")) // outputs: /user/home
     * console.log(router.pathFor("user-login")) // outputs: /user/login
     * 
     * }).setName("user-home")
     */

  }, {
    key: "setName",
    value: function setName(name) {
      if (!_utils.Utils.isSet(name)) throw new _utils.ArgumentNotFoundError("name");
      if (!_utils.Utils.isString(name)) throw new _utils.ArgumentTypeError("name", "string", name);
      var targetRoute = this.routes[this.routes.length - 1];
      this.routes.forEach(function (route) {
        if (route.name === name) throw new Error("Duplicate naming. A route with name ".concat(name, " already exists"));
      });
      targetRoute.name = name;
      return this;
    }
    /**
     * Initialize the Router.  
     * Call this method after setting up all route paths.
     * @method
     * @example
     * const router = new SPARouter(myOptions);
     * router.get("/", homeCallback);
     * router.get("/about", aboutCallback).setName("about");
     * router.get("/contact", contactCallback).setName("contact");
     * router.notFoundHandler(myNotFoundHandler);
     * router.init();
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      this.routes.forEach(function (route) {
        _this._proccessRegExp(route);
      }, this);
      var found = false;
      var routerObj = {
        pathFor: function pathFor(name, parameter) {
          return _this._pathFor(name, parameter);
        },
        goTo: function goTo(url, data, title) {
          return _this._goTo(url, data, title);
        },
        historyMode: this._historyMode
      };
      this.routes.some(function (route) {
        if (_this._requestPath().match(route.regExp)) {
          route.current = true;
          found = true;
          var request = {};
          request.param = _this._processRequestParameters(route);
          request.query = _this.query;
          request.uri = window.location.pathname;
          return route.callback.call(route.thisArg, request, routerObj);
        }
      }, this);

      if (!found) {
        if (!this._notFoundFunction) return;
        var request = {};
        request.uri = window.location.pathname;
        return this._notFoundFunction(request, routerObj);
      }
    }
    /**
     * A callback handler to execute if no route is matched.
     * @method
     * @param {function} callback Callback function
     * @example
     * router.notFoundHandler(function(){
     * console.log("page not found");
     * // or redirect to the 404 page
     * // or do anything you want!
     * });
     */

  }, {
    key: "notFoundHandler",
    value: function notFoundHandler(callback) {
      if (!_utils.Utils.isSet(callback)) throw new _utils.ArgumentNotFoundError("callback");
      if (!_utils.Utils.isFunction(callback)) throw new _utils.ArgumentTypeError("callback", "function", callback);
      this._notFoundFunction = callback;
      return this;
    }
    /**
     * Redirect one url to another
     * @method
     * @private
     * @todo create api for redirecting routes
     */

  }, {
    key: "redirect",
    value: function redirect(oldUrl, newUrl) {
      /*if(this._caseInsensitive){
          oldUrl = oldUrl.toLowerCase();
          newUrl = newUrl.toLowerCase();
      }
        if(oldUrl === newUrl) throw new Error("Redirect loop found as both urls are the same");
        if(typeof oldUrl === "string"){
          this._getParameters(oldUrl, (params, newRoute)=>{
              oldUrl = newRoute;
          });
      }
        if (this._requestPath().match(`${oldUrl}$`)){
          return window.location.href= newUrl;
      }*/
      return this;
    }
    /**
     * Route grouping
     * @method
     * @todo create api for grouping routes
     * @private
     */

  }, {
    key: "group",
    value: function group() {}
  }, {
    key: "_goTo",
    value: function _goTo(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      if (!_utils.Utils.isSet(url)) throw new _utils.ArgumentNotFoundError("url");
      if (!_utils.Utils.isString(url)) throw new _utils.ArgumentTypeError("url", "string", url);
      if (_utils.Utils.isEmpty(url)) throw new TypeError("url cannot be empty");

      if (!this._historyMode) {
        var storage = window.localStorage;
        storage.setItem("pushState", data);
        return window.location.href = url;
      }

      window.history.pushState(data, title, url);
      return this.init();
    }
  }, {
    key: "_pathFor",
    value: function _pathFor(name) {
      var _this2 = this;

      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!_utils.Utils.isSet(name)) throw new _utils.ArgumentNotFoundError("name");
      if (!_utils.Utils.isString(name)) throw new _utils.ArgumentTypeError("name", "string", string);
      if (_utils.Utils.isEmpty(name)) throw new TypeError("name cannot be empty");
      var nameFound = false;
      var uri;
      this.routes.some(function (route) {
        if (route.name === name) {
          nameFound = true;
          uri = route.uri;

          if (_this2._containsParameter(uri)) {
            if (!_utils.Utils.isSet(paramaters)) throw new _utils.ArgumentNotFoundError("parameters");
            if (!_utils.Utils.isObject(parameters)) throw new _utils.ArgumentTypeError("parameters", "object", parameters);
            if (_utils.Utils.isEmpty(parameters)) throw new TypeError("parameters cannot be empty");
            var array = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = route.uri.match(/\{(\w+)\}/g)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var value = _step.value;
                value = value.replace("{", "");
                value = value.replace("}", "");
                array.push(value);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            if (array.length !== Object.getOwnPropertyNames(parameters).length) throw new Error("The route with name [".concat(name, "] contains ").concat(array.length, " parameters. ").concat(Object.getOwnPropertyNames(parameters).length, " given"));

            for (var parameter in parameters) {
              if (!array.includes(parameter)) throw new Error("Invalid parameter name [".concat(parameter, "]"));
              var r = new RegExp("{".concat(parameter, "}"), "g");
              uri = uri.replace(r, parameters[parameter]);
            }
          }
        }
      });
      if (!nameFound) throw new Error("Invalid route name [".concat(name, "]"));
      return uri;
    }
  }, {
    key: "_proccessParameters",
    value: function _proccessParameters(uri) {
      var parameters = [];
      var sn = 0;

      if (this._containsParameter(uri)) {
        uri.replace(/\{\w+\}/g, function (parameter) {
          sn++;
          parameter.replace(/\w+/, function (parameterName) {
            var obj = {};
            obj[parameterName] = {
              sn: sn,
              regExp: "([^\\/]+)",
              // catch any word except '/' forward slash
              value: null
            };
            parameters.push(obj);
          });
        });
      }

      return parameters;
    }
  }, {
    key: "_proccessRegExp",
    value: function _proccessRegExp(route) {
      var regExp = route.uri; // escape special characters

      regExp = regExp.replace(/\//g, "\\/");
      regExp = regExp.replace(/\./g, "\\.");
      regExp = regExp.replace("/", "/?");

      if (this._containsParameter(route.uri)) {
        //replace uri parameters with their regular expression
        regExp.replace(/{\w+}/g, function (parameter) {
          var parameterName = parameter.replace("{", "");
          parameterName = parameterName.replace("}", "");
          route.parameters.some(function (i) {
            if (i[parameterName] !== undefined) {
              regExp = regExp.replace(parameter, i[parameterName].regExp);
              return regExp;
            }
          });
          return parameter;
        });
      }

      regExp = "^".concat(regExp, "$");
      route.regExp = new RegExp(regExp);
      return route;
    }
  }, {
    key: "_containsParameter",
    value: function _containsParameter(uri) {
      return uri.search(/{\w+}/g) >= 0;
    }
  }, {
    key: "_processRequestParameters",
    value: function _processRequestParameters(route) {
      var routeMatched = this._requestPath().match(route.regExp);

      if (!routeMatched) return;
      var param = {};
      routeMatched.forEach(function (value, index) {
        if (index !== 0) {
          var key = Object.getOwnPropertyNames(route.parameters[index - 1]);
          param[key] = value;
        }
      });
      return param;
    }
  }, {
    key: "_requestPath",
    value: function _requestPath() {
      return window.location.pathname;
    }
  }, {
    key: "_checkHistoryMode",
    value: function _checkHistoryMode() {
      var _this3 = this;

      if (!this._historyMode) return;
      if (!window.PopStateEvent && !"pushState" in history) return; // check for support of popstate event and pushstate in browser

      window.addEventListener("popstate", function (e) {
        _this3.init();
      });
      return this;
    }
    /**
     * The request object is passed as a callback parameter
     * @typedef {Object} request
     * @property {Object} param an object of parameters and their value.
     * @property {string} uri the current request uri
     */

    /**
     * The router object is also passed as a callback parameter
     * @typedef {Object} router
     * @property {pathFor} pathFor
     * @property {goTo} goTo
     * @property {boolean} historyMode check if history mode is set
     */

    /**
     * Returns the uri path for a named route.  
     * If the route has parameters, an object of the parameter name as ``key`` and parameter value as ``value`` should be passed as second argument.
     * @typedef {function} pathFor
     * @memberof router
     * @param {string} name The name of the route
     * @param {Object} [parameter] An object of keys and values containing the parameters of the route and its corresponding value.
     * @returns {string} uri
     * @example
     * var router = new SPARouter(options);
     * router.get("/blog/{slug}", function(req, router){
     * console.log(router.pathFor("blog-post", { slug: "hello-world"})) //outputs: /blog/hello-world
     * }).setName("blog-post");
     */

    /**
     * Use this method if you would like to **go to** or **redirect** to a link.  
     * This method uses window.location.href parsing the url param as the href.  
     * If the historyMode method is set to true, it utilizes the history.pushState() passing
     * the params and reinitializing the router.
     * @typedef {function} goTo
     * @memberof router
     * @param {string} url The url you wish to goto. An absolute url is also acceptable so long it's of the same origin.
     * @param {Object} [data={}] an object of data for HTML history.pushState()
     * @param {string} [title=""] title for HTML history.pushState()
     */

  }]);

  return SPARouter;
}();

var _default = SPARouter;
exports["default"] = _default;