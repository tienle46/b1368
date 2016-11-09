/**
 * Created by Thanh on 11/4/2016.
 */

import app from 'app';
import Phom from 'Phom';
import Component from 'Component';
import CardList from 'CardList';

export default class PhomList extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            phomPrefab: cc.Prefab,
            phomNodes: {
                default: [],
                type: [cc.Node]
            },
            cardScale: 0.7,
            space: 60,
            align: {
                default: CardList.ALIGN_CENTER,
                type: CardList.ALIGN
            }
        }

        this.owner = 0;
        this.phoms = [];
        this.cards = [];
    }

    onLoad(){
        super.onLoad();
        this.phoms = [];
        this.cards = [];
    }

    setAlign(align){
        this.align = align;

        this.phomNodes.forEach((node, i) => node.getComponent(Phom.name).setAlign(this.align));
        this.node.setAnchorPoint(CardList.convertAlignmentToAnchor(align));
    }

    setSpace(space){
        this.space = space;

        this.phomNodes.forEach((node, i) => node.getComponent(Phom.name).setSpace(this.space));
    }

    onEnable(){
        super.onEnable();

        this.phomNodes.forEach((node, i) => {
            let phom = node.getComponent(Phom.name);
            phom.setAlign(this.align);
            phom.setSpace(this.space);
            phom.setScale(this.cardScale);
        });
    }

    getPhomAt(index){
        return this.phoms[index];
    }

    push(phom){
        this.add(phom);
    }

    /**
     * this.phoms.length < 3 mean that only model created
     *
     * @param phom
     */
    add(phomModel){
        if(this.node){
            let phomNode = this.phomNodes[this.phoms.length];
            if(phomNode){
                let phom = phomNode.getComponent(Phom.name);
                phom.setCards(phomModel.cards);
               this.phoms.push(phom);
            }
        }else{
            this.phoms.push(phomModel);
        }

        this.cards = [...this.cards, ...phomModel.cards];
    }

    getCards(){
        return this.cards;
    }

    clear(){
        this.cards = [];
        this.phoms.forEach(phom => phom.clear());
        this.phoms = [];
    }

    get length() {
        return this.phoms ? this.phoms.length : 0;
    }

    toBytes(){
        return this.cards.map(card => {return card.byteValue});
    }

    cleanHighlight(){
        this.phoms.forEach(phom => phom.cleanCardHighlight());
    }

    setPhoms(phoms, srcCardList, srcOwnerPlayer){
        phoms.forEach((phom, i) => {

            let phomInList = this.phoms[i];
            phomInList && phomInList.transferFrom(srcCardList, phom.cards);
            phomInList.setOwner(phom.owner);
            this.board.downPhomList.add(phom);
        });
    }
}

app.createComponent(PhomList);