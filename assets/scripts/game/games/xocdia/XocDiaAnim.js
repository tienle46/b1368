import app from 'app';

let totalChipOnPlayer = {};

export default {
    tossChip: (startPos, toNode, chip, playerId) => {
        // and node where chip would be tossed to
        let toNodeSize = toNode.getContentSize();
        let toNodePos = toNode.getPosition();

        // chip would be located inside `toNode` area
        let endPoint = cc.v2(toNodePos.x + cc.randomMinus1To1() * 1 / 2 * toNodeSize.width * 0.8, toNodePos.y + cc.randomMinus1To1() * 1 / 2 * (toNodeSize.height - 55) * 0.8);
        // position based on world space
        let realEndPoint = toNode.parent ? toNode.parent.convertToWorldSpaceAR(endPoint) : toNode.convertToWorldSpaceAR(endPoint);

        chip.name = "miniChip";
        chip.playerId = playerId;
        chip.betId = toNode.id;
        chip.setPosition(startPos);

        cc.director.getScene().addChild(chip);

        if (!totalChipOnPlayer.hasOwnProperty(playerId)) {
            totalChipOnPlayer[playerId] = 1;
        } else {
            totalChipOnPlayer[playerId] += 1;
        }

        let action = cc.moveTo(0.1 + app._.random(0, 0.2), realEndPoint);

        chip.runAction(cc.sequence(action, cc.callFunc(() => {
            if (totalChipOnPlayer[playerId] > 20) {
                chip.destroy();
            }
        })));
    },
    receiveChip: (toPos, playerId, betId) => {
        totalChipOnPlayer[playerId] = 0;
        // and node where chip would be tossed to
        cc.director.getScene().children.filter((child) => (child.name == 'miniChip') && (child.playerId == playerId) && (child.betId == betId)).map((chip) => {
            let action = cc.moveTo(0.1 + app._.random(0, 0.2), toPos);
            chip.runAction(cc.sequence(action.clone(), cc.delayTime(0.1).clone(), cc.fadeOut(0.1).clone(), cc.callFunc(() => {
                chip.destroy();
            })));
        });
    },
    clearPlayerChip: (playerId) => {
        totalChipOnPlayer[playerId] = 0;
        cc.director.getScene().children.filter((child) => (child.name == 'miniChip') && (child.playerId == playerId)).map((chip) => {
            chip.destroy();
        });
    }
}