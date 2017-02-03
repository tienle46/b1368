import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';
import { isNode, isNull } from 'Utils';

export class Cell extends Component {
    constructor() {
        super();
    }

    /**
     * @param data : {} || ""
     * {
     *  label: {}, ||
     *  richtext: {}, ||
     *  button: {}
     * }
     */
    init(data) {
        if (data instanceof Object) {
            if (isNode(data)) {
                if (this.node.getComponent(cc.Label)) {
                    this.node.removeComponent(cc.Label);
                }
                NodeRub.addWidgetComponentToNode(data, { hortizontalCenter: true });
                data.active = true;
                this.node.addChild(data);
                return;
            }

            let options = data;

            // button
            options.button && NodeRub.addButtonComponentToNode(this.node, options.button);

            // label
            options.label && NodeRub.addLabelComponentToNode(this.node, options.label);

            // richtext
            options.richtext && NodeRub.addRichTextComponentToNode(this.node, options.richtext);
        } else {
            let text = isNull(data) ? "" : data.toString();
            NodeRub.addLabelComponentToNode(this.node, {
                text
            });
        }
    }

    setWidth(width) {
        this.node.setContentSize(width, this.node.getContentSize().height);
    }
}

app.createComponent(Cell);