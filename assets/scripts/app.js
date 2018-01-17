/* eslint-disable no-console, no-unused-vars */
/**
 * Created by Thanh on 8/23/2016.
 */
'use strict';

var app = module.exports;
var SFSErrorMessages = require('SFSErrorMessages');
var RoomErrorMessages = require('RoomErrorMessages');
var _ = require('lodash');

app.LANG = "vi";
app.async = require("async");
app.keywords = require("Keywords");
app.commands = require("Commands");
app._ = _;

require("Constant");
require("Config");
require("Resource");


app.createComponent = (classNameOrInstance, extendClass = undefined, ...args) => {

    if (!classNameOrInstance) {
        return;
    }

    let instance;
    if (typeof classNameOrInstance === 'object') {
        instance = classNameOrInstance;
    } else {
        if (!(extendClass instanceof Function)) {
            args = [extendClass, ...args];
            extendClass = null;
        }

        instance = new classNameOrInstance();
    }

    instance.extends = extendClass || instance.extends || cc.Component;


    instance.properties = instance.properties || {};


    let objPropsMap = {}; // contains keys which belong to "Object" type ( {a:1, b:2} ) and aren't empty object ( {} )

    let isCocosComponent = (element) => {
        return typeof element === 'function' && element === cc[element.name.substr(3)];
    };

    // in case: var a = {type: cc.Component, default: null}
    let isCocosProperty = (element) => {
        return typeof element === 'object' && ((element.hasOwnProperty('type') && isCocosComponent(element['type'])) || element.hasOwnProperty('default'));
    };

    let getCocosValue = (element, key) => {
        if (!element) {
            return element;
        }

        return isCocosComponent(element) || isCocosProperty(element) ? element : undefined;
    };

    // // Check if element is instance of cc[xxx]
    // function isComponentOfCC(el) {
    //     // in case: var a = cc.Component
    //     let isFunctionInstance = (element) => {
    //         // sure that `instance[key]['type'] == cc["Component"|"Editbox"...]
    //         // > instance[key]['type'] = [function cc_Component].name => cc_Component => cc_Component.substr(3) => "Component"
    //         return typeof element === 'function' && element === cc[element.name.substr(3)];
    //     };

    //     // in case: var a = {type: cc.Component, default: null}
    //     let isObjectInstance = (element) => {
    //         return typeof element === 'object' && ((element.hasOwnProperty('type') && isFunctionInstance(element['type'])) || element.hasOwnProperty('default'));
    //     };

    //     return isFunctionInstance(el) || isObjectInstance(el);
    // }

    Object.getOwnPropertyNames(instance).forEach(key => {
        if (key !== 'extends' && key !== 'properties' /*&& !key.startsWith('__')*/ ) {
            // check if property is Object && except instance of cc.Componet
            // such as {default: xxx, type: cc.XXX } => assign to `properties` for displaying value on cocoCcreator
            // if `instance[key]` is intance of `cc`


            // if (instance[key] && isComponentOfCC(instance[key])) {
            let value = getCocosValue(instance[key], key);

            if (value) {
                instance.properties[key] = value; //instance[key];
            } else {
                // else push it to "properties" property - to using "this" keyword on cc.Class()
                objPropsMap[key] = instance[key]; // {default: xx, xx: asd} <---
            }
            delete instance[key]; // remove properties because cc.Scene can not detect properties that's outside this.properties = {}
        }
    });

    const isContainClassPrototype = (obj) => {
        return obj && Object.getPrototypeOf(obj) && Object.getPrototypeOf(obj).constructor.name && Object.getPrototypeOf(obj).constructor.name !== 'Object';
    };

    let prototypeObj = instance;

    // Loop over prototypes of className except 'constructor'.
    // if className has parent, copy all methods didn't override to `instance`
    while (isContainClassPrototype(prototypeObj)) {
        Object.getOwnPropertyNames(Object.getPrototypeOf(prototypeObj)).forEach(name => {
            if (name !== 'constructor') {
                let method = instance[name];

                // ignore if it isn't Function or it's a constructor
                if (method instanceof Function) {
                    instance[name] = method;
                }
            }
        });

        prototypeObj = Object.getPrototypeOf(prototypeObj);
    }

    /**
     * This function used to assign an object type property.
     * Because cc.Class doesn't allow declare non empty object outside onLoad() and ctor() (while we are using `constructor`)
     * Ex:
     *
     * constructor(){
     *  this.a = {} --> Works
     *  this.a = {a: 1, b:2 } -> Error
     * }
     *
     * ctor: () => {
     *  this.a = {a: 1, b: 2}
     * } ---> Works
     */
    if (Object.keys(objPropsMap).length > 0) {
        instance.ctor = function ctor() {
            Object.getOwnPropertyNames(objPropsMap).forEach(key => {
                this[key] = objPropsMap[key];
            });
        };
    }

    cc.Class(instance);
    instance = null;
};


app.getRoomErrorMessage = (error) => {
    let message, errorCode = "",
        errorMessage = "",
        messages = RoomErrorMessages[app.LANG];

    if (typeof error == 'string') {
        errorCode = error;
        message = messages[error];
    } else {
        errorCode = error.errorCode;
        errorMessage = error.errorMessage;
        if (typeof messages[errorCode] === 'object') {
            message = messages[errorCode][errorMessage];
        } else {
            message = messages[errorCode];
        }
    }

    return message || app.res.string('error_undefined', { error: `${errorCode}:${errorMessage}` });
};

