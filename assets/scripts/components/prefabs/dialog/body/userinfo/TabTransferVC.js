import app from 'app';
import Component from 'Component';
import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';
import ExchangeDialog from 'ExchangeDialog';
import numeral from 'numeral';

class TabTransferVC extends Component {
    constructor() {
        super()
        this.receiverLabel = {
            default: null,
            type: cc.Label
        }
        this.receiverInput = {
            default: null,
            type: cc.EditBox
        }
    }

    onLoad() {
        // wait til every requests is done
        this.node.active = true;

        // let event = new cc.Component.EventHandler();
        // event.target = this.node;
        // event.component = 'TabExchangeCard';
        // event.handler = 'scrollEvent';
        //
        // this.node.getComponent(cc.ScrollView).scrollEvents.push(event);
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

app.createComponent(TabTransferVC);