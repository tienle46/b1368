import app from 'app';
import Component from 'Component';
import JarComponent from 'JarComponent';

class Item extends Component {
    constructor() {
        super();
        this.properties = {
            gameCode: "",
            gameID: 0,
            _clickListener: null,
            jarComponent: JarComponent
        };
    }

    onLoad() {
        super.onLoad();
    }

    onDestroy() {
        super.onDestroy();
        this._clickListener = null;
    }

    listenOnClickListener(cb) {
        this._clickListener = cb;
    }

    handleClickItem() {
        this._clickListener && this._clickListener(this.gameCode);
    }
    
    initJar({id, remainTime, startTime, endTime, currentMoney} = {}) {
        this.jarComponent.init({id, remainTime, startTime, endTime, currentMoney});
    }
}

app.createComponent(Item);