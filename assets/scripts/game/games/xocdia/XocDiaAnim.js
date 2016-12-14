import app from 'app';

export default {
    tossChip: (startPos, toNode, chipInfo, cb = null) => {
        // and node where chip would be tossed to
        let toNodeSize = toNode.getContentSize();
        let toNodePos = toNode.getPosition();
        let amount = chipInfo.amount;
        let randomRange = amount > 30 ? 30 : amount;

        // tosschip animation
        new Array(app._.random(Math.ceil(randomRange / 2), randomRange)).fill(0).map(() => {
            // chip would be located inside `toNode` area
            let endPoint = cc.v2(toNodePos.x + cc.randomMinus1To1() * 1 / 2 * toNodeSize.width * 0.8, toNodePos.y + cc.randomMinus1To1() * 1 / 2 * toNodeSize.height * 0.8);
            // position based on world space
            let realEndPoint = toNode.parent ? toNode.parent.convertToWorldSpaceAR(endPoint) : toNode.convertToWorldSpaceAR(endPoint);

            let miniChipNode = app.res.prefab.miniChip;
            if (!miniChipNode) {
                console.error('miniChipNode is not loaded', miniChipNode);
                return;
            }

            let miniChip = cc.instantiate(miniChipNode);
            miniChip.getComponent('BetChip').initChip(chipInfo);
            miniChip.setPosition(startPos);
            cc.director.getScene().addChild(miniChip);
            let action = cc.moveTo(0.1, realEndPoint);
            miniChip.runAction(cc.sequence(action.clone(), cc.delayTime(2).clone(), cc.fadeOut(1).clone(), cc.callFunc(() => {
                miniChip.removeFromParent();
                cb && cb();
            })));
        });
    }
}