/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';
import TabEvents from 'TabEvents';

class TabPersonalMessages extends TabEvents {
    constructor() {
        super();
    }
    onLoad() {
        this.groupType = app.const.DYNAMIC_GROUP_SYSTEM_MESSAGE;
        super.onLoad();
    }
}

app.createComponent(TabPersonalMessages);