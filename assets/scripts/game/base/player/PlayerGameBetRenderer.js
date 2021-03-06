import app from 'app';
import PlayerRenderer from 'PlayerRenderer';
import GameUtils from "GameUtils";
import utils from 'PackageUtils';

export default class PlayerGameBetRenderer extends PlayerRenderer {
    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
    }
    
    onEnable(){
        super.onEnable();
    }
    
    getMessageAnchorIndex(anchorIndex) {
        return anchorIndex;
        // this.actor.isItMe() ? -1 : anchorIndex;
    }
    
    injectComponent(){
        // this.balanceLabel && (this.balanceLabel.toLocaleString = '');
        this.balanceLabel = this.scene.meBalanceLabel;
        this.actor && (this.balanceLabel.string = GameUtils.formatBalanceShort(this.actor.balance));
    }
    
    hidePlayerComponentOnBetting(){
        utils.deactive(this.playerNameLabel);
    }

    showPlayerComponentOnShake(){
        utils.active(this.playerNameLabel);
    }
}