import RubUtils from 'RubUtils';

export default class ListItemBasicRub {
    constructor() {
        this._initItem();
    }

    node() {
        return this.itemNode;
    }

    _initItem() {
        this.itemNode = new Node();

        let itemNodeSprite = this.itemNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(itemNodeSprite, 'textures/50x50');

        let itemNodeWidget = this.itemNode.addComponent(cc.Widget);
        itemNodeWidget.isAlignOnce = false;

        itemNodeWidget.isAlignLeft = true;
        itemNodeWidget.isAlignRight = true;

        itemNodeWidget.left = 0;
        itemNodeWidget.right = 0;

        // itemNode -> label
        let labelNode = new Node();
        this.itemNode.addChild(labelNode);

        let labelNodeLbl = labelNode.addComponent(cc.Label);
        labelNodeLbl.string = "Tusi đã chuyển cho bạn 5000 Chip";
        labelNodeLbl.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        labelNodeLbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
        labelNodeLbl.fontSize = 16;
        labelNodeLbl.lineHeight = 40;
        labelNodeLbl.overflow = cc.Label.Overflow.RESIZE_HEIGHT;

        let labelNodeWidget = labelNode.addComponent(cc.Widget);
        labelNodeWidget.isAlignOnce = false;

        labelNodeWidget.isAlignLeft = true;
        labelNodeWidget.isAlignTop = true;
        labelNodeWidget.isAlignBottom = true;
        labelNodeWidget.isAlignRight = true;

        labelNodeWidget.left = 0;
        labelNodeWidget.top = 25;
        labelNodeWidget.bottom = 25;
        labelNodeWidget.right = 0;

        return this.itemNode;
    }
}