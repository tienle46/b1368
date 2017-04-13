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
        
        this.jarId = id;
        
        this.jarTotalMoneyLbl.string = Utils.formatNumberType2(currentMoney).toString().toUpperCase();
        this.node.active = true;
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
        app.system.addListener(app.commands.JAR_DETAIL, this._onJarDetail, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.JAR_DETAIL, this._onJarDetail, this);
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
}

app.createComponent(JarComponent);