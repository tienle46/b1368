import Actor from 'Actor';

export default class BasePopup extends Actor {
    constructor() {
        super();

        this.parentNode = null;
    }

    onLoad() {
        super.onLoad()
        this.node.on(cc.Node.EventType.TOUCH_START, () => true);
    }

    showInParentNode(parentNode, animated) {
        if (parentNode && parentNode instanceof cc.Node) {
            this.parentNode = parentNode;
            this.parentNode.addChild(this.node);
            this.openPopup(animated);
        }
    }

    openPopup(animated) {
        if (!this.node.parent) return;

        if (!this.parentNode) {
            this.parentNode = this.node.parent;
        }

        if (animated) {
            this._openPopupWithAnimation();
        } else {
            this._openPopupWithoutAnimation();
        }
    }

    closePopup(animated) {
        if (animated) {
            this._closePopupWithAnimation();
        } else {
            this._closePopupWithoutAnimation();
        }
    }

    _openPopupWithoutAnimation() {
        this.node.active = true;
        this.node.scale = cc.p(1,1);
        this.node.position = cc.p(0,0);
    }

    _openPopupWithAnimation() {
        this.node.active = true;
        this.node.position = cc.p(0,0);
        this.node.scale = cc.p(0,0);
        var scale = cc.scaleTo(BasePopup.DEFAULT_ANIMATION_INTERVAL, 1, 1).easing(cc.easeBackOut());
        this.node.runAction(scale);
    }

    _closePopupWithoutAnimation() {
        this.node.active = false;
    }

    _closePopupWithAnimation() {
        var scale = cc.scaleTo(BasePopup.DEFAULT_ANIMATION_INTERVAL, 0, 0).easing(cc.easeBackIn());
        var sequence = cc.sequence(scale, cc.callFunc(function () {
            this.node.active = false;
        }.bind(this)));

        this.node.runAction(sequence);
    }

    onBtnCloseClicked() {
        this.closePopup(true);
    }
}

BasePopup.DEFAULT_ANIMATION_INTERVAL = 0.25;