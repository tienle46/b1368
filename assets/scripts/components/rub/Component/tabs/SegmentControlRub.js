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
     *      value: Promise || Node || string 
     *          + Promise || Node -> this segement behaves as a node, and added immediately to body
     *          + string -> prefab url, behaves as prefab, need to load before adding to body
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
     *      bg: string;  # default: 'dashboard/dialog/imgs/tab-bg' : `resources` assets url for segment background
     *      width: number; # default: 81.7 # control width
     *      height: number; # default: 52
     *      activeNormalSprite: string # default: 'dashboard/popup-tab-active' : `resources` url for segment inactive state
     *      inactiveNormalSprite : string # default: 'dashboard/transparent' : We only set transparent bg for inactive node while one is activated 
     *      itemWidth: number # default: 155.1 : segment width
     *      itemHeight: number # default: 31.7 
     *      isRoundedBorder: boolean;  # default: true : if segement has rounded border <=> true : [ rounded border | nonround | nonround | rounded border ]
     *      activeNormalSprite2: string // active when `isRoundedBorder` is true. 
     *      tabBodyPrefabType: string # default: 'topup' : name of folder that placed in prefab/dialog folder to load prefabs inside
     *      hasEdge: boolean # default: true; // sometimes we dont want to have any distance between active state and control background ( look at exchange -> history -> item tab)
     *      edge: {top, left, right, height} # default edge aligment options : group.getComponent(cc.Widget)'s setting, activated while hasSpace is setted to `true`
     * }
     * 
     * @memberOf SegmentControlRub
     */
    constructor(node, segments, options = {}) {
        super(node);

        let defaultOptions = {
            width: 88,
            height: 50,
            bg: 'dashboard/dialog/imgs/tab-bg',
            activeNormalSprite: 'dashboard/popup-tab-active',
            inactiveNormalSprite: 'dashboard/transparent',
            isRoundedBorder: true,
            activeNormalSprite2: 'dashboard/popup-tab-active2',
            itemWidth: 155.1,
            itemHeight: 53,
            tabBodyPrefabType: 'topup',
            hasEdge: true,
            edge: {
                top: 9,
                bottom: 9,
                left: 9,
                right: 9
            }
        };

        this.segments = segments;

        this.options = Object.assign({}, defaultOptions, options);
    }

    init() {
        return RubUtils.loadRes('dashboard/dialog/prefabs/segmentControl').then((prefab) => {
            this.prefab = cc.instantiate(prefab);

            this.addToNode();

            return this.prefab;
        }).then(() => {
            return this._setupComponentByOptions();
        }).then(() => {
            return this._initComponents();
        }).then((toggleGroupComponent) => {
            return this._createCheckBoxStyle(toggleGroupComponent);
        });
    }

    _setupComponentByOptions() {
        // segementControl node bg
        let size = cc.size(this.options.width, this.options.height);
        this.prefab.setContentSize(size);
        let bgSpriteComponent = this.prefab.getComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(bgSpriteComponent, this.options.bg, size)

        this._resizeGroupNodeByOptions();
    }

    // sometimes we dont want to have any distance between active state and control background ( look at exchange -> history -> item tab)
    _resizeGroupNodeByOptions() {
        let groupNode = this.prefab.getChildByName('group');
        let groupWidget = groupNode.getComponent(cc.Widget);
        groupWidget.isAlignOnce = false;

        groupWidget.isAlignTop = true;
        groupWidget.isAlignBottom = true;
        groupWidget.isAlignRight = true;
        groupWidget.isAlignLeft = true;

        if (this.options.hasEdge) {
            groupWidget.top = this.options.edge.top;
            groupWidget.left = this.options.edge.left;
            groupWidget.right = this.options.edge.right;
            groupWidget.bottom = this.options.edge.bottom;
        } else {
            groupWidget.top = 0;
            groupWidget.left = 0;
            groupWidget.right = 0;
            groupWidget.bottom = 0;
        }
    }

    _initComponents() {
        let prefab = this.prefab;
        let toggleGroupNode = prefab.getChildByName('group');
        let toggleGroupComponent = toggleGroupNode.getComponent(ToggleGroup);

        this.segments.forEach((e, i) => {
            // create checkbox
            let newNode = new cc.Node();
            let newNodeWidth = this.options.itemWidth;
            let newNodeHeight = this.options.itemHeight - 10;
            let newNodeSize = cc.size(newNodeWidth, newNodeHeight);
            newNode.setContentSize(newNodeSize);

            // add to node
            toggleGroupNode.addChild(newNode);

            // resize prefab by segment size
            this.prefab.width += newNodeWidth;
            this.prefab.height = newNodeHeight;

            let checkBox = newNode.addComponent(CheckBox);

            // add checkBox event
            e.eventHander && this._registerEvents(checkBox, e.eventHander);

            // set checkBox value
            e.value && checkBox.setVal(e.value);

            // // check if node represents body instead of using prefab
            // newNode.isNode = e.isNode || false;


            let checkBoxSprite = newNode.addComponent(cc.Sprite);
            RubUtils.loadSpriteFrame(checkBoxSprite, i === 0 ? this.options.activeNormalSprite : this.options.inactiveNormalSprite, newNodeSize);

            let labelNode = new cc.Node();
            let label = labelNode.addComponent(cc.Label);
            label.fontSize = 18;
            label.lineHeight = 20;
            label.string = e.title;
            newNode.addChild(labelNode);

            // push to toggleGroup
            toggleGroupComponent.addItem(checkBox);
        });

        // fit width of group and tab

        return toggleGroupComponent;
    }

    _createCheckBoxStyle(toggleGroup) {
        let checkBoxes = toggleGroup.getItems();

        checkBoxes.map((checkBox, i) => {
            checkBox.isChecked = i === 0;
            checkBox.setSpriteFrame('inActiveNormalSprite', this.options.inactiveNormalSprite);

            if (this.options.isRoundedBorder) {
                if (i === 0 || (i === checkBoxes.length - 1)) {
                    checkBox.setSpriteFrame('activeNormalSprite', this.options.activeNormalSprite);
                    (i === checkBoxes.length - 1) && (() => {
                        // rotate Z axis itself
                        checkBox.node.scaleX = -1;
                        // and its 1st child ( the node contains cc.Label )
                        checkBox.node.children[0].scaleX = -1;
                    })();
                } else {
                    checkBox.setSpriteFrame('activeNormalSprite', this.options.activeNormalSprite2);
                }
            } else {
                checkBox.setSpriteFrame('activeNormalSprite', this.options.activeNormalSprite);
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