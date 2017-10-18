import Component from 'Component';
import app from 'app';
import Events from 'GameEvents';

export default class VisibilityActor extends Component {
    constructor() {
        super();
    }
    
    onLoad() {
        super.onLoad();
        if(app.visibilityManager) {
            app.visibilityManager.addComponent(this);
            app.visibilityManager.checkVisible(this);
        }
    }
    
    onDestroy() {
        super.onDestroy();
        this._removeGlobalListener()
        app.visibilityManager && app.visibilityManager.removeComponent(this); 
    }
    
    // @abstract : the way behaves
    activateBehavior(node, state = false) {
        node && app.visibilityManager && app.visibilityManager.behavior(this, node, state);
    }
}