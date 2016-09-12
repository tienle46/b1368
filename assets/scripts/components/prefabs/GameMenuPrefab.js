
import game from 'game'
import Component from 'Component'
import SFS2X from 'SFS2X'

class GameMenuPrefab extends Component {
    constructor() {
        super();

        this.menuBtn = {
            default: null,
            type: cc.Node
        }

        this.chatBtn = {
            default: null,
            type: cc.Node
        }

        this.topupBtn = {
            default: null,
            type: cc.Node
        }

        this.board = null;
        this.scene = null;
    }

    _init(board, scene){
        this.board = board;
        this.scene = scene;
    }

    onClickMenuButton(event){
        console.log("Click menu button")
        game.service.sendRequest(new SFS2X.Requests.System.LeaveRoomRequest(this.board.room));
        console.log("After send leave room request")
    }

    onClickChatButton(event){

    }

    onClickTopupButton(event){

    }
}

game.createComponent(GameMenuPrefab)