var app = require('app');

class RegisterControl {
    constructor() {
        this.r = "r";
    }
    login() {
        console.log('login r', this.r);
    }
}

class RegisterControl2 extends RegisterControl {
    constructor() {
        super();
        this.c = "c";
    }

    login() {
        console.log('login b2', this.c, this.r);
    }

    register() {
        console.log('register 2', this.r, this.c);
    }
}

app.createComponent(RegisterControl2);