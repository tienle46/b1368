
import app from 'app';
import Component from 'Component';
import SFS2X from 'SFS2X';

class GameMenuPrefab extends Component {
    constructor() {
        super();

        this.menuBtn = {
            default: null,
            type: cc.Node
        };

        this.chatBtn = {
            default: null,
            type: cc.Node
        };

        this.topupBtn = {
            default: null,
            type: cc.Node
        };

        this.board = null;
        this.scene = null;
    }

    _init(board, scene){
        this.board = board;
        this.scene = scene;
        
        console.log(this.menuBtn)
    }

    onClickMenuButton(event){
        this.scene.showLoading();
        app.service.sendRequest(new SFS2X.Requests.System.LeaveRoomRequest(this.board.room));
    }

    onClickChatButton(event){
        app.system.info("Chức năng đang hoàn thiện");
    }

    onClickTopupButton(event){
        app.system.info("Chức năng đang hoàn thiện");
    }
}

app.createComponent(GameMenuPrefab);