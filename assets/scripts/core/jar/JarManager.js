import app from 'app';
import CCUtils from 'CCUtils';
import VisibilityManager from 'VisibilityManager';
import Events from 'GameEvents';

export default class JarManager {
    constructor() {
        this._jars = {};
        
        this._jarExplosiveComponent = null;
        this._currentJarComponent = null;
        
        this._currentParent = null;
        
        this.start();
    }
    
    start() {
        this.addEventListener();
    }
    
    addEventListener() {
        this.removeEventListener();

        app.system.addListener(Events.ON_LIST_HU_RESPONSE, this.setupJar, this);
    }
    
    removeEventListener() {
        app.system.removeListener(Events.ON_LIST_HU_RESPONSE, this.setupJar, this);
    }
    
    updateJar(gc, newData) {
        this.setJar(gc, newData);
    }
    
    getJar(gc) {
        return this._jars[gc];
    }
    
    getComponentInJar(jar, componentName) {
        return jar ? jar.getComponent(componentName) : null;
    }
    
    getJars() {
        return this._jars;    
    }
    
    /**
     * 
     * @param {any} gc 
     * @param {cc.Node} data 
     * 
     * @memberof JarManager
     */
    setJar(gc, data) {
        this._jars[gc] = data;
    }
    
    setupJar(data) {
        this._jars = {};
        data[app.keywords.GAME_CODE_LIST].forEach((gc, i) => {
            let endTime = data[app.keywords.END_TIME_LIST][i],
                id = data[app.keywords.ID_LIST][i],
                currentMoney = data[app.keywords.MONEY_LIST][i],
                remainTime = data[app.keywords.REMAIN_TIME_LIST][i],
                startTime = data[app.keywords.START_TIME_LIST][i];
            
            let jar = cc.instantiate(app.res.prefab.jarPrefab);
            jar._jarData = {id, remainTime, startTime, endTime, currentMoney};
            
            this.setJar(gc, jar);
        });

        app.system.emit(Events.ON_LIST_HU_UPDATED, data)
    }
    
    addJarToParent(parent, gc, hasButton) {
        let jar = this.getJar(gc);
        
        if(!jar || !parent || !CCUtils.isNode(parent) || !CCUtils.isNode(jar) || this.isChildOf(gc, parent))
            return;
        
        let jarComponent = this.getComponentInJar(this.getJar(gc), 'JarComponent');
            
        this._currentJarComponent = jarComponent;
        
        if(jarComponent) {
            jarComponent._gameCode = gc;
            jarComponent.init(this.getJarData(jar));
        }
        
        jarComponent.node.active = true;
        
        if(hasButton) {
            if(jarComponent) {
                jarComponent.activeBtnComponent();
            }
        }
        
        CCUtils.clearAllChildren(parent);
        
        parent.addChild(jar);
    }
    
    getJarData(jar) {
        return jar._jarData || null;    
    }
    
    getJarDataFromGC(gc) {
        return this.getJarData(this.getJar(gc)) || null;   
    }
    
    hasJar(gc) {
        return this._jars.hasOwnProperty(gc) && this._jars[gc] ? true : false;
    }
    
    isValid(gc) {
        return cc.isValid(this.getJar(gc));
    }
    
    isChildOf(gc, parent) {
        let jar = this.getJar(gc);

        return this.isValid(gc) && jar.isChildOf(parent);
    }
    
    jarExplosive({username, money, message} = {}) {
        let jarExplosive = cc.instantiate(app.res.prefab.jarExplosive);
        if(jarExplosive) {
            let jarExplosiveComponent = this.getComponentInJar(jarExplosive, 'JarExplosive');
            jarExplosiveComponent && jarExplosiveComponent.init({username, money, message});
            
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
    
    _getJarComponent(gc) {
        let jar = this.getJar(gc);
        return this.getComponentInJar(jar, 'JarComponent');
    }
    
    requestUpdateJarList() {
        app.visibilityManager.isActive(VisibilityManager.SMASH_JAR) &&  app.service.send({
            cmd: app.commands.LIST_HU
        }); 
    }
}