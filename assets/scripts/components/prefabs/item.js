import app from 'app';
import Actor from 'Actor';
import Events from 'GameEvents';

class Item extends Actor {
    constructor() {
        super();
        this.properties = {
            jarAnchorNode: cc.Node
        };

        this._clickListener = null;
        this.gameCode = null;
        this._jarAdded = false;
    }

    onLoad() {
        super.onLoad();
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(Events.ON_LIST_HU_UPDATED, this._updateItemJar, this);
    }
    
    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(Events.ON_LIST_HU_UPDATED, this._updateItemJar, this);
    }
    
    _updateItemJar() {
        if(!this._jarAdded && app.jarManager.hasJar(this.gameCode)) {
            this._jarAdded = true;
            app.jarManager.addJarToParent(this.getJarAnchor(), this.gameCode);
        }
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