import NodeRub from 'NodeRub';
import ScrollViewRub from 'ScrollViewRub';

export default class ListViewRub extends ScrollViewRub {
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
        super(data, opts);
        let defaultOptions = {
            position: cc.v2(0, 0),
            width: 872,
            height: 350,
            isHorizontal: false,
            spacingY: 20,
            padding: 10,
            isVertical: true
        };

        this.options = Object.assign(this.options, defaultOptions, opts);

        this.init();
    }

    init() {
        super.init();

        this._addRows();
    }

    _addRows() {
        this.data.forEach((node) => {
            if (node instanceof cc.Node)
                this.contentNode.addChild(node);
        });
        return this;
    }


    resetData(data) {
        this.data = data;
        // reset body
        if(this.contentNode){
            this.contentNode.children.forEach(child => child.destroy());
            this.contentNode.removeAllChildren(true);
        }
        // reinsert
        this._addRows();
    }

    // override
    _setupComponentsByOptions(body) {
        super._setupComponentsByOptions(body);

        // content/layout
        let layout = {
            type: cc.Layout.Type.VERTICAL,
            spacingY: this.options.spacingY,
            resizeMode: cc.Layout.ResizeMode.CONTAINER,
            padding: this.options.padding,
            verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
        };
        NodeRub.addLayoutComponentToNode(this.contentNode, layout);
    }

    // return Promise which attaches `cc.Node`
    static node(data, opts = {}) {
        return new ListViewRub(data, opts).getNode();
    }

    static show(node, data, opts = {}) {
        node.addChild(new ListViewRub(data, opts).getNode());
    }
}