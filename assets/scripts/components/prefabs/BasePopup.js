import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';

class BasePopup extends Component {
    constructor() {
        super();
        this.bodyContentNode = {
            default : null,
            type : cc.Node
        };
    }

    // use this for initialization
    onLoad() {
        // prevent click from dialog to below layer
        this.node.on(cc.Node.EventType.TOUCH_START, function() {
            return;
        });

        this.bodyNode = this.node.getChildByName('popup_bkg').getChildByName('body');
        // add closeBtn
        // this._btnRegisterEvents();
    }

    handleClosePopupAction() {
        // this.closeButton.getComponent(cc.Animation).play();
        // log(this.node.parent);
        this.node.destroy();
        this.node.removeFromParent(true);
    }

    setContent(string) {
        this.bodyContentNode.getChildByName('string').getComponent(cc.Label).string = string;
    }

    /**
     * 
     * @param {cc.Node || cc.Prefab} element
     * 
     * @memberOf BasePopup
     */
    addToBody(element) {
        if (element instanceof cc.Node)
            this.bodyNode.addChild(element);
        else if (element instanceof cc.Prefab)
            this.bodyNode.addChild(cc.instantiate(element))
        else if (element instanceof String) {
            RubUtils.loadRes(element).then((prefab) => {
                this.bodyNode.addChild(cc.instantiate(prefab));
            });
        }
    }

    /* PRIVATE METHODS */
    // _btnRegisterEvents() {
    //     let event = new cc.Component.EventHandler();
    //     event.target = this.node;
    //     event.component = 'BasePopup';
    //     event.handler = 'handleClosePopupAction';
    //     this.closeButton.clickEvents = [event];
    // }
}

app.createComponent(BasePopup);