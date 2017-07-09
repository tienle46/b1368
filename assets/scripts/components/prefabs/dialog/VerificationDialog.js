import app from 'app';
import DialogActor from 'DialogActor';
import RubUtils from 'RubUtils';
import { destroy } from 'CCUtils';

class VerificationDialog extends DialogActor {
    constructor() {
        super();
        
        this.properties = {
            ...this.properties, 
            transparentBg: cc.Node,
            syntaxRichTxt: cc.RichText,
            providerContainerNode: cc.Node,
            providerItemNode: cc.Node,
            activeStateSprite: cc.Sprite,
            inActiveStateSprite: cc.Sprite,
            backBtn: cc.Node,
            okBtn: cc.Node
        };
        this.currentSyntax = "";
        this.currentShortCode = "";
    }

    onLoad() {
        super.onLoad();
        // this._initComponents();
        this.transparentBg.on('touchstart', function() {
            return;
        });
        
        if(app.env.isBrowser()) {
            this.okBtn.active = false;
        }
        this._initSyntax();
    }
    
    onCloseBtnClick() {
        destroy(this.node.parent);
    }
    
    okBtnClick() {
        if(app.env.isMobile()) {
            // detect carrier
            let {shortCode, syntax} = app.config.verifyAccountSyntax[carrier];
            if (app.env.isIOS()) {
                window.jsb.reflection.callStaticMethod("JSBUtils", "sendSMS:recipient:", this.currentSyntax, this.currentShortCode);
            }
            if (app.env.isAndroid()) {
                window.jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jsbSMS", "(Ljava/lang/String;Ljava/lang/String;)V", this.currentSyntax, this.currentShortCode);
            }
            // TODO
            // unable to get carrier name ?? ----
            //                                  |
            //                                  v
            // let text = "";
            // for(let carrier in app.config.verifyAccountSyntax) {
            //     let {shortCode, syntax, money} = app.config.verifyAccountSyntax[carrier];
            //     text += `${syntax} ${shortCode}. Chi phí: ${money}vnđ\n`;
            // }
            // text = text.replace(/\n$/, '');
            
            // app.system.info(text);
        }
    }
    
    onDestroy() {
        super.onDestroy();
        this.currentSyntax = "";
        this.currentShortCode = "";
    }
    
    _initSyntax() {
        // init provider
        let syntaxObject = app.config.verifyAccountSyntax;
        let index = 0;
        app.async.mapSeries(Object.keys(syntaxObject), (providerName, cb) => {
            let activeState = `${providerName.toLowerCase()}-active`;
            let inactiveState = `${providerName.toLowerCase()}-inactive`;

            RubUtils.getSpriteFramesFromAtlas(app.res.ATLAS_URLS.PROVIDERS, [activeState, inactiveState], (sprites) => {
                
                if(sprites) {
                    this.activeStateSprite.spriteFrame = sprites[activeState];
                    this.inActiveStateSprite.spriteFrame = sprites[inactiveState];
                    
                    let {shortCode, syntax, money} = syntaxObject[providerName];
                    let provider = cc.instantiate(this.providerItemNode);
                    this.addNode(provider);
                    provider.active = true;

                    let toggle = provider.getComponent(cc.Toggle);
                    toggle.isChecked = index == 0;
                    
                    toggle.syntax = syntax;
                    toggle.shortCode = shortCode;

                    this.providerContainerNode.addChild(provider);

                    if (toggle.isChecked) {
                        // toggle.check();
                        this.onProviderBtnClick(toggle);
                    }
                }
                index ++;
                
                cb && cb();
            });
        });
    }
    
    onProviderBtnClick(toggle) {
        this.syntaxRichTxt.string = `Cú pháp <color=#FFF618>${toggle.syntax}</c> gửi <color=#FFF618> ${toggle.shortCode} </c>`;
        this.currentSyntax = toggle.syntax;
        this.currentShortCode = toggle.shortCode;
    }
}

app.createComponent(VerificationDialog);