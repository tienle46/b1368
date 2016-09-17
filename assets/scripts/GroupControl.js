// contains login / register
var app = require('app');
var LoginControl = require('LoginControl');
let RegisterControl = require('RegisterControl');
let RegisterControl2 = require('RegisterControl2');
let RegisterControl3 = require('RegisterControl3');


var a = new cc.Component();
// // var LoginControl = this.getComponent('LoginControl')
// // mix(a, LoginControl) // -> a.login() -> login.login() => "login ctronol" -> 
// // var RegisterControl = this.getComponent('RegisterControl')
// // mix(a, RegisterControl) // login/ register -> a.register() => "login', this.b"
// //     // a.login() => 'login b'
// console.log(a);
// console.log(Object.getPrototypeOf(new LoginControl()));
// console.log(Object.getOwnPropertyNames(new LoginControl()));
// var A = Object.assign({}, a, Object.getPrototypeOf(new LoginControl()));
// var L = new LoginControl();

// for (let key in A) {
//     if (typeof A[key] === 'function' && L[key] && typeof L[key] === 'function' && A[key] == L[key]) {
//         A[key] = A[key].bind(L);
//     }
// }

var R = new RegisterControl();
// var B = Object.assign({}, A, Object.getPrototypeOf(R));

// for (let key in B) {
//     if (typeof B[key] === 'function' && R[key] && typeof R[key] === 'function' && B[key] == R[key]) {
//         B[key] = B[key].bind(R);
//     }
// }
// console.debug(B);
// B.login();
// B.showA();
// B.register();



var Z = app.mixin(a, LoginControl, RegisterControl, RegisterControl2);
console.log(Z);
Z && Z.login();
Z && Z.showA();
Z && Z.register();
Z && R.register();

/**
 * properties trung name
 *  1/ neu la function thi goi thang truoc sau thang sau
 *  2/ neu !typeof func && !object -> replace
 */