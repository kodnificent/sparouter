const variableChecker = {
    isString :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object String]";
    },
    
    isNumber :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object Number]";
    },

    isRegExp :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object RegExp]";
    },
    
    isArray :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object Array]";
    },
    
    isObject :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object Object]";
    },

    isFunction :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object Function]";
    },
    
    isBoolean :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object Boolean]";
    },
    
    isNull :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object Null]";
    },
    
    isUndefined :  (variable) =>{
        return Object.prototype.toString.call(variable) === "[object Undefined]";
    },

    isEmpty : (variable) =>{
        return this.isUndefined(variable) || this.isNull(variable) || variable === 0 || variable === false || ((this.isString(variable) || this.isArray(variable)) && variable.length === 0) || (this.isObject(variable) && Object.getOwnPropertyNames(variable).length === 0);
    },

    isSet : (variable) =>{
        return !this.isUndefined(variable) && !this.isNull(variable);
    },
    
    /**
     * @todo create a type check function
     */
    typeCheck : (...variables) =>{

    }
}

export function ArgumentNotFoundError(argName){
    argName = argName.toString();
    this.name = "ArgumentNotFoundError";
    this.message = variableChecker.isSet(argName) ? `${this.name}: ${argName} argument is required. None found` : this.name;
    this.toString = function(){
        return this.message;
    };
}

export function ArgumentTypeError(argName, argType, argValue){
    argName = argName.toString();
    argType = argType.toString();
    this.name = "ArgumentTypeError";
    this.message = variableChecker.isSet(argName) ? `${this.name}: typeof ${argName} must be equal to ${argType}. ${typeof argValue} found.` : this.name;
    this.toString = function(){
        return this.message;
    };
}

export default variableChecker;