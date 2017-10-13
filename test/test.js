/**
 * Created by Thanh on 10/6/2016.
 */
'use strict';

var TLMNUtils = require('TLMNUtils')
var Card = require('Card')

let checkSelectedCards = [
    Card.from(Card.RANK_BA, Card.SUIT_BICH), Card.from(Card.RANK_BA, Card.SUIT_TEP),
    Card.from(Card.RANK_BON, Card.SUIT_BICH), Card.from(Card.RANK_BON, Card.SUIT_TEP),
    Card.from(Card.RANK_NAM, Card.SUIT_BICH), Card.from(Card.RANK_NAM, Card.SUIT_TEP)
]

let a = TLMNUtils.getValidSelectedCards(checkSelectedCards, [Card.from(Card.RANK_HAI, Card.SUIT_BICH)]);
log(a);

