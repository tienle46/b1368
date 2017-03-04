import app from 'app';
import Component from 'Component';

class Item extends Component {
    constructor() {
        super();
        this.properties = {
            gameCode: "",
            gameID: 0,
            _clickListener: null
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
}

app.createComponent(Item);