/**
 * Created by Thanh on 8/23/2016.
 */

var app = module.exports;
var MESSAGES = require('GameErrorMessage');

app.LANG = "vi";
app.async = require("async");
app.keywords = require("Keywords");
app.commands = require("Commands");

require("Constant");
require("Config");
require("Resource");

app.createComponent = (classNameOrInstance, extendClass = undefined, ...args) => {

    if (!classNameOrInstance) {
        return;
    }

    let instance;
    if(typeof classNameOrInstance === 'object'){
        instance = classNameOrInstance;
    }else{
        if (!(extendClass instanceof Function)) {
            args = [extendClass, ...args];
            extendClass = null;
        }

        instance = new classNameOrInstance(...args);
    }

    instance.properties = instance.properties || {};
    instance.extends = extendClass || instance.extends || cc.Component;


    const objPropsMap = {}; // contains keys which belong to "Object" type ( {a:1, b:2} ) and aren't empty object ( {} )

    // Check if element is instance of cc[xxx]
    function isComponentOfCC(el) {
        // in case: var a = cc.Component
        let isFunctionInstance = (element) => {
            // sure that `instance[key]['type'] == cc["Component"|"Editbox"...]
            // > instance[key]['type'] = [function cc_Component].name => cc_Component => cc_Component.substr(3) => "Component"
            return typeof element === 'function' && element === cc[element.name.substr(3)];
        };

        // in case: var a = {type: cc.Component, default: null}
        let isObjectInstance = (element) => {
            return typeof element === 'object' && ((element.hasOwnProperty('type') && isFunctionInstance(element['type'])) || element.hasOwnProperty('default'));
        };

        return isFunctionInstance(el) || isObjectInstance(el);
    }

    Object.getOwnPropertyNames(instance).forEach(key => {
        if (key !== 'extends' && key !== 'properties' && !key.startsWith('__')) {
            // check if property is Object && except instance of cc.Componet
            // such as {default: xxx, type: cc.XXX } => assign to `properties` for displaying value on cocoCcreator
            // if `instance[key]` is intance of `cc`
            if (instance[key] && isComponentOfCC(instance[key])) {
                instance.properties[key] = instance[key];
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
    instance.ctor = function ctor() {
        Object.getOwnPropertyNames(objPropsMap).forEach(key => {
            this[key] = objPropsMap[key];
        });
    };

    return cc.Class(instance);
};

app.getMessageFromServer = (errorCode, errorMessage = 0) => {
    let M = MESSAGES[app.LANG];
    return (typeof M[errorCode] === 'object') ? M[errorCode][errorMessage] : M[errorCode];
};

/* INIT GAME */
_setupGame();

function _setupGame() {
    require('PreLoader');
    app.service = require("Service");
    app.system = require("System");
    app.context = require("Context");
    app.event = require("Events");
}