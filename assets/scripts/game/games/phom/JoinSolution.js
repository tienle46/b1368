/**
 * Created by Thanh on 11/11/2016.
 */

import PhomList from 'PhomList';

// export default class JoinSolution extends Array{
//     constructor(solution) {
//         super();

//         solution && this.push(...solution);
//     }

//     isEmpty(){
//         return this.length == 0;
//     }
    
//     push(node) {
//         this.push(node)
//     }
    
//     addNode(node) {
//         this.push(node);
//     }

//     removeNodeAt(index) {
//         this.splice(index, 1);
//     }

//     value() {
//         let value = this.length * 1000;
//         let phomIds = [];

//         this.forEach(node => {
//             if (phomIds.indexOf(node.phomId) < 0) {
//                 phomIds.push(node.phomId);
//             }
//             value += node.card.rank;
//         });

//         value += phomIds.length * 100;

//         return value;
//     }

//     equals(solution) {
//         let isSame = false;

//         if (this.length == solution.length) {
//             isSame = true;

//             solution && solution.some(node => {
//                 let bValue = node.value();
//                 let indexOfCard = -1;
//                 this.some((node, k) => {
//                     if (bValue == node.value()) {
//                         indexOfCard = k;
//                         return true;
//                     }
//                 });

//                 if (indexOfCard == -1) {
//                     isSame = false;
//                     return true;
//                 }
//             });
//         }

//         return isSame;
//     }

//     static sortSolution(solutions) {
//         solutions.sort((solution1, solution2) => {
//             return solution2.value() - solution1.value();
//         });
//     }

//     /**
//      *
//      * @param solutions Array
//      */
//     static removeSubSolution(solutions) {
//         if (solutions.length > 0) {
//             let bestSolutionSize = solutions[0].length;

//             for (let i = solutions.length - 1; i > 0; i--) {
//                 if (solutions[i].length < bestSolutionSize) {
//                     solutions.splice(i, 1);
//                 }
//             }
//         }
//     }

//     static removeEmptySolution(solutions) {
//         if (solutions.length > 0) {
//             for (let i = solutions.length - 1; i >= 0; i--) {
//                 if (solutions[i] == 0) {
//                     solutions.splice(i, 1);
//                 }
//             }
//         }
//     }

//     getPhomList(phoms) {
//         let pl = new PhomList();
//         let phomIds = []
//         this.solutions.forEach(node => {
//             if (phomIds.indexOf(node.phomId) == -1) {
//                 pl.push(phoms[node.phomId]);
//                 phomIds.push(node.phomId);
//             }
//         });
//         return pl;
//     }
// }

export default class JoinSolution {
    constructor(solution) {
        this.solutions = [];
        
        solution && this.solutions.push(...solution);
    }
    
    get length() {
        return this.solutions.length;    
    }
    
    isEmpty(){
        return this.solutions.length == 0;
    }
    
    push(node) {
        this.solutions.push(node)
    }
    
    addNode(node) {
        this.push(node);
    }
    
    splice(start, count) {
        this.solutions.splice(start, count);    
    }
    
    some(cb) {
        return this.solutions.some(cb);    
    }
    
    forEach(cb) {
        this.solutions.forEach(cb);
    }
    
    map(cb) {
        return this.solutions.map(cb);
    }
    
    filter(cb) {
        return this.solutions.filter(cb);
    }
    
    sort(cb) {
       return this.solutions.sort(cb); 
    }
    
    removeNodeAt(index) {
        this.splice(index, 1);
    }
    
    indexOf(item) {
        return this.solutions.indexOf(item);
    }

    value() {
        let value = this.solutions.length * 1000;
        let phomIds = [];

        this.solutions.forEach(node => {
            if (phomIds.indexOf(node.phomId) < 0) {
                phomIds.push(node.phomId);
            }
            value += node.card.rank;
        });

        value += phomIds.length * 100;

        return value;
    }
    
    getSolutions() {
        return this.solutions;
    }
    
    equals(solutions) {
        let isSame = false;

        if (this.length == solutions.length) {
            isSame = true;

            solutions && solutions.some(node => {
                let bValue = node.value();
                let indexOfCard = -1;
                this.some((node, k) => {
                    if (bValue == node.value()) {
                        indexOfCard = k;
                        return true;
                    }
                });

                if (indexOfCard == -1) {
                    isSame = false;
                    return true;
                }
            });
        }

        return isSame;
    }
    
    // [solutions]
    static sortSolution(solutions) {
        solutions.sort((solution1, solution2) => {
            return solution2.value() - solution1.value();
        });
    }

    /**
     *
     * @param solutions Array
     */
    static removeSubSolution(solutions) {
        if (solutions.length > 0) {
            let bestSolutionSize = solutions[0].getSolutions().length;

            for (let i = solutions.length - 1; i > 0; i--) {
                if (solutions[i].getSolutions().length < bestSolutionSize) {
                    solutions.splice(i, 1);
                }
            }
        }
    }

    static removeEmptySolution(solutions) {
        if (solutions.length > 0) {
            for (let i = solutions.length - 1; i >= 0; i--) {
                if (solutions[i].getSolutions().length == 0) {
                    solutions.splice(i, 1);
                }
            }
        }
    }

    getPhomList(phoms) {
        let pl = new PhomList();
        let phomIds = []
        this.solutions.forEach(node => {
            if (phomIds.indexOf(node.phomId) == -1) {
                pl.push(phoms[node.phomId]);
                phomIds.push(node.phomId);
            }
        });
        return pl;
    }
}