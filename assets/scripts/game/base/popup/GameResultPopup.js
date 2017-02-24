/**
 * Created by Thanh on 10/3/2016.
 */

import app from 'app';
import Actor from 'Actor';
import GameResultItem from 'GameResultItem';
import { GameUtils } from 'utils';
import Commands from "Commands";
import ArrayUtils from "ArrayUtils";

export default class GameResultPopup extends Actor {
    constructor() {
        super();
        this.title = {
            default: null,
            type: cc.Label
        };
        this.content = {
            default: null,
            type: cc.Node
        };
        this.itemPrefab = {
            default: null,
            type: cc.Prefab
        };

        this._shownTime = 0;
        this._closeCb = null;
        this.animation = null;
        this.loaded = false;
        this.__models__ = null;

        this.properties = {
            ...this.properties,
            showAnimName: 'showGameResult',
            hideAnimName: 'hideGameResult',
        }
    }

    onLoad() {
        this.loaded = false;
        this.animation = this.node.getComponent(cc.Animation);
    }

    onEnable() {
        super.onEnable();
        this.loaded = true;
        this._showResultData(this.__models__);
    }

    start() {
        super.start();
        this.node.active = false;
    }

    onClickCloseButton() {
        this.hide();
    }

    _addItem(model) {
        let space = 20;
        let gameResultItem = cc.instantiate(this.itemPrefab).getComponent('GameResultItem');
        gameResultItem.setModel(model);
        // gameResultItem.node.setPosition(0, - (this.content.childrenCount * (gameResultItem.node.height + space)));
        this.content.addChild(gameResultItem.node);
    }

    clear() {
        this.__models__ = null;
        this.content.children.forEach(child => child.destroy());
        this.content.removeAllChildren();
    }

    _showResultData(models) {
        if (ArrayUtils.isEmpty(models) || !this.loaded) return;

        this.clear();
        this.__models__ = models || [];
        this.__models__.forEach(model => this._addItem(model));
        this._shownTime = Date.now();

        this.node.active = true;
        this.node.on('touchstart', () => false);
        this.animation && this.animation.play(this.showAnimName);

    }

    show(models, closeCb) {

        this._closeCb = closeCb;

        if (this.loaded) {
            this._showResultData(models);
        } else {
            this.__models__ = models;
        }

        this.active = true;
    }

    onShown() {}

    onHidden() {
        this.node.active = false;
        this.clear();
        this._closeCb && this._closeCb(Math.ceil((Date.now() - this._shownTime) / 1000));
        this.node.off('touchstart');

        let currentScene = app.system.currentScene;
        currentScene && currentScene.room && app.service.send({ cmd: Commands.PLAYER_CONTINUE, data: {}, room: currentScene.room });
    }

    _callCloseCallback() {}

    hide() {
        this.animation && this.animation.play(this.hideAnimName);
        this.node.off('touchstart');
    }
}

app.createComponent(GameResultPopup);