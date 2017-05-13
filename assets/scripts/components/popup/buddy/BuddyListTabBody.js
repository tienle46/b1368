/**
 * Created by Thanh on 2/17/2017.
 */

import app from 'app';
import utils from 'utils';
import PopupTabBody from 'PopupTabBody';
import Events from 'Events';
import CCUtils from 'CCUtils';

class BuddyListTabBody extends PopupTabBody {

    constructor() {
        super();

        this.properties = {
            ...this.properties,

            leftBuddyListComponent: cc.Node,
            rightBuddyListComponent: cc.Node,
            filterEditBoxNode: cc.EditBox,
            addBuddyEditBox: cc.EditBox,
            buddyItemPrefab: cc.Prefab,
            preButton: cc.Button,
            nextButton: cc.Button,
            buddyMenuNode: cc.Node,
            transferMoneyNode: cc.Node,
            filterOnlineToggle: cc.Toggle,
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
        /**
         * @type {TabBuddyTransfer}
         */
        this.transferMoneyComponent = null;
    }

    addNewBuddy() {
        app.service.send({ cmd: app.commands.REQUEST_BUDDY, data: { buddyName: this.addBuddyEditBox.string } });
    }

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        
        this.loadBuddyInfo();
        return false;
    }

    onDataChanged({ balances = [], buddyNames = [] } = {}) {
        if (buddyNames.length === 0) return;
        
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
        this.transferMoneyComponent = this.transferMoneyNode.getComponent('TabBuddyTransfer');
        this.transferMoneyComponent.setOnClickBackButtonListener(() => this._hideTransferMoneyComponent());
        this.filteredBuddies = [];
        this.data = null;
        this.currentBuddyItems = [];
    }

    onEnable() {
        super.onEnable();

        this.setBuddyList([...app.buddyManager.buddies], true);
        this.setLoadingData();
        this._hideTransferMoneyComponent();
    }

    onDisable() {
        super.onDisable();
        this.hideMenu();
    }

