
var game = require('game')
var BaseScene = require("BaseScene")

cc.Class({
    extends: BaseScene,

    properties: {

      loginButton: {
        default:null,
        type:cc.Button
      },

      registerButton: {
        default:null,
        type:cc.Button
      },

      playNowButton: {
        default:null,
        type:cc.Button
      },

      facebookButton: {
        default:null,
        type:cc.Button
      }
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
    },

    // use this for initialization
    onLoad: function () {


    },

    //  handle Action
    handleLoginAction:function () {

        game.service.connect((success) => {
            console.debug("success: " + success);
            if (success) {
                game.service.login("crush1", "1234nm", (error, result) => {
                    if (result) {
                        console.debug(`Logged in as ${game.context.getUser().name}`)

                        this.node.runAction(cc.sequence(
                            cc.fadeOut(),
                            cc.callFunc(function () {
                                cc.director.loadScene('DashboardScene');
                            })
                        ));
                    }

                    if (error) {
                        console.debug("Login error: ")
                        console.debug(error)
                    }
                });
            }
        });
    },

    handleRegisterButton: function() {

    },

    handlePlayNowButton: function() {

    },

    handleFacebookLoginAction: function () {

    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
