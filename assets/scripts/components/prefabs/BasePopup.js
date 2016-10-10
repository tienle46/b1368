import app from 'app';
import Component from 'Component';

class BasePopup extends Component {
    constructor() {
        super();
        this.bodyContentNode = cc.Node;
    }

    // use this for initialization
    onLoad() {
        // prevent click from dialog to below layer
        this.node.on('touchstart', function() {
            return;
        });

        // add closeBtn
        // this._btnRegisterEvents();
    }

    handleClosePopupAction() {
        // this.closeButton.getComponent(cc.Animation).play();
        // log(this.node.parent);
        this.node.removeFromParent(true);
    }

    setContent(string) {
        this.bodyContentNode.getChildByName('string').getComponent(cc.Label).string = string;
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