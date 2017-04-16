import app from 'app';
import CCUtils from 'CCUtils';

export default class JarManager {
    constructor() {
        this._jars = {};
        
        this._jarExplosiveComponent = null;
        this._currentJarComponent = null;
        
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
    
    getJarComponent(jar, componentName) {
        return jar ? jar.getComponent(componentName) : null;
    }
    
    getJars() {
        return this._jars;    
    }
    
    setJar(gc, data) {
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
            jar._jarInit = {id, remainTime, startTime, endTime, currentMoney};
            
            this.setJar(gc, jar);
        });
    }
    
    addJarToParent(parent, gc, hasButton) {
        let jar = this.getJar(gc);
        
        if(!jar || !parent || !CCUtils.isNode(parent) || !CCUtils.isNode(jar))
            return;
        let data = this.getInitData(jar);
        
        let cloner = cc.instantiate(jar); // clone this node to prevent node's component will be destroy while scene's changing. --> fix only in simulator
        
        let jarComponent = this.getJarComponent(cloner, 'JarComponent');
        
        this._currentJarComponent = jarComponent;
        
        if(jarComponent) {
            jarComponent._gameCode = gc;
            jarComponent.init(data);
        }
        
        cloner.active = true;
        
        if(hasButton) {
            if(jarComponent) {
                jarComponent.activeBtnComponent();
            }
        }
        
        CCUtils.clearAllChildren(parent);
        
        parent.addChild(cloner);
    }
    
    getInitData(jar) {
        return jar._jarInit;    
    }
    
    hasJar(gc) {
        return this._jars.hasOwnProperty(gc) && this._jars[gc] ? true : false;
    }
    
    jarExplosive({username, money, message} = {}) {
        let jarExplosive = cc.instantiate(app.res.prefab.jarExplosive);
        if(jarExplosive) {
            let jarExplosiveComponent = this.getJarComponent(jarExplosive, 'JarExplosive');
            jarExplosiveComponent.init({username, money, message});
            
            this._jarExplosiveComponent = jarExplosiveComponent;
            cc.director.getScene().addChild(jarExplosive);
        } 
    }
    
    closeJarExplosive() {
        if(this._jarExplosiveComponent) {
            this._jarExplosiveComponent.close();
            this._jarExplosiveComponent = null;
        }
    }
    
    runCoinFliesFromJarToUserAnim(destination) {
        if(this._currentJarComponent) {
            this._currentJarComponent.runCoinAnim(destination);
        }
    }
}