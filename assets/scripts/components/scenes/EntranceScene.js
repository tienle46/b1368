var game = require('game');
import BaseScene from "BaseScene"

class EntranceScene extends BaseScene {

    constructor() {

        super();

        this.loginButton = {
            default: null,
            type: cc.Button
        };

        this.registerButton = {
            default: null,
            type: cc.Button
        };

        this.playNowButton = {
            default: null,
            type: cc.Button
        };

        this.facebookButton = {
            default: null,
            type: cc.Button
        };
    }

    // use this for initialization
    onLoad() {
        super.onLoad();
        console.log("Entrance on load...")
    }

    handleLoginAction() {

        game.service.connect((success) => {
            console.debug("success: " + success);
            if (success) {
                game.service.login("crush1", "1234nm", (error, result) => {
                    if (result) {
                        // console.debug(`Logged in as ${game.context.getMe().name}`)

                        // if(game.context.getMe()){
                        //     let ListTableScene = require('ListTableScene');
                        //     new ListTableScene()._createRoom(game.const.gameCode.TLMNDL, 1, 2)
                        // }else{
                            this.node.runAction(cc.sequence(
                                cc.fadeOut(0.5),
                                cc.callFunc(function() {
                                    cc.director.loadScene('DashboardScene');
                                })
                            ));
                        // }

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

game.createComponent(EntranceScene);