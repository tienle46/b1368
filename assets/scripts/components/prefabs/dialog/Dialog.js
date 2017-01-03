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

        this.bgTransparent = {
            default: null,
            type: cc.Node
        };

        this.addedPrefabs = [];
        this.addedNodes = {};
    }

    onLoad() {
        super.onLoad();
        this.node.zIndex = app.const.dialogZIndex;
    }

    onEnable() {
        this.addedPrefabs = [];
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true);
    }

    onDestroy() {
        super.onDestroy();
        RubUtils.releaseAssets(this.addedPrefabs);
        this.addedPrefabs = [];
        this.addedNodes = {};
    }

    onCloseBtnClick() {
        this.releaseAssets();
        this.node.parent.removeFromParent();
    }

    addToBody(id, url) {
        if (!this.addedNodes[id]) {
            if (this._isNode(url)) {
                this._addContentNodeToBody(id, url);
            } else {
                this._addContentPrefabToBody(id, url);
            }
        } else {
            this._showBody(id);
        }
    }


    setTitle(string) {
        this.titleLbl.string = string.toUpperCase();
    }

    _showBody(id) {
        if (this.bodyNode.children) {
            this.bodyNode.children.map(node => {
                node.active = (node.__uid == id);
            });
        }
    }

    _addContentPrefabToBody(id, prefabURL) {
        return RubUtils.loadRes(prefabURL).then((prefab) => {
            this.addedPrefabs.push(prefab);
            let p = cc.instantiate(prefab);
            p.__uid = id;
            this._addChildToBody(id, p);
            return p;
        }).catch((e) => {
            error('err', e);
        });
    }

    // add content node to body node
    _addContentNodeToBody(id, content) {
        if (content instanceof cc.Node) {
            let node = app._.cloneDeep(content);
            node.__uid = id;

            this._addChildToBody(id, node);
        } else if (content instanceof Promise) {
            content.then((node) => {
                // wait until resources are loaded.
                setTimeout(() => {
                    let n = app._.cloneDeep(node);
                    n.__uid = id;

                    this._addChildToBody(id, n);
                });
            });
        }
    }

    _isNode(value) {
        return value instanceof cc.Node || value instanceof Promise;
    }

    _addChildToBody(id, node) {
        let widget = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        NodeRub.addWidgetComponentToNode(node, widget);
        node.setPosition(cc.v2(0, 0));
        node.active = false;

        this.addedNodes[id] = node;

        this.bodyNode.addChild(node);

        this.addAssets(node); // <- removed assets

        this._showBody(id);
    }
}

app.createComponent(Dialog);