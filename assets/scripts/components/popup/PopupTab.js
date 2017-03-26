/**
 * Created by Thanh on 2/16/2017.
 */

import app from 'app';
import Component from 'Component';

export default class PopupTab extends Component {

    constructor(props) {
        super(props);
        this.properties = {
            ...super.properties,
            titleLabel: cc.Label,
            inactiveNode: cc.Node,
            activeNode: cc.Node,
            toggle: cc.Toggle,
        }

        /**
         * @type {cc.ToggleGroup}
         */
        this.title = "";
        this.toggleGroup = null;
        this.onClickListener = null;
    }

    onEnable() {
        super.onEnable();

        this.toggle.toggleGroup = this.toggleGroup;
        this.titleLabel.string = this.title;
    }

    onDestroy() {
        super.onDestroy();
        this.onClickListener = null;
    }

    setToggleGroup(toggleGroup) {
        this.toggleGroup = toggleGroup;
        return this;
    }

    setTitle(title = app.res.string('system')) {
        this.title = title;
        return this;
    }

    onClick() {
        this.onClickListener && this.onClickListener();
    }

    setOnClickListener(listener) {
        this.onClickListener = listener;
    }

    activeTab() {
        this.inactiveNode.active = false;
        this.activeNode.active = true;
        this.toggle.check();
        this._updateOutlineColor(true);
    }

    inactiveTab() {
        this.inactiveNode.active = true;
        this.activeNode.active = false;
        this._updateOutlineColor(false);
    }
    
    _updateOutlineColor(state) {
        let outlineComponent = this.titleLabel.node.getComponent(cc.LabelOutline);
        outlineComponent && (outlineComponent.color = state ? new cc.Color(147, 110, 0) : new cc.Color(1, 106, 181))
    }
}

app.createComponent(PopupTab)