app.getMessageFromServer = (error) => {
    let message, errorCode = "",
        errorMessage = "",
        messages = SFSErrorMessages[app.LANG];

    if (typeof error == 'string') {
        errorCode = error;
        message = messages[error];
    } else {
        errorCode = error.errorCode;
        errorMessage = error.errorMessage;
        if(errorCode != undefined){
            if (typeof messages[errorCode] === 'object') {
                message = messages[errorCode][errorMessage];
                if(!message){
                    message = errorMessage;
                }
            } else {
                message = messages[errorCode];
                if(message && typeof message !== 'string'){
                    message = undefined
                }
            }
        }
    }

    return message || app.res.string('error_undefined', { error: `${errorCode}:${errorMessage}` });
};

app.sendSMS = (message, recipient) => {
    if (app.env.isBrowser()) {
        app.system.showToast(app.res.string('error_not_support_platform'));
    } else if (app.env.isMobile()) {
        if (app.env.isIOS()) {
            window.jsb.reflection.callStaticMethod("JSBUtils", "sendSMS:recipient:", message, recipient);
        }
        if (app.env.isAndroid()) {
            window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jsbSMS", "(Ljava/lang/String;Ljava/lang/String;)V", message, recipient);
        }
    }
}

(function() {
    window.free = function(object) {
        if (!app._.isObject(object) || object instanceof cc.Component)
            return;

        for (let key in object) {
            object[key] = null;
        }
    };

    // release array
    window.release = function(...args) {
        let isRecursive = arguments[arguments.length - 1] === true;
        [...args].forEach(array => {
            if (!app._.isArray(array))
                return;
        
            if (isRecursive) {
                array.map(a => {
                    app._.isArray(a) && window.release(a, isRecursive);
                });
            }
            array.length = 0;
        });
    };

    window.log = function log(...args) {
        
        if(!app.config.debug) return;
        
        console.log(...args);
    };

    window.debug = function debug(...args) {
        if(!app.config.debug) return;
        
        if (app.config.buildForMobile) {
            console.log(...args);
        } else {
            console.debug(...args);
        }
    };

    window.error = function error(...args) {
        console.error(...args);
    };

    window.warn = function warn(...args) {
        console.warn(...args);
    };

    /**
     *
     * @param jsonString = {
     *      “action”:”action namne”,
     *      ”action_extras”: {}}
     * }
     */
    window.onNativePostAction = function(jsonString) {
        debug(`receive action with detail ${jsonString}`);
        try {
            let jsonParam = JSON.parse(jsonString);
            let actionParamObject = jsonParam['action_extras'];
            let actionParam = actionParamObject && Object.keys(actionParamObject).length > 0 ? actionParamObject : {};
            require('Linking').goTo(jsonParam.action, actionParam);
        } catch (e) {
            //DO nothing
            debug(`linking exception ${e}`);
        }
    }
    window.onAndroidCaptchaVerified = function(data) {
        let jsonParam = JSON.parse(data);
        console.log(`onAndroidCaptchaVerified`, jsonParam);
        if(jsonParam["token"] && jsonParam["token"].length > 0) {
            
            if(app.const.scene.REGISTER_SCENE === app.system.getCurrentSceneName()){
                app.system.currentScene.doRegister(false);
            }
            else if(app.const.scene.ENTRANCE_SCENE === app.system.getCurrentSceneName()){
                if(jsonParam["cbAction"] === "playNow" )
                    app.system.currentScene.doPlaynow();
                if(jsonParam["cbAction"] === "fbLogin" )
                    app.system.currentScene.doLoginFacebook();
            }
            else{
                //
            }
        }
        else{
            if(jsonParam["errorCode"] && jsonParam["errorCode"].length > 0){
                switch (jsonParam["errorCode"]) {
                    case "NETWORK_ERROR" :
                        app.system.showErrorToast('Không thể kết nối đến máy chủ, xin vui lòng kiểm tra lại kết nối');
                        break;
                    case "UNSUPPORTED" :
                        app.system.showErrorToast('Phiên bản hệ điều hành không được hỗ trợ.');
                        break;
                    case "UNKNOWN_ERROR" :
                        app.system.showErrorToast('Không thể xác thực thiết bị, vui lòng liên hệ hotline');
                        break;
                }
            }
        }
        app.system.currentScene && app.system.currentScene.hideLoading();
    }
    
    window.isJSON = (str) => {
        if ( /^\s*$/.test(str) ) return false;
        str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
        str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        return (/^[\],:{}\s]*$/).test(str);
    }
    
    /* INIT GAME */
    (function _setupGame() {
         // update pollyfill
        require('Pollyfill')(app);

        require('PreLoader');
        app.service = require("Service");
        require('Env')(app);
        app.system = require("System");
        /**
         * @type {Context}
         */
        app.context = require("Context");
        app.event = require('GameEvents');

        // setup game environment by platform
        app.env.__setupEnvironment();
        app.service._initSmartFoxClient();
    })();

    window.app = app;
    window.game = app.game;

    // window.addEventListener("beforeunload", function(event) {
    //     console.debug('unloaded! ')
    //     app.service.send({
    //         cmd: 'rep_p_exitGame',
    //         data: {
    //             data: true
    //         }
    //     }, true);
    // });
})();
// cc.game.setFrameRate(30);

app.getPartnerId = () =>{
    let strPId = cc.sys.localStorage.getItem('pid') || "";
    let pid = Number(strPId) || app.config.partnerId;

    return pid;
}