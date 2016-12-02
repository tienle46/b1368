import RubUtils from 'RubUtils';
import app from 'app';

export default class LoaderRub {
    constructor(node = cc.director.getScene(), hideBg = false, opts = {}) {
        let defaultOptions = {
            position: cc.v2(0, 0)
        };
        this.options = Object.assign({}, defaultOptions, opts);
        this.hideBg = hideBg;
        this.node = node;

        this._node();
        this.time = 3000 * 10;

        this._setTimer(this.time);
    }

    _node() {
        let winsize = cc.director.getWinSize();

        this.spinLoaderNode = new cc.Node();
        this.spinLoaderNode.zIndex = app.const.loadingZIndex;
        this.spinLoaderNode.name = 'spin_loader';
        this.spinLoaderNode.setPosition(cc.v2(0, 0));
        this.spinLoaderNode.setContentSize(winsize.width, winsize.height + 500);

        // widget
        let widget = this.spinLoaderNode.addComponent(cc.Widget);
        widget.isAlignOnce = false;

        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;

        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;


        // spin_loader -> bgNode
        let bgNode = new cc.Node();
        bgNode.name = 'bg';
        bgNode.setPosition(0, 0);
        bgNode.setContentSize(this.spinLoaderNode.getContentSize());
        bgNode.color = new cc.Color(0, 0, 0);
        bgNode.opacity = 190;
        bgNode.active = !this.hideBg;
        this.spinLoaderNode.addChild(bgNode);

        // bg sprite
        let bgSprite = bgNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(bgSprite, 'textures/50x50', bgNode.getContentSize());

        // spin_loader -> loader Node
        let loaderNode = new cc.Node();
        loaderNode.name = 'loader';
        loaderNode.setPosition(0, 0);
        loaderNode.setContentSize(cc.size(113, 113));
        this.spinLoaderNode.addChild(loaderNode);

        // loader -> cricle Node
        let circleNode = new cc.Node();
        circleNode.name = 'circle';
        circleNode.setPosition(0, 0);
        circleNode.setContentSize(cc.size(115.6, 115.6));
        loaderNode.addChild(circleNode);

        let circleSprite = circleNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(circleSprite, 'textures/loading-1', circleNode.getContentSize());

        // rotate cricle node
        circleNode.runAction(cc.repeatForever(cc.rotateBy(1.0, 360)));

        // cricle -> light
        let lightNode = new cc.Node();
        lightNode.name = 'light';
        lightNode.setPosition(0, 54.07);
        lightNode.setContentSize(cc.size(43, 36));

        circleNode.addChild(lightNode);

        let lightSprite = lightNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(lightSprite, 'textures/light-indicator', lightNode.getContentSize());

        // loader -> spade Node
        let spadeNode = new cc.Node();
        spadeNode.name = 'spade';
        spadeNode.setPosition(0, 0);
        spadeNode.setContentSize(53, 53);

        loaderNode.addChild(spadeNode);

        let spadeSprite = spadeNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(spadeSprite, 'textures/bich', spadeNode.getContentSize());

        this.node.addChild(this.spinLoaderNode);
        this.hide();
    }

    show() {
        this.spinLoaderNode.active = true;
        this._setTimer(this.time);
    }

    hide() {
        this.spinLoaderNode.active = false;
        clearTimeout(this.timer);
    }

    _setTimer(time) {
        this.timer = setTimeout((() => {
            this.spinLoaderNode.active && this.hide();
        }).bind(this), time);
    }
}