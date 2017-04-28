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

    updateComponentData(data, renderImmediately = true){
        this.__componentData = {...this.__componentData, ...data };
        renderImmediately && this.renderComponentData(this.__componentData)
    }

    /**
     * @param {object} data
     * @abstract
     */
    renderComponentData(data = {}) {

    }

    onLoad() {
        if(this.node) {
            let btns = this.node.getComponentsInChildren(cc.Button);
            btns && btns.forEach(btn => {
                let sprite = btn.node.getComponent(cc.Sprite);
                let color = {
                    // "buttons-ninePaths-btn-do": new cc.Color(151,15,0),
                    // "buttons-ninePaths-btn-blue": new cc.Color(0,99,175),
                    // "buttons-ninePaths-btn-vang": new cc.Color(142,84,0),
                    // "buttons-ninePaths-btn-xanhla": new cc.Color(27,88,3),
                    // "buttons-ninePaths-btn-tim": new cc.Color(72,72,72)
                     "buttons-ninePaths-btn-do": new cc.Color(25,25,25),
                    "buttons-ninePaths-btn-blue": new cc.Color(25,25,25),
                    "buttons-ninePaths-btn-vang": new cc.Color(25,25,25),
                    "buttons-ninePaths-btn-xanhla": new cc.Color(25,25,25),
                    "buttons-ninePaths-btn-tim": new cc.Color(25,25,25)
                };
                
                if(sprite && sprite.spriteFrame && sprite.spriteFrame._name.indexOf('-ninePaths-') > -1) {
                    let outlines = sprite.node.getComponentsInChildren(cc.LabelOutline);
                    color[sprite.spriteFrame._name] && outlines && outlines.forEach(outline => {
                        outline.color = color[sprite.spriteFrame._name];
                        outline.width = 2;
                        let lbl = outline.node.getComponent(cc.Label);
                        // only uppercase first letter
                        lbl.string = Utils.upperCaseFirstLetter(lbl.string);
                    });
                }
            });
        }
    }

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