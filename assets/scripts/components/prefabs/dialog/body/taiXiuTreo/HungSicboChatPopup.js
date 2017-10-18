import app from 'app'
import Actor from 'Actor'
import ActionBlocker from 'ActionBlocker';
import Events from 'GameEvents'

class HungSicBoChatPopup extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            item: cc.RichText,
            container: cc.Node,
            chatEditBox: cc.EditBox,
            chatScroll: cc.ScrollView,
            view: cc.Node
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
        
        this.viewHeight = this.view.getContentSize().height
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
        app.system.addListener(Events.TAI_XIU_TREO_SHOW_BET_GROUP_PANEL, this._onDisableSetOnTop, this)
        app.system.addListener(Events.TAI_XIU_TREO_HISTORY_CLICKED, this._onDisableSetOnTop, this)
        app.system.addListener(Events.TAI_XIU_TREO_SOI_CAU_CLICKED, this._onDisableSetOnTop, this)
        app.system.addListener(Events.TAI_XIU_TREO_RANK_BTN_CLICKED, this._onDisableSetOnTop, this)
        app.system.addListener(Events.TAI_XIU_TREO_ON_CLOSE_BTN_CLICKED, this._onDisableSetOnTop, this)
        
    }

    _removeGlobalListener() {
       super._removeGlobalListener()
       app.system.removeListener(app.commands.MINIGAME_CHAT_HISTORY, this._onChatHistory, this);
       app.system.removeListener(app.commands.MINIGAME_CHAT, this._appendChild, this);
       app.system.removeListener(Events.TAI_XIU_TREO_SHOW_BET_GROUP_PANEL, this._onDisableSetOnTop, this)
       app.system.removeListener(Events.TAI_XIU_TREO_HISTORY_CLICKED, this._onDisableSetOnTop, this)
       app.system.removeListener(Events.TAI_XIU_TREO_SOI_CAU_CLICKED, this._onDisableSetOnTop, this)
       app.system.removeListener(Events.TAI_XIU_TREO_RANK_BTN_CLICKED, this._onDisableSetOnTop, this)
       app.system.removeListener(Events.TAI_XIU_TREO_ON_CLOSE_BTN_CLICKED, this._onDisableSetOnTop, this)
    }
    
    _onChatHistory(data) {
        let { messages } = data
        
        this.container.removeAllChildren(false)
        
        if(!messages && messages.length < 1)
            return
        messages.forEach((message, index) => {
            let {sender, msg, ft} = message
            
            this._addItem(sender, msg, ft)
        })
        
        this.container.runAction(cc.sequence(cc.delayTime(.1), cc.callFunc(() => {
            if(this.container.getContentSize().height > this.viewHeight)
                this.chatScroll.scrollToBottom();
        })))
    }
    
    onSubmit() {
        ActionBlocker.runAction(ActionBlocker.USER_TAI_XIU_TREO_CHAT, () => {
            let text = this.chatEditBox.string.trim()
            
            if(!text || text === "")
                return
            
            this._incrementId = Date.now()
            app.service.send({cmd: app.commands.MINIGAME_CHAT, data: {
                id: this._incrementId.toString(),
                msg: text
            }})
            
            this._appendChild(text)
            this.chatScroll.scrollToBottom();
            this.chatEditBox.string = ""
        })
    }
    
    onEditingDidBegan () {
        app.env.isBrowser() && (this.chatEditBox.stayOnTop = true)
    }
    
    onEditingDidEnded () {
        app.env.isBrowser() && this.chatEditBox.setFocus()
    }
    
    _onDisableSetOnTop() {
        app.env.isBrowser() && (this.chatEditBox.stayOnTop = false)
    }
    
    /**
     * @param {object || string} data 
     * @memberof HungSicBoChatPopap
     */
    _appendChild(data) {
        let name = null
        let text = null
        let formatText = null
        
        if(typeof data === 'string') {
            name = app.context.getMyInfo().displayName
            text = data
        } else if(data instanceof Object && !(data instanceof Array)) {
            let {sender, msg, id, ft} = data
            if(id === this._incrementId.toString())
                return
                
            name = sender
            text = msg
            formatText = ft
        }
        
        name && text && this._addItem(name, text, formatText)
    }
    
    _addItem(username, text, formatText) {
        if(this._nodeInstances.length > HungSicBoChatPopup.MAX_INSTANCE) {
            let node = this._nodeInstances.shift()
            node.destroy()   
        }
        if(!username) {
            username = 'Bài 1368'
        }
        
        if(formatText) {
            username = formatText.replace(/({[a-zA-Z0-9-_]+})/g, username)
        } else {
            if(username.length > 12) {
                username = `${username.substr(0, 12)}...`
            }
            username = `<color=${HungSicBoChatPopup.USERNAME_COLOR}>${username}</c>`
        }
              
        this.item.string = `${username}: ${text}`
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
                
                this.chatEditBox.stayOnTop = false
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