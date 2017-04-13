import app from 'app';
import Actor from 'Actor';
import moment from 'moment';
import Utils from 'Utils';
import { requestTimeout, clearRequestTimeout } from 'TimeHacker';


export default class JarComponent extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            remainTimeLbl: cc.Label,
            jarTotalMoneyLbl: cc.Label,
            button: cc.Button,
            jarDetailPrefab: cc.Prefab
        }
        
        this._timeout = null;
        this.time = 1000; // 1s
        this.remainTime = 0;
        this.jarId = null;  
    }
  
    onLoad() {
        super.onLoad();
    }
    
    onEnable() {
        super.onEnable();
    }
    
    activeBtnComponent() {
        this.button && (this.button.interactable = true);
    }
    
    init({id, remainTime, startTime, endTime, currentMoney} = {}) {
        this._updateRemainTime(remainTime);
        this.updateTotalMoney(currentMoney);
                
        this.jarId = id;
        this.node.active = true;
    }
    
    updateTotalMoney(totalMoney) {
        this.jarTotalMoneyLbl.string = Utils.formatNumberType2(totalMoney).toString().toUpperCase();
    }
    
    onDestroy() {
        super.onDestroy();
        this._clearInterval();
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
    
    _updateRemainTime(remainTime) {
        this.remainTime = remainTime;
        this.remainTimeLbl && (this.remainTimeLbl.string = moment(this.remainTime).format('hh:mm:ss'));
        
        this.timeout = setTimeout(() => {
            clearTimeout(this.timeout);
            this._updateRemainTime(this.remainTime - this.time);
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
        
        if(index > -1) {
            let currentMoney = data[app.keywords.MONEY_LIST][index],
                remainTime = data[app.keywords.REMAIN_TIME_LIST][index];
            this.updateTotalMoney(currentMoney);
            this._updateRemainTime(remainTime);
        };
    }
}

app.createComponent(JarComponent);