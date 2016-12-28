/**
 * Created by Thanh on 9/1/2016.
 */

export default class Component {
    constructor() {
        this.extends = cc.Component;

        this.properties = {
            path: ""
        };

        this.loadedAssets = [];
        this.addAssets(this);
    }

    addAssets(asset) {
        this.loadedAssets.push(asset);
    }

    onLoad() {
        console.debug('textureCache', cc.textureCache.getAllTextures().length);
    }

    start() {

    }

    update(dt) {

    }

    onEnable() {

    }

    onDisable() {

    }

    onDestroy() {
        this.node && this.loadedAssets.push(this.node);
        this.releaseAssets();
    }

    releaseAssets() {
        cc.loader.release(this.loadedAssets);
        this.loadedAssets = [];
    }
}