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

    init(cells, showSprite) {
        if (!app._.isEmpty(cells)) {
            cells.map(cell => {
                if (!showSprite) {
                    let sprite = this.node.getComponent(cc.Sprite);
                    sprite.enabled = false;
                }
                this.node.addChild(cell);
            });
        }
    }
}

app.createComponent(Row);