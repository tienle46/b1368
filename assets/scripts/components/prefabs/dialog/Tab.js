/**
 * Tab - handling toggleGroup behaves as tabs
 */
import app from 'app';
import Component from 'Component';
import ToggleGroup from 'ToggleGroup';
import RubUtils from 'RubUtils';
import GridViewRub from 'GridViewRub';

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
            bodyNode.addChild(content);
        } else if (content instanceof Promise) {
            // let d = {
            //     items: [
            //         ['01-08-2016 09:15:46', '07-07-2016 16:16:26', '01-07-2016 16:24:17', '01-07-2016 16:23:18', '13-06-2016 11:36:45', '07-06-2016 11:24:33', '05-06-2016 20:07:24', '05-06-2016 19:56:36', '04-06-2016 21:40:28', '04-06-2016 21:35:11'],
            //         ['Vina1 50K', 'Viettel 50K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', 'Viettel 20K', ' Mobi 20K', 'Vina 20K'],
            //         []
            //     ]
            // };
            // GridViewRub.node(bodyNode, d.items, { position: cc.v2(2, 94), width: 715 }).then((node) => {
            //     bodyNode.addChild(node);
            // });

            content.then((node) => {
                bodyNode.addChild(node);
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