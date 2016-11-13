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
     *      previous: cc.Component.EventHandler
     *      next: cc.Component.EventHandler
     *  }
     * }
     * @memberOf ListViewRub
     */
    constructor(data, opts = {}) {
        let defaultOptions = {
            position: cc.v2(0, 0),
            width: 585,
            height: 250,
            isHorizontal: false,
            spacingY: 30,
            isVertical: true
        };

        this.options = Object.assign({}, defaultOptions, opts);
        this.data = data;
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
        }).then(this._setupComponentsByOptions.bind(this)).then(this._initRow.bind(this));
    }

    _initRow() {
        this.contentNode.addChild(this.data[0]);
        return this;
    }

    getNode() {
        return this.init().then(() => {
            return this.prefab;
        });
    }

    updateData(data) {
        data = this._validData(data);
        // this.data = [...this.data, ...data];
        // this.prefab.active = false;
        this._insertCellBody(data);
    }

    _setupComponentsByOptions(scroll) {
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
            padding: 10,
            verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
        };
        NodeRub.addLayoutComponentToNode(this.contentNode, layout);

        return null;
    }

    // resize content node by parent ( dont know why widget does not work )
    _resize(prefab) {
        prefab.setPosition(this.options.position);
        // set prefab size
        prefab.setContentSize(cc.size(this.options.width, this.options.height));
        // `view` node size
        this.viewNode.setContentSize(cc.size(this.options.width - 30, this.options.height));
        // `view/content` node size
        this.contentNode.setContentSize(this.viewNode.getContentSize());
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
            node.addChild(a._getNode());
            return a;
        });
    }
}