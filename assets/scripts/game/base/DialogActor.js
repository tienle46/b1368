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

        this._scrollView = null;
        this.tabGroup = null;
        this.data = null;
        this.isLoaded = false;
    }

    setData(data){
        this.data = data;

        if(this.isLoaded){
            this._onDataChanged();
        }
    }

    onEnable(...args){
        super.onEnable(...args);

        this.isLoaded = true;
        this._onDataChanged();
    }

    onDisable(){
        super.onDisable();

        this.isLoaded = false;
    }

    _onDataChanged(){

    }

    setTabGroup(tabGroup){
        this.tabGroup = tabGroup;
    }

    onDestroy() {
        super.onDestroy();
        if (this._scrollView && cc.isValid(this._scrollView)) {
            this._scrollView.destroy();
            this._scrollView = null;
        }
    }

    initView(head, data, options) {
        if (!this._scrollView) {
            this._scrollView = cc.instantiate(this.scrollview);
            let o = { top: 0, left: 0, right: 0, bottom: 0 };
            this._scrollView.getComponent('Scrollview').initView(head, data, options);
            NodeRub.addWidgetComponentToNode(this._scrollView, o);
            o = null;
        } else {
            this._scrollView.getComponent('Scrollview').updateOptions(options);
            this._scrollView.getComponent('Scrollview').updateView(head, data);
        }
    }

    getScrollViewNode() {
        return this._scrollView;
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