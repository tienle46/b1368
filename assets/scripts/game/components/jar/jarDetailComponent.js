import app from 'app';
import Actor from 'Actor';
import Utils from 'Utils';
import {destroy, setActive} from 'CCUtils';

export default class JarDetailComponent extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            bgTransparent: cc.Node,
            textContentScrollNode: cc.Node,
            textContentItem: cc.RichText,
            htmlContentView: cc.WebView,
            jarTotalMoneyLbl: cc.Label,
            listUserContentNode: cc.Node,
            itemUser: cc.Node,
            userNameLbl: cc.Label,
            userMoneyLbl: cc.Label
        });
        
        this._timeout = null;
        this.time = 1000; // 1s
        this.remainTime = 0;
        this.jarId = null;  
    }
  
    onLoad() {
        super.onLoad();
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true); 
        
        
        if(this.content.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
            // open web view
            this.openWebView();
            console.warn('this.htmlContentView', this.htmlContentView);
            this.htmlContentView.url = 'https://bai1368.com/game/play/jar/bacay.html';
        } else {
            this.openTextView();
            this.textContentItem.string = this.content;
        }
        this.content = "";
    }
    
    start() {
        super.start();
    }
    
    onEnable() {
        super.onEnable();
        this._requestListUserJars();  
    }
    
    initContent({name, content, total} = {}) {
        this.content = content || "";
        this.jarTotalMoneyLbl.string = total ? `${Utils.numberFormat(total)}`: "";
    }
    
    openWebView() {
        setActive(this.htmlContentView.node);  
        setActive(this.textContentScrollNode, false);  
    }
    
    openTextView() {
        setActive(this.htmlContentView.node, false);  
        setActive(this.textContentScrollNode);
    }
    
    onDestroy() {
        super.onDestroy();
    }
    
    close() {
        if (this.node) {
            this.node.active = false;
            destroy(this.node);
        }
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GOT_JAR, this._onUserJarInfo, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GOT_JAR, this._onUserJarInfo, this);
    }
    
    _requestListUserJars() {
        app.service.send({
            cmd: app.commands.USER_GOT_JAR,
            data: {
                [app.keywords.GAME_CODE]: app.context.getSelectedGame(),
                [app.keywords.PAGE]: 1
            }
        });
    }
    
    _onUserJarInfo(data) {
        let names = data['ul'],
            chips = data['ml'];
        
        names.forEach((name, i) => {
            if(name.length > 9) {
                name = `${name.substr(0, 6)}...`;
            }
            
            this.userNameLbl.string = `${i+1}. ${name}`;
            this.userMoneyLbl.string = Utils.formatNumberType1(chips[i]).toString().toUpperCase();
            let item = cc.instantiate(this.itemUser);
            item.active = true;
            this.listUserContentNode.addChild(item);
        });
    }
}

app.createComponent(JarDetailComponent);