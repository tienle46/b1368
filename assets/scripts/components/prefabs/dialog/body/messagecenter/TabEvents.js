import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';
import  ListItem from 'ListItem';
import MessageEvent from 'MessageEvent'
import ConfirmPopupRub from 'ConfirmPopupRub';
import ExchangeDialog from 'ExchangeDialog';
import numeral from 'numeral';

export default class TabEvents extends Component {
    constructor() {
        super()
        this.contentNode = {
            default : null,
            type: cc.Node
        }
        this.currentPage = 0;
        this.groupType = app.const.DYNAMIC_GROUP_NEW_EVENT;
    }

    onLoad() {
        this.node.active = true;
        // get content node
        let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'TabEvents';
        event.handler = 'scrollEvent';

        // this.node.getComponent(cc.ScrollView).scrollEvents.push(event);

        this._requestEventList();
    }
    _requestEventList(){
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey':'dcn',
            'data': {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE] : app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: 0,
            }
        };

        app.service.send(sendObject, (data) => {
            log(data);
            if(data){
                //convert raw data to list models
                this.currentPage = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.CURRENT_PAGE];

                const listHeader = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TITLE_LIST];
                const listSub = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TIME_LIST];
                const listIds = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.ID_ITEM_LIST];

                const events = [];
                for(let i = 0 ; i < listHeader.length; i++){
                    const event = new MessageEvent({title:listHeader[i], sub: listSub[i], nodeId : listIds[i]});
                    events.push(event);
                }

                this._displayEvents(events);
            }

        }, app.const.scene.BOTTOM_BAR);
    }

    _requestEventDetail(nodeId){
        var sendObject = {
            'cmd': app.commands.LIST_SYSTEM_MESSAGE,
            'cbKey':'dcn',
            'data': {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE] : app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: nodeId,
            }
        };

        app.service.send(sendObject, (data) => {
            log(data);
            if(data){

            }

        }, app.const.scene.BOTTOM_BAR);
    }
    _displayEvents(events){
        RubUtils.loadRes('dashboard/dialog/prefabs/userinfo/list_item').then((preFab)=>{
            events.forEach((event)=>{
                const transactionItem = cc.instantiate(preFab);
                transactionItem.getComponent('ListItem').initWithStyle(ListItem.TYPE.STYLE1, true);
                transactionItem.getComponent('ListItem').fillData({title : event.title, sub : event.sub});

                const widget = transactionItem.addComponent(cc.Widget);
                widget.isAlignLeft = true;
                widget.isAlignRight = true;

                widget.left = 0;
                widget.right = 0;

                this.contentNode.addChild(transactionItem);
            });
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

app.createComponent(TabEvents);