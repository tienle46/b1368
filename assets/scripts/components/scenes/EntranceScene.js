
var game = require('game')
var BaseScene = require("BaseScene")

class EntranceScene {

    constructor() {

        this.loginButton = {
            default:null,
            type:cc.Button
        }

        this.registerButton = {
            default:null,
            type:cc.Button
        }

        this.playNowButton = {
            default:null,
            type:cc.Button
        }

        this.facebookButton = {
            default:null,
            type:cc.Button
        }
    }

    // use this for initialization
    onLoad() {
        console.log("on load...")
    }

    handleLoginAction () {

        game.service.connect((success) => {
            console.debug("success: " + success);
            if (success) {
                game.service.login("crush1", "1234nm", (error, result) => {
                    if (result) {
                        console.debug(`Logged in as ${game.context.getMySelf().name}`)

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
    }

    handleRegisterButton() {

    }

    handlePlayNowButton() {

    }

    handleFacebookLoginAction() {

    }

}

game.createComponent(EntranceScene, BaseScene);