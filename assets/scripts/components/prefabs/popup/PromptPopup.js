/**
 * Created by Thanh on 10/18/2016.
 */

import app from 'app';
import NodeRub from 'NodeRub';
import Component from 'Component';
import { isNode } from 'Utils';

export default class PromptPopup extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            titleLbl: cc.Label,
            inputEditBox: cc.EditBox,
            descriptionLbl: cc.Label,
            acceptBtnNode: cc.Node,
            mainNode: cc.Node,
            bodyNode: cc.Node,
            popupBkg: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();
        this.node.on(cc.Node.EventType.TOUCH_START, function() {
            return;
        });
        this.node.zIndex = (app.const.popupZIndex - 1);
    }

    onDestroy() {
        super.onDestroy();
    }

    onDenyBtnClick() {
        this.node.destroy();
        this.node.removeFromParent();
    }

    addAcceptBtnHandler(fn) {
        this.acceptBtnNode.on(cc.Node.EventType.TOUCH_END, () => {
            let value = this.inputEditBox.string;
            if (!value) {
                app.system.error(app.res.string('error_user_enter_empty_input'));
            } else {
                fn.call(null, value);
                this.onDenyBtnClick();
            }
        });
    }

    init(parent, initObject, title, edBox, hl) {
        if (isNode(initObject)) {
            this.mainNode.removeAllChildren();
            initObject.setPosition(cc.v2(0, 0));
            this.mainNode.addChild(initObject);

            let children = initObject.children;

            edBox && (this.inputEditBox = edBox);

            hl && this.addAcceptBtnHandler(hl);

        } else {
            let { handler, title, description, editBox } = initObject;
            debug(handler, title, description, editBox);
            let currentSize = this.inputEditBox.node.getContentSize();
            if (editBox.height) {
                this.inputEditBox.node.setContentSize(currentSize.width, editBox.height);
                this.popupBkg.setContentSize(this.popupBkg.getContentSize().width, this.popupBkg.getContentSize().height + Math.abs(currentSize.height - editBox.height) + 30);
                delete editBox.height;
            }
            handler && this.addAcceptBtnHandler(handler);
            this.descriptionLbl.string = description || "Xin hãy nhập :";
            editBox && NodeRub.addEditBoxComponentToNode(this.inputEditBox.node, editBox);
        }

        title && (this.titleLbl.string = title);

        if (!parent) {
            parent = app.system.getCurrentSceneNode();
        }
        parent.addChild(this.node);
    }
}

app.createComponent(PromptPopup)