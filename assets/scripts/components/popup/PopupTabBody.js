/**
 * Created by Thanh on 2/16/2017.
 */

import app from 'app';
import Actor from 'Actor';

export default class PopupTabBody extends Actor {

    constructor(props) {
        super(props);

        this.properties = {
            ...this.properties,
            bodyNode: cc.Node,
        }

        /**
         * @type {Progress}
         */
        this.progress = null;
        /**
         * @type {cc.Node}
         */
        this.emptyNode = null,
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