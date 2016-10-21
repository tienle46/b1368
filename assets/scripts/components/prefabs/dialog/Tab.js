/**
 * Tab - handling toggleGroup behaves as tabs
 */
import app from 'app';
import Component from 'Component';
import ToggleGroup from 'ToggleGroup';
import RubUtils from 'RubUtils';
import _ from 'lodash';

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
            // add to node
            bodyNode.addChild(p);

            return p;
        }).catch((e) => {
            error('err', e);
        });
    }

    // add content node to body node
    addContentNodeToBody(bodyNode, content) {
        this.clearBody(bodyNode);

        if (content instanceof cc.Node) {
            let node = _.cloneDeep(content);
            bodyNode.addChild(node);
        } else if (content instanceof Promise) {
            content.then((node) => {
                // wait until resources are loaded.
                setTimeout(() => {
                    let n = _.cloneDeep(node);
                    bodyNode.addChild(n);
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
}

app.createComponent(Tab);