class Router {
    constructor(){
        this.routes = [];
        this.requestPath = window.location.pathname;
        return this;
    }

    /**
     * Initialize the Router.
     * Call this method after setting all route paths
     */
    init(){
        this._routeMatched = false;
        this.routes.some(route=>{
            if(this.requestPath.match(`${route.regEx}$`)){
                this._routeMatched = true;
                route.params = this._getParameterValue(route.regEx, route.params);
                return route.callback(this, route.params, route.pattern);// || route.callback.call(this, route.params, route.pattern);
            }
        }, this)
        if(!this._routeMatched){
            if(!this._notFoundFunc){
                return;
            } else {
                return this._notFoundFunc();
            }
        }
    }

    get(route, cb, routeName = null){
        if (typeof cb !== "function") throw new Error(`typeof parameter 2 must be a callback function`);
        
        route = route === "" ? "/" : route; //empty route will be seen as home page
        route = route.toLowerCase();
        this.routes.forEach(storedRoutes=>{
            if(storedRoutes.pattern === route) throw new Error(`Cannot have two route patterns. Route pattern ${route} already exists`);
        });

        if(routeName) this.routes.forEach((storedRoutes)=>{
            if(storedRoutes.name === routeName) throw new Error(`Duplicate naming. A route with name ${routeName} already exists`);
        });
        
        let routeUrl = route;
        let parameters = {};

        if(typeof route === "string"){
            this._getParameters(route, (params, newRoute)=>{
                parameters = params;
                route = newRoute;
            });
        }
        
        this.routes.push({
            name: routeName,
            pattern :   routeUrl,
            regEx : route,
            callback : cb,
            params: parameters
        });
        return this;
    }

    // @TODO create group function for grouping routes
    /*groupGet(groupRoute, route, cb, routeName = null){
        console.log("groupingggg!")
    }

    group(route, cb, groupName = null){
        this.group.get = this._groupGet;
        cb(this.group);
        /*if (typeof cb !== "function") throw new Error(`typeof parameter 2 must be a callback function`);
        
        route = route === "" ? "/" : route;
        route = route.toLowerCase();

        if(groupName) this.routes.forEach((storedRoutes)=>{
            if(storedRoutes.name === groupName) throw new Error(`Duplicate naming. A route with name ${routeName} already exists`);
        });
        
        let routeUrl = route;
        let parameters = {};

        if(typeof route === "string"){
            this._getParameters(route, (params, newRoute)=>{
                parameters = params;
                route = newRoute;
            });
        }
        
        this.routes.push({
            name: groupName,
            pattern :  routeUrl,
            regEx : route,
            callback : cb,
            params: parameters
        });*/
        //return this;
    //}

    redirect(oldUrl, newUrl){
        oldUrl = oldUrl.toLowerCase();
        newUrl = newUrl.toLowerCase();

        if(oldUrl === newUrl) throw new Error("Redirect loop found as both urls are the same");

        if(typeof oldUrl === "string"){
            this._getParameters(oldUrl, (params, newRoute)=>{
                oldUrl = newRoute;
            });
        }

        if (this.requestPath.match(`${oldUrl}$`)){
            return window.location.href= newUrl;
        }
        return this;
    }
    
    /**
     * Returns the url path of a named route.
     * If params is included, the value of the parameters will be passed into the url.
     * @param {string} routeName A string containing the name of the route
     * @param {object} params An object of keys and values containing the parameters of the route
     * @returns {string} url
     */
    pathFor(routeName, params = {}){
        let url;
        let routeNameFound = false;
        this.routes.some(route=>{
            if(route.name === routeName){
                routeNameFound = true;
                url = route.pattern;
                if(route.params.length === 0 || Object.getOwnPropertyNames(route.params).length === 0) return url; // if there are no parameters for this route

                let routeParamsProps = Object.getOwnPropertyNames(route.params);
                let paramsProps = Object.getOwnPropertyNames(params);

                // if this route requires some parameters and none given or the required number of params not given
                if(paramsProps.length !== routeParamsProps.length) throw new Error(`The route pattern ${route.pattern} requires ${routeParamsProps.length} parameter(s). ${paramsProps.length} found`)
                
                for(let key in params){
                    if(!route.params.hasOwnProperty(key)) throw new Error(`Invalid route parameter (${key}) found in the given parameters`);
                    url = url.replace(`{${key}}`, params[key])
                }
                return;
            }
        });
        if (!routeNameFound) throw new Error(`Invalid route name (${routeName})`);
        return url;
    }

    notFound(){
        if(!this._notFoundFunc){
            throw new Error("notFoundHandler is not set. Use Router.setNotFoundHandler() method to set it.");
        } else {
            return this._notFoundFunc();
        }
    }

    notFoundHandler(cb=null){

        this._notFoundFunc = cb;
        return this;
    }

    _getParameters(route, cb){
        let params = [];
        if((route.indexOf("{") && route.indexOf("}")) > -1){
            let startIndex = 0;
            let startPosition = 0;
            let endPosition = 0;
            let loopStarted = 0;

            while(startIndex <= route.length){
                startPosition = route.indexOf("{", startIndex);
                endPosition = route.indexOf("}", startIndex + loopStarted)
                let parameter = route.substring(startPosition+1, endPosition);
                params.push(parameter);
                startIndex = startIndex + endPosition;
                loopStarted = 1;
            }
        }
        let newRoute = route.replace(/\{{1}\w*\}{1}/gi, "(.+)");
        
        return cb(params, newRoute);
    }

    _getParameterValue(regEx, paramNames){
        let param = [];
        let routeParams = {} // route  parameters in object for
        let array = this.requestPath.match(`${regEx}$`);
        if(array)
            array.forEach((value, index) => {
                if(index !== 0){
                    param.push({
                        [paramNames[index-1]] : value
                    });
                }
            });
        param.forEach(el=>{
            for(let key in el){
                routeParams[key] = el[key];
            }
        })
        return routeParams;
    }
}
Router = new Router();
export default Router;