
var BaseScene = require("BaseScene");

cc.Class({
    extends: BaseScene,

    properties: {
      accountNameLabel: {
          default: null,
          type: cc.Label
      },
      accountNameInput: {
          default: null,
          type: cc.EditBox
      }
    },

    // use this for initialization
    onLoad: function () {
        
      // this.accountNameLabel.string = "AAA";

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
