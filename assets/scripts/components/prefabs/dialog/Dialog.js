import app from 'app';
import Component from 'Component';
import DialogTab from 'DialogTab';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';

export default class Dialog extends Component {
    constructor() {
        super();

        this.tabs = {
            default: null,
            type: DialogTab
        };

        this.bodyNode = {
            default: null,
            type: cc.Node
        };

        this.titleLbl = {
            default: null,
            type: cc.Label
        };
    }

    onLoad() {
        this.node.zIndex = app.const.dialogZIndex;
    }

    onCloseBtnClick() {
        this.node.removeFromParent(true);
        this.releaseAssets();
    }

    addToBody(url) {
        if (this._isNode(url)) {
            this._addContentNodeToBody(url);
        } else {
            this._addContentPrefabToBody(url);
        }
    }

    setTitle(string) {
        this.titleLbl.string = string.toUpperCase();
    }

    _addContentPrefabToBody(prefabURL) {
        this.clearBody();
        return RubUtils.loadRes(prefabURL).then((prefab) => {
            let p = cc.instantiate(prefab);
            p.setPosition(cc.v2(0, 0));
            // add to node
            this._addChildToBody(p);
            return p;
        }).catch((e) => {
            error('err', e);
        });
    }

    // add content node to body node
    _addContentNodeToBody(content) {
        this.clearBody();

        if (content instanceof cc.Node) {
            let node = app._.cloneDeep(content);

            this._addChildToBody(node);
        } else if (content instanceof Promise) {
            content.then((node) => {
                // wait until resources are loaded.
                setTimeout(() => {
                    let n = app._.cloneDeep(node);

                    this._addChildToBody(n);
                });
            });
        }
    }

    clearBody() {
        if (this.bodyNode.children) {
            this.bodyNode.removeAllChildren(true);
            this.releaseAssets();
        }
    }

    _isNode(value) {
        return value instanceof cc.Node || value instanceof Promise;
    }

    _addChildToBody(node) {
        let widget = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        NodeRub.addWidgetComponentToNode(node, widget);
        node.setPosition(cc.v2(0, 0));
        this.bodyNode.addChild(node);

        this.addAssets(node);
    }
}

app.createComponent(Dialog);