import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';
import numeral from 'numeral';

class TabSMS extends Component {
    constructor() {
        super()
        this.contentNode = {
            default: null,
            type: cc.Node
        }
    }

    onLoad() {
        this.node.active = true;
        // get content node
        let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'TabSMS';
        event.handler = 'scrollEvent';

        // this.node.getComponent(cc.ScrollView).scrollEvents.push(event);

        let data = {
            ap: ['com.bamienstudio.baibamien.4000g', 'com.bamienstudio.baibamien.8000g'],
            bp: {
                dl: ['4000 Gold (1AU -> 4000Xu)', 'Test (0AU -> 1Xu)'],
                il: ['com.milabs.4000', 'android.test.purchased']
            },
            c: {

            },
            il: [],
            nl: [],
            s: {
                b: [30000,
                    50000,
                    120000,
                    200000,
                    350000,
                    750000,
                    120000,
                    200000,
                    350000,
                    120000,
                    200000,
                    350000
                ],
                s: [8698,
                    8798,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029
                ],
                c: ["DR 1 bitcoin",
                    "DR 1 bitcoin",
                    "MW 20000 VLA NAP 1/bitcoin",
                    "MW 30000 VLA NAP 1/bitcoin",
                    "MW 50000 VLA NAP 1/bitcoin",
                    "MW 100000 VLA NAP 1/bitcoin",
                    "MW VLA NAP20 1/bitcoin",
                    "MW VLA NAP30 1/bitcoin",
                    "MW VLA NAP50 1/bitcoin",
                    "MW VLA NAP20 1/bitcoin",
                    "MW VLA NAP30 1/bitcoin",
                    "MW VLA NAP50 1/bitcoin"
                ],
                m: ["10000 VN\U0110",
                    "15000 VN\U0110",
                    "Viettel  20K",
                    "Viettel  30K",
                    "Viettel  50K",
                    "Viettel  100K",
                    "Mobi  20K",
                    "Mobi  30K",
                    "Mobi  50K",
                    "Vina  20K",
                    "Vina  30K",
                    "Vina  50K"
                ]
            }
        }

        // this._initSMSList(data);
        this._requestPaymentList();
    }

    _requestPaymentList() {
        var sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

        app.service.send(sendObject, (data) => {
            this._initSMSList(data);

        }, app.const.scene.DASHBOARD_SCENE);
    }

    _initSMSList(data) {
        let smsList = [];
        // app.keywords.CHARGE_SMS_OBJECT
        if (data.hasOwnProperty(app.keywords.CHARGE_SMS_OBJECT)) {
            const obj = data[app.keywords.CHARGE_SMS_OBJECT];

            if (obj.hasOwnProperty(app.keywords.CHARGE_SMS_MONEY_GOT) && obj.hasOwnProperty(app.keywords.CHARGE_SMS_MONEY_LOST) &&
                obj.hasOwnProperty(app.keywords.CHARGE_SMS_SHORT_CODE) &&
                obj.hasOwnProperty(app.keywords.CHARGE_SMS_COMMAND)
            ) {

                let moneyGotList = obj[app.keywords.CHARGE_SMS_MONEY_GOT];
                let moneySpendList = obj[app.keywords.CHARGE_SMS_MONEY_LOST];
                let sendToList = obj[app.keywords.CHARGE_SMS_MONEY_LOST];
                let commandList = obj[app.keywords.CHARGE_SMS_COMMAND];

                for (let i = 0; i < moneyGotList.length; i++) {
                    let smsModel = {};
                    smsModel['xCoinGot'] = moneyGotList[i];
                    smsModel['moneyLost'] = moneySpendList[i];
                    smsModel['sendTo'] = sendToList[i];
                    smsModel['command'] = commandList[i];

                    smsList.push(smsModel);
                    console.debug('sms', smsModel);
                }
            }
        }

        //TODO: what the hell is ac
        if (data.hasOwnProperty('ac')) {
            let smsObj = data['ac'];

        }

        //render models to screen
        RubUtils.loadRes('dashboard/dialog/prefabs/topup/smsItem').then((preFab) => {

            smsList.forEach((smsModel) => {
                const transactionItem = cc.instantiate(preFab);
                const widget = transactionItem.addComponent(cc.Widget);
                widget.isAlignLeft = true;
                widget.isAlignRight = true;

                widget.left = 0;
                widget.right = 0;

                transactionItem.getChildByName('bg').getChildByName('titleLabel').getComponent(cc.Label).string = smsModel['moneyLost'];
                transactionItem.getChildByName('bg').getChildByName('valueLabel').getComponent(cc.Label).string = numeral(smsModel['xCoinGot']).format('0,0');

                this.contentNode.addChild(transactionItem);
            })

        })
    }

    _hide() {
        this.node.active = false;
    }

    scrollEvent(sender, event) {
        switch (event) {
            case 0:
                console.log('Scroll to Top');
                break;
            case 1:
                console.log('Scroll to Bottom');
                break;
            case 2:
                console.log('Scroll to left');
                break;
            case 3:
                console.log('Scroll to right');
                break;
            case 4:
                console.log('Scrolling');
                break;
            case 5:
                console.log('Bounce Top');
                break;
            case 6:
                console.log('Bounce bottom');
                break;
            case 7:
                console.log('Bounce left');
                break;
            case 8:
                console.log('Bounce right');
                break;
            case 9:
                console.log('Auto scroll ended');
                break;
        }
    }
}

app.createComponent(TabSMS);