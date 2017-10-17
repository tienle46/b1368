import app from 'app';
import DialogActor from 'DialogActor';
import PopupTabBody from 'PopupTabBody';

export default class TabBuddyPolicy extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            richText: cc.RichText,
            webView: cc.WebView,
            contentScr: cc.ScrollView
        };

        this.addedNodes = {};
    }
    
    _loadPolicy() {
        app.service.send({
            cmd: app.commands.BANK_TRANSFER_POLICY,
        })
    }

    onLoad() {
        super.onLoad();
    }
    
    start() {
        super.start()
        this._loadPolicy()
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.BANK_TRANSFER_POLICY, this._onTaiXiuHistory, this)
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.BANK_TRANSFER_POLICY, this._onTaiXiuHistory, this)
    }
    
    _onTaiXiuHistory(data){
        console.warn(data)
        // if (!resURL.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/))
        // let content = 'lorem ipsum hsofj auduof j v lorem ipsum hsofj auduof lorem ipsum hsofj auduo florem ipsum hsofj auduof'
        // let content = 'http://www.24h.com.vn'
        const content = data.c
        if(content.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)){
                this.webView.node.active = true
                this.contentScr.node.active = false
                this.webView.url = content
        }else{
            this.richText.string = content
            this.webView.node.active = false
            this.contentScr.node.active = true
        }
    }
}

app.createComponent(TabBuddyPolicy);