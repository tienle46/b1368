/**
 * Created by Thanh on 10/3/2016.
 */

import app from 'app';
import Actor from 'Actor';
import GameResultItem from 'GameResultItem';
import {GameUtils} from 'utils';
import * as Commands from "../../../core/Commands";

export default class GameResultPopup extends Actor {
    constructor() {
        super();
        this.title = cc.Label;
        this.content = cc.Node;
        this.itemPrefab = cc.Prefab;
        this._shownTime = 0;
        this._closeCb = null;
        this.animation = null;
        this.loaded = false;
        this.models = null;

        this.properties = {
            ...this.properties,
            showAnimName: 'showGameResult',
            hideAnimName: 'hideGameResult',
        }
    }

    onEnable(){
        super.onEnable();

        this.animation = this.node.getComponent(cc.Animation);
        this.loaded = true;

        this._showResultData(this.models);
    }

    start(){
        super.start();

        this.node.active = false;
    }

    onClickCloseButton(){
        this.hide();
    }

    addItems(models){
        this.clear();
        models && models.forEach(model => this.addItem(model));
    }

    addItem(model){
        let space = 20;

        let itemNode = cc.instantiate(this.itemPrefab);
        itemNode.setPosition(0, - (this.content.childrenCount * (itemNode.height + space)));
        itemNode.getComponent('GameResultItem').setModel(model);
        this.content.addChild(itemNode);
    }

    clear(){
        this.models = null;
        this.content.removeAllChildren();
    }

    _showResultData(models){
        if(!models) return;

        this.node.active = true;
        this.addItems(models);
        this._shownTime = Date.now();
        this.animation && this.animation.play(this.showAnimName);
        this.node.on('touchstart', () => false);
    }

    show(models, closeCb){

        this._closeCb = closeCb;

        if(this.loaded){
            this._showResultData(models);
        }else{
            this.models = models;
        }
    }

    onShown(){
    }

    onHidden(){
        this.node.active = false;
        this.clear();
        this._closeCb && this._closeCb(Math.ceil((Date.now() - this._shownTime) / 1000));
        this.node.off('touchstart');

        let currentScene = app.system.currentScene;
        currentScene && currentScene.room && app.service.send({cmd: Commands.PLAYER_CONTINUE, data: {}, room: currentScene.room});
    }

    _callCloseCallback(){
    }

    hide(){
        this.animation && this.animation.play(this.hideAnimName);
        this.node.off('touchstart');
    }
}

app.createComponent(GameResultPopup);

