import app from 'app';
import Component from 'Component';

export class Row extends Component {
    constructor() {
        super();
        this.properties = {
            layout: cc.Layout
        };
    }

    onDestroy() {
        this.addAsset(this.node.getComponent(cc.Sprite).spriteFrame);
        super.onDestroy();
    }
    
    onEnable() {
        super.onEnable();
        this.verticalAlignCenterText();
    }
    
    init(cells, showBg) {
        if (!app._.isEmpty(cells)) {
            cells.map(cell => {
                // if (!showBg) {
                //     let sprite = this.node.getComponent(cc.Sprite);
                //     sprite.enabled = false;
                // }
                this.node.addChild(cell);
            });
        }

        if(!app.env.isBrowser()) {
            this.layout.paddingTop = 40;
        }
        
        this.node.active = true;
    }

    initWithNode(node, showBg) {
        // if (!showBg) {
        //     let sprite = this.node.getComponent(cc.Sprite);
        //     sprite.enabled = false;
        // }

        this.node.addChild(node);
    }

    verticalAlignCenterText() {
        if(this.node) {
            let height = this.node.getContentSize().height;
            
            let max = Math.max(...this.node.children.map(o => {
                return o.getContentSize().height;
            }));

            if (max > height) {
                this.node.children.map(child => {
                    let cell = child.getComponent('Cell');
                    if(cell) {
                        cell.label.overflow = cc.Label.Overflow.CLAMP;
                        cell.resizeHeight(max/cell.label.lineHeight);
                    }  
                });
            }
        }
    }
}

app.createComponent(Row);