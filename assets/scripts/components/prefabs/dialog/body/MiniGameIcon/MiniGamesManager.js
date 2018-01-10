import app from 'app';

export default class MiniGamesManager {
    constructor() {
        this.icon = null;
        this.isOpen = false;

        this._lastPos = null;
    }

    createIcon() {
        this.icon = cc.instantiate(app.res.prefab.minigameIcon);
        var iconPos = (this._lastPos || cc.p(574, 101));
        this.icon.setPosition(iconPos);
        app.system.getCurrentSceneNode().addChild(this.icon);
        this.initTaiXiuTreo();
    }

    initTaiXiuTreo() {
        app.taiXiuTreoManager._iconComponent = this.icon.getComponentInChildren('TaiXiuTreo');
        app.taiXiuTreoManager.updateIcon();
    }

    onDestroy() {
        app.taiXiuTreoManager.onDestroy();
        if (this.icon) {
            this._lastPos = this.icon.getPosition();
            this.icon = null;
        }
    }
}