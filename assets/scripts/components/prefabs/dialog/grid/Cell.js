import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';
import { isNode, isNull } from 'Utils';

export class Cell extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            label: cc.Label
        };
    }

    onEnable() {
        cc.log('------>', this.label.verticalAlign, cc.Label.VerticalAlign);
    }

    /**
     * @param data : {} || ""
     * {
     *  label: {}, ||
     *  richtext: {}, ||
     *  button: {}
     * }
     */
    init(data, options) {
        if (data instanceof Object) {
            if (isNode(data)) {
                if (this.label) {
                    this.node.removeComponent(this.label);
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
            let o = Object.assign({}, options);
            o.text = isNull(data) ? "" : data.toString();
            NodeRub.addLabelComponentToNode(this.node, o);
        }
    }

    setWidth(width) {
        this.node.setContentSize(width, this.node.getContentSize().height);
    }

    setColor(color) {
        if (color instanceof cc.Color)
            this.node.color = color;
    }
}

app.createComponent(Cell);