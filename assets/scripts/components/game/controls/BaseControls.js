/**
 * Created by Thanh on 9/13/2016.
 */

import game from 'game'
import utils from 'utils'
import Component from 'Component'

class BaseControls extends Component {
    constructor(){
        super();
        
        this.readyBtn = {
            default: null,
            type: cc.Button
        }

        this.unreadyBtn = {
            default: null,
            type: cc.Button
        }

        this.board = null;
        this.scene = null;
    }

    onClickReadyButton(){
        //TODO show waiting dialog
        console.log("onClickReadyButton")
        game.service.send({cmd: game.commands.PLAYER_READY, room: this.board.room}, (resObj) => {
            console.log(resObj)

            let playerId = resObj[game.keywords.PLAYER_ID]

            if(this.scene.playerManager.isItMe(playerId)){
                utils.show(this.unreadyBtn)
                utils.hide(this.readyBtn)
            }

        });
    }

    onClickUnreadyButton(){
        //TODO show waiting dialog
        console.log("onClickUnreadyButton")
        game.service.send({cmd: game.commands.PLAYER_UNREADY, room: this.board.room}, (resObj) => {
            console.log(resObj)

            let playerId = resObj[game.keywords.PLAYER_ID]

            if(this.scene.playerManager.isItMe(playerId)){
                utils.show(this.readyBtn)
                utils.hide(this.unreadyBtn)
            }
        });
    }

    _init(board, scene){
        this.board = board;
        this.scene = scene;
    }
}

game.createComponent(BaseControls)
