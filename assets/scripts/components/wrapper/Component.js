/**
 * Created by Thanh on 9/1/2016.
 */
import RubUtils from 'RubUtils';
import { destroy } from 'CCUtils';

export default class Component {
    constructor() {
        this.extends = cc.Component;

        this.properties = {
            path: ""
        };

        this.__componentData = null
        this.__isComponentEnabled = false
        this.loadedAssets = []; // assets (cc.Font, cc.SpriteFrame, cc.SpriteAtlas ...) will be release when destroy
        this.loadedNodes = []; // nodes will be destroy & removeFromParent when component onDestroy
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
        this.__componentData = null;
        Object.getOwnPropertyNames(this).forEach(key => {
            this[key] = null;
        });
    }

    releaseAssets() {
        RubUtils.releaseAssets(this.loadedAssets);
    }

    removeNodes() {
        let nodes = this.loadedNodes;

        nodes && nodes.map(node => destroy(node));
        RubUtils.releaseArray(this.loadedNodes);
    }
}