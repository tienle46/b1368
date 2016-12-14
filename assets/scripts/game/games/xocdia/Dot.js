import app from 'app';
import Component from 'Component';

class Dot extends Component {
    constructor() {
        super();
    }

    setColor(color) {
        this.node.color = color;
    }
}

app.createComponent(Dot);