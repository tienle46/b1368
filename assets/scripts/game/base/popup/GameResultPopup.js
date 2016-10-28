/**
 * Created by Thanh on 10/3/2016.
 */

import app from 'app';
import Actor from 'Actor';
import GameResultItem from 'GameResultItem';
import {GameUtils} from 'utils';

export default class GameResultPopup extends Actor {
    constructor() {
        super();
        this.title = cc.Label;
        this.content = cc.Node;
        this.itemPrefab = cc.Prefab;
        this._shownTime = 0;
        this._closeCb = null;
    }

    onLoad(){
        super.onLoad();
        this.node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
        this.node.on('touchstart', () => false);
    }

    start(){
        this._shownTime = Date.now();
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
        itemNode.getComponent(GameResultItem.name).setModel(model);
        this.content.addChild(itemNode);
    }

    clear(){
        this.content.removeAllChildren();
    }

    show(models, closeCb){
        this.addItems(models);
        this._closeCb = closeCb;

        app.system.currentScene.node.parent.addChild(this.node);
    }

    onDisable(){
        this._closeCb && this._closeCb(Math.ceil((Date.now() - this._shownTime) / 1000));
    }

    hide(){
        this.clear();
        this.node.removeFromParent(true);
    }
}

app.createComponent(GameResultPopup);

