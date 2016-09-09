/**
 * Created by Thanh on 8/27/2016.
 */

var utils = {};

utils.loadComponent = (componentPath, parent) => {
    cc.loader.loadRes(componentPath, (error, prefab) => {
        let prefabObj = cc.instantiate(prefab);
        prefabObj.parent = this.playerLayer
    });
}

utils.getGameCode = (room) => {
    return room && room.isGame && room.name.substring(0, 3);
}

module.exports = utils;