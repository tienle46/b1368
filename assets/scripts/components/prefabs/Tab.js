/**
 * Tab - handling toggleGroup behaves as tabs
 * @params:
 *  + toggleGroup: Component which `toggleGroup.js` attached
 *  + bodies : The Array of Nodes represent for tab-body. Mapped with toggleGroup[checkBox]
 *  Example:
 *      + We have 4 tabs : ['A', 'B', 'C', 'D'] // => index [0, 1, 2, 3]
 *      => We need arranage our bodies (in cocos creator) with the same order. It means, Tab 'A' will display bodies[0] 
 * @actions:
 *  + onTabClick(checkBox): have to add to `Check Events` property in `CheckBox` Component so that content bodies will be appeared 
 */
var app = require('app');
var Component = require('Component');

class Tab extends Component {
    constructor() {
        super();

        this.toggleGroup = cc.Node;
        this.bodies = {
            default: [],
            type: cc.Node
        };
    }

    onLoad() {
        this.toggleGroupScript = this.toggleGroup.getComponent('ToggleGroup');
        // inactive all contents
        this._hideBody();
        // active tab content
        this._showBody(0);
    }

    onTabClick() {
        this._showBody(this.toggleGroupScript.getCheckedIndex());
    }


    _hideBody() {
        this.bodies.map((body) => {
            return body.active = false;
        });
    }

    _showBody(index) {
        this.bodies.map((body, i) => {
            return body.active = index === i;
        });
    }
}

app.createComponent(Tab);