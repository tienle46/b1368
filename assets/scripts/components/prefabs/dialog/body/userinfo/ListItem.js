import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';

export default class ListItem extends Component {

    constructor() {
        super();

        this.verticalLayout = {
            default : null,
            type: cc.Layout
        }

        this.descriptionLabel = {
            default : null,
            type: cc.Label
        }
        this.toggleButton = {
            default : null,
            type: cc.Button
        }
        this.imageView = {
            default : null,
            type: cc.Sprite
        }
        this.resizeRequired = false;
        this._style;
        this._expandable = false;
    }

    onLoad(){
        this.descriptionLabel.node.on('active-in-hierarchy-changed', ()=>{
            console.log(`active changed`);
        });

        const toggleEventHandle = new cc.Component.EventHandler();
        toggleEventHandle.target = this.node;
        toggleEventHandle.component = ListItem.name;
        toggleEventHandle.handler = "toggleClicked";

        this.toggleButton.clickEvents = [toggleEventHandle];

        if(this._style === ListItem.TYPE.STYLE1){
            this.imageView.node.active = false;
            this.verticalLayout.node.getComponent(cc.Widget).left = 10;
        }
        else{
            this.imageView.node.active = true;
            this.verticalLayout.node.getComponent(cc.Widget).left = 80;
        }

        this.toggleButton.node.active = this._expandable;
    }
    initWithStyle(style, expandable = false){
        this._style = style;
        this._expandable = expandable;
    }

    toggleClicked(sender, event) {

        this.descriptionLabel.node.active  = !this.descriptionLabel.node.active;

        if(this.descriptionLabel.node.active){
            cc.loader.loadRes('dashboard/dialog/imgs/len', cc.SpriteFrame, (err, spriteFrame) => {
                if(!err)
                    sender.target.getComponent(cc.Button).normalSprite = spriteFrame;
            });
        }
        else{
            cc.loader.loadRes('dashboard/dialog/imgs/xuong', cc.SpriteFrame, (err, spriteFrame) => {
                if(!err)
                    sender.target.getComponent(cc.Button).normalSprite = spriteFrame;
            });
        }

       //change height node to display additional information

    }
    update(){
        if(this.resizeRequired){
            this.node.runAction(cc.callFunc(()=>{
                this.node.height = this.verticalLayout.node.height;
            }))
            this.resizeRequired = false;
        }
        if(this.verticalLayout._layoutDirty){
            this.resizeRequired = true;
        }
    }

}

ListItem.TYPE = {
    STYLE1 : 'NO_IMAGE_LEFT',
    STYLE2 : 'W_IMAGE_LEFT',
}

app.createComponent(ListItem);
