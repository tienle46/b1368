import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';
import ListItem from 'ListItem';
import moment from 'moment';

class TabTransactionHistory extends Component {
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
        event.component = 'TabTransactionHistory';
        event.handler = 'scrollEvent';

        // this.node.getComponent(cc.ScrollView).scrollEvents.push(event);
        let data = {
            p: 1
        };
        let sendObj = {
            cmd: "b_ath",
            data
        };

        app.service.send(sendObj, (data) => {
            console.log(data);
            RubUtils.loadRes('dashboard/dialog/prefabs/userinfo/list_item').then((preFab) => {
                for (let i = 0; i < data.gold.length; i++) {
                    const transactionItem = cc.instantiate(preFab);
                    transactionItem.getComponent('ListItem').initWithStyle(ListItem.TYPE.STYLE1, true);
                    const widget = transactionItem.addComponent(cc.Widget);
                    widget.isAlignLeft = true;
                    widget.isAlignRight = true;

                    widget.left = 0;
                    widget.right = 0;

                    this.contentNode.addChild(transactionItem);
                }
            });
        });
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

app.createComponent(TabTransactionHistory);