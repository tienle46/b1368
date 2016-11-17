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
    }

    init() {
        let basePopup = app.res.prefab.basePopup;
        this.prefab = cc.instantiate(basePopup);
        this.addToNode();

        this.basePopupComponent = this.prefab.getComponent(BasePopup);
        this.popup_bkgNode = this.prefab.getChildByName('popup_bkg');

        this._setupPopupElement();

        this._setupPopupContent();
    }

    _setupPopupElement() {
        let btnGroupNode = this.popup_bkgNode.getChildByName('footer').getChildByName('groupBtn');
        this.greenBtn = btnGroupNode.getChildByName('greenBtn').getComponent(cc.Button);
        this.violetBtn = btnGroupNode.getChildByName('violetBtn').getComponent(cc.Button);
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
}