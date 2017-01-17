import Actor from 'Actor';
import GridViewRub from 'GridViewRub';

export default class DialogActor extends Actor {
    constructor() {
        super();

        this._gridView = null;

        this.p404 = {
            default: null,
            type: cc.Prefab
        };
    }

    onDestroy() {
        super.onDestroy();
        this._gridView && this._gridView.destroy() && (this._gridView = null);
    }

    initGridView(head, data, options) {
        this._gridView = new GridViewRub(head, data, options);
    }

    getGridView() {
        return this._gridView;
    }

    getGridViewNode() {
        return this._gridView && this.getGridView().getNode();
    }

    pageIsEmpty(node, str) {
        let p404 = cc.instantiate(this.p404);
        node.children.map(child => cc.isValid(child) && child.destroy() && child.removeFromParent());
        node.addChild(p404);

        if (str) {
            let p404Component = p404.getComponent('P404');
            p404Component && p404Component.setText(str);
        }
    }
}