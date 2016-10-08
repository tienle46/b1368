/**
 * Created by Thanh on 10/6/2016.
 */
'use strict';

var TLMNUtils = require('../assets/scripts/game/games/tlmndl/TLMNUtils')
var Card = require('../assets/scripts/game/base/card/Card')

let checkSelectedCards = [
    Card.from(Card.RANK_BA, Card.SUIT_BICH), Card.from(Card.RANK_BA, Card.SUIT_TEP),
    Card.from(Card.RANK_BON, Card.SUIT_BICH), Card.from(Card.RANK_BON, Card.SUIT_TEP),
    Card.from(Card.RANK_NAM, Card.SUIT_BICH), Card.from(Card.RANK_NAM, Card.SUIT_TEP)
]

let a = TLMNUtils.getValidSelectedCards(checkSelectedCards, [Card.from(Card.RANK_HAI, Card.SUIT_BICH)]);
console.log(a);

