/**
 * Created by Thanh on 1/25/2017.
 */
import app from 'app';
import utils from 'utils';
import DialogActor from 'DialogActor';
import PersonalInfoDialogRub from 'PersonalInfoDialogRub';

export default class TabBuddiesList extends DialogActor {

    constructor() {
        super();

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

        this.buddyInfoComponent = {
            default: null,
            type: cc.Node
        }

        this.receiverEditBoxNode = {
            default: null,
            type: cc.EditBox
        }

        this.transferAmountEditBoxNode = {
            default: null,
            type: cc.EditBox
        }

        this.transferReasonEditBoxNode = {
            default: null,
            type: cc.EditBox
        }
    }

    _onDataChanged(){
        if(this.data && this.data.buddy) {

            utils.active(this.data.buddyInfoComponent);

            this.buddyNameLabel.string = this.data.buddy.name;
            this.receiverEditBoxNode.string = this.data.buddy.name;
            this.balanceLabel.string = `${this.data.buddy.balance || 0}`;

            let gameCode = utils.getVariable(this.data.buddy, 'playingGame');
            let gameName = app.res.gameName[gameCode];
            this.playingGameLabel.string = app.res.string('game_playing_game', {gameName: gameName || ""});
        }else{
            utils.deactive(this.buddyInfoComponent);

            this.buddyNameLabel.string = "";
            this.balanceLabel.string = '0';
            this.playingGameLabel.string = app.res.string('game_playing_game', "");
            this.receiverEditBoxNode.string = "";
        }
    }

}

app.createComponent(TabBuddiesList);