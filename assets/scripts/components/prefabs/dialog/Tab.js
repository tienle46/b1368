/**
 * Tab - handling toggleGroup behaves as tabs
 */
import app from 'app';
import Component from 'Component';
import ToggleGroup from 'ToggleGroup';
import RubUtils from 'RubUtils';

class Tab extends Component {
    constructor() {
        super();
    }

    onLoad() {
        console.log('tab onload');
        this.node.on('touchstart', function() {
            return;
        });

        this.toggleGroupComponent = this.node.getChildByName('group').getChildByName('toggleGroup').getComponent(ToggleGroup);
    }

    addContentPrefabToBody(node, prefabURL) {
        node.removeAllChildren();
        return RubUtils.loadPrefab(prefabURL).then((prefab) => {
            let p = cc.instantiate(prefab);
            // add to node
            node.addChild(p);

            return p;
        }).catch((e) => {
            console.log('err', e);
        });
    }

    getToggleGroup() {
        return this.toggleGroupComponent;
    }
}

app.createComponent(Tab);