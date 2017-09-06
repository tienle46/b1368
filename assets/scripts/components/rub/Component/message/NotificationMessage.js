/**
 * A kind of Highlight Message in ingame only
 * 
 * @export
 * @class Notification
 */
import app from 'app'
import Events from 'GameEvents'

export default class NotificationMessage {
    constructor() {
        this.messages = [
        ]
        
        // current showed message
        this._currentNode = null
        
        this._remainTime = 0
        this._startTime = null // started time when node showed
        
        this.addEventListeners()
    }
    
    addEventListeners() {
        this.removeEventListeners()
        
        app.system.addListener(Events.ON_NEW_NOTIFICATION, this._onNewNotification, this)
    }
    
    removeEventListeners() {
        app.system.removeListener(Events.ON_NEW_NOTIFICATION, this._onNewNotification, this)
    }
    
    _onNewNotification(text, duration = 10) {
        this.pushMessage({text, duration})
    }
    /**
     * 
     * @param {string} message 
     * @memberof Notification
     */
    pushMessage(message) {
        this.messages.push(message)
        
        return this
    }

    getMessages() {
        return this.messages
    }
    
    getFirstMessage() {
        if(this.isEmptyStack())
            return
        
        // return this.messages.shift()

        return this.messages[0]
    }
    
    getLastMessage() {
        if(this.isEmptyStack())
            return
        
        // return this.messages.pop()
        return this.messages[this.messages.length - 1]
    }
    
    isEmptyStack() {
        return this.messages.length === 0
    }
    
    calling() {
        if(this._currentNode || this.isEmptyStack()) {
            if(this._currentNode) {
                // console.warn('this._currentNode', this._currentNode)
                if(!this._currentNode.isChildOf(app.system.getCurrentSceneNode())) {
                    let current = new Date()
                    let diff =  10 - Math.round((current.getTime() - this._startTime.getTime()) / 1000)
                    if(diff < this._remainTime && diff >= 0) {
                        this._currentNode = null
                        this._remainTime = diff
                        
                        // this.showMessage(diff, true)
                    }
                }
            }
            return
        }

        this.showMessage()
    }
    
    setStartTime() {
        if(!this._startTime)
            return
        
        this._startTime = new Date()
    }
    
    showMessage(timePhase = null) {
        let message = this.getFirstMessage()
        if(!message)
            return
        
        let node = cc.instantiate(app.res.prefab.notification)
        node.opacity = 0
        node.setPosition(0, 425)
        
        let label = node.getComponentInChildren(cc.Label)
        if(label) {
            label.string = message.text
        }
        
        timePhase = this._remainTime > 0 ? this._remainTime : (message.duration || 10)
        
        node.runAction(cc.sequence(
            cc.callFunc(() => {
                this._onMessageShowing(node, timePhase)
                // add to base scene
                app.system.getCurrentSceneNode().addChild(node)
            }),
            cc.moveTo(.1, cc.v2(0, 313)),
            cc.callFunc(() => {
                this._onMessageShowed(node, timePhase)
            }),
            cc.delayTime(timePhase),
            cc.callFunc(() => {
                this._onMessageClosing(node, timePhase)
            }),
            cc.fadeTo(.2, 0), cc.callFunc(() => {
                this._onMessageClosed(node, timePhase)
            })
        ))
    }
    
    _onMessageShowing(node, timePhase) {
        node.opacity = 255
        this._currentNode = node
        
        this._remainTime = timePhase || 10
    }
    
    _onMessageShowed(node) {
        this._currentNode = node
        this._startTime = new Date()
    }
    
    _onMessageClosing(node) {
        // this._currentNode = null
    }
    
    _onMessageClosed(node) {
        this._remainTime = 0
        this._currentNode = null
        
        node.removeFromParent()
        
        // remove first
        this.messages.splice(0, 1)
    }   
}