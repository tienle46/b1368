import app from 'app';
import Threshold from 'Threshold';

class MiniGameIconThreshold extends Threshold {
    constructor() {
        super();

        this.properties = this.assignProperties({
        });
    }

    onLoad() {
        super.onLoad();

        this.miniGameIcon = this.node.getComponent('MiniGameIcon');
    }

    _onTouchEnd() {
        if (!this.miniGameIcon) {
            this.miniGameIcon = this.node.getComponent('MiniGameIcon');
        }

        if (!app.minigameManager.isOpen)
            this.node.opacity = 180;

        if (!this.miniGameIcon.isAnimating) {
            this.updatePosition();
        }

    }

    updatePosition() {
        let T = this._componentShouldBeMovedTo(this.node.getPosition())
        this._moveToThreshold(T)

        app.minigameManager && (app.minigameManager._lastPos = this._getPositionForType(T));
    }
}

app.createComponent(MiniGameIconThreshold);