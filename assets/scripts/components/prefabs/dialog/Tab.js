/**
 * Tab - handling toggleGroup behaves as tabs
 */
import app from 'app';
import Component from 'Component';
import ToggleGroup from 'ToggleGroup';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';

class Tab extends Component {
    constructor() {
        super();
    }

    onLoad() {
        log('tab onload');
        this.node.on('touchstart', function() {
            return;
        });

        this.toggleGroupComponent = this.node.getChildByName('group').getComponent(ToggleGroup);
        // this.toggleGroupComponent = this.node.getChildByName('group').getChildByName('toggleGroup').getComponent(ToggleGroup);
    }

    addContentPrefabToBody(bodyNode, prefabURL) {
        this.clearBody(bodyNode);
        return RubUtils.loadRes(prefabURL).then((prefab) => {
            let p = cc.instantiate(prefab);
            p.setPosition(cc.v2(0, 0));
            // add to node
            this._addChildToBody(bodyNode, p);

            return p;
        }).catch((e) => {
            error('err', e);
        });
    }

    // add content node to body node
    addContentNodeToBody(bodyNode, content) {
        this.clearBody(bodyNode);

        if (content instanceof cc.Node) {
            let node = app._.cloneDeep(content);

            this._addChildToBody(bodyNode, node);
        } else if (content instanceof Promise) {
            content.then((node) => {
                // wait until resources are loaded.
                setTimeout(() => {
                    let n = app._.cloneDeep(node);

                    this._addChildToBody(bodyNode, n);
                });
            });
        }
    }

    getToggleGroup() {
        return this.toggleGroupComponent;
    }

    clearBody(bodyNode) {
        bodyNode.removeAllChildren(true);
    }

    _addChildToBody(bodyNode, node) {
        let widget = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        NodeRub.addWidgetComponentToNode(node, widget);
        node.setPosition(cc.v2(0, 0));
        bodyNode.addChild(node);
    }
}

app.createComponent(Tab);