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
    }

    inactiveTab() {
        this.inactiveNode.active = true;
        this.activeNode.active = false;
    }
}

app.createComponent(PopupTab)