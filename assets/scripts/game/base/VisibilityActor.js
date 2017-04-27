import Component from 'Component';
import app from 'app';

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
    
    onEnable() {
        super.onEnable();
    }
    
    onDestroy() {
        super.onDestroy();
        app.visibilityManager && app.visibilityManager.removeComponent(this); 
    }
    
    // @abstract : the way behaves
    activateBehavior(node, state = false) {
        node && app.visibilityManager && app.visibilityManager.behavior(this, node, state);
    }
}