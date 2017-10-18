/**
 * Created by Thanh on 1/25/2017.
 */
import app from 'app';
import PopupTabBody from 'PopupTabBody';
import {isNumber, active, deactive, numberFormat} from 'GeneralUtils';
import CCUtils from 'CCUtils';
import ActionBlocker from 'ActionBlocker';
import SFS2X from 'SFS2X';
import utils from 'PackageUtils';

export default class TabBuddiesTransfer extends PopupTabBody {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            content: cc.Node,
            row: cc.Node,
            balanceLbl: cc.Label,
            agentName: cc.Label,
            displayName: cc.Label,
            username: cc.EditBox,
            amountLbl: cc.EditBox,
            transferReason: cc.EditBox,
            maXacNhan: cc.EditBox,
            phoneNumber: cc.Label,
            captcha: cc.Label ,
            verifySpriteFrames:{
                type: cc.SpriteFrame,
                default: []
            },
            verifySprite: cc.Sprite
        });
        
        this.balance = 0 
        this.feeTransfer = 0 
        this.minTransfer = 0 
        this.maxTransfer = 0 
        this.listAgent = []
        this.receiverBuddyName = null;
    }
    
    start() {
        super.start();
        this._getCaptcha();
        this._sendRequest();
    }
    
    _getCaptcha(){
        this.captcha.string = Math.random().toString(36).slice(2, 6)
    }
    
    _verifySprite(type){
        this.verifySprite.spriteFrame = type != null ? this.verifySpriteFrames[type] : null
    }
    
    _clearInputs(){
        this.displayName.string = ''
        this.username.string = ''
        this.amountLbl.string = ''
        this.transferReason.string = ''
        this.maXacNhan.string = ''
        this._verifySprite(null)
    }
    
    _checkAgent(){
        return this.listAgent.filter(agent => agent.username == this.username.string)[0]
    }
    
    setReceiverBuddyName(username, displayName){
        this.username.string = username
        this.displayName.string = displayName || ''
        let agent = this._checkAgent()
        if(agent){
            this.displayName.string = agent.agentName
            this._verifySprite(0)
        }else{
            this._verifySprite(1)
        }
    }
    
    onClickAgentButton(e){
        let target = e.currentTarget
        let {agentName, username} = target._d
        this.displayName.string =  agentName
        this.username.string =  username
        
        this._verifySprite(0)
    }
    
    onEdittingDidEnd(){
        let agent =  this._checkAgent()
        if(agent){
            this.displayName.string = agent.agentName
            this._verifySprite(0)
        }else{
            const username = this.username.string.trim()
            if(username)
                app.service.send({
                    cmd: app.commands.GET_DISPLAY_NAME,
                    data:{
                        [app.keywords.USER_NAME]: username
                    }
                })
            else
                this._clearInputs()
        }
    }
    
    onChangeAmount(){
        this.amountLbl.string = numberFormat(this.amountLbl.string)
    }
    
    onCancelButton(){
       this._clearInputs()
       this.cb && this.cb()
    }
    
    setOnClickBackButtonListener(cb) {
        this.cb = cb
    }
    
    onClickTransferButton() {
        let [balance, feeTransfer, minTransfer, maxTransfer] = [this.balance , this.feeTransfer, this.minTransfer, this.maxTransfer]
        let [receiver, money, reason, maXacNhan] =  [this.username.string, Number(this.amountLbl.string.replace(/,/g, "")), this.transferReason.string, this.maXacNhan.string]
        if (!receiver) {
            app.system.showToast(app.res.string('error_user_enter_empty_input'));
            return;
        }
        if (!isNumber(money)) {
            // console.warn(money)
            app.system.showToast(app.res.string('error_transfer_input_is_invalid', {type: 'chuyển'}));
            return;
        }
        
        if (money < minTransfer) {
            app.system.showToast(app.res.string('error_transfer_input_is_too_small', {type: "chuyển", min: minTransfer}));
            return;
        }
    
        if (balance < (minTransfer * (1 + feeTransfer/100))) {
            app.system.showToast(app.res.string('error_transfer_input_is_not_enough', {amount: data.minTransfer * (1 + data.feeTransfer/100)}));
            return;
        }
        
        if (money > maxTransfer) {
            app.system.showToast(app.res.string('error_transfer_input_is_over_max', {
                type: 'chuyển',
                max: maxTransfer
            }));
            return;
        }
        
        if (maXacNhan != this.captcha.string) {
            app.system.showToast(app.res.string('error_transfer_captcha_is_not_match'));
            return;
        }
        
        this._getCaptcha()
        app.service.send({
            cmd: app.commands.USER_TRANSFER_TO_USER,
            data: {
                [app.keywords.USERNAME]: receiver,
                [app.keywords.GOLD]: money,
                [app.keywords.TRANSFER_REASON]: reason
            }
        })
    }
    
    _onUserTransferResponse(data) {
        let su = data[app.keywords.RESPONSE_RESULT];
        if (su) {
            let username = this.username.string;
            let amount = this.amountLbl.string;
            app.system.showToast(app.res.string('transfer_successfully', {amount, username}));
            this._clearInputs()
        } else {
            let msg = data[app.keywords.RESPONSE_MESSAGE];
            app.system.showToast(msg || app.res.string('error_unknow'));
        }
    }
    
    _onUserVariablesUpdate(data) {
        // console.warn(data)
        let changedVars = data[app.keywords.BASE_EVENT_CHANGED_VARS] || [];
        changedVars.map(v => {
            if (v == app.keywords.USER_VARIABLE_BALANCE) {
                this.balanceLbl.string = `${utils.numberFormat(app.context.getMeBalance() || 0)}`;
            }
        })
    }
    
    _onGetEdittingDidEnd(data) {
        // console.warn(data)
        let {username, displayName, isAgent} = data
        if(displayName) {
            this.displayName.string = displayName
            this._verifySprite(1)
        }else{
            this._verifySprite(null)
            this.displayName.string = ''
        }
    }
    
    _addGlobalListener(){
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_TRANSFER_CONFIG, this._onGetTransferInfo, this);
        app.system.addListener(app.commands.USER_TRANSFER_TO_USER, this._onUserTransferResponse, this);
        app.system.addListener(app.commands.AGENCY_LIST, this._onGetListAgency, this);
        app.system.addListener(app.commands.GET_DISPLAY_NAME, this._onGetEdittingDidEnd, this);
        app.system.addListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_TRANSFER_CONFIG, this._onGetTransferInfo, this);
        app.system.removeListener(app.commands.USER_TRANSFER_TO_USER, this._onUserTransferResponse, this);
        app.system.removeListener(app.commands.AGENCY_LIST, this._onGetListAgency, this);
        app.system.removeListener(app.commands.GET_DISPLAY_NAME, this._onGetEdittingDidEnd, this);
        app.system.addListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariablesUpdate, this);
    }
    
    _onGetTransferInfo(data){
        // console.warn(data)
        let {feeTransfer, minTransfer, maxTransfer} = data
        let balance = app.context.getMeBalance()
        this.balance = balance
        this.feeTransfer = feeTransfer
        this.minTransfer = minTransfer
        maxTransfer = maxTransfer
        this.maxTransfer = balance < maxTransfer ? balance * (1 - feeTransfer/100) : maxTransfer
        this.balanceLbl.string = numberFormat(app.context.getMeBalance())
    }
    
    getAgencyList() {
        app.service.send({
            cmd : app.commands.AGENCY_LIST,
            data:{
                [app.keywords.AGENCY_VERSION]: app.config.version
            }
        })
    }
    
    _sendRequest() {
        // this.showLoading()
        app.service.send({cmd: app.commands.USER_TRANSFER_CONFIG});
        this.getAgencyList()
    }
        
    _onGetListAgency(data){
        let {agents} = data
        this.listAgent = agents
        this.content.removeAllChildren()
        
        agents.map((a, i) => {
            this.phoneNumber.string = numberFormat(a.callNumber)
            this.agentName.string = a.agentName
            let row = cc.instantiate(this.row)
            row.active = true
            row._d = {agentName: a.agentName, username: a.username}
            row.color = (i%2 === 0) ? new cc.Color(3, 26, 67) : new cc.Color(1, 9, 28)
            this.content.addChild(row)
        })
    }
}
app.createComponent(TabBuddiesTransfer);