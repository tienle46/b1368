import app from 'app';
import Component from 'Component';
import {betTypeIdToNameMap} from 'BetContainerButton';


export default class XocDiaAnim {

    constructor(scene) {
        this.scene = scene;
        this.chipLayer = scene.chipLayer;
        this.chipManager = {};
        this._allChipList = [];
        this._totalChipCount = 0;
        this.totalChipOnPlayer = {};

        Object.values(betTypeIdToNameMap).forEach(name => {
            let obj = {
                1: [],
                2: [],
                3: [],
                4: []
            };

            this.chipManager[name] = obj;
            this._allChipList.push(...Object.values(obj));
        });
    }

    _resetChipManager() {
        this._totalChipCount = 0;
        this.totalChipOnPlayer = {};
        this._allChipList.forEach(arr => arr.length = 0);
    }

    reset() {
        this._resetChipManager();
    }

    tossChip(startPos, toNode, chip, playerId, typeId, betIndex) {

        this._totalChipCount++;
        let betTypename = betTypeIdToNameMap[typeId];
        if (betIndex >= 0 && betIndex < 4 && betTypename && this.chipManager[betTypename]) {
            this.chipManager[betTypename][betIndex + 1].push(chip);
        }
        if (this._totalChipCount > 50) {
            this.removeSinglePreviousChip();
        }

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

        if (!this.totalChipOnPlayer.hasOwnProperty(playerId)) {
            this.totalChipOnPlayer[playerId] = 1;
        } else {
            this.totalChipOnPlayer[playerId] += 1;
        }

        this.chipLayer.addChild(chip);
        chip.runAction(cc.sequence(cc.moveTo(0.1 + app._.random(0, 0.2), realEndPoint)));
    }

    receiveChip(toPos, playerId, betId) {
        this.totalChipOnPlayer[playerId] = 0;
        // and node where chip would be tossed to
        this.chipLayer.children.filter(child => (child.playerId == playerId) && (child.betId == betId)).map((chip) => {
            let action = cc.moveTo(0.1 + app._.random(0, 0.2), toPos);
            chip.runAction(cc.sequence(action.clone(), cc.delayTime(0.1).clone(), cc.fadeOut(0.1).clone(), cc.callFunc(() => {
                chip.destroy();
                chip.removeFromParent();
            })));
        });
    }

    clearPlayerChip(playerId) {
        delete this.totalChipOnPlayer[playerId];
        this.chipLayer.children.filter(child => (child.playerId == playerId)).map((chip) => {
            chip.destroy();
            chip.removeFromParent(true);
        });
    }

    removeSinglePreviousChip() {
        let removableChipArr = this._allChipList.sort((a, b) => b.length - a.length)[0];
        if (removableChipArr.length > 0) {
            let chip = removableChipArr[0];

            chip.destroy();
            chip.removeFromParent(true);

            removableChipArr.splice(0, 1);
            this._totalChipCount--;
        }
    }

    clearAllChip() {
        this.chipLayer.removeAllChildren(true);
        this._resetChipManager();
    }
}