/**
 * Created by Thanh on 11/19/2016.
 */

import app from 'app';
import CardList from 'CardList';
import Phom from 'Phom';
import PhomList from 'PhomList';
import Component from 'Component';
import PhomUtils from 'PhomUtils';

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

        this.phomList = null;
        this.phoms = null;
    }

    onLoad() {
        super.onLoad();
        this.phoms = [];
        this.down = [];
        this.phomList = new PhomList();
    }

    clear() {
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

    _findFirstEmptyPhomComponentIndex() {
        if (this.phoms[0].cards.length == 0) {
            return 0;
        }

        if (this.phoms[1].cards.length == 0) {
            return 1;
        }

        if (this.phoms[2].cards.length == 0) {
            return 2;
        }

        return 3;
    }

    addPhomList(newPhomList, player) {
        let firstEmptyPhomComponentIndex = this._findFirstEmptyPhomComponentIndex();

        if (!player) {
            this._setPhomListWithoutPlayer(newPhomList, firstEmptyPhomComponentIndex);
        } else {
            newPhomList.forEach((newPhom, i) => {

                if (i < PhomList.MAX_PHOM_COUNT) {

                    let phom = this.phoms[i + firstEmptyPhomComponentIndex];
                    if (phom) {
                        if (player.isItMe()) {
                            player.renderer.cardList.transferTo(phom, newPhom.cards, () => this._sortCardList(phom));
                        } else {
                            phom.transferFrom(player.renderer.cardList, newPhom.cards);
                        }

                        newPhom.renderComponent = phom;
                    }
                }
            });
        }

        return newPhomList;
    }

    _sortCardList(cardList){
        if(cardList){
            PhomUtils.sortAsc(cardList.cards);
            cardList.onCardsChanged();
        }
    }

    _setPhomListWithoutPlayer(phomList, firstEmptyPhomComponentIndex) {
        phomList && phomList.forEach((phomModel, index) => {
            let phom = this.phoms[index + firstEmptyPhomComponentIndex];
            if (phom) {
                phom && phom.setCards(phomModel.cards);
            }
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
            }
        })
    }
}

app.createComponent(PhomListComponent);