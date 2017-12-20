import app from 'app'
import Actor from 'Actor'
import MiniPokerPopup from 'MiniPokerPopup';

/**
 * This component MUST BE placed in lower level than Draggable Component (if any)
 * Otherwise, remove an EventListener in `onEnable` method and using cc.Button -> clickEvents instead
 * 
 * @class Threshold
 * @extends {Component}
 */
class TaiXiuTreo extends Actor {
    constructor() {
        super()
        
        this.properties = this.assignProperties({
            popup: cc.Prefab,
            remainTime: cc.Label,
        })

        this._lastTime = null
        this._time = {min: 0, sec: 0}
    }
    
    onLoad() {
        super.onLoad()
        this.draggable = this.node.getComponent('Draggable')
    }
    
    onEnable() {
        super.onEnable()
        // this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this)
        app.system.addAppStateListener(this)
    }
    
    updateTimer() {
        if(!this._time)
            return
            
        var timestr;
        var date = new Date();
    
        date.setHours(0);
        date.setMinutes(this._time.min);
        date.setSeconds(this._time.sec);
        
        // get the elapsed time 
        var elapsedTime = Date.now() - this._lastTime;
        
        // set the lastTime var to 'now' so we can calculate the
        // elapsed time between this event and the next event
        this._lastTime = Date.now();
        
        // instead of (date.getTime() - 1000) you need to 
        // put in the time that actually has elapsed.
        var newDate = new Date(date.getTime() - elapsedTime);
        var temp = newDate.toTimeString().split(" ");
        var tempsplit = temp[0].split(':');
        
        this._time.min = tempsplit[1];
        this._time.sec = tempsplit[2];
    
        timestr = this._time.min + this._time.sec;
        
        if (timestr === '0000') {
            
        }
    
        if (timestr != '0000') {
            this.remainTime.string = `${Number(this._time.sec)}`
            setTimeout(this.updateTimer.bind(this), 1000);
        }
            
    }
    
    onAppStateChange(state) {
        // if(state == 'active') {
        //     app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_REMAIN_TIME})
        // }
    }
    
    onDestroy() {
        super.onDestroy()
        if(app.taiXiuTreoManager) {
            app.taiXiuTreoManager.onDestroy()
        }
        app.system.removeAppStateListener(this)
    }
   
    _onClick() {
        if (app.taiXiuTreoManager.needRequestNew()) {
            app.service.send({
                cmd: app.commands.MINIGAME_TAI_XIU_GET_STATE
            })
        }
        else {
            app.taiXiuTreoManager.showPopup()
        }

        // if(this.draggable && this.draggable.isIdle()) {
        //     if(app.taiXiuTreoManager.needRequestNew())
        //         app.service.send({
        //             cmd: app.commands.MINIGAME_TAI_XIU_GET_STATE
        //         })
        //     else
        //         app.taiXiuTreoManager.showPopup()
        // }

    }
    
    createPopup(data) {
        let {state} = data
        
        if(state == 0)
            return
            
        let popup = cc.instantiate(this.popup)
        let popupComponent = popup.getComponent('TaiXiuTreoPopup')
        return popupComponent
    }
    
    runCountDown(remainTime) {
        this._lastTime = new Date()
        const initTime = this._secondsToMinutes(remainTime).split(":")
        this._time = {
            min: initTime[0],
            sec: initTime[1]
        }
        
        // set the last Time (start time) in this phase
        this._lastTime = new Date()
        setTimeout(this.updateTimer.bind(this), 1000)
        this.remainTime.string = `${Number(this._time.sec)}`
    }
    
    _secondsToMinutes(secs) {
        function pad(num) {
            return ("0"+num).slice(-2)
        }
        
        let minutes = Math.floor(secs / 60)
        secs = secs % 60
        minutes = minutes % 60
        
        return `${pad(minutes)}:${pad(secs)}`
    }
}

app.createComponent(TaiXiuTreo)