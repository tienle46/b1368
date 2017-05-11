import app from 'app';
import Component from 'Component';

class TabTransferVC extends Component {
    constructor() {
        super();
        this.receiverLabel = {
            default: null,
            type: cc.Label
        };
        this.receiverInput = {
            default: null,
            type: cc.EditBox
        };
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
                log('Scroll to Top');
                break;
            case 1:
                log('Scroll to Bottom');
                break;
            case 2:
                log('Scroll to left');
                break;
            case 3:
                log('Scroll to right');
                break;
            case 4:
                log('Scrolling');
                break;
            case 5:
                log('Bounce Top');
                break;
            case 6:
                log('Bounce bottom');
                break;
            case 7:
                log('Bounce left');
                break;
            case 8:
                log('Bounce right');
                break;
            case 9:
                log('Auto scroll ended');
                break;
        }
    }
}

app.createComponent(TabTransferVC);