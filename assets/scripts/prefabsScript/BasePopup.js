cc.Class({
    extends: cc.Component,

    properties: {
        

        popUpContainner: {
            default:null,
            type:cc.Sprite
        },

        closeButton: {
            default:null,
            type:cc.Button
        }

    },

    // use this for initialization
    onLoad: function () {

    },

    handleClosePopupAction: function () {


        this.closeButton.getComponent(cc.Animation).play();
        this.node.removeFromParent(true);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
