var Button = require('Button');
var app = require('app');

class CheckBox extends Button {
    constructor() {
        super();

        this._toggleGroup = null;

        this.isChecked = {
            default: true,
            notify: function() {
                this._updateSprites();
            }
        };

        // active states
        this.activeNormalSprite = this._propertySetting();
        this.activePressedSprite = this._propertySetting();
        this.activeDisabledSprite = this._propertySetting();

        // inactive state
        this.inActiveNormalSprite = this._propertySetting('Inactive Normal Sprite');
        this.inActivePressedSprite = this._propertySetting('Inactive Pressed Sprite');
        this.inActiveDisabledSprite = this._propertySetting('Inactive Disabled Sprite');

        this.checkEvents = {
            default: [],
            type: cc.Component.EventHandler
        };
    }

    _updateSprites() {
        if (this.isChecked) {
            this.normalSprite = this.activeNormalSprite;
            this.pressedSprite = this.activePressedSprite;
            this.disabledSprite = this.activeDisabledSprite;
        } else {
            this.normalSprite = this.inActiveNormalSprite;
            this.pressedSprite = this.inActivePressedSprite;
            this.disabledSprite = this.inActiveDisabledSprite;
        }
    }

    // use this for initialization
    onLoad() {
        this.transition = cc.Button.Transition.SPRITE; //use sprite transition mode

        this._updateSprites();

        this._registerCheckBoxEvent();
    }

    //this method override the parent method...
    _registerCheckBoxEvent() {
        //register checkbox specific event
        var event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'CheckBox';
        event.handler = 'toggleCheckBoxStatus';
        this.clickEvents = [event];

    }

    toggleCheckBoxStatus() {
        if (this._toggleGroup && this.isChecked) {
            return;
        }
        this.isChecked = !this.isChecked;


        this.node.emit('check-event', this);
        if (this.checkEvents) {
            cc.Component.EventHandler.emitEvents(this.checkEvents, this);
        }

        if (this._toggleGroup) {
            this._toggleGroup.updateToggles(this);
        }
    }

    check() {
        if (this._toggleGroup && this.isChecked) {
            return;
        }

        this.isChecked = true;
        if (this._toggleGroup) {
            this._toggleGroup.updateToggles(this);
        }
    }

    uncheck() {
        if (this._toggleGroup && this.isChecked) {
            return;
        }

        this.isChecked = false;
    }

    _propertySetting(name = null) {
        let o = {
            default: null,
            type: cc.SpriteFrame,
            notify: () => {
                this._updateSprites();
            }
        };
        if (name) {
            o.displayName = name;
        }

        return o;
    }
}

app.createComponent(CheckBox);