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

    onLoad() {}

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
        for (let i = 0; i < this.loadedAssets.length; i++) {
            console.debug('release......', this.loadedAssets[i]);
            cc.loader.releaseAsset(this.loadedAssets[i]);
        }
        this.loadedAssets = [];
    }
}