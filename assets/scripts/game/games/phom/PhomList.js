/**
 * Created by Thanh on 11/4/2016.
 */

import app from 'app';
import Phom from 'Phom';
import Component from 'Component';
import CardList from 'CardList';

export default class PhomList extends Array {
    constructor(phoms) {
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
        this.cards = [];
        this._init(phoms);
    }

    onLoad() {
        this.cards = [];
    }

    _init(phoms){
        
        console.log("_init: ", phoms)
        
        if(phoms){
            this.push(...phoms);
        }else{
            this.cards = [];
        }
    }

    clone() {
        let cloned = new PhomList();
        cloned.push(...this);
        return cloned;
    }

    setPhomList(phomList, player) {

        this.clear();

        if (player.isItMe()) {
            phomList.forEach((phom, i) => {
                if (i < PhomList.MAX_PHOM_COUNT) {
                    let phomComponent = this.phomNodes[i].getComponent(Phom.name);
                    player.renderer.cardList.transfer(phom.cards, phomComponent);
                }
            });
        } else {
            phomList.forEach((phom, i) => {
                if (i < PhomList.MAX_PHOM_COUNT) {
                    let phomComponent = this.phomNodes[i].getComponent(Phom.name);
                    phomComponent.transferFrom(player.renderer.cardList, phom.cards);
                }
            });
        }

        return this;
    }

    getPhomLengths() {
        return this.map(phom => phom.cards.length);
    }

    join(phomList) {
        phomList && this.push(...phomList);
    }

    setAlign(align) {
        this.align = align;

        this.phomNodes.forEach((node, i) => node.getComponent(Phom.name).setAlign(this.align));
        this.node.setAnchorPoint(CardList.convertAlignmentToAnchor(align));
    }

    setSpace(space) {
        this.space = space;

        this.phomNodes.forEach((node, i) => node.getComponent(Phom.name).setSpace(this.space));
    }

    onEnable() {

        this.phomNodes.forEach((node, i) => {
            let phom = node.getComponent(Phom.name);
            phom.setAlign(this.align);
            phom.setSpace(this.space);
            phom.setScale(this.cardScale);
        });
    }

    getPhomAt(index) {
        return this[index];
    }

    push(...phoms) {
        if (this.node) {
            phoms.forEach((phomModel, i) => {
                let phomNode = this.phomNodes[this.length || 0];
                if (phomNode) {
                    let phom = phomNode.getComponent(Phom.name);
                    phom.setCards(phomModel.cards);
                    this.cards.push(...phom.cards);
                    super.push(phom);
                }
            })
        } else {
            phoms.forEach(phom => this.cards.push(...phom.cards));
            super.push(...phoms);
        }
    }

    /**
     * this.length < 3 mean that only model created
     *
     * @param phom
     */
    add(phomModel) {
        this.push(phomModel);
    }

    getCards() {
        return this.cards;
    }

    clear() {
        this.cards.splice(0, this.cards.length);
        this.phomNodes && this.phomNodes.forEach(phomNode => phomNode.getComponent(Phom.name).clear());
        this.splice(0, this.length)
    }

    toBytes() {
        return this.cards.map(card => {
            return card.byteValue
        });
    }

    cleanHighlight() {
        this.forEach(phom => phom.cleanHighlight());
    }

    // /**
    //  *
    //  *
    //  * @param phoms
    //  * @param srcCardList
    //  * @param srcOwnerPlayer
    //  */
    // setPhoms(phoms, srcCardList, srcOwnerPlayer) {
    //     phoms.forEach((phom, i) => {
    //         let phomInList = this[i];
    //         phomInList && phomInList.transferFrom(srcCardList, phom.cards);
    //         phomInList.setOwner(phom.owner);
    //         this.board.allPhomList.add(phom);
    //     });
    // }

    equals(phomList) {
        if (this.length != phomList.length) return false;

        let isInside = false;
        this.forEach(phom => {
            phomList.some(phom => {
                if (phom.equals(phomList[j])) {
                    isInside = true;
                    return true;
                }
            });

            if (!isInside) {
                return true;
            }
        });

        return isInside;
    }

    static sortSolution(solutions) {
        solutions.sort((phomList1, phomList2) => {
            phomList2.value() - phomList1.value();
        });
    }

    static removeLongPhom(phomLists) {
        // for (int i = solutions.size() - 1; i >= 0; i--) {
        //     PhomList phomList = solutions.get(i);
        //
        //     for (int j = 0; j < phomList.size(); j++) {
        //         if (phomList.getPhomAt(j).isLongPhom()) {
        //             solutions.remove(i);
        //             break;
        //         }
        //     }
        // }
    }

    static removeInvalidPhomWithEatenCards(phomLists, eatenCards) {
        // for (int i = solutions.size() - 1; i >= 0; i--) {
        //     PhomList phomList = solutions.get(i);
        //     CardVector phomCards = phomList.getCards();
        //
        //     for (int j = 0; j < eatenCards.size(); j++) {
        //         if (phomCards.indexOfCard(eatenCards.getCardAt(j)) == -1) {
        //             solutions.remove(i);
        //             break;
        //         }
        //     }
        // }
    }

    value(){
        return this.reduce((retV, phom) => retV + phom.value(), this.length * 1000);
    }

    remove(phom) {
        let index = this.indexOf(phom);
        index >= 0 && this.splice(index, 1);
    }
}

PhomList.MAX_PHOM_COUNT = 3;

app.createComponent(PhomList);