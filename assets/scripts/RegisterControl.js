var app = require('app');
var Component = require('Component');

class RegisterControl extends Component {
    constructor() {
        super();
        this.b = "b";
    }

    login() {
        console.log('login b');
    }
    register() {
        console.log('register', this.b);
    }
}

app.createComponent(RegisterControl);