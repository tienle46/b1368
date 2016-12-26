/**
 * Created by Thanh on 12/26/2016.
 */

export default class GameAnim {

    static flyTo({fromNode = null, toNode = null, duration = 0.2, prefab = null, delayPerItem = 0.05, amount = 1, autoRemove = true, cb = null} = {}) {
        if(!fromNode || !toNode || !prefab) return;

        let startPos = fromNode.parent ? fromNode.parent.convertToWorldSpaceAR(fromNode.getPosition())
            : fromNode.convertToWorldSpaceAR(fromNode.getPosition());

        let endPoint = toNode.parent ? toNode.parent.convertToWorldSpaceAR(toNode.getPosition())
            : toNode.convertToWorldSpaceAR(toNode.getPosition());

        // tosschip animation
        new Array(Math.min(amount, 5)).fill(0).map((_, index) => {

            let miniChip = cc.instantiate(prefab);
            cc.director.getScene().addChild(miniChip);

            miniChip.setPosition(startPos);
            let actions = [];

            let delayTime = index * delayPerItem;
            if(delayTime > 0) {
                actions.push(cc.delayTime(delayTime).clone());
            }

            miniChip.runAction(cc.sequence(
                ...actions,
                cc.moveTo(duration, endPoint),
                cc.delayTime(0.05).clone(),
                cc.callFunc(() => {
                    autoRemove && miniChip.removeFromParent();
                    cb && cb();
                })
            ));
        });
    }

}