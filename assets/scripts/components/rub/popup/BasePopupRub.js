var BasePopup = require('BasePopup');
var ButtonGroup = require('ButtonGroup');

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
        return new Promise((resolve, reject) => {
            cc.loader.loadRes('Popup/BasePopup', (err, prefab) => {
                if (err)
                    reject(err);
                this.prefab = cc.instantiate(prefab);
                let basePopupComponent = this.prefab.getComponent(BasePopup);
                // set elements
                this._setupPopupElement(basePopupComponent);

                resolve(this);
            });
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