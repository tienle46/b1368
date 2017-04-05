/**
 * Created by Thanh on 2/16/2017.
 */

import app from 'app';
import Actor from 'Actor';
import NodeRub from 'NodeRub';

export default class PopupTabBody extends Actor {

    constructor(props) {
        super(props);

        this.properties = {
            ...this.properties,
            bodyNode: cc.Node,
            scrollview: cc.Prefab
        }

        /**
         * @type {Progress}
         */
        this.progress = null;
        /**
         * @type {cc.Node}
         */
        this.emptyNode = null;
        this._doneCb = null;
        this._data = null;
        this.dataLoaded = false;
        this.popup = null;
        this._isTabEnable = false;
    }

    onEnable() {
        super.onEnable();

        this._isTabEnable = true;

        if (!this.loadData()) {
            this.dataLoaded = true;
        }

        if (this.dataLoaded) {
            this._renderData(this._data);
        }
    }

    onDisable() {
        super.onDisable();

        this._isTabEnable = false;
    }

    onDestroy() {
        super.onDestroy();
        this._doneCb = null;
        this._data = null;
    }

    getPopup() {
        return this.popup;
    }

    setPopup(popup) {
        this.popup = popup;
    }

    init({ data = null, loadingProgress = null, emptyNode = null, didLoadDataCb = null } = {}) {
        this._data = data;
        this.progress = loadingProgress;
        this.emptyNode = emptyNode;
        this._doneCb = didLoadDataCb;
    }

    setLoadingData(loadingData = true) {
        this.dataLoaded = !loadingData;
    }

    /**
     * Request data from server
     * @abstract
     * @return true if data is loading, false if otherwise
     */
    loadData() {
        return false;
    }
    
    /**
     * Need to call immediately before requesting to server
     * @memberOf PopupTabBody
     */
    showLoadingProgress() {
        this.progress.show(app.const.LOADING_SHORT_DURATION, () => {
            this.progress && this.progress.hide();
            this._showEmptyData();
        });
    }

    /**
     * Update UI data
     * @abstract
     */
    onDataChanged(data) {
        if (!this._isTabEnable) {
            this._data = {...this._data, ...data };
        }
        
        return this._isTabEnable;
    }

    setLoadedData(data, renderImmediately = true) {
        this._hideLoading();
        this.dataLoaded = true;
        this._data = {...this._data, ...data };
        renderImmediately && this._renderData(this._data);
    }
    
    initView(head, data, options) {
        if (!this._scrollView) {
            this._scrollView = cc.instantiate(this.scrollview);
            // console.debug(cc.loader.isAutoRelease(this.scrollview));
            this._scrollView.getComponent('Scrollview').initView(head, data, options);
            NodeRub.addWidgetComponentToNode(this._scrollView, { top: 0, left: 0, right: 0, bottom: 0 });
            this.addNode(this._scrollView)
        } else {
            this._scrollView.getComponent('Scrollview').updateOptions(options);
            this._scrollView.getComponent('Scrollview').updateView(head, data);
        }
    }
    
    pageIsEmpty(node, str) {
        this.hideLoader(node);

        let p404 = cc.instantiate(this.p404);
        node.children.map(child => cc.isValid(child) && child.destroy() && child.removeFromParent());
        node.addChild(p404);

        if (str) {
            let p404Component = p404.getComponent('P404');
            p404Component && p404Component.setText(str);
        }
    }
    
    getScrollViewNode() {
        return this._scrollView;
    }
    
    _renderData(data) {
        this.onDataChanged(data);
        this._showTabBody();
        this._doneCb && this._doneCb();
    }

    _showEmptyData() {
        this.emptyNode && (this.emptyNode.active = true);
        this._doneCb && this._doneCb();
    }

    _showTabBody() {
        this._hideLoading();
        this.bodyNode && (this.bodyNode.active = true);
        this._doneCb && this._doneCb();
    }

    _hideLoading() {
        this.progress && this.progress.hide();
    }
}

app.createComponent(PopupTabBody)