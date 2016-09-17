var app = require('app');
var Component = require('Component');

class LoginControl extends Component {
    constructor() {
        super();
        this.a = "a";
        this.x = "x";
    }

    login() {
        console.log('login a');
    }

    showA() {
        console.log('show a', this.a);
    }
}

app.createComponent(LoginControl);