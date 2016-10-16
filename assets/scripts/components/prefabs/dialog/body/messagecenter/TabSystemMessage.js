/**
 * Created by trungnt on 10/14/16.
 */
// import app from 'app';
import TabEvents from 'TabEvents';

class TabSystemMessage extends TabEvents{
    constructor(){
        super();
    }
    onLoad(){
        this.groupType = app.const.DYNAMIC_GROUP_NOTIFY;
        super.onLoad();
    }
}

app.createComponent(TabSystemMessage);