    onDestroy() {
        super.onDestroy();
        this.free(this.data);
        window.release(this.currentBuddyItems, this.filteredBuddies);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_BUDDY_INFO, this._onBuddyDetailInfoResponse, this);
        app.system.addListener(Events.ON_BUDDY_CHANGE_PLAYING_GAME, this._onBuddyChangePlayingGame, this);
        app.system.addListener(Events.ON_BUDDY_LIST_UPDATE, this._onBuddyListUpdate, this);
        app.system.addListener(Events.ON_BUDDY_BLOCK_STATE_CHANGE, this._onBuddyBlockStateChange, this);
        app.system.addListener(Events.ON_BUDDY_ONLINE_STATE_CHANGED, this._onBuddyOnlineStateChange, this);
        app.system.addListener(Events.ON_BUDDY_MESSAGE, this._onBuddyMessage, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_BUDDY_INFO, this._onBuddyDetailInfoResponse, this);
        app.system.removeListener(Events.ON_BUDDY_CHANGE_PLAYING_GAME, this._onBuddyChangePlayingGame, this);
        app.system.removeListener(Events.ON_BUDDY_LIST_UPDATE, this._onBuddyListUpdate, this);
        app.system.removeListener(Events.ON_BUDDY_BLOCK_STATE_CHANGE, this._onBuddyBlockStateChange, this);
        app.system.removeListener(Events.ON_BUDDY_ONLINE_STATE_CHANGED, this._onBuddyOnlineStateChange, this);
        app.system.removeListener(Events.ON_BUDDY_MESSAGE, this._onBuddyMessage, this);
    }
    
    _onBuddyMessage(senderName, toBuddyName, message, isItMe) {
        if(isItMe) return;
        
        let buddyItem = this._findCurrentBuddyItem(app.buddyManager.getBuddyByName(senderName));
        buddyItem && buddyItem.onShowNotify(senderName);
    }
    
    _onBuddyOnlineStateChange(isOnline, isItMe, buddy) {
        if (!isItMe) {
            let buddyItem = this._findCurrentBuddyItem(buddy);
            buddyItem && buddyItem.onBuddyChanged();
        } else {

        }

    }

    _onBuddyBlockStateChange(buddy) {
        let buddyItem = this._findCurrentBuddyItem(buddy);
        buddyItem && buddyItem.onBuddyChanged();
        // buddyItem && buddyItem.setBlocked(buddy.isBlocked());
    }

    _onBuddyListUpdate() {
        this.onFilterChanged();
    }

    _onBuddyChangePlayingGame(isItMe, buddy) {

        if (!isItMe) {
            let buddyItem = this._findCurrentBuddyItem(buddy);
            buddyItem && buddyItem.onBuddyChanged();
        }
    }

    _findCurrentBuddyItem(buddy) {
        let findBuddyItem;

        if (buddy) {
            this.currentBuddyItems.some(buddyItem => {
                if (buddyItem.buddy.name == buddy.name) {
                    findBuddyItem = buddyItem;
                    return true;
                }
            });
        }

        return findBuddyItem;
    }

    loadBuddyInfo(buddyName) {
        let buddyNames = app.buddyManager.getAllBuddy().map(buddy => buddy.name);
        app.service.send({ cmd: app.commands.GET_BUDDY_INFO, data: { buddyNames } });
    }

    _onBuddyDetailInfoResponse({ balances = [], buddyNames = [] } = {}) {
        this.setLoadedData({ balances, buddyNames })
    }

    onFilterChanged() {
        let filterStr = this.filterEditBoxNode.string;

        if (filterStr && filterStr.trim().length > 0) {
            this.currentPage = 1;
            let filteredBuddyList = app.buddyManager.filterBuddies(filterStr);
            this.setBuddyList(filteredBuddyList, true);
        } else {
            this.setBuddyList(app.buddyManager.buddies, true);
        }
    }

    setBuddyList(buddies = [], renderImmediately = false) {
        if (this.filterOnlineToggle.isChecked) {
            this.filteredBuddies = buddies.filter(buddy => buddy.isOnline());
        } else {
            this.filteredBuddies = buddies;
        }

        let buddyItemPerPage = this.itemPerList * 2;
        this.totalPage = parseInt(this.filteredBuddies.length % buddyItemPerPage == 0 ?
            this.filteredBuddies.length / buddyItemPerPage : this.filteredBuddies.length / buddyItemPerPage + 1);

        if (this.currentPage > this.totalPage) {
            this.currentPage = this.totalPage;
        }

        this._updatePagingButton();

        renderImmediately && this.renderBuddies(this.currentPage);
    }

    _updatePagingButton() {
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
        } else {
            CCUtils.clearAllChildren(this.leftBuddyListComponent);
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

        CCUtils.clearAllChildren(this.rightBuddyListComponent);
        CCUtils.clearAllChildren(this.leftBuddyListComponent);
    }

    hideMenu() {
        utils.setVisible(this.buddyMenu, false);
    }

    _createBuddyItem(buddy) {
        let itemNode = cc.instantiate(this.buddyItemPrefab);
        let buddyItem = itemNode.getComponent('BuddyItem');

        buddyItem.setBuddy(buddy);
        buddyItem.setPopup(this);
        buddyItem.setBuddyMenu(this.buddyMenu);
        buddyItem.setClickChatListener((buddy) => {
            this.popup && this.popup.changeToChatTab({ buddy })
                // if(buddy.isOnline()){
                //     this.popup && this.popup.changeToChatTab({buddy})
                // }else{
                //     app.system.showToast(app.res.string("buddy_chat_with_online_buddy_only"));
                // }
        });
        buddyItem.setClickTransferListener((buddy) => {
            if (this.transferMoneyComponent) {
                this.transferMoneyComponent.setReceiverBuddyName(buddy.name)
                utils.setVisible(this.transferMoneyNode, true);
                utils.setVisible(this.bodyNode, false);
            }
        });
        
        buddyItem.onShowNotify(buddy.name);
        
        return buddyItem;
    }

    _hideTransferMoneyComponent() {
        if (this.transferMoneyComponent) {
            utils.setVisible(this.transferMoneyNode, false);
            utils.setVisible(this.bodyNode, true);
        }
    }

}

app.createComponent(BuddyListTabBody);