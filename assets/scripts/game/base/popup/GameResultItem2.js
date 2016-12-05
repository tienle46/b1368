import app from 'app';
import Component from 'Component';

class GameResultItem2 extends Component {
    constructor() {
        super();

        this.infoNode = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        this.infoNode.zIndex = 40;
    }
}

app.createComponent(GameResultItem2);