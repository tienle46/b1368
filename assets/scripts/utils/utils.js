/**
 * Created by Thanh on 8/27/2016.
 */

export default class utils {
    static isNumber(value){
        return typeof value === 'number'
    }

    static isBoolean (value) {
        return typeof value === 'boolean'
    }

    static isString (value) {
        return typeof value === 'boolean'
    }

    static isObject (value) {
        return typeof value === 'object'
    }

    static isNull (value) {
        return value === null
    }

    static gone (node) {
        if(node) node.active = false;
    }

    static visible (node) {
        if(node) node.active = true;
    }

    static setVisible (node, visible) {
        if(visible){
            this.visible(node)
        }else{
            this.gone(node)
        }
    }

    static hide (node) {
        node = node.node || node
        node && node.runAction && node.runAction(cc.hide())
    }

    static show (node) {
        node = node.node || node
        node && node.runAction && node.runAction(cc.show())
    }

    static loadComponent (componentPath, parent) {
        cc.loader.loadRes(componentPath, (error, prefab) => {
            let prefabObj = cc.instantiate(prefab);
            prefabObj.parent = this.playerLayer
        });
    }

    static getVariable (obj, key) {
        return obj.containsVariable && obj.containsVariable(key) && obj.getVariable && obj.getVariable(key).value;
    }

    static getGameCode (room) {
        return room && room.isGame && room.name.substring(0, 3);
    }
}

