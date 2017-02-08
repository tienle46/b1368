import app from 'app';
import DialogActor from 'DialogActor';

export default class TabBuddyDetail extends DialogActor {
    constructor() {
        super();

        this.properties = {

        };

        this.addedNodes = {};
    }

    onLoad() {
        super.onLoad();
        console.debug('x');
    }
}

app.createComponent(TabBuddyDetail);