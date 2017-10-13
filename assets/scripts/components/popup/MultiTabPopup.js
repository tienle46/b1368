/**
 * Created by Thanh on 2/16/2017.
 */

import app from 'app';
import Actor from 'Actor';
import { destroy } from 'CCUtils';

let currentPopup = null;

/**
 * ComponentData = {
 *   tabNotifyData: {
 *      index (int): count (int)
 *   }
 * }
 */
export default class MultiTabPopup extends Actor {

    constructor() {
        super();
        
        this.properties = this.assignProperties({
            titleLabel: cc.Label,
            bgTransparent: cc.Node,
            bodyNode: cc.Node,
            loadingNode: cc.Node,
            tabContainer: cc.Node,
            toggleGroup: cc.ToggleGroup,
            emptyBody: cc.Node,
            tabPrefab: cc.Prefab,
        });

        /**
         * @type {Progress}+
         */
        this.progress = null;
        this.activeTabIndex = -1;
        this.focusTabIndex = 0;
        this._tabModels = [];
        this._tabs = [];
        this._tabBodies = [];
    }

    onLoad() {
        super.onLoad();
        this.progress = this.loadingNode.getComponent('Progress');
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true);

        this._tabs = [];
        this._tabBodies = [];
    }

    onEnable() {
        super.onEnable();
        this._initTab();
        currentPopup = this;

        let {tabNotifyData} = this.getComponentData();
        tabNotifyData && Object.keys(tabNotifyData).forEach(key => {
            this.setNotifyCountForTab(key, tabNotifyData[key]);
        });
    }

    onDisable() {
        super.onDisable();
    }

    onDestroy() {
        super.onDestroy();
        // window.release(this._tabs, this._tabModels, this._tabBodies);
    }

    start() {
        super.start();
        this.changeTab(this.focusTabIndex);
    }
    
    setNotifyCountForTab(index, count = 0){
        if(this.isComponentLoaded()){
            let popupTab = index >= 0 && this._tabs && this._tabs[index];
            popupTab && popupTab.setNotifyCount(count)
        }
    }
    
    // in some cases we need to check if tab have been added but it should be hide immediately.
    /**
     * @param {Func} condition: function condition with 1st parameter is a child tab 
     * 
     * @memberOf MultiTabPopup
     */
    filterTab(condition) {
        this._tabModels = this._tabModels.filter(condition)
    }
    
    _initTab() {
        this._tabs = this._tabModels.map((model, index) => {
            let tabNode = cc.instantiate(this.tabPrefab);
            let tab = tabNode.getComponent('PopupTab');
            if (tab) {
                tab.setTitle(model.title)
                tab.setOnClickListener(() => this.changeTab(index))
                tab.setToggleGroup(this.toggleGroup)
                this.tabContainer.addChild(tabNode);
            }

            return tab;
        });
    }

    showLoading() {
        this.progress && this.progress.show();
    }

    hideLoading() {
        this.progress && this.progress.hide();
    }

    _changeBody(tabIndex, data) {
        let model = this._tabModels[tabIndex];
        let tabBody = this._tabBodies[tabIndex];
        
        if (model && (tabBody || model.prefabPath)) {
            this.setTitle(model.title);
            this._hideAllBodyChildren();

            if (tabBody) {
                this._visibleBodyNode()
                tabBody.onDataChanged(data);
                tabBody.node.active = true;
            } else if (model.prefabPath) {
                this.showLoading()

                cc.loader.loadRes(model.prefabPath, cc.Prefab, (error, prefab) => {
                
                    this.hideLoading()

                    if (error || !prefab) {
                        this._showEmptyBody();
                    } else {
                        let bodyTabNode = cc.instantiate(prefab);
                        let bodyComponent = bodyTabNode.getComponent(model.componentName);
                        if (bodyComponent) {
                            this._hideAllBodyChildren();
                            this._visibleBodyNode();

                            bodyComponent.setPopup(this);
                            // bodyComponent.init({ data: {...model.data, ...data }, emptyNode: this.emptyNode, loadingProgress: this.progress });
                            bodyComponent.init({ data: Object.assign({}, model.data, data), emptyNode: this.emptyNode, loadingProgress: this.progress });
                            this.bodyNode.addChild(bodyTabNode);
                            this._tabBodies[tabIndex] = bodyComponent;
                        } else {
                            this._showEmptyBody();
                        }
                    }

                });

            }
        } else {
            this._showEmptyBody();
        }
    }

    _hideAllBodyChildren() {
        this.bodyNode && this.bodyNode.children && this.bodyNode.children.forEach(child => child.active = false);
    }

    _visibleBodyNode(visible = true) {
        this.bodyNode && (this.bodyNode.active = visible);
        visible && (this.emptyBody.active = false);
    }

    _showEmptyBody() {
        this.bodyNode && (this.bodyNode.active = false);
        this.emptyBody && (this.emptyBody.active = true);
    }

    setTitle(title = app.res.string('system')) {
        this.titleLabel && (this.titleLabel.string = title);
        // if(!app.env.isBrowser()) {
        //     this.titleLabel.node.setPositionY(this.titleLabel.node.getPositionY() - 5); 
        // }
    }

    changeTab(tabIndex, data) {
        console.warn('changeTab', tabIndex, data)
        if (tabIndex == this.activeTabIndex || tabIndex < 0 || tabIndex >= this._tabs.length) return;

        this.activeTabIndex = tabIndex;
        let tab = this._tabs[tabIndex];

        if (tab) {
            this._tabs.forEach(tab => tab.inactiveTab());
            tab.activeTab();
            this._changeBody(tabIndex, data);
        } else {
            this._showEmptyBody();
        }
    }

    /**
     * Tabs is an array of object
     * {
     *      title: String,
     *      prefabPath: String,
     *      componentName: String,
     *      data: Object
     * }
     */
    show({ parentNode = cc.director.getScene(), focusTabIndex = 0, title = null, tabModels = [], initData = null } = {}) {
        this._hidePopupInstance();
        this.title = title;
        // this._tabModels = tabModels;
        this._tabModels = tabModels.filter(tab => !tab.hide);
        this.focusTabIndex = focusTabIndex;
        this.initData = initData; 
        parentNode.addChild(this.node);
    }
    
    resetInitData() {
        this.initData = null;    
    }
    
    hide() {
        if (this.node) {
            this.node.active = false;
            destroy(this.node);
        }
    }

    _hidePopupInstance() {
        currentPopup && currentPopup.hide();
        currentPopup = null;
    }
}

app.createComponent(MultiTabPopup);