/**
 * Created by Thanh on 8/23/2016.
 */

var game = module.exports;

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


    let objProperties = {}; // contains keys which are in "Object" type ( {a:1, b:2} ) and aren't empty object ( {} )

    Object.getOwnPropertyNames(instance).forEach(key => {
        if (key !== 'extends' && key !== 'properties' && !key.startsWith('__')) {
            // check if property is non empty Object && except instance of cc.Componet
            // such as {default: xxx, type: cc.XXX }
            if (typeof instance[key] === 'object' && Object.keys(instance[key] || {}).length > 0) {
                // if `instance[key]` is intance of `cc` 
                if (instance[key].hasOwnProperty('type') && typeof instance[key]['type'] === 'function') {
                    instance.properties[key] = instance[key]; // push it to `properties` property
                } else {
                    objProperties[key] = instance[key]; // push it to objProperties so that We can append it into `assignObjPropsFunc() function`
                }
            } else {
                // else push it to "properties" property - to using "this" keyword on cc.Class()
                instance.properties[key] = instance[key];
            }
            delete instance[key]; // remove properties because cc.Scene can not detect properties that's outside this.properties = {}
        }
    });

    // check if whether className has parent prototype ?
    const isContainClassPrototype = (obj) => {
        return className = obj && Object.getPrototypeOf(obj) && Object.getPrototypeOf(obj).constructor.name && Object.getPrototypeOf(obj).constructor.name !== 'Object';
    };

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
     * onLoad: () => {
     *  this.a = {a: 1, b: 2}
     * } ---> Works
     */
    function assignObjPropsFunc(valueObj) {
        Object.getOwnPropertyNames(valueObj).forEach(key => {
            this[key] = valueObj[key];
        });
    };

    let prototypeObj = instance;

    while (isContainClassPrototype(prototypeObj)) {
        // Loop over prototypes of className except 'constructor'.
        // if className has parent, copy all methods didn't override to `instance`
        Object.getOwnPropertyNames(Object.getPrototypeOf(prototypeObj)).forEach(name => {
            if (name !== 'constructor') {
                let method = instance[name];

                // ignore if it isn't Function or it's a constructor
                if (method instanceof Function) {
                    instance[name] = method;

                    if (name == 'onLoad' && Object.keys(objProperties).length > 0) {
                        // modify onLoad function
                        instance[name] = function onLoad() {
                            assignObjPropsFunc.call(instance, objProperties); // assign `this` to class `instance`
                            method.call(instance); // copy original method
                        }
                    }
                }
            }
        });

        // recursive if it still has parent
        prototypeObj = Object.getPrototypeOf(prototypeObj);
    }

    if (args.length > 1) {
        console.log(instance)
    }

    return cc.Class(instance)
};

_setupGame();

function _setupGame() {
    require('PreLoader')
    game.service = require("GameService");
    game.system = require("GameSystem");
    game.context = require("GameContext");
    game.manager = require("GameManager");
}