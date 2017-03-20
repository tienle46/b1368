import app from 'app';
import DialogActor from 'DialogActor';
import { destroy } from 'CCUtils';

export default class VipDialog extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            bgNode: cc.Node
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

app.createComponent(VipDialog);