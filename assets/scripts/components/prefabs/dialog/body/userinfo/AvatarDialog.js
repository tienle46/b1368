import app from 'app';
import DialogActor from 'DialogActor';
import { destroy } from 'CCUtils';

export default class AvatarDialog extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            bgNode: cc.Node,
            itemNode: cc.Node,
            detailAvatarNode: cc.Node,
            pickedAvatarSprite: cc.Sprite,
            pickedAvatarLbl: cc.Label,
            pickedAvatarDescription: cc.Label,
        };
    }

    onLoad() {
        super.onLoad();
        this.bgNode.on(cc.Node.EventType.TOUCH_START, () => true)
    }

    start() {
        super.start();
    }

    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }
    
    onCloseBtnClick() {
        destroy(this.node);
    }
}

app.createComponent(AvatarDialog);