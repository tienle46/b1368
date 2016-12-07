import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import ToggleGroup from 'ToggleGroup';
import CheckBox from 'CheckBox';
import RubUtils from 'RubUtils';
import LoaderRub from 'LoaderRub';

class TabCard extends Component {
    constructor() {
        super();

        this.ratioItem = {
            default: null,
            type: cc.Prefab
        };

        this.ratioContainer = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        this.loader = new LoaderRub(this.node.parent);
        // wait til every requests is done
        this.node.active = false;
        // show loader
        this.loader.show();

        this._initCardsGroup();

        this._initRatioGroup();
    }

    _initRatioGroup() {
        let rateFaker = 0.8;
        let typesFaker = [10, 20, 50, 100, 200, 500];

        typesFaker.forEach(type => {
            let ratioItem = cc.instantiate(this.ratioItem);
            let ratioItemComponent = ratioItem.getComponent('RatioItem');
            ratioItemComponent.initItem(type, rateFaker);
            this.ratioContainer.addChild(ratioItem);
        });
    }

    _initCardsGroup() {
        let sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST
        };

        app.service.send(sendObject, (data) => {
            if (data) {
                let layoutComponent = cc.find('left/layout', this.node);
                this.toggleGroup = layoutComponent.getComponent(ToggleGroup);
                let cardListIds = data[app.keywords.EXCHANGE_LIST.RESPONSE.ITEM_ID_LIST];
                cardListIds = [...cardListIds, ...cardListIds];
                cardListIds.pop();
                cardListIds.forEach((id, index) => {
                    RubUtils.loadRes('dashboard/topup/cardItem').then((prefab) => {
                        let cardName = data['nl'][index] || `mega`;
                        let cardPrefab = cc.instantiate(prefab);

                        let spriteComponent = cardPrefab.children[0].getComponent(cc.Sprite);
                        RubUtils.loadSpriteFrame(spriteComponent, `dashboard/popup-card-${cardName.toLowerCase()}`);

                        let card = cardPrefab.getComponent(CheckBox);
                        card.setVal(id);
                        card.isChecked = index === 0;

                        // get left/layout
                        layoutComponent.addChild(cardPrefab);
                        // push card checkbox to toggleGroup
                        this.toggleGroup.addItem(card);
                        //reset state
                        index === 0 && this.toggleGroup.onLoad();
                    });
                });

                this.loader.hide();
                // active node
                this.node.active = true;

            }
        }, app.const.scene.DASHBOARD_SCENE);
    }

    onHanleChargeBtnClick() {
        let centerComponent = this.node.getChildByName('center');
        let cardSerial = centerComponent.getChildByName('cardSerialEditBox').getComponent(cc.EditBox).string.trim();
        let serialNumber = centerComponent.getChildByName('serialNumberEditBox').getComponent(cc.EditBox).string.trim();

        if (cardSerial === "" || serialNumber === "" || isNaN(cardSerial) || isNaN(serialNumber)) {
            AlertPopupRub.show(null, 'Vui lòng nhập đầy đủ thông tin');
        } else {
            let id = this.toggleGroup.getVal();

            let data = {};
            data[app.keywords.CHARGE_CARD_PROVIDER_ID] = id;
            data[app.keywords.CARD_CODE] = cardSerial;
            data[app.keywords.CARD_SERIAL] = serialNumber;
            let sendObject = {
                'cmd': app.commands.USER_SEND_CARD_CHARGE,
                data
            };
            console.log(sendObject);
            app.service.send(sendObject); // send request and get `smsg` (system_message) response from server
        }
    }
}

app.createComponent(TabCard);