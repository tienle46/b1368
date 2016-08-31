cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        settingButton: {
            default:null,
            type:cc.Button
        },

        chatButton: {
            default:null,
            type:cc.Button
        },

        highLightLabel: {
            default:null,
            type:cc.Label
        },

        friendsButton: {
            default:null,
            type:cc.Button
        },

        moreButton: {
            default:null,
            type:cc.Button
        },

        backButton: {
            default:null,
            type:cc.Button

        },

        _showBack:false

    },

    // use this for initialization
    onLoad: function () {
        if (this._showBack) {
            this.settingButton.node.removeFromParent();
        }
        else  {
            this.backButton.node.removeFromParent();
        }

    },
    
    // Handle Click Action
    
    handleSettingAction: function () {
    if (this._showBack) {

    }
        else  {

    }


    },
    
    handleChatAction: function () {

    },

    handleFriendButtonAction: function () {

    },

    handleMoreAction: function () {

    },

    handleBackAction: function () {
        
    },

    
    autoScrollHighlight: function () {
        
    },
    
    // show Back Button, replace Setting Button
    
    showBackButton: function () {
        this._showBack = true;
    }



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
