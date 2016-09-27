
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

        this.scene = null;
    }

    _init(scene){
        this.scene = scene;
    }

    onClickMenuButton(event){
        //TODO
        this.scene.showLoading();
        app.service.sendRequest(new SFS2X.Requests.System.LeaveRoomRequest(this.board.room));
    }

    onClickChatButton(event){
        app.system.info(app.res.string('coming_soon'));
    }

    onClickTopupButton(event){
        app.system.info(app.res.string('coming_soon'));
    }
}

app.createComponent(GameMenuPrefab);