/**
 * Created by Thanh on 8/27/2016.
 */

var utils = module.exports;

utils.gone = (node) => {
    if(node) node.active = false;
}

utils.visible = (node) => {
    if(node) node.active = true;
}

utils.setVisible = (node, visible) => {
    if(visible){
        utils.visible(node)
    }else{
        utils.gone(node)
    }
}

utils.hide = (node) => {
    node && node.runAction(cc.hide())
}

utils.show = (node) => {
    node && node.runAction(cc.show())
}

utils.loadComponent = (componentPath, parent) => {
    cc.loader.loadRes(componentPath, (error, prefab) => {
        let prefabObj = cc.instantiate(prefab);
        prefabObj.parent = this.playerLayer
    });
}

utils.getGameCode = (room) => {
    return room && room.isGame && room.name.substring(0, 3);
}