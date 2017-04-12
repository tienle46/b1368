import app from 'app';
import Component from 'Component';

class Item extends Component {
    constructor() {
        super();
        this.properties = {
            jarAnchorNode: cc.Node
        };

        this._clickListener = null;
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
    
    getJarAnchor() {
        return this.jarAnchorNode;    
    }
    
    // initJar({id, remainTime, startTime, endTime, currentMoney} = {}) {
    //     this.jarNode.getComponent('JarComponent').init({id, remainTime, startTime, endTime, currentMoney});
    // }
}

app.createComponent(Item);