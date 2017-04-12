import app from 'app';
import CCUtils from 'CCUtils';

export default class JarManager {
    constructor() {
        this._jars = {};
        
        this.addEventListener();
        
        this.start();
    }
    
    start() {
    }
    
    addEventListener() {
        this.removeEventListener();

        app.system.addListener(app.commands.LIST_HU, this.setupJar, this);
    }
    
    removeEventListener() {
        app.system.removeListener(app.commands.LIST_HU, this.setupJar, this);
    }
    
    updateJar(gc, newData) {
        this.setJar(newData);
    }
    
    getJar(gc) {
        return this._jars[gc];
    }
    
    getJars() {
        return this._jars;    
    }
    
    setJar(gc, data) {
        // console.debug('setjar')
        this._jars[gc] = data;
    }
    
    setupJar(data) {
        // console.debug('setupJar')
        data[app.keywords.GAME_CODE_LIST].forEach((gc, i) => {
            let endTime = data[app.keywords.END_TIME_LIST][i],
                id = data[app.keywords.ID_LIST][i],
                currentMoney = data[app.keywords.MONEY_LIST][i],
                remainTime = data[app.keywords.REMAIN_TIME_LIST][i],
                startTime = data[app.keywords.START_TIME_LIST][i];
            
            let jar = cc.instantiate(app.res.prefab.jarPrefab);
            jar._jarInit = {id, remainTime, startTime, endTime, currentMoney};
            this.setJar(gc, jar);
        });
    }
    
    addJarToParent(parent, gc, hasButton) {
        let jar = this.getJar(gc);
        
        if(!jar || !parent || !CCUtils.isNode(parent) || !CCUtils.isNode(jar))
            return;
        
        let jarComponent = jar.getComponent('JarComponent');
        if(jarComponent) {
            jarComponent.init(this.getInitData(jar));
        }
        
        jar.active = true;
        
        if(hasButton) {
            if(jarComponent) {
                jarComponent.activeBtnComponent();
            }
        }
        parent.addChild(jar);
    }
    
    getInitData(jar) {
        return jar._jarInit;    
    }
    
    hasJar(gc) {
        return this._jars.hasOwnProperty(gc) && this._jars[gc] ? true : false;
    }
}