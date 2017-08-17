import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';
import { isNode, isNull } from 'GeneralUtils';

export class Cell extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            label: cc.Label
        });
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
                let widgetOptions = { hortizontalCenter: true };
                !app.env.isBrowser() && (widgetOptions.top = -5); 
                
                NodeRub.addWidgetComponentToNode(data, widgetOptions);
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
    
    resizeHeight(numberOfLines) {
        if(this.label.overflow == cc.Label.Overflow.CLAMP) {
            this.label.lineHeight = this.label.fontSize + 10;
            let height = numberOfLines * this.label.lineHeight + 35;
            
            this.label.verticalAlign = cc.Label.VerticalAlign.CENTER;
            
            this.node.setContentSize(this.node.getContentSize().width, height);
        }
    }
}

app.createComponent(Cell);