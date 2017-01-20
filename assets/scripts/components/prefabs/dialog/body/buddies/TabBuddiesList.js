import app from 'app';
import DialogActor from 'DialogActor';

export default class TabBuddiesList extends DialogActor {
    constructor() {
        super();

        this.properties = {

        };
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._initBuddyList();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_BUDDY_LIST_MUTUAL, this._onInitBuddy, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_BUDDY_LIST_MUTUAL, this._onInitBuddy, this);
    }

    _initBuddyList() {
        let sendObject = {
            cmd: app.commands.GET_BUDDY_LIST_MUTUAL
        };

        app.service.send(sendObject);
    }

    _onInitBuddy(data) {
        debug(data);
    }
}

app.createComponent(TabBuddiesList);