import app from 'app'
import Actor from 'Actor'
import ActionBlocker from 'ActionBlocker';

class HungSicBoChatPopup extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            item: cc.RichText,
            container: cc.Node,
            chatEditBox: cc.EditBox,
            chatScroll: cc.ScrollView
        });
        
        this._incrementId = 0
        this._nodeInstances = []
        
        this._state = HungSicBoChatPopup.STATE_HIDE
    }

    onLoad() {
        super.onLoad();
        this._incrementId = 0
        this._nodeInstances = []
        this._state = HungSicBoChatPopup.STATE_HIDE
    }
    
    start() {
        super.start()
        app.service.send({cmd: app.commands.MINIGAME_CHAT_HISTORY})
    }
    
    onEnable() {
        super.onEnable()
    }
    
    onDestroy() {
        super.onDestroy()
        this._incrementId = 0
        this._nodeInstances = []
    }
    
    _addGlobalListener() {
        super._addGlobalListener()
        app.system.addListener(app.commands.MINIGAME_CHAT_HISTORY, this._onChatHistory, this);
        app.system.addListener(app.commands.MINIGAME_CHAT, this._appendChild, this);
    }

    _removeGlobalListener() {
       super._removeGlobalListener()
       app.system.removeListener(app.commands.MINIGAME_CHAT_HISTORY, this._onChatHistory, this);
       app.system.removeListener(app.commands.MINIGAME_CHAT, this._appendChild, this);
    }
    
    _onChatHistory(data) {
        let { messages } = data
        
        this.container.removeAllChildren()
        
        if(!messages && messages.length < 1)
            return
        
        messages.forEach(message => {
            let {sender, msg} = message
            
            this._addItem(sender, msg)
        })
        this.chatScroll.scrollToBottom();
    }
    
    onSubmit() {
        ActionBlocker.runAction(ActionBlocker.USER_TAI_XIU_TREO_CHAT, () => {
            let text = this.chatEditBox.string.trim()
            
            if(!text || text === "")
                return
                
            app.service.send({cmd: app.commands.MINIGAME_CHAT, data: {
                id: (++this._incrementId).toString(),
                msg: text
            }})
            
            this._appendChild(text)
            this.chatScroll.scrollToBottom();
            this.chatEditBox.string = ""
        })
    }
    
    /**
     * @param {object || string} data 
     * @memberof HungSicBoChatPopap
     */
    _appendChild(data) {
        let name = null
        let text = null
        
        if(typeof data === 'string') {
            name = app.context.getMeDisplayName()
            text = data
        } else if(data instanceof Object && !(data instanceof Array)) {
            let {sender, msg, id} = data
            if(id == this._incrementId)
                return
                
            name = sender
            text = msg
        }
        
        name && text && this._addItem(name, text)
    }
    
    _addItem(username, text) {
        if(this._nodeInstances.length > HungSicBoChatPopup.MAX_INSTANCE) {
            let node = this._nodeInstances.shift()
            node.destroy()   
        }
        
        this.item.string = `<color=${HungSicBoChatPopup.USERNAME_COLOR}>${username}:</c> ${text}`
        let item = cc.instantiate(this.item.node)
        item.active = true
        
        this.container.addChild(item)
        this._nodeInstances.push(item)
    }
    
    onCloseBtnClick() {
        // this.node.destroy()
        this.hide()
    }
    
    toggle() {
        if(this.isRunning()) 
            return
        
        this._state === HungSicBoChatPopup.STATE_SHOWED ? this.hide() : this.show()
    }
    
    isRunning() {
        return this._state === HungSicBoChatPopup.STATE_RUNNING   
    }
    
    show() {
        this._state = HungSicBoChatPopup.STATE_RUNNING
        this.node.opacity = 255
        this.node.emit('chat.box.show')
        this.node.runAction(cc.sequence(
            cc.moveTo(.1, cc.v2(328, this.node.getPosition().y)),
            cc.callFunc(() => {
                this._state = HungSicBoChatPopup.STATE_SHOWED
            })
        ))   
    }
    
    hide() {
        this._state = HungSicBoChatPopup.STATE_RUNNING
        this.node.emit('chat.box.hide')
        this.node.runAction(cc.sequence(
            cc.moveTo(.1, cc.v2(857, this.node.getPosition().y)),
            cc.callFunc(() => {
                this._state = HungSicBoChatPopup.STATE_HIDE
                this.node.opacity = 0
            })
        ))        
    }
}

HungSicBoChatPopup.USERNAME_COLOR = cc.Color.ORANGE.toCSS("#rrggbb")
HungSicBoChatPopup.MAX_INSTANCE = 100

HungSicBoChatPopup.STATE_HIDE = 1
HungSicBoChatPopup.STATE_RUNNING = 2
HungSicBoChatPopup.STATE_SHOWED = 3

app.createComponent(HungSicBoChatPopup);