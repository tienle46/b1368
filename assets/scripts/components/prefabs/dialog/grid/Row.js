import app from 'app';
import Component from 'Component';

export class Row extends Component {
    constructor() {
        super();
    }

    init(cells) {
        if (!app._.isEmpty(cells)) {
            cells.map(cell => {
                this.node.addChild(cell);
            });
        }
    }
}

app.createComponent(Row);