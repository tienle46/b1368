import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';

export default class ToggleableListItem extends Component {

    constructor() {
        super();

        this.verticalLayout = {
            default: null,
            type: cc.Layout
        };

        this.titleLabel = {
            default: null,
            type: cc.Label
        };
        this.subTitleLabel = {
            default: null,
            type: cc.Label
        };

        this.descriptionLabel = {
            default: null,
            type: cc.Label
        };

        this.toggleButton = {
            default: null,
            type: cc.Button
        };

        this.imageView = {
            default: null,
            type: cc.Sprite
        };

        this.resizeRequired = false;
        this._style;
        this._expandable = false;

    }

    onLoad() {
        // this.descriptionLabel.node.on('active-in-hierarchy-changed', ()=>{
        //     console.log(`active changed`);
        // });

        const toggleEventHandle = new cc.Component.EventHandler();
        toggleEventHandle.target = this.node;
        toggleEventHandle.component = ToggleableListItem.name;
        toggleEventHandle.handler = "toggleClicked";

        this.toggleButton.clickEvents = [toggleEventHandle];

        if (this._style === ToggleableListItem.TYPE.STYLE1) {
            this.imageView.node.active = false;
            this.verticalLayout.node.getComponent(cc.Widget).left = 10;
        } else {
            this.imageView.node.active = true;
            this.verticalLayout.node.getComponent(cc.Widget).left = 80;
        }

        this.toggleButton.node.active = this._expandable;

        cc.loader.loadRes('dashboard/dialog/imgs/len', cc.SpriteFrame, (err, spriteFrame) => {
            if (!err)
                this.lenSprite = spriteFrame;
        });

        cc.loader.loadRes('dashboard/dialog/imgs/xuong', cc.SpriteFrame, (err, spriteFrame) => {
            if (!err)
                this.xuongSprite = spriteFrame;
        });

        // hide node
        this.descriptionLabel.node.runAction(cc.hide());
    }

    initWithStyle(style, expandable = false) {
        this._style = style;
        this._expandable = expandable;
    }

    fillData({ title = '', sub = '', detail = '', image = null } = {}) {
        this.titleLabel.string = title;
        this.subTitleLabel.string = sub;
        this.descriptionLabel.string = detail;
    }

    toggleClicked(sender, event) {
        // this.descriptionLabel.node.runAction(cc.sequence(
        //     cc.callFunc(function() {})
        // ));
        this.descriptionLabel.node.active = !this.descriptionLabel.node.active;

        if (this.descriptionLabel.node.active) {
            sender.target.getComponent(cc.Button).normalSprite = this.lenSprite;
            sender.target.getComponent(cc.Button).normalSprite = this.lenSprite;
        } else {
            sender.target.getComponent(cc.Button).normalSprite = this.xuongSprite;
            sender.target.getComponent(cc.Button).normalSprite = this.xuongSprite;
        }

        //change height node to display additional information

    }

    update() {
        if (this.resizeRequired) {
            this.node.height = this.verticalLayout.node.height;

            this.resizeRequired = false;
        }

        //chờ vòng update sau để cập nhật lại chiều cao của item
        if (this.verticalLayout._layoutDirty) {
            this.resizeRequired = true;
        }
    }

}

ToggleableListItem.TYPE = {
    STYLE1: 'NO_IMAGE_LEFT',
    STYLE2: 'W_IMAGE_LEFT',
}

app.createComponent(ToggleableListItem);