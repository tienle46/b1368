import app from 'app';
import DialogActor from 'DialogActor';
import {
    isEmpty
} from 'Utils';
import RubUtils from 'RubUtils';

class TabCard extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            activeStateSprite: cc.Sprite,
            inActiveStateSprite: cc.Sprite,
            providerItemNode: cc.Node,
            providerContainerNode: cc.Node,
            providerTitleLbl: cc.Label,
            cardLayout: cc.Node,
            cardSerialEditBox: cc.EditBox,
            serialNumberEditBox: cc.EditBox
        };

        this.providerId = null;
    }

    onLoad() {
        super.onLoad();
        this.cardLayout.active = false;
        // wait til every requests is done
        // this._initRatioGroup();
    }

    start() {
        super.start();
        this._initCardsGroup();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
        // app.system.addListener(app.commands.GET_CHARGE_RATE_LIST, this._onUserGetRateList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
        // app.system.removeListener(app.commands.GET_CHARGE_RATE_LIST, this._onUserGetRateList, this);
    }

    _initCardsGroup() {
        let sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

        // show loader
        this.showLoader();
        app.service.send(sendObject);
    }

    _onUserGetChargeList(data) {
        let cardListIds = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST] || [];
        if (cardListIds.length > 0) {
            cardListIds.forEach((id, index) => {
                let providerName = data[app.keywords.TASK_NAME_LIST][index];
                let activeState = `${providerName.toLowerCase()}-active`;
                let inactiveState = `${providerName.toLowerCase()}-inactive`;
                
                RubUtils.getSpriteFramesFromAtlas('blueTheme/atlas/providers', [activeState, inactiveState], (sprites) => {
                    this.activeStateSprite.spriteFrame = sprites[activeState];
                    this.inActiveStateSprite.spriteFrame = sprites[inactiveState];

                    let provider = cc.instantiate(this.providerItemNode);
                    this.addNode(provider);
                    provider.active = true;

                    let toggle = provider.getComponent(cc.Toggle);
                    toggle.isChecked = index == 0;
                    toggle.providerName = providerName;
                    toggle.providerId = id;

                    this.providerContainerNode.addChild(provider);

                    if (toggle.isChecked) {
                        // toggle.check();
                        this.onProviderBtnClick(toggle);
                    }

                    if(index === cardListIds.length - 1) {
                        this.cardLayout.active = true;
                    }
                });
            });
            
            this.hideLoader();
        } else {
            this.pageIsEmpty(this.node);
        }
    }
    
    onProviderBtnClick(toggle) {
        this.providerTitleLbl.string = toggle.providerName;
        this.providerId = toggle.providerId;
    }
    
    onHanleChargeBtnClick() {
        let cardSerial = this.cardSerialEditBox.string.trim();
        let serialNumber = this.serialNumberEditBox.string.trim();

        if (isEmpty(cardSerial) || isEmpty(serialNumber) || isNaN(cardSerial) || isNaN(serialNumber)) {
            app.system.error(
                app.res.string('error_user_enter_empty_input')
            );
        } else {
            let data = {};
            data[app.keywords.CHARGE_CARD_PROVIDER_ID] = this.providerId;
            data[app.keywords.CARD_CODE] = cardSerial;
            data[app.keywords.CARD_SERIAL] = serialNumber;
            let sendObject = {
                'cmd': app.commands.USER_SEND_CARD_CHARGE,
                data
            };

            app.service.send(sendObject); // send request and get `smsg` (system_message) response from server
        }
    }
}

app.createComponent(TabCard);