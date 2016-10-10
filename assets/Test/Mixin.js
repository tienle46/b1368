// /**
//  * Created by Thanh on 9/14/2016.
//  */
//
// class A extends Component {
//     constructor(){
//         this.a = "a"
//     }
//
//     aFunc(){
//
//     }
// }
//
// class B {
//     constructor(){
//         this.b = "b"
//     }
//
//     bFunc(){
//     }
// }
//
// class B1 extends A {
//     constructor(){
//         super()
//         this.b = "b"
//     }
//
//     bFunc(){
//         log(this)
//     }
// }
//
// class C {
//     constructor(){
//         this.c = "c"
//     }
//
//     cFunc(){
//     }
// }
//
// class C1 extends A {
//     constructor(){
//         super()
//         this.c = "c"
//     }
//
//     cFunc(){
//         log(this)
//     }
// }
//
//
// function mixin(compnent1, component2){
//     //Mix all properties && function of component 2 => component 1
// }
//
// /**
//  * Result
//  */
//
// /**
//  * TH1
//  */
// let component
//
// let a = game.createComponent(A)
// //TODO Add a to scene
// component = a
//
// let b = game.createComponent(B)
// //TODO Add a to scene
// mixin(b1, b)
//
// /**
//  * TH2
//  */
// component = game.createComponent(B1)
// //TODO Add a to scene
//
// /**
//  * + Logic liên quan đến từ khóa this.* trong Component a, b vẫn hoạt động bình thường
//  * + Các giá trị và tham chiếu của properties vẫn giữ nguyên
//  * + Kết quả của C1 và C2 là như nhau (tạo ra một script component như nhau)
//  *
//  * - Tương tự với class C, C1
//  */
