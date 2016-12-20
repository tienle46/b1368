import app from 'app';

export default {
    tossChip: (startPos, toNode, chipInfo, cb = null) => {
        // and node where chip would be tossed to
        let toNodeSize = toNode.getContentSize();
        let toNodePos = toNode.getPosition();
        let amount = chipInfo.amount;
        let randomRange = amount > 15 ? 15 : amount;

        // tosschip animation
        new Array(app._.random(Math.ceil(randomRange / 4), Math.ceil(randomRange / 2))).fill(0).map((_, index) => {
            // chip would be located inside `toNode` area
            let endPoint = cc.v2(toNodePos.x + cc.randomMinus1To1() * 1 / 2 * toNodeSize.width * 0.8, toNodePos.y + cc.randomMinus1To1() * 1 / 2 * (toNodeSize.height - 55) * 0.8);
            // position based on world space
            let realEndPoint = toNode.parent ? toNode.parent.convertToWorldSpaceAR(endPoint) : toNode.convertToWorldSpaceAR(endPoint);

            let miniChipNode = app.res.prefab.miniChip;
            if (!miniChipNode) {
                console.error('miniChipNode is not loaded', miniChipNode);
                return;
            }

            let miniChip = cc.instantiate(miniChipNode);
            miniChip.name = "miniChip";
            miniChip.getComponent('BetChip').initChip(chipInfo, true);
            miniChip.setPosition(startPos);

            cc.director.getScene().addChild(miniChip);
            let actions = [cc.moveTo(0.1, realEndPoint), cc.delayTime(1.5).clone()];

            (index != 0) && actions.push(cc.fadeOut(0.7).clone());

            miniChip.runAction(cc.sequence(actions, cc.callFunc(() => {
                (miniChip.index != 0) && miniChip.removeFromParent();
                cb && cb();
            })));
        });
    },
    receiveChip: (fromNode, toPos, chipInfo, cb = null) => {
        // and node where chip would be tossed to
        let fromNodeSize = fromNode.getContentSize();
        let fromNodePos = fromNode.getPosition();
        let amount = chipInfo.amount;
        let randomRange = amount > 15 ? 15 : amount;

        cc.director.getScene().children.filter((child) => child.name == 'miniChip').map((child) => child.removeFromParent());

        // tosschip animation
        new Array(app._.random(Math.ceil(randomRange / 4), Math.ceil(randomRange / 2))).fill(0).map(() => {
            // chip would be located inside `fromNode` area
            let startPoint = cc.v2(fromNodePos.x + cc.randomMinus1To1() * 1 / 2 * fromNodeSize.width * 0.8, fromNodePos.y + cc.randomMinus1To1() * 1 / 2 * fromNodeSize.height * 0.8);
            // position based on world space
            let realstartPoint = fromNode.parent ? fromNode.parent.convertToWorldSpaceAR(startPoint) : fromNode.convertToWorldSpaceAR(startPoint);

            let miniChipNode = app.res.prefab.miniChip;
            if (!miniChipNode) {
                console.error('miniChipNode is not loaded', miniChipNode);
                return;
            }

            let miniChip = cc.instantiate(miniChipNode);
            miniChip.getComponent('BetChip').initChip(chipInfo, true);
            miniChip.setPosition(realstartPoint);
            cc.director.getScene().addChild(miniChip);

            let action = cc.moveTo(0.5 + cc.random0To1(), toPos);
            miniChip.runAction(cc.sequence(action.clone(), cc.delayTime(0.5).clone(), cc.fadeOut(0.2).clone(), cc.callFunc(() => {
                miniChip.removeFromParent();
                cb && cb();
            })));
        });
    }
}