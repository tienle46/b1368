/**
 *  Ingame friend profile popup
 * */
import app from 'app';

export default class FriendProfilePopupRub {
    constructor(user) {
        this.user = user;

        this._init();
    }

    _init() {
        let popup = app.res.prefab.friendProfilePopup;
        this.prefab = cc.instantiate(popup);
    }

    getNode() {
        return this.prefab;
    }

    static show(node, user) {
        let popup = new FriendProfilePopupRub(user);

        node.addChild(popup.getNode());
    }
}