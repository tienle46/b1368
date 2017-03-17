import app from 'app';
import Component from 'Component';

export class Row extends Component {
    constructor() {
        super();
    }

    onDestroy() {
        this.addAsset(this.node.getComponent(cc.Sprite).spriteFrame);
        super.onDestroy();
    }

    init(cells, showBg) {
        if (!app._.isEmpty(cells)) {
            cells.map(cell => {
                if (!showBg) {
                    let sprite = this.node.getComponent(cc.Sprite);
                    sprite.enabled = false;
                }
                this.node.addChild(cell);
            });
        }
    }

    initWithNode(node, showBg) {
        if (!showBg) {
            let sprite = this.node.getComponent(cc.Sprite);
            sprite.enabled = false;
        }
        this.node.addChild(node);
    }

    verticalAlignCenterText() {
        let height = this.node.getContentSize().height;
        setTimeout(() => {
            let max = Math.max(...this.node.children.map(o => {
                return o.getContentSize().height;
            }));

            if (max > height) {
                this.node.children.map(child => {
                    let label = child.getComponent(cc.Label);
                    label.overflow = cc.Label.Overflow.CLAMP;

                    child.setContentSize(child.getContentSize().width, max);
                });
            }
        });

    }
}

app.createComponent(Row);