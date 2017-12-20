import app from 'app';
import Actor from 'Actor';
import MiniPokerPopup from 'MiniPokerPopup';
import Draggable from 'Draggable';
import MiniGameIconThreshold from 'MiniGameIconThreshold';
import MiniGamesManager from 'MiniGamesManager';

class MiniGameIcon extends Actor {

    constructor() {
        super();

        this.properties = this.assignProperties({
            // Mini games container
            container: cc.Node,
            mainButton: cc.Node,

            // Popup prefabs
            miniPokerPrefab: cc.Prefab,
        });

        this.miniPokerPopup = null;
        this.isAnimating = false;
    }

    onLoad() {
        super.onLoad();

        this.draggable = this.node.getComponent(Draggable);
        this.threshold = this.node.getComponent(MiniGameIconThreshold);
        this.mainButton.on(cc.Node.EventType.TOUCH_END, this._onMainButtonClicked, this);
    }

    start() {
        super.start();

        if (app.minigameManager && app.minigameManager.isOpen) {
            this._openContainer(false);
        } else {
            this._closeContainer(false);
        }
    }

    _closeContainer(animated) {
        app.minigameManager.isOpen = false;
        this.isAnimating = true;

        if (animated) {
            this._closeContainerAnimated();
        } else {
            this.container.rotation = 180;
            this.container.setScale(0);
            this.node.setContentSize(this.mainButton.getContentSize());
            if (!this.threshold) {
                this.threshold = this.node.getComponent(MiniGameIconThreshold);
            }
            this.threshold && this.threshold.updatePosition();
            this.isAnimating = false;
        }
    }

    _closeContainerAnimated() {
        var action = cc.spawn(cc.rotateTo(MiniGameIcon.DEFAULT_INTERVAL, 180, 180).easing(cc.easeIn(2)),
            cc.fadeTo(MiniGameIcon.DEFAULT_INTERVAL, 0),
            cc.sequence(cc.scaleTo(MiniGameIcon.DEFAULT_INTERVAL, 0, 0).easing(cc.easeIn(2)), cc.callFunc(()=>{
                this.node.setContentSize(this.mainButton.getContentSize());
                this.isAnimating = false;
                if (!this.threshold) {
                    this.threshold = this.node.getComponent(MiniGameIconThreshold);
                }
                this.threshold && this.threshold.updatePosition();
            })));

        this.container.runAction(action);
    }

    _openContainer(animated) {
        app.minigameManager.isOpen = true;
        this.isAnimating = true;

        if (animated) {
            this._openContainerAnimated();
        } else {
            this.container.rotation = 0;
            this.container.setScale(1);
            this.node.setContentSize(this.container.getContentSize());
            if (!this.threshold) {
                this.threshold = this.node.getComponent(MiniGameIconThreshold);
            }
            this.threshold && this.threshold.updatePosition();
            this.isAnimating = false;
        }

    }

    _openContainerAnimated() {
        var action = cc.spawn(cc.rotateTo(MiniGameIcon.DEFAULT_INTERVAL, 0, 0).easing(cc.easeOut(2)),
            cc.fadeTo(MiniGameIcon.DEFAULT_INTERVAL, 255),
            cc.sequence(cc.scaleTo(MiniGameIcon.DEFAULT_INTERVAL, 1, 1).easing(cc.easeOut(2)), cc.callFunc(()=>{
                this.node.setContentSize(this.container.getContentSize());
                this.isAnimating = false;
                if (!this.threshold) {
                    this.threshold = this.node.getComponent(MiniGameIconThreshold);
                }
                this.threshold && this.threshold.updatePosition();
            })));

        this.container.runAction(action);
    }

    _initMiniPoker() {
        if (this.miniPokerPopup) return true;
        if (this.miniPokerPrefab) {
            this.miniPokerPopup = cc.instantiate(this.miniPokerPrefab);
            this.miniPokerPopup.active = false;
            app.system.getCurrentSceneNode().addChild(this.miniPokerPopup);
            return true;
        }

        return false;
    }

    onMiniPokerPopupClicked() {

        if (this._checkClickable()) {
            if (this._initMiniPoker()) {
                var miniPokerPopupController = this.miniPokerPopup.getComponent(MiniPokerPopup);
                miniPokerPopupController.openPopup(true);
            }
        }
    }

    onTaiXiuPopupClicked() {
        if (this._checkClickable()) {
            if (app.taiXiuTreoManager.needRequestNew()) {
                app.service.send({
                    cmd: app.commands.MINIGAME_TAI_XIU_GET_STATE
                })
            }
            else {
                app.taiXiuTreoManager.showPopup()
            }
        }
    }

    _onMainButtonClicked() {
        if (this._checkClickable()) {
            if (app.minigameManager.isOpen) {
                this._closeContainer(true);
            } else {
                this._openContainer(true);
            }
        }
    }

    _checkClickable() {
        return (this.draggable && this.draggable.isIdle());
    }

}

MiniGameIcon.DEFAULT_INTERVAL = 0.15;


app.createComponent(MiniGameIcon);