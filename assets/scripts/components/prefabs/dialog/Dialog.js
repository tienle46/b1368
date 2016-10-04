import Component from 'Component';

export default class Dialog extends Component {
    constructor() {
        super();
    }

    onCloseBtnClick() {
        this.node.removeFromParent(true);
    }
}