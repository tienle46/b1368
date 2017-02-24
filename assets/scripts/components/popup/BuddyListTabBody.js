/**
 * Created by Thanh on 2/17/2017.
 */

import app from 'app';
import utils from 'utils';
import PopupTabBody from 'PopupTabBody';
import Events from 'Events';

class BuddyListTabBody extends PopupTabBody {

    constructor() {
        super();

        this.properties = {
            ...this.properties,

            leftBuddyListComponent: cc.Node,
            rightBuddyListComponent: cc.Node,
            filterEditBoxNode:  cc.EditBox,
            addBuddyEditBox:  cc.EditBox,
            buddyItemPrefab: cc.Prefab,
            preButton: cc.Button,
            nextButton: cc.Button,
            buddyMenuNode: cc.Node,
            itemPerList: {
                default: 3,
                type: cc.Integer
            },

        }

        this.filterEditBox = null;
        this.filteredBuddies = [];
        this.currentPage = 1;
        this.data = null;
        this.buddyMenu = null;
        this.currentBuddyItems = [];
    }

    addNewBuddy(){
        app.service.send({cmd: app.commands.REQUEST_BUDDY, data: {buddyName: this.addBuddyEditBox.string}});
    }

    loadData() {
        this.loadBuddyInfo();
        return false;
    }

    onDataChanged({balances = [], buddyNames = []} = {}) {
        if(buddyNames.length == 0) return;

        buddyNames.forEach((buddyName, index) => {
            let buddy = app.buddyManager.getBuddyByName(buddyName);
            buddy && (buddy.balance = balances[index]);

            let buddyItem = this._findCurrentBuddyItem(buddy);
            buddyItem && buddyItem.onBuddyChanged();
        });
    }

    onLoad() {
        super.onLoad();

        this.filterEditBox = this.filterEditBoxNode.getComponent(cc.EditBox);
        this.filterEditBox.editingDidEnded = this.onFilterChanged.bind(this);
        this.buddyMenu = this.buddyMenuNode.getComponent('BuddyMenu');
    }

    onEnable() {
        super.onEnable();

        this.setBuddyList([...app.buddyManager.buddies], true);
        this.setLoadingData();
    }

