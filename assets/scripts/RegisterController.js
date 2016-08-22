cc.Class({
    extends: cc.Component,

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
