import Actor from 'Actor';
import app from 'app';
import NodeRub from 'NodeRub';

export default class DialogActor extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            p404: cc.Prefab,
            scrollview: cc.Prefab
        };

        this._gridView = null;
    }

    onDestroy() {
        super.onDestroy();
        if (this._gridView && cc.isValid(this._gridView)) {
            this._gridView.destroy();
            this._gridView = null;
        }
    }

    initGridView(head, data, options) {
        if (!this._gridView) {
            this._gridView = cc.instantiate(this.scrollview);
            let o = { top: 0, left: 0, right: 0, bottom: 0 };
            NodeRub.addWidgetComponentToNode(this._gridView, o);
            o = null;
            this._gridView.getComponent('Scrollview').initGrid(head, data, options);
        } else {
            this._gridView.getComponent('Scrollview').updateOptions(options);
            this._gridView.getComponent('Scrollview').updateView(head, data);
        }
    }

    getGridViewNode() {
        return this._gridView;
    }

    pageIsEmpty(node, str) {
        app.system.hideLoader();
        let p404 = cc.instantiate(this.p404);
        node.children.map(child => cc.isValid(child) && child.destroy() && child.removeFromParent());
        node.addChild(p404);

        if (str) {
            let p404Component = p404.getComponent('P404');
            p404Component && p404Component.setText(str);
        }
    }
}