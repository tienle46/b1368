/**
 * Created by Thanh on 3/27/2017.
 */
import app from 'app'
import Component from 'Component'
import Card from 'Card'
import Phom from 'Phom'
import PhomList from 'PhomList'
import SFS2X from 'SFS2X';

class TestScene extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            playerAnchorNode: cc.Node,
            playerNode: cc.Node,
            myCardListNode: cc.Node,
        });
    }

    onLoad(){
        super.onLoad()

        this.player1Node = cc.instantiate(this.playerNode);
        this.player2Node = cc.instantiate(this.playerNode);
        this.player3Node = cc.instantiate(this.playerNode);
        this.player4Node = cc.instantiate(this.playerNode);
        this.player5Node = cc.instantiate(this.playerNode);

        this.player1Node.setPosition(0, 0)
        this.player2Node.setPosition(0, 0)
        this.player3Node.setPosition(0, 0)
        this.player4Node.setPosition(0, 0)
        this.player5Node.setPosition(0, 0)

        this.playerAnchorNode.getChildByName('myAnchorPoint').addChild(this.player1Node)
        this.playerAnchorNode.getChildByName('anchorPoint2').getChildByName('inviteButton').addChild(this.player2Node)
        this.playerAnchorNode.getChildByName('anchorPoint3').getChildByName('inviteButton').addChild(this.player3Node)
        this.playerAnchorNode.getChildByName('anchorPoint4').getChildByName('inviteButton').addChild(this.player4Node)
        this.playerAnchorNode.getChildByName('anchorPoint5').getChildByName('inviteButton').addChild(this.player5Node)

        this.player1 = this.player1Node.getComponent('PlayerSam')
        this.player2 = this.player2Node.getComponent('PlayerSam')
        this.player3 = this.player3Node.getComponent('PlayerSam')
        this.player4 = this.player4Node.getComponent('PlayerSam')
        this.player5 = this.player4Node.getComponent('PlayerSam')
    }

    onEnable(){
        super.onEnable()

        this.setCardForPlayer2(this.player2Node, 2)
        this.setCardForPlayer2(this.player5Node, 5)
        this.setCardForPlayer3(this.player3Node, 3)
        this.setCardForPlayer3(this.player4Node, 4)

    }

    start(){
        this.setCardForMe()
    }

    setCardForPlayer2(playerNode, index){
        let downCardLists = playerNode
            .getChildByName('downCardAnchor')
            .getChildByName('downCardAnchor' + index)
            .getComponentsInChildren('CardList');

        downCardLists.forEach(cardList => cardList.addCards([
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
        ]))
    }


    setCardForPlayer3(playerNode, index){
        let downCardLists = playerNode
            .getChildByName('downCardAnchor')
            .getChildByName('downCardAnchor' + index)
            .getComponentsInChildren('CardList');

        downCardLists[0].addCards([
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
            Card.from(Card.RANK_ACE, Card.SUIT_CO),
            Card.from(Card.RANK_ACE, Card.SUIT_TEP),
        ])
    }


    setCardForMe(){

        let meCardList = this.player1Node
            .getChildByName('myCardAnchor')
            .getChildByName('CardListPrefab')
            .getComponent('CardList');

        meCardList.addCards([
            Card.from(Card.RANK_AT, Card.SUIT_BICH),
            Card.from(Card.RANK_HAI, Card.SUIT_BICH),
            Card.from(Card.RANK_BA, Card.SUIT_BICH),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
        ])
    }
}

app.createComponent(TestScene)