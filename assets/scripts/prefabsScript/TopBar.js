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
            type:cc.Label
        },

        moreButton: {
            default:null,
            type:cc.Button
        }


    },

    // use this for initialization
    onLoad: function () {

    },
    
    // Handle Click Action
    
    handleSettingAction: function () {

    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
