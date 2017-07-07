import app from 'app';
import CCUtils from 'CCUtils';
import VisibilityManager from 'VisibilityManager';

export default class JarManager {
    constructor() {
        this._jars = {};
        
        this._jarExplosiveComponent = null;
        this._currentJarComponent = null;
        
        this._currentParent = null;
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
    }
    
    addJarToParent(parent, gc, hasButton) {
        let jar = this.getJar(gc);
        
        if(!jar || !parent || !CCUtils.isNode(parent) || !CCUtils.isNode(jar))
            return;
            
        let _jarData = this.getJarData(jar);
        
        let jarComponent = this.getComponentInJar(this.getJar(gc), 'JarComponent');
            
        this._currentJarComponent = jarComponent;
        
        if(jarComponent) {
            jarComponent._gameCode = gc;
            jarComponent.init(_jarData);
        }
        
        jarComponent.node.active = true;
        
        if(hasButton) {
            if(jarComponent) {
                jarComponent.activeBtnComponent();
            }
        }
        
        CCUtils.clearAllChildren(parent);
        
        parent.addChild(this.getJar(gc));
              
        // let _jarData = this.getJarData(jar);

        // let cloner = cc.instantiate(jar); // clone this node to prevent node's component will be destroy while scene's changing. --> fixed only in simulator
        
        // if(cloner) {
        //     cloner._jarData = _jarData;
            
        //     this.updateJar(gc, cloner);
            
        //     let jarComponent = this.getComponentInJar(this.getJar(gc), 'JarComponent');
            
        //     this._currentJarComponent = jarComponent;
            
        //     if(jarComponent) {
        //         jarComponent._gameCode = gc;
        //         jarComponent.init(_jarData);
        //     }
            
        //     this.getJar(gc).active = true;
            
        //     if(hasButton) {
        //         if(jarComponent) {
        //             jarComponent.activeBtnComponent();
        //         }
        //     }
            
        //     CCUtils.clearAllChildren(parent);
            
        //     parent.addChild(this.getJar(gc));
        // }
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