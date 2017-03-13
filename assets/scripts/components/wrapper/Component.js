/**
 * Created by Thanh on 9/1/2016.
 */
import { destroy } from 'CCUtils';
import Utils from 'Utils';

export default class Component {
    constructor() {
        this.extends = cc.Component;

        this.properties = {
            path: "",
        };

        this.__componentData = null
        this.__isComponentEnabled = false
        this.loadedAssets = []; // assets (cc.Font, cc.SpriteFrame, cc.SpriteAtlas ...) will be release when destroy
        this.loadedNodes = []; // nodes will be destroy & removeFromParent when component onDestroy
    }

    getUniqueName() {
        return cc.js.getClassName(this);
    }

    getClass() {
        return this.constructor;
    }

    getClassName() {
        return cc.js.getClassName(this);
    }

    addAsset(asset) {
        this.loadedAssets.push(asset);
    }

    addNode(node) {
        this.loadedNodes.push(node);
    }

    isComponentEnabled() {
        return this.__isComponentEnabled;
    }

    getComponentData() {
        return this.__componentData || {};
    }

    setComponentData(data) {
        this.__componentData = {...data };
    }

    /**
     * @param {object} data
     * @abstract
     */
    renderComponentData(data = {}) {

    }

    onLoad() {}

    start() {}

    update(dt) {}

    onEnable() {
        this.__isComponentEnabled = true;
        this.renderComponentData(this.__componentData);
    }

    onDisable() {
        this.__isComponentEnabled = false;
    }

    onDestroy() {
        this.releaseAssets();
        this.removeNodes();
        this.free(this.__componentData);
        this.__componentData = null;
        // this._$componentPropertyNames && this._$componentPropertyNames.forEach(propertyName => {
        //     let value = this[propertyName];
        //     if (Utils.isObject(value)) {
        //         if (Utils.isArray(value)) {
        //             value.length = 0;
        //         } else {
        //             this.free(value);
        //         }
        //     }
        // });
        // Object.getOwnPropertyNames(this).forEach(key => {
        //     this[key] = null;
        // });
    }

    releaseAssets() {
        window.release(this.loadedAssets);
    }

    free(object) {
        if (!Utils.isObject(object) || (object instanceof cc.Component))
            return;

        for (let key in object) {
            object[key] = null;
        }
    }

    freeChunk(...args) {
        [...args].forEach(value => {
            this.free(value);
        });
    }

    removeNodes() {
        let nodes = this.loadedNodes;

        nodes && nodes.map(node => destroy(node));
        window.release(this.loadedNodes);
    }
}