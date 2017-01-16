import app from 'app';
import NodeRub from 'NodeRub';

export default class ScrollViewRub {
    /**
     * Creates an instance of GridViewRub.
     * 
     * @param {Array [[]]} data # multiple string mapping array 
     * let data = [
     *  ['1', 2, 3], # colum 1                  1   |   a  |  c1
     *  ['a', 'b', 'c'], # column 2         =>  2   |   b  |  c2
     *  ['c1', 'c2', 'c3'], # column 3          3   |   c  |  c3
     *  ... # column N
     * ];
     *  or
     *  ['1', '2', '3'],
     *  [{obj}, {obj}, {obj}]
     *  Therein {obj} are an object includes:
     *  {
     *      text: string # display string of label
     *      color: new cc.Color() # color of node which includes label above
     *      fontSize : number # number of fontSize, it has higher priority than opts.cell.fontSize
     *      fontLineHeight: number
     *      button: { # if this property is exist. Default a label will be contained inside button < if above `text` is availabe >
     *          spriteFrame: string,
     *          eventHandler: cc.Component.EventHandler,
     *          width: number # button width
     *          value: {any} // button's value
     *          height: number # button height
     *      }
     *  }
     * 
     * @param {any} opts
     * {
     *  @required position: cc.v2() # default : cc.v2(0, 0);
     *  @required width: number # grid width 
     *  @required height: number # grid height
     *  isHorizontal: boolean # default false
     *  isVertical: boolean # default true
     *  @required spacingX: number # default 2px
     *  @required spacingY: boolean # default 2px
     *  dataValidated: boolean # sometimes we dont need to validate our getted data # default: false
     *  group: {
     *      widths: array[number || null] # array of width per cell ['', 500, 20]
     *          # assuming you have `content` node with width = 100 and 3 columns ['', 50, 20]
     *          # while the first element in array `width` is empty || null its width will be 100 - (50 + 20)
     *          # if we have width = ['', '', 50, 20] -> (100 - (50 + 20)) / 2
     *      colors: array[new cc.Color || null] # array of setting color of text. default cc.Color(225, 255, 255)
     *      events: array[ cc.Component.EventHandler || null] # only affected to all button or mapped by array position.
     *  }
     *  paging: {
     *      previous: cc.Component.EventHandler
     *      next: cc.Component.EventHandler
     *  }
     * 
     * 
     * @memberOf GridViewRub ( cc.Node )
     */
    constructor(data, opts = {}) {
        let defaultOptions = {
            position: cc.v2(0, 0),
            width: 850,
            height: 415,
            spacingX: 0,
            spacingY: 0,
            padding: 0,
            isHorizontal: false,
            isVertical: true,
            group: null,
            dataValidated: false,
            paging: null,
        };

        this.options = Object.assign({}, defaultOptions, opts);
        this.data = data;

        this.SCROLL_VIEW_PADDING_BOTTOM = 40;
    }

    init() {
        // let scrollviewPrefab = 'dashboard/dialog/prefabs/scrollview';

        this.prefab = cc.instantiate(app.res.prefab.scrollview);

        this.bodyNode = this.prefab.getChildByName('body');
        this.pagingNode = this.prefab.getChildByName('paging');

        this.viewNode = this.bodyNode.getChildByName('view');
        this.contentNode = this.viewNode.getChildByName('content');

        this._setupComponentsByOptions(this.bodyNode);
    }

    getContentNodeWidth() {
        return this.contentNode && (() => this.contentNode.getContentSize().width || 0)();
    }

    getNode() {
        this.data = [];
        return this.prefab;
    }

    destroy() {
        this.contentNode.children && this.contentNode.children.forEach(child => cc.isValid(child) && child.destroy() && child.removeFromParent());
    }

    addEventPagingBtn(prevEvent, nextEvent) {
        if (prevEvent) {
            let backBtn = this.pagingNode.getChildByName('previous').getComponent(cc.Button);

            prevEvent instanceof cc.Component.EventHandler && (backBtn.clickEvents = [prevEvent]);
            prevEvent instanceof Function && (backBtn.node.on(cc.Node.EventType.TOUCH_END, prevEvent));
        }

        if (nextEvent) {
            let nextBtn = this.pagingNode.getChildByName('next').getComponent(cc.Button);

            nextEvent instanceof cc.Component.EventHandler && (nextBtn.clickEvents = [nextEvent]);
            nextEvent instanceof Function && (nextBtn.node.on(cc.Node.EventType.TOUCH_END, nextEvent));
        }

    }

    _initPaging() {
        if (!this.options.paging) {
            // hide paging Node
            this.pagingNode.active = false;

            // fit to 100% by body
            let widget = {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            };
            NodeRub.addWidgetComponentToNode(this.bodyNode, widget);
        } else {
            this.pagingNode.active = true;
            let prevEvent = this.options.paging.prev;
            let nextEvent = this.options.paging.next;
            this.addEventPagingBtn(prevEvent, nextEvent);

        }
    }

    _setupComponentsByOptions(body) {
        this._initPaging();
        this._resize(body);

        // scrollview
        let scrollView = body.getComponent(cc.ScrollView);
        scrollView.horizontal = this.options.isHorizontal;
        scrollView.vertical = this.options.isVertical;
        // register scrollview scrollEvent
        // scrollView.scrollEvents = [];
        // this.options.event && scrollView.scrollEvents.push(this.options.event);


        // let contentLayout = this.contentNode.getComponent(cc.Layout);
        // contentLayout.spacingX = this.options.spacingX;
        // contentLayout.spacingY = this.options.spacingY;
    }

    // resize content node by parent ( dont know why widget does not work )
    _resize(scroll) {
        let widget = {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        };
        if (!this.options.paging) {
            // hide paging Node
            this.pagingNode.active = false;

            // fit to 100% by body
            NodeRub.addWidgetComponentToNode(this.bodyNode, widget);
        }
        this.prefab.setPosition(this.options.position);
        // set prefab size
        this.prefab.setContentSize(cc.size(this.options.width, this.options.height));
        // NodeRub.addWidgetComponentToNode(this.prefab, widget);

        scroll.setContentSize(cc.size(this.options.width, this.options.height - this.SCROLL_VIEW_PADDING_BOTTOM));
        // `view` node size
        this.viewNode.setContentSize(scroll.getContentSize());
        // `view/content` node size
        this.contentNode.setContentSize(this.viewNode.getContentSize());
    }
}