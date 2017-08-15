import app from 'app';
import { destroy } from 'CCUtils';

class ChipManager {
    /**
     * Creates an instance of ChipManager.
     * @param {Number} totalAllowedChip // total chips on board per player
     * @param {Array} betTypeIds 
     * @memberof ChipManager
     */
    constructor(totalAllowedChip, betTypeIds) {
        this.chips = {};
        this._totalAllowedChip = totalAllowedChip;
        this._betTypeIds = betTypeIds;
        this._amountChipPerBet = Math.ceil(totalAllowedChip/betTypeIds.length); // the total actual chip may be larger than totalAllowedChip 
    }    
    
    add(chip) {
        this._initPlayer(chip.playerId)
        this.chips[chip.playerId][chip.betId].push(chip)
        if(this.chips[chip.playerId][chip.betId].length > this._amountChipPerBet) {
            let _1stChip = this.chips[chip.playerId][chip.betId].shift()
            
            if(_1stChip instanceof cc.Node) {
                destroy(_1stChip)
            } 
        }
    }
    
    reset() {
        for(let key in this.chips) {
            Object.keys(this.chips[key]).forEach(k => this.chips[key][k] = [])
            // this.chips[key] = null;
        }  
    }
    
    clearChips(playerId, betId) {
        if(betId) {
            this._clearChipByBetId(playerId, betId)
        } else {
            for(let betId in this.chips[playerId]) {
                this._clearChipByBetId(playerId, betId)
            } 
        }
    }
    
    _clearChipByBetId(playerId, betId) {
        if(!this.chips[playerId][betId])
            return;
        
        let i = this.chips[playerId][betId].length
        while(i-- && i>=0) {
            let node = this.chips[playerId][betId][i]
            node && node instanceof cc.Node && destroy(node)
            this.chips[playerId][betId].splice(i, 1)
        }
    }
    
    _initPlayer(playerId) {
        if(!this.chips.hasOwnProperty(playerId) || !this.chips[playerId]) {
            this.chips[playerId] = {}
            this._betTypeIds.forEach(betId => {
                this.chips[playerId][betId] = []
            })
        }        
    }
}

export default class BetChipAnim {

    constructor(scene, betTypeIdToNameMap) {
        this.scene = scene;
        this.chipLayer = scene.chipLayer;
        
        this.betTypeIdToNameMap = betTypeIdToNameMap;
        // 330 ~ 330kb alloc
        this.chipManager = new ChipManager(330, Object.keys(this.betTypeIdToNameMap));
    }

    tossChip(startPos, toNode, chip, playerId, typeId, betIndex) {
        this.addChip(toNode, chip, playerId, typeId, betIndex, startPos);
        
        // position based on world space
        let realEndPoint = this.getRealEndPoint(toNode);
        
        chip.runAction(cc.moveTo(0.1 + app._.random(0, 0.2), realEndPoint));
    }
    
    addChip(toNode, chip, playerId, typeId, betIndex, startPos) {
        chip.name = "miniChip";
        chip.playerId = playerId;
        chip.betId = typeId;
        chip.setPosition(startPos);
        
        this.chipManager.add(chip)
        this.chipLayer.addChild(chip);
    }
    
    getRealEndPoint(toNode) {
        // and node where chip would be tossed to
        let toNodeSize = toNode.getContentSize();
        let toNodePos = toNode.getPosition();

        // chip would be located inside `toNode` area
        let endPoint = cc.v2(toNodePos.x + cc.randomMinus1To1() * 1 / 2 * toNodeSize.width * 0.8, toNodePos.y + cc.randomMinus1To1() * 1 / 2 * (toNodeSize.height - 55) * 0.8);
        // position based on world space
        let realEndPoint = toNode.parent ? toNode.parent.convertToWorldSpaceAR(endPoint) : toNode.convertToWorldSpaceAR(endPoint);
        
        return realEndPoint;
    }
    
    receiveChip(toPos, playerId, betId) {
        // and node where chip would be tossed to
        this.chipLayer.children.filter(child => (child.playerId == playerId) && (child.betId == betId)).map((chip) => {
            let action = cc.moveTo(0.1 + app._.random(0, 0.2), toPos);
            chip.runAction(cc.sequence(action.clone(), cc.delayTime(0.1).clone(), cc.fadeOut(0.1).clone(), cc.callFunc(() => {
                this.chipManager.clearChips(playerId, betId)
                // destroy(chip);
            })));
        });
    }

    clearPlayerChip(playerId) {
        this.chipManager.clearChips(playerId)
    }

    clearAllChip() {
        this.chipLayer.removeAllChildren(true);
        this.chipManager.reset();
    }
}