import app from 'app';
import Component from 'Component';

export class Row extends Component {
    constructor() {
        super();
    }

    onDestroy() {
        this.addAsset(this.node.getComponent(cc.Sprite).spriteFrame)
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
}

app.createComponent(Row);