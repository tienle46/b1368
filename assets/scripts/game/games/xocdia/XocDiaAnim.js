import app from 'app';

export default {
    tossChip: (startPos, toNode, chipInfo, cb = null) => {
        // and node where chip would be tossed to
        let toNodeSize = toNode.getContentSize();
        let toNodePos = toNode.getPosition();

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
        let chipComponent = miniChip.getComponent('BetChip');
        chipComponent.initChip(chipInfo, true);
        miniChip.setPosition(startPos);

        cc.director.getScene().addChild(miniChip);
        let action = cc.moveTo(0.1 + app._.random(0, 0.2), realEndPoint);

        miniChip.runAction(cc.sequence(action, cc.callFunc(() => {
            // miniChip.destroy();
            // chipComponent.destroy();
            cb && cb();
        })));
    },
    receiveChip: (fromNode, toPos, chipInfo, cb = null) => {
        // and node where chip would be tossed to
        let fromNodeSize = fromNode.getContentSize();
        let fromNodePos = fromNode.getPosition();
        let amount = chipInfo.amount;
        let randomRange = amount > 10 ? 10 : amount;

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
            let chipComponent = miniChip.getComponent('BetChip');
            chipComponent.initChip(chipInfo, true);
            miniChip.setPosition(realstartPoint);
            cc.director.getScene().addChild(miniChip);

            let action = cc.moveTo(0.2 + app._.random(0, 0.2), toPos);
            miniChip.runAction(cc.sequence(action.clone(), cc.delayTime(0.1).clone(), cc.fadeOut(0.1).clone(), cc.callFunc(() => {
                miniChip.destroy();
                chipComponent.destroy();
                cb && cb();
            })));
        });
    }
}