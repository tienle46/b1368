/**
 * Created by Thanh on 2/16/2017.
 */

import app from 'app';
import Component from 'Component';

let currentPopup = null;

export default class MultiTabPopup extends Component {

    constructor() {
        super();

        this.properties = {
            ...this.properties,
            titleLabel: cc.Label,
            bodyNode: cc.Node,
            loadingNode: cc.Node,
            tabContainer: cc.Node,
            toggleGroup: cc.ToggleGroup,
            emptyBody: cc.Node,
            tabPrefab: cc.Prefab,
        }

        /**
         * @type {Progress}+
         */
        this.progress = null;
        this.activeTabIndex = -1;
        this.firstTabIndex = 0;
        this._tabModels = [];
        this._tabs = [];
        this._tabBodys = [];
    }

    onLoad() {
        super.onLoad();
        this.progress = this.loadingNode.getComponent('Progress');
        this._tabBodys = [];
    }

    onEnable() {
        super.onEnable();
        this._initTab();
        currentPopup = this;
    }

    onDisable() {
        super.onDisable();

        this._tabs = null;
        this._tabModels = null;
        this._tabBodys = null;
    }

    start() {
        super.start();
        this.changeTab(this.firstTabIndex);
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

    _showLoading() {
        this.progress.show();
    }

    _hideLoading() {
        this.progress.hide();
    }

    _changeBody(tabIndex, data) {
        let model = this._tabModels[tabIndex];
        let tabBody = this._tabBodys[tabIndex];

        if (model && (tabBody || model.prefabPath)) {
            this.setTitle(model.title);

            if (tabBody) {
                this._hideAllBodyChildren();
                this._visibleBodyNode()
                tabBody.onDataChanged(data);
                tabBody.node.active = true;
            } else if (model.prefabPath) {

                this.progress.show();

                cc.loader.loadRes(model.prefabPath, cc.Prefab, (error, prefab) => {

                    this.progress.hide();

                    if (error || !prefab) {
                        this._showEmptyBody();
                    } else {
                        let bodyTabNode = cc.instantiate(prefab);
                        let bodyComponent = bodyTabNode.getComponent(model.componentName);
                        if (bodyComponent) {
                            this._hideAllBodyChildren();
                            this._visibleBodyNode();

                            bodyComponent.setPopup(this);
                            bodyComponent.init({data: {...model.data, ...data}, emptyNode: this.emptyNode, loadingProgress: this.progress});
                            this.bodyNode.addChild(bodyTabNode);
                            this._tabBodys[tabIndex] = bodyComponent;
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

    _hideAllBodyChildren(){
        this.bodyNode.children.forEach(child => child.active = false);
    }

    _visibleBodyNode(visible = true) {
        this.bodyNode.active = visible;
        visible && (this.emptyBody.active = false);
    }

    _showEmptyBody() {
        this.bodyNode.active = false;
        this.emptyBody.active = true;
    }

    setTitle(title = app.res.string('system')) {
        this.titleLabel && (this.titleLabel.string = title);
    }

    changeTab(tabIndex, data) {
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
    show({parentNode = cc.director.getScene(), firstTabIndex = 0, title = null, tabModels = []} = {}) {

        this._hidePopupInstance();
        this.title = title;
        this._tabModels = tabModels;
        this.firstTabIndex = firstTabIndex;
        parentNode.addChild(this.node);
    }

    hide() {
        if (this.node) {
            this.node.active = false;
            this.node.destroy();
            this.node.removeFromParent(true);
        }
    }

    _hidePopupInstance() {
        currentPopup && currentPopup.hide();
        currentPopup = null;
    }
}

app.createComponent(MultiTabPopup);