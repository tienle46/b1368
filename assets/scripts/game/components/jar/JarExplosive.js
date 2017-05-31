import app from 'app';
import Actor from 'Actor';
import GameUtils from 'GameUtils';
import CCUtils from 'CCUtils';

export default class JarExplosive extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            amount: cc.Label,
            message: cc.Label,
            bgTransparent: cc.Node
        });
        
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
            debug('close close');
            this.close();
        }, this.duration);
    }
    
    onShareBtnClick() {
        app.facebookActions.share(app.config.getShareObject('jar'));
    }
    
    activeBtnComponent() {
        this.button && (this.button.interactable = true);
    }
    
    init({username, message, money} = {}) {
        debug('on init', username, message, money);

        this.message.string = message ? message : app.res.string('jar_explosion');
        this.amount.string = GameUtils.formatBalanceShort(money);
    }
    
    close() {
        debug('close cmnr');

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