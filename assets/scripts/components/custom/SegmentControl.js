import app from 'app'
import Component from 'Component'

export default class SegmentControl extends Component {


    constructor() {
        super();

        this.items = {
            default: [],
            type: cc.String
        }
        this.style = cc.Integer //style of segment control, for example rounded corner or not
        this.leftSpriteFrame = cc.SpriteFrame;
        this.middleSpriteFrame = cc.SpriteFrame;
        this.rightSpriteFrame = cc.SpriteFrame;
        this.leftActiveSpriteFrame = cc.SpriteFrame;
        this.middleActiveSpriteFrame = cc.SpriteFrame;
        this.rightActiveSpriteFrame = cc.SpriteFrame;
        this.textColor = new cc.Color();
        this.buttonPrefab = {
            default: null,
            type: cc.Node
        };
        this.segmentItemClickedHandlder = cc.Component.EventHandler;
    }

    onLoad() {
        let layout = this.node.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.HORIZONTAL;
        layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
        layout.resizeMode = cc.Layout.ResizeMode.CHILDREN;

        this.segmentItemClickedHandlder = new cc.Component.EventHandler();
        this.segmentItemClickedHandlder.target = this.node;
        this.segmentItemClickedHandlder.component = 'SegmentControl';
        this.segmentItemClickedHandlder.handler = "_segmentItemClicked";

        this.items.forEach((item, index) => {

            var segmentItem = cc.instantiate(this.buttonPrefab);
            segmentItem.getComponentInChildren(cc.Label).string = item;
            segmentItem.children[0].color = cc.Color.WHITE;
            segmentItem.getComponentInChildren(cc.Label).fontSize = 16;

            if (index === 0) {
                segmentItem.getComponent(cc.Button).normalSprite = this.leftSpriteFrame;
                segmentItem.getComponent(cc.Button).pressedSprite = this.leftActiveSpriteFrame;
                segmentItem.getComponent(cc.Button).hoverSprite = this.leftActiveSpriteFrame;
            } else if (index > 0 && index < this.items.length - 1) {
                segmentItem.getComponent(cc.Button).normalSprite = this.middleSpriteFrame;
                segmentItem.getComponent(cc.Button).pressedSprite = this.middleActiveSpriteFrame;
                segmentItem.getComponent(cc.Button).hoverSprite = this.middleActiveSpriteFrame;
            } else {
                segmentItem.getComponent(cc.Button).normalSprite = this.rightSpriteFrame;
                segmentItem.getComponent(cc.Button).pressedSprite = this.rightActiveSpriteFrame;
                segmentItem.getComponent(cc.Button).hoverSprite = this.rightActiveSpriteFrame;
            }
            segmentItem.tag = index;

            segmentItem.getComponent(cc.Button).clickEvents.push(this.segmentItemClickedHandlder);

            this.node.addChild(segmentItem);
        });

        this.node.on('segment-item-clicked', function(event) {
            log(`need to toggle state of other segment item except segment with index ${event.detail.selectedIndex}`);
        });
    }

    _segmentItemClicked(event) {
        // log(`item at index ${event.target.tag} clicked`);
        event.target.parent.emit('segment-item-clicked', { selectedIndex: event.target.tag });
        event.target.selected = true;
    }
}


app.createComponent(SegmentControl)