import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';

export default class ListViewRub {
    /**
     * Creates an instance of ListViewRub.
     * 
     * @param @required [{any} || cc.Node] data
     * @param @required {any} [opts={}]
     * {
     *  @required position: cc.v2
     *  @required width: number
     *  @required height: number
     *  paging: {
     *      prev: cc.Component.EventHandler
     *      next: cc.Component.EventHandler
     *  }
     * }
     * @memberOf ListViewRub
     */
    constructor(data, opts = {}) {
        let defaultOptions = {
            position: cc.v2(0, 0),
            width: 872,
            height: 350,
            isHorizontal: false,
            spacingY: 20,
            padding: 10,
            isVertical: true
        };

        this.options = Object.assign({}, defaultOptions, opts);
        this.data = data;
        this.SCROLL_VIEW_PADDING_BOTTOM = 40;
    }

    init() {
        let scrollviewPrefab = 'dashboard/dialog/prefabs/scrollview';

        return RubUtils.loadRes(scrollviewPrefab).then((prefab) => {
            this.prefab = cc.instantiate(prefab);

            // this.addToNode();
            this.bodyNode = this.prefab.getChildByName('body');
            this.pagingNode = this.prefab.getChildByName('paging');

            this.viewNode = this.bodyNode.getChildByName('view');
            this.contentNode = this.viewNode.getChildByName('content');

            return this.bodyNode;
        }).then(this._setupComponentsByOptions.bind(this)).then(this._addRows.bind(this));
    }

    _addRows() {
        this.data.forEach((node) => {
            if (node instanceof cc.Node)
                this.contentNode.addChild(node);
        });
        return this;
    }

    getNode() {
        return this.init().then(() => {
            return this.prefab;
        });
    }

    resetData(data) {
        this.data = data;
        // reset body
        this.contentNode && this.contentNode.removeAllChildren(true);
        // reinsert
        this._addRows();
    }

    // push data
    // updateData(data) {
    //     data = this._validData(data);
    //     // this.data = [...this.data, ...data];
    //     // this.prefab.active = false;
    //     this._insertCellBody(data);
    // }

    _setupComponentsByOptions(scroll) {
        this._initPaging();
        this._resize(scroll);

        // scrollview
        let scrollView = scroll.getComponent(cc.ScrollView);
        scrollView.horizontal = this.options.isHorizontal;
        scrollView.vertical = this.options.isVertical;
        // register scrollview scrollEvent
        // scrollView.scrollEvents = [];
        // this.options.event && scrollView.scrollEvents.push(this.options.event);

        // content/layout
        let layout = {
            type: cc.Layout.Type.VERTICAL,
            spacingY: this.options.spacingY,
            resizeMode: cc.Layout.ResizeMode.CONTAINER,
            padding: this.options.padding,
            verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
        };
        NodeRub.addLayoutComponentToNode(this.contentNode, layout);
        return null;
    }

    // resize content node by parent ( dont know why widget does not work )
    _resize(scroll) {
        this.prefab.setPosition(this.options.position);
        // set prefab size
        this.prefab.setContentSize(cc.size(this.options.width, this.options.height));

        scroll.setContentSize(cc.size(this.options.width, this.options.height - this.SCROLL_VIEW_PADDING_BOTTOM));
        // `view` node size
        this.viewNode.setContentSize(cc.size(this.options.width - 30, this.options.height));
        // `view/content` node size
        this.contentNode.setContentSize(this.viewNode.getContentSize());
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

    addEventPagingBtn(prevEvent, nextEvent) {
        if (prevEvent && prevEvent instanceof cc.Component.EventHandler) {
            let backBtn = this.pagingNode.getChildByName('previous').getComponent(cc.Button);
            backBtn.clickEvents = [prevEvent];
        }

        if (nextEvent && nextEvent instanceof cc.Component.EventHandler) {
            let nextBtn = this.pagingNode.getChildByName('next').getComponent(cc.Button);
            nextBtn.clickEvents = [nextEvent];
        }
    }

    _getNode() {
        return this.prefab;
    }


    // return Promise which attaches `cc.Node`
    static node(data, opts = {}) {
        return new ListViewRub(data, opts).init().then((a) => {
            return a._getNode();
        });
    }

    static show(node, data, opts = {}) {
        return new ListViewRub(data, opts).init().then((a) => {
            let n = a._getNode();

            node.addChild(n);
            return a;
        });
    }
}