import app from 'app';
import Actor from 'Actor';
import moment from 'moment';
import GameUtils from 'GameUtils';
import CCUtils from 'CCUtils';
import RubUtils from 'RubUtils';

export default class JarComponent extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            remainTimeLbl: cc.Label,
            jarTotalMoneyLbl: cc.Label,
            button: cc.Button,
            jarDetailPrefab: cc.Prefab,
            jarSprite: cc.Sprite,
            huCoin: cc.Node // this node will be animated
        });
        
        this._timeout = null;
        this.time = 1000; // 1s
        this.jarId = null;
        this.spriteFrames = [];
    }
  
    onLoad() {
        super.onLoad();
        RubUtils.getAtlasFromUrl('jar/huvang', (atlas) => {
            this.spriteFrames = atlas.getSpriteFrames();
            this.jarSprite.spriteFrame = this.spriteFrames[0];
        });
    }
    
    start() {
        super.start();
        
        app.system.getCurrentSceneName() !== app.const.scene.DASHBOARD_SCENE && !app.context.rejoiningGame && app.jarManager.requestUpdateJarList();
    }
    
    onEnable() {
        super.onEnable();
    }
    
    activeBtnComponent() {
        this.button && (this.button.interactable = true);
    }
    
    init({id, remainTime, startTime, endTime, currentMoney} = {}) {
        remainTime = Math.abs(new Date().getTime() - endTime);
        this.jarId = id;
        
        this._updateRemainTimeInterval(remainTime);
        this.updateTotalMoney(currentMoney);
        
        this.node.active = true;
    }
    
    _updateData(remainTime, totalMoney) {
        this.remainTime = remainTime;
        this.updateTotalMoney(totalMoney);
    }
    
    updateTotalMoney(totalMoney) {
        this.totalMoney = totalMoney;
        this.totalMoney < 0 && (this.totalMoney = 0);
        this.jarTotalMoneyLbl.string = GameUtils.formatBalanceShort(this.totalMoney).toString().toUpperCase();
    }
    
    onDestroy() {
        super.onDestroy();
        this._clearInterval();
        window.release(this.spriteFrames);
        
        let jar = cc.instantiate(app.res.prefab.jarPrefab);
        jar._jarData = this.node._jarData;
        app.jarManager.updateJar(this._gameCode, jar);
    }
    
    onJarClick() {
        app.service.send({
            cmd: app.commands.JAR_DETAIL,
            data: {
                [app.keywords.ID]: this.jarId
            }
        });
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.LIST_HU, this._onListHu, this);
        app.system.addListener(app.commands.JAR_DETAIL, this._onJarDetail, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.JAR_DETAIL, this._onJarDetail, this);
        app.system.removeListener(app.commands.LIST_HU, this._onListHu, this);
    }
    
    _updateRemainTimeInterval(remainTime) {
        this.remainTime = remainTime;
        this.remainTimeLbl && (this.remainTimeLbl.string = moment(this.remainTime).format('hh:mm:ss'));
        
        this.timeout = setTimeout(() => {
            clearTimeout(this.timeout);
            this._updateRemainTimeInterval(this.remainTime - this.time);
        }, this.time);
    }
    
    _clearInterval() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    
    _onJarDetail(data) {
        let name = data[app.keywords.NAME],
            content = data[app.keywords.DETAIL];
      
        let jarDetail = cc.instantiate(this.jarDetailPrefab);
        let jarDetailComponent = jarDetail.getComponent('jarDetailComponent');
        if(jarDetailComponent) {
            jarDetailComponent.initContent({name, content});
            app.system.getCurrentSceneNode().addChild(jarDetail);
        }
    }
    
    _onListHu(data) {
        let index = data[app.keywords.GAME_CODE_LIST].findIndex((gc) => gc == this._gameCode);
        
        if(~index) {
            let currentMoney = data[app.keywords.MONEY_LIST][index], //  total money in current jar
                endTime = data[app.keywords.END_TIME_LIST][index],
                remainTime = Math.abs(new Date().getTime() - endTime),
                id = data[app.keywords.ID_LIST][index],
                startTime = data[app.keywords.START_TIME_LIST][index];
                
            this.node._jarData = {id, remainTime, startTime, endTime, currentMoney};
            
            this._updateData(remainTime, currentMoney)
        };
    }
    
    // @param destination : v2(x,y)
    runCoinAnim(destination) {
        if(this && this.jarSprite) {
            // open the jar
            const animation = this.jarSprite.node.getComponent(cc.Animation) ? this.jarSprite.node.getComponent(cc.Animation) : this.jarSprite.node.addComponent(cc.Animation)
            this.spriteFrames[1] && (this.jarSprite.spriteFrame = this.spriteFrames[1]);
            
            if(this.node) {
                let startPos = this.node.convertToWorldSpaceAR(this.node.getPosition());
                for(let i = 0; i <= 20; i++) {
                    let huCoin = cc.instantiate(this.huCoin);
                    huCoin.setPosition(startPos.x, startPos.y);
                    
                    cc.director.getScene().addChild(huCoin);
                    
                    let midPoint = cc.p(Math.abs(startPos.x) - Math.abs(destination.x)/2, (Math.abs(destination.y) - 100) * (destination.y > 0 ? 1 : -1) );
                    var bezier = [startPos, midPoint, destination];
                    var bezierTo = cc.bezierTo(1  +  Math.random(0, 1), bezier);
                    
                    let sequence = cc.sequence(bezierTo, cc.callFunc(() => {
                        huCoin.active = false;
                        CCUtils.destroy(huCoin);
                        i === 20 && this.spriteFrames[0] && (this.jarSprite.spriteFrame = this.spriteFrames[0]);
                    }));
                    huCoin.runAction(sequence);
                }
            }
        }
    }
}

app.createComponent(JarComponent);