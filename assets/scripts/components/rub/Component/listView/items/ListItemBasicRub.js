import RubUtils from 'RubUtils';
import app from 'app';
import ButtonScaler from 'ButtonScaler';

export default class ListItemBasicRub {
    constructor(opts = {}) {
        let defaultOptions = {
            height: 60,
            spriteFrame: 'textures/50x50',
            color: app.const.COLOR_VIOLET,
            label: {
                alignLeft: 10,
                alignRight: 0
            },
            button: {
                width: 114,
                height: 47,
                spriteFrame: 'textures/login_btn_bg'
            }
        };
        this.options = Object.assign({}, defaultOptions, opts);
        this._initItem();
    }

    node() {
        return this.itemNode;
    }

    _initItem() {
        this.itemNode = new cc.Node();
        this.itemNode.height = 60;

        let itemNodeSprite = this.itemNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(itemNodeSprite, 'textures/50x50', null, null, (sprite) => {
            sprite.node.color = app.const.COLOR_VIOLET;
        });

        let itemNodeWidget = this.itemNode.addComponent(cc.Widget);
        itemNodeWidget.isAlignOnce = false;

        itemNodeWidget.isAlignLeft = true;
        itemNodeWidget.isAlignRight = true;

        itemNodeWidget.left = 0;
        itemNodeWidget.right = 0;

        // itemNode -> label
        this._initLabel('ai do da chuyen 6000 chip cho may cmnr day', this.itemNode);

        this._initBtnGroup(this.itemNode);
    }

    _initBtnGroup(parent) {
        let btnGroupNode = new cc.Node();
        let btnSize = cc.size(114, 47);
        btnGroupNode.setContentSize(btnSize);
        parent.addChild(btnGroupNode);

        let btnGroupNodeSprite = btnGroupNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(btnGroupNodeSprite, 'textures/login_btn_bg', btnSize);

        let btnGroupNodeWidget = btnGroupNode.addComponent(cc.Widget);
        btnGroupNodeWidget.isAlignOnce = false;
        btnGroupNodeWidget.isAlignVerticalCenter = true;
        btnGroupNodeWidget.isAlignRight = true;
        btnGroupNodeWidget.right = 40;

        // btnGroupNode -> label
        this._initLabel('Xac nhan', btnGroupNode, { horizontalAlign: cc.Label.HorizontalAlign.CENTER });

        btnGroupNode.addComponent(ButtonScaler);
    }

    _initLabel(text, parent, opts = {}) {
        let labelNode = new cc.Node();
        parent.addChild(labelNode);

        let labelNodeLbl = labelNode.addComponent(cc.Label);
        labelNodeLbl.string = text;
        labelNodeLbl.horizontalAlign = opts.horizontalAlign || cc.Label.HorizontalAlign.LEFT;
        labelNodeLbl.verticalAlign = opts.verticalAlign || cc.Label.VerticalAlign.CENTER;
        labelNodeLbl.fontSize = 16;
        labelNodeLbl.lineHeight = 40;
        labelNodeLbl.overflow = cc.Label.Overflow.RESIZE_HEIGHT;

        let labelNodeWidget = labelNode.addComponent(cc.Widget);
        labelNodeWidget.isAlignOnce = false;

        labelNodeWidget.isAlignLeft = true;
        labelNodeWidget.isAlignTop = true;
        labelNodeWidget.isAlignBottom = true;
        labelNodeWidget.isAlignRight = true;

        labelNodeWidget.left = 10;
        labelNodeWidget.top = 25;
        labelNodeWidget.bottom = 25;
        labelNodeWidget.right = 0;
    }
}