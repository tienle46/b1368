import app from 'app';
import utils from 'utils';
import DialogActor from 'DialogActor';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';
import CCUtils from 'CCUtils';

export default class TabBuddiesList extends DialogActor {

    constructor() {
        super();

        this.itemPerList = {
            default: 5,
            type: cc.Integer
        }

        this.buddyInfoComponent = {
            default: null,
            type: cc.Node
        }

        this.leftBuddyListComponent = {
            default: null,
            type: cc.Node
        }

        this.rightBuddyListComponent = {
            default: null,
            type: cc.Node
        }


        this.buddyNameLabel = {
            default: null,
            type: cc.Label
        }

        this.balanceLabel = {
            default: null,
            type: cc.Label
        }

        this.playingGameLabel = {
            default: null,
            type: cc.Label
        }

        this.filterEditBoxNode = {
            default: null,
            type: cc.EditBox
        }

        this.buddyItemPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.preButton = {
            default: null,
            type: cc.Button
        }

        this.nextButton = {
            default: null,
            type: cc.Button
        }

        this.selectedBuddy = null;
        this.filterEditBox = null;
        this.filteredBuddies = [];
        this.loadingDetailInfo = false;
        this.currentPage = 1;
        this.data = null;
        this.toggleGroup = null;
    }

    onLoad() {
        super.onLoad();

        this.filterEditBox = this.filterEditBoxNode.getComponent(cc.EditBox);
        this.filterEditBox.editingDidEnded = this.onFilterChanged.bind(this);
        this.toggleGroup = this.node.getComponent(cc.ToggleGroup);
    }

    onEnable() {
        super.onEnable();

        this.setBuddyList([...app.buddyManager.buddies], true);

        if (app.buddyManager.buddies.length > 0) {
            this.selectBuddy(app.buddyManager.buddies[0]);
        }
    }

    _addGlobalListener() {
        app.system.addListener(app.commands.GET_BUDDY_DETAIL_INFO, this._onBuddyDetailInfoResponse, this);
    }

    _removeGlobalListener() {
        app.system.removeListener(app.commands.GET_BUDDY_DETAIL_INFO, this._onBuddyDetailInfoResponse, this);
    }

    _loadBuddyDetailInfo(buddyName) {
        this.loadingDetailInfo = true;
        app.service.send({cmd: app.commands.GET_BUDDY_DETAIL_INFO, data: {buddyName: buddyName}});
    }

    _onBuddyDetailInfoResponse(data) {
        this.loadingDetailInfo = false;

        if (this.selectedBuddy && this.selectedBuddy.name === data.buddyName) {
            this.balanceLabel.string = data.balance;
            this.playingGameLabel.string = app.res.string('game_playing_game', {gameName: app.res.gameName[data.gameCode] || ""});
        }
    }

    onClickTransferButton() {

        console.log('this.tabGroup: ', this.tabGroup);

        this.tabGroup && this.tabGroup.changeTab(PersonalInfoDialogRub.TAB_TRANSFER_INDEX, {buddy: this.selectedBuddy});
    }

    onClickBlockBuddyButton() {
        if(!this.selectedBuddy) return;

        if(!this.selectedBuddy.isBlocked()){
            app.system.confirm(app.res.string('confirm_block_buddy', {buddyName: this.selectedBuddy.name}), null, () => {
                app.buddyManager.blockBuddy(this.selectedBuddy);
            });
        }
    }

    onClickRemoveBuddyButton() {
        if(!this.selectedBuddy) return;

        app.system.confirm(app.res.string('confirm_remove_buddy', {buddyName: this.selectedBuddy.name}), null, () => {
            app.buddyManager.removeBuddy(this.selectedBuddy);
        });

    }

    onClickSendMessageButton() {
        this.tabGroup && this.tabGroup.changeTab(PersonalInfoDialogRub.TAB_CHAT_INDEX, {buddy: this.selectedBuddy});
    }

    onFilterChanged() {
        let filterStr = this.filterEditBoxNode.string;

        if (filterStr && filterStr.trim().length > 0) {
            this.currentPage = 1;
            let filteredBuddyList = app.buddyManager.filterBuddies(filterStr);
            this.setBuddyList(filteredBuddyList, true);
        }
    }

    selectBuddy(selectedBuddy) {

        this.selectedBuddy = selectedBuddy;
        this._clearCurrentSelectedBuddyInfo();

        if (selectedBuddy) {

            if (!this.buddyInfoComponent.active) {
                utils.active(this.buddyInfoComponent)
            }

            this.buddyNameLabel.string = selectedBuddy.name;
            this._loadBuddyDetailInfo(selectedBuddy.name);
        }
    }

    _clearCurrentSelectedBuddyInfo() {
        this.buddyNameLabel.string = app.res.string("loading_data");
        this.balanceLabel.string = "0";
        this.playingGameLabel.string = "";
    }

    setBuddyList(buddyList = [], renderImmediately = false){
        this.filteredBuddies = buddyList;

        let buddyItemPerPage = this.itemPerList * 2;
        this.totalPage = buddyList.length % buddyItemPerPage == 0 ? buddyList.length / buddyItemPerPage : buddyList.length / buddyItemPerPage + 1;

        renderImmediately && this.renderBuddies(this.currentPage);
    }

    renderBuddies(page = 1) {
        if(page < 1 || (this.totalPage > 0 && page > this.totalPage)) return;

        this._clearAllBuddyItemComponent();

        this.currentPage = page;
        let buddyItemPerPage = this.itemPerList * 2;

        if(this.filteredBuddies.length > 0){
            let startIndex = Math.min((this.currentPage - 1) * buddyItemPerPage, this.filteredBuddies.length - 1);
            let endIndex = Math.min(startIndex + buddyItemPerPage, this.filteredBuddies.length);

            this.filteredBuddies.filter((buddy, index) => index >= startIndex && index < endIndex)
                .forEach((buddy, index) => {
                    if(index < 5){
                        this.leftBuddyListComponent.addChild(this._createBuddyItem(buddy))
                    }else{
                        this.rightBuddyListComponent.addChild(this._createBuddyItem(buddy))
                    }
                });
        }
    }

    onClickNextPage(){
        let nextPage = this.currentPage + 1;

        if(nextPage > 1){
            !this.preButton.interactable && utils.setInteractable(this.preButton, true);
        }

        if(nextPage >= this.totalPage){
            utils.setInteractable(this.nextButton, false);
        }

        this.renderBuddies(nextPage);
    }

    onClickPreviousPage(){
        let prePage = this.currentPage - 1;

        if(prePage < this.totalPage){
            !this.nextButton.interactable && utils.setInteractable(this.nextButton, true);
        }

        if(prePage <= 1){
            utils.setInteractable(this.preButton, false);
        }

        this.renderBuddies(prePage);
    }

    _clearAllBuddyItemComponent() {
        CCUtils.clearAllChildren(rightBuddyListComponent);
        CCUtils.clearAllChildren(leftBuddyListComponent);
    }

    _createBuddyItem(buddy) {
        let itemNode = cc.instantiate(this.buddyItemPrefab);
        let buddyItem = itemNode.getComponent('BuddyItem');

        buddyItem.setBuddyList(buddy);
        buddyItem.setBuddy(buddy);
        buddyItem.setToggleGroup(this.toggleGroup);
        buddyItem.setSelected(this.selectedBuddy && buddy.name === this.selectedBuddy.name);
        buddyItem.setOnClickListener((item) => {
            item.setSelected(true);
            this.selectBuddy(item.buddy);
        });

        return itemNode;
    }
}

app.createComponent(TabBuddiesList);