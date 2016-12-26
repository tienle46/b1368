import app from 'app';

let totalChipOnPlayer = {};

export default {
    tossChip: (startPos, toNode, chipInfo, playerId) => {
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
        miniChip.playerId = playerId;
        miniChip.betId = toNode.id;
        miniChip.setPosition(startPos);

        let chipComponent = miniChip.getComponent('BetChip');
        chipComponent && chipComponent.initChip(chipInfo, true);

        cc.director.getScene().addChild(miniChip);

        if (!totalChipOnPlayer.hasOwnProperty(playerId)) {
            totalChipOnPlayer[playerId] = 1;
        } else {
            totalChipOnPlayer[playerId] += 1;
        }

        let action = cc.moveTo(0.1 + app._.random(0, 0.2), realEndPoint);

        miniChip.runAction(cc.sequence(action, cc.callFunc(() => {
            if (totalChipOnPlayer[playerId] > 20) {
                miniChip.destroy();
            }
        })));
    },
    receiveChip: (toPos, playerId, betId) => {
        totalChipOnPlayer[playerId] = 0;
        // and node where chip would be tossed to
        cc.director.getScene().children.filter((child) => (child.name == 'miniChip') && (child.playerId == playerId) && (child.betId == betId)).forEach((chip) => {
            let action = cc.moveTo(0.1 + app._.random(0, 0.2), toPos);
            chip.runAction(cc.sequence(action.clone(), cc.delayTime(0.1).clone(), cc.fadeOut(0.1).clone(), cc.callFunc(() => {
                chip.destroy();
            })));
        });
    }
}