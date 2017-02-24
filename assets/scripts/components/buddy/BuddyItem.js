/**
 * Created by Thanh on 1/24/2017.
 */

import app from 'app';
import utils from 'utils';
import Component from 'Component';
import PopupTabBody from 'PopupTabBody';
import BuddyManager from 'BuddyManager';
import CCUtils from 'CCUtils';

class BuddyItem extends PopupTabBody {
    
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            nameLabel: cc.Label,
            balanceLabel: cc.Label,
            gameLabel: cc.Label,
            currencyNameLabel: cc.Label,
            playingGameLabel: cc.Label,
            playingGameNode: cc.Node,
            onlineNode: cc.Node,
            offlineNode: cc.Node,
            lockedNode: cc.Node,
            avatarNode: cc.Node,
        }

        this.online = false;
        this.selected = false;
        this.name = "";
        this.isLoaded = false;
        this.buddy = null,
        this.buddyMenu = null,
        this.onClickChatListener = null;
        this.onClickTransferListener = null;
        this.locked = false;
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        super.onEnable();
        this.isLoaded = true;
        this.playingGameLabel.string = app.res.string('game_playing_game');
        this.currencyNameLabel.string = app.res.string('currency_name');

        if(this.buddy){
            this.onBuddyChanged();
        }
    }

    onBuddyChanged(){
        if(this.buddy) {
            this.nameLabel.string = this.buddy.name;
            this.setBlocked(this.buddy.isBlocked())
            this.setOnlineState(this.buddy.isOnline());
            this.setBalance(this.buddy.balance);


            console.log('this.buddy: ', this.buddy, app.keywords.VARIABLE_PLAYING_GAME);

            let gameRoomName = utils.getVariable(this.buddy, app.keywords.VARIABLE_PLAYING_GAME);

            console.log('gamRoomGame: ', gameRoomName);
            this.setPlayingGame(gameRoomName);
        }
    }

    setBuddyMenu(buddyMenu){
        this.buddyMenu = buddyMenu;
    }

    setPopup(popup){
        this.popup = popup;
    }

    setOnlineState(online = false){
        this.online = online;
        if(!this.locked){
            utils.setVisible(this.onlineNode, online);
            utils.setVisible(this.offlineNode, !online);
        }
    }

    setBlocked(locked){
        this.locked = locked;
        utils.setVisible(this.lockedNode, locked);
        if(locked){
            utils.setVisible(this.onlineNode, false);
            utils.setVisible(this.offlineNode, false);
        }else{
            this.setOnlineState(this.online);
        }
    }

    setBuddy(buddy){
        this.buddy = buddy;
        if(this.isLoaded){
            this.onBuddyChanged();
        }
    }

    setPlayingGame(gameRoomName){
        let gameCode = gameRoomName && gameRoomName.length >= 3 ? gameRoomName.substr(0, 3) : undefined;
        let gameName = gameCode && app.res.gameName[gameCode];
        this.gameLabel.string = gameName || "";

        console.log('setPlayingGame: ', gameCode, gameName);

        if(gameName){
            this.playingGameNode.active = true;
        }else{
            this.playingGameNode.active = false;
        }
    }

    setBalance(balance = 0){
        this.balanceLabel.string = `${balance}`
    }

    onItemClicked(){
        this._hideMenu();
    }

    _hideMenu(){
        this.buddyMenu && this.buddyMenu.hide();
    }

    onClickChatButton(){
        this._hideMenu();
        this.onClickChatListener && this.onClickChatListener(this.buddy);
    }

    onClickTransferButton(){
        this._hideMenu();
        this.onClickTransferListener && this.onClickTransferListener(this.buddy);
    }

    onClickEditButton(){
        if(!this.popup) return;

        let position = this.popup.node.convertToNodeSpaceAR(CCUtils.getWorldPosition(this.avatarNode));
        this.buddyMenu && this.buddyMenu.show(position, this.buddy, this.buddy.name);

        // app.system.info(app.res.string('coming_soon'));
    }

    setClickChatListener(listener){
        this.onClickChatListener = listener;
    }

    setClickTransferListener(listener){
        this.onClickTransferListener = listener;
    }
}

app.createComponent(BuddyItem);