import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';

class StatisticTable extends Component {
    constructor() {
        super();

        this.oddLbl = {
            default: null,
            type: cc.Label
        };

        this.evenLbl = {
            default: null,
            type: cc.Label
        };

        this.separateSideNode = {
            default: null,
            type: cc.Node
        };

        this.cellNode = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {

    }

    updateSeparateTable(histories) {
        //only update newest 32 cells
        let numberCellsInTable = 32;
        if (histories.length > numberCellsInTable)
            histories = histories.slice(0, numberCellsInTable + 1);

        //clear table
        // this.separateSideNode.children.map((child, i) => i > 0 && child.destroy());
        this.separateSideNode.removeAllChildren();

        histories.map((data) => {
            let cell = this.addChildToSeparateSide(data);

            this.separateSideNode.addChild(cell);
        });

        //0: even, 1: odd
        let evens = histories.filter((type) => type === 0).length;
        let odds = histories.filter((type) => type === 1).length;

        this.evenLbl.string = evens;
        this.oddLbl.string = odds;
    }

    // @param type:  0: even, 1: odd
    addChildToSeparateSide(type) {
        // 0: white, 1: red
        let colors = ['blueTheme/ingame/xocdia/trang', 'blueTheme/ingame/xocdia/do'];

        let cell = cc.instantiate(this.cellNode);
        cell.active = true;

        let sprite = {
            spriteFrame: colors[type],
            type: cc.Sprite.Type.SLICE,
            sizeMode: cc.Sprite.SizeMode.CUSTOM
        };

        NodeRub.addSpriteComponentToNode(cell, sprite);

        return cell;
    }
}

app.createComponent(StatisticTable);