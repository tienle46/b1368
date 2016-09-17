var game = require('game');

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
        console.log('register 2', this.b);
    }
}

class RegisterControl3 extends RegisterControl2 {
    constructor() {
        super();
        this.r3 = "r3";
    }

    login() {
        super.login();
        console.log('login b3');
    }
    register() {
        console.log('register 3', this.r3);
    }
}

game.createComponent(RegisterControl3);