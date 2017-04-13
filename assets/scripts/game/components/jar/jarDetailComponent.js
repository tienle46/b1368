import app from 'app';
import Actor from 'Actor';
import Utils from 'Utils';
import {destroy} from 'CCUtils';

export default class JarDetailComponent extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            bgTransparent: cc.Node,
            textContentScrollNode: cc.Node,
            textContentItem: cc.RichText,
            htmlContentViewNode: cc.WebView,
            jarTotalMoneyLbl: cc.Label,
            listUserContentNode: cc.Node,
            itemUser: cc.Node,
            userNameLbl: cc.Label,
            userMoneyLbl: cc.Label
        }
        
        this._timeout = null;
        this.time = 1000; // 1s
        this.remainTime = 0;
        this.jarId = null;  
    }
  
    onLoad() {
        super.onLoad();
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true);
    }
    
    start() {
        super.start();
    }
    
    onEnable() {
        super.onEnable();
        this._requestListUserJars();  
    }
    
    initContent({name, content} = {}) {
        content = content || "";
        this.textContentItem.string = content;
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
            this.userNameLbl.string = `${i+1}. ${name}`;
            this.userMoneyLbl.string = Utils.formatNumberType1(chips[i]).toString().toUpperCase();
            let item = cc.instantiate(this.itemUser);
            item.active = true;
            this.listUserContentNode.addChild(item);
        });
    }
}

app.createComponent(JarDetailComponent);