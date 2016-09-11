/**
 * Created by Thanh on 8/23/2016.
 */

var game = module.exports;
var MESSAGES = require('GameErrorMessage');

game.LANG = "vi";
game.async = require("async");
game.keywords = require("Keywords");
game.commands = require("Commands");


require("GameConst");
require("GameConfig");
require("GameResource");

game.createComponent = (className, extendClass = undefined, ...args) => {
    if (!className) {
        return;
    }

    if (!(extendClass instanceof Function)) {
        args = [extendClass, ...args];
        extendClass = null;
    }

    const instance = new className(...args);

    instance.properties = instance.properties || {};
    instance.extends = extendClass || instance.extends || cc.Component;

    const objPropsMap = {}; // contains keys which belong to "Object" type ( {a:1, b:2} ) and aren't empty object ( {} )

    Object.getOwnPropertyNames(instance).forEach(key => {
        if (key !== 'extends' && key !== 'properties' && !key.startsWith('__')) {
            // check if property is non empty Object && except instance of cc.Componet
            // such as {default: xxx, type: cc.XXX }
            
            // if (instance[key] instanceof Object && instance[key].hasOwnProperty('default')) {
            //     instance.properties[key] = instance[key];
            // } else {
            //     // instance.properties[key] = null;
            //     objPropsMap[key] = instance[key] // {default: xx, xx: asd} <---
            // }

            if (typeof instance[key] === 'object' && Object.keys(instance[key] || {}).length > 0) {
                // if `instance[key]` is intance of `cc`  
                if (instance[key].hasOwnProperty('type') && typeof instance[key]['type'] === 'function' && instance[key]['type'] === cc[instance[key]['type'].name.split('_')[1]]) {
                    instance.properties[key] = instance[key]; // push it to `properties` property
                } else {
                    objPropsMap[key] = instance[key]; // push it to objPropsMap so that We can append it into `assignObjPropsFunc() function`
                }
            } else {
                // else push it to "properties" property - to using "this" keyword on cc.Class()
                instance.properties[key] = instance[key];
            }
            delete instance[key]; // remove properties because cc.Scene can not detect properties that's outside this.properties = {}
        }
    });

    const isContainClassPrototype = (obj) => {
        return className = obj && Object.getPrototypeOf(obj) && Object.getPrototypeOf(obj).constructor.name && Object.getPrototypeOf(obj).constructor.name !== 'Object';
    }

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
            this[key] = objPropsMap[key]
        })
    }

    return cc.Class(instance);
};

game.getMessageFromServer = (errorCode, errorMessage = 0) => {
    let M = MESSAGES[game.LANG];
    return (typeof M[errorCode] === 'object') ? M[errorCode][errorMessage] : M[errorCode];
}

/* INIT GAME */
_setupGame();

function _setupGame() {
    require('PreLoader')
    game.service = require("GameService");
    game.system = require("GameSystem");
    game.context = require("GameContext");
    game.manager = require("GameManager");
}