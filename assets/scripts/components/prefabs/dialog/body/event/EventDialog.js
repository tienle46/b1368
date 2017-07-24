import app from 'app';
import Actor from 'Actor';
import CCUtils from 'CCUtils';
import Utils from 'Utils'

class EventDialog extends Actor {
    constructor() {
        super();
        this.properties = this.assignProperties({
            pageContent: cc.Node,
            pageView: cc.PageView,
            eventPagePrefab: cc.Prefab,
            pageIndicator: cc.PageViewIndicator,
            loadingNode: cc.Node,
            bgTransparent: cc.Node
        });

        this.groupType = app.const.DYNAMIC_GROUP_NEW_EVENT;
        /**
         * @type {cc.PageView}
         */
        this.pageView = null;
        this.eventPages = null;
        this.dialog = null;
        this.progress = null;
    }

    setDialog(dialog){
        this.dialog = dialog;
    }

    onLoad() {
        this.eventPages = [];
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true);
        
        this.progress = this.loadingNode.getComponent('Progress')
    }

    start(){
        super.start()
        this._getEventsFromServer()
    }

    onDestroy() {
        super.onDestroy();
        window.release(this.eventPages)
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.LIST_SYSTEM_MESSAGE, this._onLoadEventResponse, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.LIST_SYSTEM_MESSAGE, this._onLoadEventResponse, this);
    }

    _onLoadEventResponse(data) {
        const listHeader = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.TITLE_LIST]
        const listIds = data[app.keywords.SYSTEM_MESSAGE.RESPONSE.ID_ITEM_LIST]
        const {actionCodes, actionDatas, imageUrls, policyUrls} = data;

        
        this.eventPages = [];
        CCUtils.clearAllChildren(this.pageContent);

        listHeader && listHeader.forEach((title, index) => {
            let eventPageNode = cc.instantiate(this.eventPagePrefab);
            let eventPage = eventPageNode.getComponent('EventPage');

            if (eventPage) {
                eventPage.setComponentData({
                    name: title,
                    id: listIds[index],
                    imageUrl: imageUrls[index],
                    actionCode: actionCodes[index],
                    actionData: actionDatas[index],
                    policyUrl: policyUrls[index],
                    attendBtnListener: this._onClickAttendEvent.bind(this),
                    policyBtnListener: this._onPolicyBtnClick.bind(this),
                    backBtnListener: this._onBackBtnClick.bind(this)
                });
                this.pageView.addPage(eventPageNode);
                this.eventPages.push(eventPage);
            }
        });

        this.progress && this.progress.hide();
    }

    onChangePage() {
        // this._updateControls(false);
    }

    _onPolicyBtnClick(){
        CCUtils.setVisible(this.pageIndicator, false);
    }
    
    _onClickAttendEvent(){
        this.hide();
    }
    
    _onBackBtnClick() {
        CCUtils.setVisible(this.pageIndicator, true);
    }

    // _updateControls(policyShowing, eventPage) {
    //     if(!eventPage){
    //         let index = this.pageView.getCurrentPageIndex();
    //         eventPage = this.eventPages[index];
    //     }

    //     if (policyShowing) {
    //         CCUtils.setVisible(this.backBtn, true)
    //         CCUtils.setVisible(this.policyBtn, false)
    //         CCUtils.setVisible(this.attendBtn, false)
    //     } else {
    //         CCUtils.setVisible(this.backBtn, false)
    //         CCUtils.setVisible(this.policyBtn, true)

    //         let actionCode = eventPage && eventPage.getComponentData().actionCode;
    //         CCUtils.setVisible(this.attendBtn, !Utils.isEmpty(actionCode))
    //     }
    // }

    _getEventsFromServer() {
        this.progress && this.progress.hide();
        app.service.send({
            cmd: app.commands.LIST_SYSTEM_MESSAGE,
            data: {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: 0,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.PAGE_NUMBER]: 1
            }
        });
        console.warn('params',{
            cmd: app.commands.LIST_SYSTEM_MESSAGE,
            data: {
                [app.keywords.SYSTEM_MESSAGE.REQUEST.ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.GROUP_TYPE]: this.groupType,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.NODE_ID]: 0,
                [app.keywords.SYSTEM_MESSAGE.REQUEST.PAGE_NUMBER]: 1
            }
        } )
    }

    hide() {
        this.node.removeFromParent();
        CCUtils.destroy(this.node);
    }
}

app.createComponent(EventDialog);