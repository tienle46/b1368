/**
 * Created by Thanh on 8/27/2016.
 */
import numeral from 'numeral';

export default class Utils {

    static isNull(val) {
        return val == undefined || val == null;
    }

    static isNode(val) {
        return val && val instanceof cc.Node;
    }

    static isEmpty(str) {
        return !str || (Utils.isString(str) && str.trim().length == 0);
    }

    static isEmptyArray(arr) {
        return !arr || arr.length == 0;
    }

    static isArray(arr) {
        return arr instanceof Array;
    }

    static isNumber(value) {
        return typeof value === 'number'
        // value = Number(value);
        // return !isNaN(value) && typeof value === 'number';
    }

    static isFunction(value) {
        return typeof value === 'function' || value instanceof Function;
    }

    static isBoolean(value) {
        return typeof value === 'boolean';
    }

    static isString(value) {
        return typeof value === 'string';
    }

    static isObject(value) {
        return typeof value === 'object';
    }

    static setInteractable(control, interactable) {
        control instanceof cc.Button && (control.interactable = interactable);
    }

    static disable(node) {
        if (!node) return;

        if (node instanceof cc.Node) {
            node.enabled = false;
        } else {
            node.node && (node.node.enabled = false);
        }
    }

    static enable(node) {
        if (!node) return;

        if (node instanceof cc.Node) {
            node.enabled = true;
        } else {
            node.node && (node.node.enabled = true);
        }
    }

    static active(node, opacity) {
        Utils.setActive(node, true);
        if (opacity) {
            //TODO
        }
    }

    static deactive(node, opacity) {
        Utils.setActive(node, false);

        if (opacity) {
            //TODO
        }
    }

    static setActive(node, active) {
        if (!node) return;

        if (node instanceof cc.Node) {
            node.active = active;
        } else {
            node.node && (node.node.active = active);
        }
    }

    static setVisible(node, visible) {
        this.setActive(node, visible);
    }

    /**
     * @param opacity {int}
     */
    static setOpacity(node, opacity) {
        node = node instanceof cc.Node ? node : (node.node || null);
        if (!node)
            return;
        node.opacity = opacity ? opacity : 0;
    }

    /**
     * @param opacity {boolean}
     */
    static setVisibility(node, visiblity) {
        let opacity = visiblity ? 255 : 0;
        Utils.setOpacity(node, opacity);
    }

    static hide(node, action = cc.hide()) {
        node = node && (node.node || node);
        node && node.runAction && node.runAction(action);
    }

    static show(node) {
        node = node.node || node;
        node && node.runAction && node.runAction(cc.show());
    }

    static loadComponent(componentPath, parent) {
        cc.loader.loadRes(componentPath, (error, prefab) => {
            let prefabObj = cc.instantiate(prefab);
            prefabObj.parent = this && this.playerLayer;
        });

    }
    //
    // static getVariable(obj, key, defaultValue) {
    //     return (obj && obj.containsVariable && obj.containsVariable(key) && obj.getVariable && obj.getVariable(key).value) || defaultValue;
    // }

    static getVariable(obj, key, defaultValue) {
       if(obj && obj.variables && obj.variables.hasOwnProperty(key)){
            let value = obj.variables[key].value;

            if(value != null && value != undefined){
                return value;
            }
        }

        return defaultValue;
    }

    static getValue(mapObj, key, defaultValue) {
        if (mapObj && mapObj.hasOwnProperty(key)) {
            return mapObj[key];
        }
        return defaultValue;
    }

    static getGameCode(room) {
        return room && room.isGame && room.name.substring(0, 3);
    }

    static cloneProperties(dest, src) {

        Object.getOwnPropertyNames(src).forEach(key => {

            log("Check: ", dest[key], src[key], !dest[key] && src[key]);
            if (!dest[key] && src[key]) {
                dest[key] = src[key];
            }
        });

        // dest.node && src.node && (src.node.children.forEach(node => {
        //     node.parent = null;
        //     dest.node.addChild(node)
        // }));
    }

    static getAllKeys(...args) {
        return args.map(arg => this.isObject(arg) ? Object.keys(arg) : []).reduce((keys, keyArr) => { return [...keys, ...keyArr] }, []);
    }

    static isDuplicate(array, value) {

    }

    static numberFormat(value = 0, format = '0,0') {
        return numeral(value).format(format);
    }
}