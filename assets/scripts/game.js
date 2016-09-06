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

game.createComponent = (className = null, extendClass) => {
    if (!className) {
        return;
    }

    const instance = new className();

    instance.properties = instance.properties || {};
    instance.extends = extendClass || instance.extends || cc.Component;


    Object.getOwnPropertyNames(instance).forEach(key => {
        if (key !== 'extends' && key !== 'properties' && !key.startsWith('__')) {
            instance.properties[key] = instance[key];
            delete instance[key]; // remove properties because cc.Scene can not detect properties that's outside this.properties = {}
        }
    });

    const isContainClassPrototype = (obj) => {
        return className = obj && Object.getPrototypeOf(obj) && Object.getPrototypeOf(obj).constructor.name && Object.getPrototypeOf(obj).constructor.name !== 'Object';
    }

    let prototypeObj = instance;
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

    return cc.Class(instance);
};

_setupGame();

function _setupGame() {
    require('PreLoader')
    game.service = require("GameService");
    game.system = require("GameSystem");
    game.context = require("GameContext");
    game.manager = require("GameManager");
}