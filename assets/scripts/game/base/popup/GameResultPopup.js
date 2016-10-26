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

        this.itemPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.content = {
            default: null,
            type: cc.Node
        }

        this.title = cc.Label;
    }

    onLoad(){

        this.node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
        this.node.on('touchstart', () => false);
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

    show(models){
        this.addItems(models);

        app.system.currentScene.node.parent.addChild(this.node);
    }

    hide(){
        this.clear();
        this.node.removeFromParent(true);
    }
}

app.createComponent(GameResultPopup);