    onDisable(){
        super.onDisable();
        this.hideMenu();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_BUDDY_INFO, this._onBuddyDetailInfoResponse, this);
        app.system.addListener(Events.ON_BUDDY_CHANGE_PLAYING_GAME, this._onBuddyChangePlayingGame, this);
        app.system.addListener(Events.ON_BUDDY_LIST_UPDATE, this._onBuddyListUpdate, this);
        app.system.addListener(Events.ON_BUDDY_BLOCK_STATE_CHANGE, this._onBuddyBlockStateChange, this);
        app.system.addListener(Events.ON_BUDDY_ONLINE_STATE_CHANGED, this._onBuddyOnlineStateChange, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_BUDDY_INFO, this._onBuddyDetailInfoResponse, this);
        app.system.removeListener(Events.ON_BUDDY_CHANGE_PLAYING_GAME, this._onBuddyChangePlayingGame, this);
        app.system.removeListener(Events.ON_BUDDY_LIST_UPDATE, this._onBuddyListUpdate, this);
        app.system.removeListener(Events.ON_BUDDY_BLOCK_STATE_CHANGE, this._onBuddyBlockStateChange, this);
        app.system.removeListener(Events.ON_BUDDY_ONLINE_STATE_CHANGED, this._onBuddyOnlineStateChange, this);
    }

    _onBuddyOnlineStateChange(isOnline, isItMe, buddy){
        if(!isItMe){
            let buddyItem = this._findCurrentBuddyItem(buddy);
            buddyItem.onBuddyChanged();
        }else{

        }

    }

    _onBuddyBlockStateChange(buddy){
        let buddyItem = this._findCurrentBuddyItem(buddy);
        buddyItem.onBuddyChanged();
        // buddyItem && buddyItem.setBlocked(buddy.isBlocked());
    }

    _onBuddyListUpdate(){
        this.onFilterChanged();
    }

    _onBuddyChangePlayingGame(isItMe, buddy){

        if(!isItMe){
            let buddyItem = this._findCurrentBuddyItem(buddy);
            buddyItem && buddyItem.onBuddyChanged();
        }
    }

    _findCurrentBuddyItem(buddy){
        let findBuddyItem;

        if(buddy){
            this.currentBuddyItems.some(buddyItem => {
                if(buddyItem.buddy.name == buddy.name){
                    findBuddyItem = buddyItem;
                    return true;
                }
            });
        }

        return findBuddyItem;
    }

    loadBuddyInfo(buddyName) {
        let buddyNames = app.buddyManager.getAllBuddy().map(buddy => buddy.name);
        app.service.send({cmd: app.commands.GET_BUDDY_INFO, data: {buddyNames}});
    }

    _onBuddyDetailInfoResponse({balances = [], buddyNames= []} = {}) {
        this.setLoadedData({balances, buddyNames})
    }

    onClickTransferButton() {
        //TODO
        // this.tabGroup && this.tabGroup.changeTab(PersonalInfoDialogRub.TAB_TRANSFER_INDEX, {buddy: this.selectedBuddy});
    }

    onFilterChanged() {
        let filterStr = this.filterEditBoxNode.string;

        if (filterStr && filterStr.trim().length > 0) {
            this.currentPage = 1;
            let filteredBuddyList = app.buddyManager.filterBuddies(filterStr);
            this.setBuddyList(filteredBuddyList, true);
        }else{
            this.setBuddyList(app.buddyManager.buddies, true);
        }
    }

    setBuddyList(buddyList = [], renderImmediately = false) {
        this.filteredBuddies = buddyList;
        let buddyItemPerPage = this.itemPerList * 2;
        this.totalPage = parseInt(buddyList.length % buddyItemPerPage == 0 ? buddyList.length / buddyItemPerPage : buddyList.length / buddyItemPerPage + 1);
        if(this.currentPage > this.totalPage){
            this.currentPage = this.totalPage;
        }
        this._updatePagingButton();

        renderImmediately && this.renderBuddies(this.currentPage);
    }

    _updatePagingButton(){
        let nextPage = this.currentPage + 1;

        if (nextPage > 1) {
            utils.setInteractable(this.preButton, true);
        }

        if (nextPage >= this.totalPage) {
            utils.setInteractable(this.nextButton, false);
        }

        let prePage = this.currentPage - 1;

        if (prePage < this.totalPage) {
            utils.setInteractable(this.nextButton, true);
        }

        if (prePage <= 1) {
            utils.setInteractable(this.preButton, false);
        }

    }

    renderBuddies(page = 1) {

        this.hideMenu();
        if (this.totalPage > 0 && page > this.totalPage) return;

        this._clearAllBuddyItemComponent();
        this.currentPage = page < 1 ? 1 : page;
        let buddyItemPerPage = this.itemPerList * 2;

        if (this.filteredBuddies.length > 0) {
            let startIndex = (this.currentPage - 1) * buddyItemPerPage;
            let endIndex = Math.min(startIndex + buddyItemPerPage, this.filteredBuddies.length);

            startIndex < this.filteredBuddies.length && this.filteredBuddies
                .filter((buddy, index) => index >= startIndex && index < endIndex)
                .forEach((buddy, index) => {
                    let buddyItem = this._createBuddyItem(buddy);
                    if (index < this.itemPerList) {
                        this.leftBuddyListComponent.addChild(buddyItem.node)
                    } else {
                        this.rightBuddyListComponent.addChild(buddyItem.node)
                    }
                    this.currentBuddyItems.push(buddyItem);
                });
        }else{
            this.leftBuddyListComponent.removeAllChildren(true);
        }
    }

    onClickNextPage() {
        let nextPage = this.currentPage + 1;

        if (nextPage > 1) {
            utils.setInteractable(this.preButton, true);
        }

        if (nextPage >= this.totalPage) {
            utils.setInteractable(this.nextButton, false);
        }

        this.renderBuddies(nextPage);
        this.hideMenu();
    }

    onClickPreviousPage() {
        let prePage = this.currentPage - 1;

        if (prePage < this.totalPage) {
            utils.setInteractable(this.nextButton, true);
        }

        if (prePage <= 1) {
            utils.setInteractable(this.preButton, false);
        }

        this.renderBuddies(prePage);
    }

    _clearAllBuddyItemComponent() {
        this.currentBuddyItems.splice(0, this.currentBuddyItems.length);
        this.rightBuddyListComponent.children.forEach(component => component.destroy());
        this.leftBuddyListComponent.children.forEach(component => component.destroy());
        this.rightBuddyListComponent.removeAllChildren(true);
        this.leftBuddyListComponent.removeAllChildren(true);
    }

    hideMenu(){
        utils.setVisible(this.buddyMenu, false);
    }

    _createBuddyItem(buddy) {
        let itemNode = cc.instantiate(this.buddyItemPrefab);
        let buddyItem = itemNode.getComponent('BuddyItem');

        buddyItem.setBuddy(buddy);
        buddyItem.setPopup(this);
        buddyItem.setBuddyMenu(this.buddyMenu);
        buddyItem.setClickChatListener((buddy) => {
            if(buddy.isOnline()){
                this.popup && this.popup.changeToChatTab({buddy})
            }else{
                app.system.showToast(app.res.string("buddy_chat_with_online_buddy_only"));
            }
        });
        buddyItem.setClickTransferListener((buddy) => {console.log("clicked transfer")});

        return buddyItem;
    }

}

app.createComponent(BuddyListTabBody);