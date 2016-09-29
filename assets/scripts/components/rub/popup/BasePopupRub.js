import BasePopup from 'BasePopup';
import ButtonGroup from 'ButtonGroup';
import RubUtils from 'RubUtils';

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
        return RubUtils.loadPrefab('Popup/BasePopup').then((prefab) => {
            this.prefab = cc.instantiate(prefab);
            let basePopupComponent = this.prefab.getComponent(BasePopup);
            // set elements
            this._setupPopupElement(basePopupComponent);

            return this;
        });
    }

    _setupPopupElement(basePopupComponent) {
        this.greenBtn = basePopupComponent.greenButtonNode.getComponent(cc.Button);
        this.violetBtn = basePopupComponent.greenButtonNode.getComponent(cc.Button);
        this.groupBtn = basePopupComponent.groupBtnNode.getComponent(ButtonGroup);
        this._setupPopup(basePopupComponent);
    }

    _setupPopup(basePopupComponent) {
        basePopupComponent.setContent(this.string.trim());
    }

    changeText(string) {
        this.string = string;
    }

    addToNode() {
        this.node.addChild(this.prefab);
    }

    closePopup() {
        this.prefab.getComponent(BasePopup).handleClosePopupAction();
    }
}