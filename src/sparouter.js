import {
    Utils,
    ArgumentNotFoundError as ArgNotFound, ArgumentTypeError as ArgTypeError, QueryParams
} from "./utils.js";

class SPARouter {

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
    constructor(options){
        this.routes = [];
        this.path =  this._requestPath();

        //default options
        let defOptions = {
            caseInsensitive: true,
            historyMode: false
        };
        let mergedOptions = {...defOptions, ...options};
        for(let key in mergedOptions){
            this[`_${key}`] = mergedOptions[key];
        }
        this._checkHistoryMode();
        this.query = new QueryParams(null, this._historyMode);
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
    get(uri, callback, thisArg){
        if(!Utils.isSet(uri)) throw new ArgNotFound("uri")
        if(!Utils.isSet(callback)) throw new ArgNotFound("callback");

        if(!Utils.isString(uri)) throw new ArgTypeError("uri", "string", uri);
        if(!Utils.isFunction(callback)) throw new ArgTypeError("callback", "function", callback);

        thisArg = thisArg instanceof SPARouter ? undefined : thisArg;

        let route = {
            uri: null,
            callback: null,
            thisArg: thisArg,
            parameters: null,
            regExp: null,
            name: null,
            current: false
        }

        if(this._caseInsensitive) {
            uri = uri.toLowerCase()
        };
        uri = uri.startsWith("/") ? uri : `/${uri}`;
        this.routes.forEach(route=>{
            if(route.uri === uri) throw new Error(`Conflicting routes. The route uri ${route.uri} already exists`);
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
    where(name, regExp){
        
        //validate type
        if(!Utils.isSet(name)) throw new ArgNotFound("name");
        if(!Utils.isSet(regExp)) throw new ArgNotFound("regExp");
        if(!Utils.isString(name)) throw new ArgTypeError("name", "string", name);
        if(!Utils.isString(regExp)) throw new ArgTypeError("regExp", "string", regExp);

        let route = this.routes[this.routes.length - 1]; // the target route
        
        //if paramaters exists for this route
        if (route.parameters.length === 0) throw new Error(`No Parameters Found: Could not set paramater regExpression for [${route.uri}] because the route has no parameters`);
        
        regExp = regExp.replace(/\(/g,"\\(");
        regExp = regExp.replace(/\)/g,"\\)");

        regExp = `(${regExp}+)`;

        let parameterFound = false;
        route.parameters.forEach((parameter, index)=>{
            if(parameter[name] !== undefined){
                parameterFound = true;
                parameter[name].regExp = regExp;
            }
        });
 
        if(!parameterFound) throw new Error(`Invalid Parameter: Could not set paramater regExpression for [${route.uri}] because the parameter [${name}] does not exist`);

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
    setName(name){
        if(!Utils.isSet(name)) throw new ArgNotFound("name");
        if(!Utils.isString(name)) throw new ArgTypeError("name", "string", name);

        let targetRoute = this.routes[this.routes.length - 1];
        this.routes.forEach((route)=>{
            if(route.name === name) throw new Error(`Duplicate naming. A route with name ${name} already exists`);
        })
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
    init(){
        this.routes.forEach((route)=>{
            this._proccessRegExp(route);
        }, this);

        let found = false;
        let routerObj = {
            pathFor: (name, parameter)=>{
                return this._pathFor(name, parameter);
            },

            goTo: (url, data, title)=>{
                return this._goTo(url, data, title);
            },

            historyMode: this._historyMode
        };
        this.routes.some((route)=>{
            if(this._requestPath().match(route.regExp)) {
                route.current = true;
                found = true;

                let request = {};
                request.param = this._processRequestParameters(route);
                request.query = this.query;
                request.uri = window.location.pathname;

                return route.callback.call(route.thisArg, request, routerObj);
            }
        },this)

        if(!found){
            if(!this._notFoundFunction) return;
            let request = {};
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
    notFoundHandler(callback){
        if(!Utils.isSet(callback)) throw new ArgNotFound("callback");
        if(!Utils.isFunction(callback)) throw new ArgTypeError("callback", "function", callback);

        this._notFoundFunction = callback;
        return this;
    }

    /**
     * Redirect one url to another
     * @method
     * @private
     * @todo create api for redirecting routes
     */
    redirect(oldUrl, newUrl){
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
    group(){

    }

    _goTo(url, data = {}, title =""){
        if(!Utils.isSet(url)) throw new ArgNotFound("url");
        if(!Utils.isString(url)) throw new ArgTypeError("url", "string", url);
        if(Utils.isEmpty(url)) throw new TypeError("url cannot be empty");

        if(!this._historyMode){
            let storage = window.localStorage;
            storage.setItem("pushState", data);
            return window.location.href= url;
        }

        window.history.pushState(data, title, url);
        return this.init();
    }

    _pathFor(name, parameters = {}){
        if(!Utils.isSet(name)) throw new ArgNotFound("name");
        if(!Utils.isString(name)) throw new ArgTypeError("name", "string", string);
        if(Utils.isEmpty(name)) throw new TypeError("name cannot be empty");
        let nameFound = false;
        let uri;
        this.routes.some(route=>{
            if(route.name === name){
                nameFound = true;
                uri = route.uri;
                if(this._containsParameter(uri)){
                    
                    if(!Utils.isSet(paramaters)) throw new ArgNotFound("parameters");
                    if(!Utils.isObject(parameters)) throw new ArgTypeError("parameters", "object", parameters);
                    if(Utils.isEmpty(parameters)) throw new TypeError("parameters cannot be empty");
                    let array  = [];
                    for(let value of route.uri.match(/\{(\w+)\}/g)){
                        value = value.replace("{","");
                        value = value.replace("}","");
                        array.push(value);
                    }
                    if(array.length !== Object.getOwnPropertyNames(parameters).length) throw new Error(`The route with name [${name}] contains ${array.length} parameters. ${Object.getOwnPropertyNames(parameters).length} given`)
                    for(let parameter in parameters){
                        if (!array.includes(parameter)) throw new Error(`Invalid parameter name [${parameter}]`);
                        let r = new RegExp(`{${parameter}}`,"g");
                        uri = uri.replace(r, parameters[parameter]);
                    }
                }
            }
        });
        if (!nameFound) throw new Error(`Invalid route name [${name}]`);
        return uri;
    }

    _proccessParameters(uri){
        let parameters = [];
        let sn = 0;

        if(this._containsParameter(uri)){
            uri.replace(/\{\w+\}/g,(parameter)=>{
                sn++;
                parameter.replace(/\w+/, (parameterName)=>{
                    let obj = {};
                    obj[parameterName] = {
                        sn: sn,
                        regExp: "([^\\/]+)", // catch any word except '/' forward slash
                        value: null
                    }
                    parameters.push(obj);
                });
            });
        }
        
        return parameters;
    }

    _proccessRegExp(route){
        let regExp = route.uri;

        // escape special characters
        regExp = regExp.replace(/\//g, "\\/");
        regExp = regExp.replace(/\./g, "\\.");
        regExp = regExp.replace("/", "/?");

        if(this._containsParameter(route.uri)){

            //replace uri parameters with their regular expression
            regExp.replace(/{\w+}/g, (parameter)=>{
                let parameterName = parameter.replace("{","");
                parameterName = parameterName.replace("}","");
                route.parameters.some((i)=>{
                    if(i[parameterName] !== undefined) {
                        regExp = regExp.replace(parameter, i[parameterName].regExp)
                        return regExp;
                    }
                });
                return parameter;
            });
        }
        regExp = `^${regExp}$`;
        route.regExp = new RegExp(regExp);
        return route;
    }

    _containsParameter(uri){
        return uri.search(/{\w+}/g) >= 0;
    }

    _processRequestParameters(route){
        let routeMatched = this._requestPath().match(route.regExp);
        if (!routeMatched) return;
        let param = {};
        routeMatched.forEach((value, index)=>{
            if(index !== 0){
                let key = Object.getOwnPropertyNames(route.parameters[index - 1]);
                param[key] = value;
            }
        });
        return param;
    }

    _requestPath(){
        return window.location.pathname;
    }

    _checkHistoryMode(){
        if(!this._historyMode) return;

        if(!window.PopStateEvent && !"pushState" in history) return; // check for support of popstate event and pushstate in browser

        window.addEventListener("popstate", (e)=>{
            this.init();
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
}
export default SPARouter;