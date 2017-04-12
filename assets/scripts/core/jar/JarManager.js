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
        if(this._jars[gc])
            CCUtils.clearFromParent(this._jars[gc]);
        this._jars[gc] = data;
    }
    
    setupJar(data) {
        data[app.keywords.GAME_CODE_LIST].forEach((gc, i) => {
            let endTime = data[app.keywords.END_TIME_LIST][i],
                id = data[app.keywords.ID_LIST][i],
                currentMoney = data[app.keywords.MONEY_LIST][i],
                remainTime = data[app.keywords.REMAIN_TIME_LIST][i],
                startTime = data[app.keywords.START_TIME_LIST][i];
            
            let jar = cc.instantiate(app.res.prefab.jarPrefab);
            this.setJar(gc, jar);
            
            if(jar) {
                let jarComponent = jar.getComponent('JarComponent');
                if(jarComponent) {
                    jarComponent.init({id, remainTime, startTime, endTime, currentMoney});
                }
                jar.active = true;
            }
        });
    }
    
    addJarToParent(parent, gc, hasButton) {
        let jar = this.getJar(gc);
        
        if(!jar || !parent || !CCUtils.isNode(parent) || !CCUtils.isNode(jar))
            return;
        
        if(hasButton) {
            let jarComponent = jar.getComponent('JarComponent');
            if(jarComponent) {
                jarComponent.activeBtnComponent();
            }
        }
        parent.addChild(jar);
    }
    
    hasJar(gc) {
        return this._jars.hasOwnProperty(gc) && this._jars[gc] ? true : false;
    }
}