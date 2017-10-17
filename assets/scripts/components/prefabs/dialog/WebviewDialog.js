import app from 'app';
import Actor from 'Actor';
import CCUtils from 'CCUtils';

class EventDialog extends Actor {
    constructor() {
        super();
        this.properties = this.assignProperties({
            loadingNode: cc.Node,
            bgTransparent: cc.Node,
            webView: cc.WebView,
            titleLabel : cc.Label,
        });
        /**
         * @type {cc.PageView}
         */
        this.dialog = null;
        this.progress = null;
        this._url = null
    }

    setDialog(dialog){
        this.dialog = dialog;
    }

    onLoad() {
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true);
        this.progress = this.loadingNode.getComponent('Progress')
        this._url && (this.webView.url = this._url)
    }

    start(){
        super.start()
    }

    onDestroy() {
        super.onDestroy();
    }
    
    loadURL(webURL){
        CCUtils.active(this.webView);
        this._url = webURL;
    }

    hide() {
        this.node.removeFromParent(false);
        CCUtils.destroy(this.node);
    }
}

app.createComponent(EventDialog);