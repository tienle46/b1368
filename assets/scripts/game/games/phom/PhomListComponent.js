/**
 * Created by Thanh on 11/19/2016.
 */

import app from 'app';
import CardList from 'CardList';
import Phom from 'Phom';
import PhomList from 'PhomList';
import Component from 'Component';

export default class PhomListComponent extends Component {
    constructor() {
        super();

        this.align = {
            default: CardList.ALIGN_CENTER,
            type: CardList.ALIGN
        }

        this.properties = {
            ...this.properties,
            phomPrefab: cc.Prefab,
            phomNodes: {
                default: [],
                type: [cc.Node]
            },
            cardScale: 0.7,
            space: 60,
        }

        this.phomList = new PhomList();
        this.phoms = [];
    }

    onLoad() {
        super.onLoad();
        this.phoms = [];
        this.phomList.clear();
    }

    clear() {
        this.node && this.node.children && this.node.children.length > 0 && this.node.removeAllChildren(true);
        this.phomList.clear();
    }

    onEnable() {
        super.onEnable();

        this.phomNodes.forEach((phomNode, i) => {
            let phom = phomNode.getComponent('Phom');
            phom.setAlign(this.align);
            phom.setSpace(this.space);
            phom.setScale(this.cardScale);
            this.phoms[i] = phom;
        });

        this.phomList.push(...this.phoms);
    }

    setPhomList(newPhomList, player) {

        if(!player){
            this._setPhomListWithoutPlayer(newPhomList);
        }else{
            newPhomList.forEach((newPhom, i) => {
                if (i < PhomList.MAX_PHOM_COUNT) {

                    let phom = this.phoms[i];
                    if (player.isItMe()) {
                        player.renderer.cardList.transferTo(phom, newPhom.cards);
                    } else {
                        phom.transferFrom(player.renderer.cardList, newPhom.cards);
                    }

                    newPhom.renderComponent = phom;
                }
            });
        }

        return newPhomList;
    }

    _setPhomListWithoutPlayer(phomList){
        phomList && phomList.forEach((phomModel, index) => {
            let phom = this.phoms[index];
            phom && phom.setCards(phomModel.cards);
        })
    }

    setAlign(align) {
        this.align = align;

        this.phoms.forEach(phom => phom.setAlign(this.align));
        this.node.setAnchorPoint(CardList.convertAlignmentToAnchor(align));
    }

    setSpace(space) {
        this.space = space;
        this.phoms.forEach(phom => phom.setSpace(this.space));
    }

    cleanHighlight() {
        this.phoms.forEach(phom => phom.cleanHighlight());
    }

    setHighlight(highlightPhom, highlight) {
        this.phoms.forEach(phom => phom.equals(highlightPhom) && phom.setHighlightAll(highlight));
    }

    addPhom(phomModel) {
        this.phoms.forEach(phom => {
            if (phom.cards.length == 0) {
                phom.setCards(phomModel.cards);
                this.cards.push(...phom.cards);
            }
        })
    }
}

app.createComponent(PhomListComponent);