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
        this.releaseAssets();
    }

    releaseAssets() {
        cc.loader.release(this.loadedAssets);
        this.loadedAssets = [];
    }
}