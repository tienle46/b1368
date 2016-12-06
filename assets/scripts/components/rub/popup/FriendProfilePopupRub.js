/**
 *  Ingame friend profile popup
 * */
import app from 'app';

export default class FriendProfilePopupRub {
    constructor(userName, startAnimNode, endAnimNode) {
        this.userName = userName;
        this.startAnimNode = startAnimNode;
        this.endAnimNode = endAnimNode;
        this._init();
    }

    _init() {
        let popup = app.res.prefab.friendProfilePopup;
        this.prefab = cc.instantiate(popup);

        let component = this.prefab.getComponent('FriendProfilePopup');
        component.displayUserDetail(this.userName);
        component.setCallbackOptions(this.startAnimNode, this.endAnimNode);

    }

    getNode() {
        return this.prefab;
    }

    static show(node, userName, startAnimNode, endAnimNode) {
        let popup = new FriendProfilePopupRub(userName, startAnimNode, endAnimNode);
        node.addChild(popup.getNode());

    }
}