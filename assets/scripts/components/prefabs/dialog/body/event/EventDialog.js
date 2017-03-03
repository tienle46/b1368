import app from 'app';
import Actor from 'Actor';
import CCUtils from 'CCUtils';
import Linking from 'Linking';
import Utils from 'Utils'

class EventDialog extends Actor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            pageContent: cc.Node,
            btnGroupNode: cc.Node,
            policyBtn: cc.Button,
            attendBtn: cc.Button,
            backBtn: cc.Button,
            pageViewNode: cc.Node,
            eventPagePrefab: cc.Prefab,
            loadingNode: cc.Node
        };

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
        this.node.on('touch-start', () => null)
        this.node.on('touch-end', () => null)
        this.pageView = this.pageViewNode.getComponent(cc.PageView)
        this.progress = this.loadingNode.getComponent('Progress')
    }

    start(){
        super.start()
        this._getEventsFromServer()
    }

    onDestroy() {
        super.onDestroy();
        this.eventPages = null
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
        const actionCodes = data["actionCodes"]
        const imageUrls = data['imageUrls']
        const policyUrls = data['policyUrls']

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
                    policyUrl: policyUrls[index]
                });
                this.pageView.addPage(eventPageNode);
                this.eventPages.push(eventPage);
            }
        });

        this.progress && this.progress.hide();
    }

    onChangePage() {
        this._updateControls(false);

    }

    onClickAttendEvent(){
        let index = this.pageView.getCurrentPageIndex();
        let eventPage = this.eventPages[index];

        let actionCode = eventPage && eventPage.getComponentData().actionCode;
        if(eventPage) {
            this.hide();
            Linking.goTo(actionCode);
        }
    }

    onPolicyBtnClick() {
        let index = this.pageView.getCurrentPageIndex();
        let eventPage = this.eventPages[index];
        eventPage && eventPage.showPolicy();
        this._updateControls(true);
    }

    onBackBtnClick() {
        let index = this.pageView.getCurrentPageIndex();
        let eventPage = this.eventPages[index];
        eventPage && eventPage.showImage();
        this._updateControls(false);
    }

    _updateControls(policyShowing, eventPage) {
        if(!eventPage){
            let index = this.pageView.getCurrentPageIndex();
            eventPage = this.eventPages[index];
        }

        if (policyShowing) {
            CCUtils.setVisible(this.backBtn, true)
            CCUtils.setVisible(this.policyBtn, false)
            CCUtils.setVisible(this.attendBtn, false)
        } else {
            CCUtils.setVisible(this.backBtn, false)
            CCUtils.setVisible(this.policyBtn, true)

            let actionCode = eventPage && eventPage.getComponentData().actionCode;
            CCUtils.setVisible(this.attendBtn, !Utils.isEmpty(actionCode))
        }
    }

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
    }

    hide() {
        let parent = this.node.parent;

        CCUtils.clearFromParent(this.node);
        CCUtils.clearFromParent(parent);
    }
}

app.createComponent(EventDialog);