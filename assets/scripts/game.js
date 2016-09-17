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

    // Check if element is instance of cc[xxx]
    function isComponentOfCC(el) {
        // in case: var a = cc.Component
        let isFunctionInstance = (element) => {
            // sure that `instance[key]['type'] == cc["Component"|"Editbox"...]
            // > instance[key]['type'] = [function cc_Component].name => cc_Component => cc_Component.substr(3) => "Component"
            return typeof element === 'function' && element === cc[element.name.substr(3)];
        }

        // in case: var a = {type: cc.Component, default: null}
        let isObjectInstance = (element) => {
            return typeof element === 'object' && element.hasOwnProperty('type') && isFunctionInstance(element['type']);
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
                objPropsMap[key] = instance[key] // {default: xx, xx: asd} <---
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

game.mixin = (...args) => {
    let O = {};

    return args.reduce((prev, next) => {
        let P = typeof prev === 'function' ? Object.getPrototypeOf(new prev()) : prev;
        let N = typeof next === 'function' ? Object.getPrototypeOf(new next()) : next;
        let B = typeof next === 'function' ? new next() : new Function();

        function joinF(...a) {
            let b;

            b = a[(a.length - 1)];
            a.pop();

            if (a.length > 1) {
                a = joinF(a);
            } else {
                a = a[0];
            }

            return function(...args) {
                b.apply(new a(), args);
            };

            // return function(...args) {
            //     a.apply(new a, args);
            //     b.apply(new b, args);
            // }

        }

        for (let key in Z) {
            if (typeof Z[key] === 'function' && N[key] && typeof N[key] === 'function' && Z[key] == N[key]) {
                Z[key] = Z[key].bind(B);
            }
        }

        return Z;
    }, {});
}

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
    game.utils = require("utils");
}