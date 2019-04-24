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

export default Utils;