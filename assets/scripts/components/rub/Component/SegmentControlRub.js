import ToggleGroup from 'ToggleGroup';
import CheckBox from 'CheckBox';
import Rub from 'Rub';
import RubUtils from 'RubUtils';

export default class SegmentControlRub extends Rub {
    /**
     * Creates an instance of SegmentControlRub.
     * @param {cc.Node} node
     * @param {Array} [segments]  Object array
     * [
     *  {
     *      title: string,
     *      value: any,
     *      eventHander: {
     *          target: cc.Node,
     *          component: string,
     *          eventHander: string
     *          options: // {} updating ...
     *      }
     *  }
     * ]
     * @param {any} options={} style options of segment group, includes:
     *  {
     *      bg: string;  # /resources url for segment background
     *      bgChild: string; # /resources url for child background (if not any, use transparent texture)
     *      bgWidth: number;
     *      bgHeight: number;
     *      inActiveNormalSprite : string # /resources url for segment inactive state
     *      activeNormalSprite : string # /resources url for segment active state
     *      itemWidth: number 
     *      itemHeight: number
     *      // if round border
     *      isRoundBorder: boolean;
     *      // active when isRoundBorder == true
     *      activeNormalSprite2: string
     *      tabPrefabUrl: string
     *  }
     * 
     * @memberOf SegmentControlRub
     */
    constructor(node, segments, options = {}) {
        super(node);
        // this.node = node;
        this.segments = segments;
        this.options = options;

    }

    init() {
        return RubUtils.loadRes('dashboard/dialog/prefabs/segmentControl').then((prefab) => {
            this.prefab = cc.instantiate(prefab);

            this.addToNode();

            return this.prefab;
        }).then((prefab) => {
            return this._initComponents(prefab);
        }).then((toggleGroupComponent) => {
            return this._createCheckBoxStyle(toggleGroupComponent);
        });
    }

    _initComponents(prefab) {
        let toggleGroupNode = prefab.getChildByName('group');
        let toggleGroupComponent = toggleGroupNode.getComponent(ToggleGroup);


        this.segments.forEach((e, i) => {
            // create checkbox
            let newNode = new cc.Node();
            let newNodeWidth = this.options.itemWidth || 155.1;
            let newNodeHeight = this.options.itemHeight || 31.7;
            newNode.setContentSize(cc.size(newNodeWidth, newNodeHeight));
            console.log('pos', newNode.getPosition());
            // add to node
            toggleGroupNode.addChild(newNode);

            this.prefab.width += 155;

            let checkBox = newNode.addComponent(CheckBox);
            // add checkBox event
            e.eventHander && this._registerEvents(checkBox, e.eventHander);

            // set checkBox value
            e.value && checkBox.setVal(e.value);
            let checkBoxSprite = newNode.addComponent(cc.Sprite);
            RubUtils.loadSpriteFrame(checkBoxSprite, i === 0 ? 'dashboard/popup-tab-active' : 'dashboard/transparent', (sprite) => {
                newNode.setContentSize(cc.size(newNodeWidth, newNodeHeight));
            });
            // cc.loader.loadRes(i === 0 ? 'dashboard/popup-tab-active' : 'dashboard/transparent', cc.SpriteFrame, (err, spriteFrame) => {
            //     checkBoxSprite.spriteFrame = spriteFrame;
            //     checkBoxSprite.type = cc.Sprite.Type.SLICED;
            //     checkBoxSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            //     newNode.width = this.options.itemWidth || 155.1;
            //     newNode.height = this.options.itemHeight || 31.7;
            // });
            let labelNode = new cc.Node();
            let label = labelNode.addComponent(cc.Label);
            label.fontSize = 18;
            label.lineHeight = 20;
            label.string = e.title;
            newNode.addChild(labelNode);

            // push to toggleGroup
            toggleGroupComponent.addItem(checkBox);
        });

        return toggleGroupComponent;
    }

    _createCheckBoxStyle(toggleGroup) {
        let checkBoxes = toggleGroup.getItems();

        checkBoxes.map((checkBox, i) => {
            checkBox.isChecked = i === 0;
            checkBox.setSpriteFrame('inActiveNormalSprite', 'dashboard/transparent');

            if (i === 0 || (i === checkBoxes.length - 1)) {
                checkBox.setSpriteFrame('activeNormalSprite', 'dashboard/popup-tab-active');
                (i === checkBoxes.length - 1) && (() => {
                    checkBox.node.scaleX = -1;
                    checkBox.node.children[0].scaleX = -1;
                })();
            } else {
                checkBox.setSpriteFrame('activeNormalSprite', 'dashboard/popup-tab-active2');
            }
        });

        return toggleGroup;
    }

    /**
     * addEventToBtn
     * 
     * @param {any} event
     * 
     * @memberOf SegmentControlRub
     */
    _registerEvents(checkbox, e) {
        let event = new cc.Component.EventHandler();
        event.target = e.eventHander.target;
        event.component = e.eventHander.component;
        event.handler = e.eventHander.handler;

        checkbox.pushEvent(event);
    }

    addToNode() {
        this.node.addChild(this.prefab);
    }

    static show(node, segments, options) {
        return new SegmentControlRub(node, segments, options).init();
    }
}