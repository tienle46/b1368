/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app'
import GameManager from 'GameManager'
import TLMNDLBoard from 'TLMNDLBoard';
import TLMNDLPlayer from 'TLMNDLPlayer';
import Board from 'Board';
import BoardCard from 'BoardCard';
import BoardCardTurnBase from 'BoardCardTurnBase';
import BoardTurnBaseAdapter from 'BoardTurnBaseAdapter';
import BoardBetTurnAdapter from 'BoardBetTurnAdapter';
import Player from 'Player';
import PlayerCard from 'PlayerCard';
import PlayerCardTurnBase from 'PlayerCardTurnBase';
import PlayerTurnBaseAdapter from 'PlayerTurnBaseAdapter';
import PlayerBetTurnAdapter from 'PlayerBetTurnAdapter';
import GameEventHandler from 'GameEventHandler';

const gameManager = new GameManager();

const game = {};
game.const = app.const.game;

export {
    game,
    gameManager,
    TLMNDLBoard,
    TLMNDLPlayer,
    Board,
    BoardCard,
    BoardCardTurnBase,
    BoardTurnBaseAdapter,
    BoardBetTurnAdapter,
    Player,
    PlayerCard,
    PlayerCardTurnBase,
    PlayerTurnBaseAdapter,
    PlayerBetTurnAdapter,
    GameEventHandler
};

export default game;
