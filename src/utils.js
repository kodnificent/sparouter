class Utils {
    isString(variable){
        return Object.prototype.toString.call(variable) === "[object String]";
    }
    
    isNumber(variable){
        return Object.prototype.toString.call(variable) === "[object Number]";
    }

    isRegExp(variable){
        return Object.prototype.toString.call(variable) === "[object RegExp]";
    }
    
    isArray(variable){
        return Object.prototype.toString.call(variable) === "[object Array]";
    }
    
    isObject(variable){
        return Object.prototype.toString.call(variable) === "[object Object]";
    }

    isFunction(variable){
        return Object.prototype.toString.call(variable) === "[object Function]";
    }
    
    isBoolean(variable){
        return Object.prototype.toString.call(variable) === "[object Boolean]";
    }
    
    isNull(variable){
        return Object.prototype.toString.call(variable) === "[object Null]";
    }
    
    isUndefined(variable){
        return Object.prototype.toString.call(variable) === "[object Undefined]";
    }

    isEmpty (variable){
        return this.isUndefined(variable) || this.isNull(variable) || variable === 0 || variable === false || ((this.isString(variable) || this.isArray(variable)) && variable.length === 0) || (this.isObject(variable) && Object.getOwnPropertyNames(variable).length === 0);
    }

    isSet(variable){
        return !this.isUndefined(variable) && !this.isNull(variable);
    }
}
Utils = new Utils();

export function ArgumentNotFoundError(argName){
    let name = "ArgumentNotFoundError";
    let message = Utils.isSet(argName) ? `${argName} argument is required. None found` : "Required argument was not found";
	let instance = new Error(message);
	instance.name = name;
	instance.message = message;
	instance.toString = function(){
        return instace.message;
    };
	Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
	if (Error.captureStackTrace){
		Error.captureStackTrace(instance, ArgumentNotFoundError);
	}
	return instance;
}

export function ArgumentTypeError(argName, argType, argValue){
    argType = Utils.isSet(argType) ? argType.toString() : typeof argType;
    let name = "ArgumentTypeError";
    let message = Utils.isSet(argName) ? `typeof ${argName.toString()} argument must be equal to ${argType}. ${typeof argValue} found.` : "Invalid argument type found";
    let instance = new Error(message);
	instance.name = name;
	instance.message = message;
	instance.toString = function(){
        return this.message;
    };
	Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
	if (Error.captureStackTrace){
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

if (Object.setPrototypeOf){
	Object.setPrototypeOf(ArgumentNotFoundError, Error);
	Object.setPrototypeOf(ArgumentTypeError, Error);
} else {
	ArgumentNotFoundError.__proto__ = Error;
	ArgumentTypeError.__proto__ = Error;
}

// QueryParams class constants


var KEYS = [];
var QUERIES = [];
var QUERY_STRING = "";
var HISTORY_MODE;

const DECODE = value=>{
    return decodeURIComponent(value);
}
const DECODE_KEY = key=>{
    return decodeURIComponent(key.split(' ').join(''));
}
const GET_PARAM = (key, index = null) =>{
    let param = null;
    if(index){
        param = QUERIES[index][key];
    } else {
        QUERIES.some(query=>{
            if(query.hasOwnProperty(key)) return param = query[key];
        });
    }
    return param;
}

class QueryParams {
    constructor(url = null, historyMode = false){
        QUERY_STRING = url ? url : window.location.search;
        HISTORY_MODE = window.PopStateEvent && "pushState" in window.history ? historyMode : false;
        if(HISTORY_MODE){
            window.addEventListener("popstate", (e)=>{
                let event = e.currentTarget;
                QUERY_STRING = event.location.search;
                KEYS = [];
                QUERIES = [];
                return this.init(); // re run this class again
            });
        };
        this.init();
    }

    init(){
        if (QUERY_STRING) {
            let queryArray = QUERY_STRING.slice(1).split("&");
            queryArray.forEach(query=>{
                query = query.split('=');
                KEYS.push(DECODE_KEY(query[0]));
                let obj = {};
                obj[DECODE_KEY(query[0])] = query.length > 1 ? DECODE(query[1]) : true; // return true if search query has no value
                QUERIES.push(obj);
            }, this);
        }
    }

    keys(){
        return KEYS;
    }

    has(key){
        key = DECODE_KEY(key);
        return KEYS.length > 0 && GET_PARAM(key) ? true : false;
    }

    get(key){
        key = DECODE_KEY(key);
        return this.has(key) ? GET_PARAM(key) : null;
    }
    
    getAll(key) {
        key = DECODE_KEY(key);
        return this.has(key) ? GET_PARAM(key).split(',') : [];
    }

    toString (){
        let string = "";
        if(QUERY_STRING){
            string = "?";
            KEYS.forEach((key, index)=>{
                let value = GET_PARAM(key, index) === true ? '' : `=${GET_PARAM(key, index)}`;
                let newString = index === 0 ? key + value : `&${key + value}`;
                string += newString;
            });
        }
        return string;
    }

    append(key, value){
        if(!Utils.isSet(key)) throw new ArgNotFound("key");
        key = DECODE_KEY(key);
        value = Utils.isSet(value) ? DECODE(value) : true;

        let index = KEYS.push(key) - 1;
        QUERIES[index] = {
            [key]: value
        }
        QUERY_STRING = QUERY_STRING ? this.toString() : true;
        if(HISTORY_MODE){
            window.history.pushState('', '', this.toString());
        }
        return GET_PARAM(key, index);
    }

    set(key, value){
        if(!Utils.isSet(key)) throw new ArgNotFound("key");
        key = DECODE_KEY(key);
        value = Utils.isSet(value) ? DECODE(value) : true;
        QUERY_STRING = QUERY_STRING ? QUERY_STRING : true;
        let index = KEYS.indexOf(key);
        if(index !== -1) {
            KEYS[index] = key; // replace the key if it exists else append new key
            QUERIES[index] = {
                [key]: value
            }
        } else {
            index = KEYS.push(key) - 1;
            QUERIES[index] = {
                [key]: value
            }
        }
        
        QUERY_STRING = QUERY_STRING ? this.toString() : true;
        if(HISTORY_MODE){
            window.history.pushState('', '', this.toString());
        }
        return GET_PARAM(key, index);
    }

    delete(key){
        if(!Utils.isSet(key)) throw new ArgNotFound("key");
        key = DECODE_KEY(key);
        if(!this.has(key)) return this.has(key); // definitely returns false if key doesn't exist

        let index = KEYS.indexOf(key);
        let value = QUERIES[index][key];
        KEYS.splice(index, 1);
        QUERIES.splice(index, 1);

        QUERY_STRING = QUERY_STRING ? this.toString() : true;
        if(HISTORY_MODE){
            window.history.pushState('', '', this.toString());
        }
        return value;
    }

}

export {Utils, QueryParams};