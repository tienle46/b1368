import app from 'app';
import Actor from 'Actor';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class SlotTopItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            LblRank: cc.Label,
            lblUsername: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,
            lblDetail: cc.Label,
            sprRank: cc.Node,
            spriteFrame1st : cc.SpriteFrame,
            spriteFrame2nd: cc.SpriteFrame,
            spriteFrame3rd: cc.SpriteFrame

        });

    }

    loadData(data) {
        let rank = data.rank
        if (rank < 4) {

            switch (rank) {
                case 1:
                    this.sprRank.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1st
                    break
                case 2:
                    this.sprRank.getComponent(cc.Sprite).spriteFrame = this.spriteFrame2nd
                    break
                case 3:
                    this.sprRank.getComponent(cc.Sprite).spriteFrame = this.spriteFrame3rd
                    break
            }

        } else {
            this.LblRank.string = data.rank
        }

        this.lblUsername.string = data.username
        this.lblBet.string = GameUtils.formatNumberType1(data.bet)
        this.lblWin.string = GameUtils.formatNumberType1(data.win)
        this.lblDetail.string = data.detail
    }

}


app.createComponent(SlotTopItem);