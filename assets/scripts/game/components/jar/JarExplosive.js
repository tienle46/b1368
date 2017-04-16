import app from 'app';
import Actor from 'Actor';
import Utils from 'Utils';
import CCUtils from 'CCUtils';

export default class JarExplosive extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            amount: cc.Label,
            message: cc.Label,
            bgTransparent: cc.Node
        };
        
        this.timeout = null;
        this.duration = 60000; // 6s
    }
  
    onLoad() {
        super.onLoad();
        this.node.zIndex = 999;
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => {
            this.close();
        });
    }
    
    onEnable() {
        super.onEnable();
        
        this.timeout = setTimeout(() => {
            this.close();
        }, this.duration);
    }
    
    onShareBtnClick() {
        if(app.env.isBrowser()){
            window.FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object: '....',
                })
            }, function(response) {
                console.log('response', response);
            });
        }
        else if (app.env.isMobile()){
            cc.log(`share on mobile`);
            var info = new Object();
            info.type  = "link";
            info.link  = "http://b1368.com";
            info.title = "Bài 1368";
            info.text  = "Chơi miễn phí, rinh tiền tỉ";
            info.image = "http://cocos2d-x.org/images/logo.png";
            window.sdkbox.PluginFacebook.dialog(info);
        }  
    }
    
    activeBtnComponent() {
        this.button && (this.button.interactable = true);
    }
    
    init({username, message, money} = {}) {
        this.message.string = message ? message : app.res.string('jar_explosion');
        this.amount.string = Utils.numberFormat(money, '0.0');
    }
    
    close() {
        if(this.node) {
            this.node.active = false;
            CCUtils.destroy(this.node);                    
        }
    }
    
    onDestroy() {
        super.onDestroy();
        this.timeout && clearTimeout(this.timeout)
    }
}

app.createComponent(JarExplosive);