
var BaseScene = require("BaseScene");

export default class RegisterScene extends BaseScene {
    constructor() {
        super();

        this.accountNameLabel = {
        default: null,
                type: cc.Label
        }

        this.accountNameInput = {
        default: null,
                type: cc.EditBox
        }
    }
}