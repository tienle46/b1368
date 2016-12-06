import BasePopup from 'BasePopup';
import ButtonGroup from 'ButtonGroup';
import app from 'app';

export default class BasePopUpRub {
    /**
     * Creates an instance of PopUpRub.
     * 
     * @param {cc.Node} node : where this popup will be added 
     * @param {string} [string=""] : popup content
     * 
     * @memberOf PopUpRub
     */
    constructor(node, string = "") {
        this.string = string;
        this.node = node;
        this.time = 3000 * 10;

        this._setTimer(this.time);
        this.NAME = 'base_popup';
    }

    init() {
        let basePopup = app.res.prefab.basePopup;
        this.prefab = cc.instantiate(basePopup);
        this.prefab.zindex = app.const.popupZIndex;
        this.setPrefabName(this.NAME);

        if (!this.isAlreadyExist()) {
            this.addToNode();

            this.basePopupComponent = this.prefab.getComponent(BasePopup);
            this.popup_bkgNode = this.prefab.getChildByName('popup_bkg');

            this._setupPopupElement();

            this._setupPopupContent();
        }
    }

    // check if prefab is already added to node
    isAlreadyExist() {
        return (this.node && this.node.getChildByName(this.NAME)) ? true : false;
    }

    setPrefabName(name) {
        this.prefab && (this.prefab.name = name);
    }

    _setupPopupElement() {
        let btnGroupNode = this.popup_bkgNode.getChildByName('footer').getChildByName('groupBtn');
        this.bodyNode = this.basePopupComponent.bodyNode;
        this.confirmBtn = btnGroupNode.getChildByName('greenBtn').getComponent(cc.Button);
        this.cancelBtn = btnGroupNode.getChildByName('violetBtn').getComponent(cc.Button);
        this.groupBtn = btnGroupNode.getComponent(ButtonGroup);
    }

    _setupPopupContent() {
        this.basePopupComponent.setContent(this.string.trim());
    }

    changeText(string) {
        this.string = string;
    }

    addToNode() {
        this.node.addChild(this.prefab);
    }

    /**
     * @param {cc.Node || cc.Prefab || prefab dir} element
     * 
     * @memberOf BasePopUpRub
     */
    addToBody(element) {
        this.basePopupComponent.addToBody(element);
    }

    removeScrollView() {
        let scrollview = this.bodyNode.getChildByName('scrollview');
        this.bodyNode.removeChild(scrollview);
    }

    _setTimer(time) {
        this.timer = setTimeout((() => {
            this.prefab.removeFromParent();
        }).bind(this), time);
    }

    // static show(node, string, greenBtnEvent = null, context = null) {
    //     return new BasePopUpRub(node, string, greenBtnEvent, context).init();
    // }
}