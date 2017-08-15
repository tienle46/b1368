import app from 'app';
import GameBetContainerButton from 'GameBetContainerButton';

// OLD
// export const betTypeNameToIdMap = {
//     even: 1,
//     odd: 2,
//     fourWhite: 3,
//     fourRed: 4,
//     threeWhite: 5,
//     threeRed: 6
// }
// OLD
// export const betTypeIdToNameMap = {
//     1: 'even',
//     2: 'odd',
//     3: 'fourWhite',
//     4: 'fourRed',
//     5: 'threeWhite',
//     6: 'threeRed',
// }

class XocDiaBetContainerButton extends GameBetContainerButton {
    constructor() {
        super();
        
        // 1: 'even',
        // 2: 'odd',
        // 3: 'fourWhite',
        // 4: 'fourRed',
        // 5: 'threeWhite',
        // 6: 'threeRed',
        this.betTypeIdsMap = [1, 2, 3, 4, 5, 6]
    }
    
    //override
    doesBetTypeIdWin(id, dots) {
        // trắng: chẵn, đỏ: lẻ
        // id -> 1: Chẵn, 2: Lẻ, 3: 4 Trắng, 4: 4 Đỏ, 5: 3 Trắng 1 Đỏ, 6: 3 Đỏ 1 Trắng
        // even : [0, 0, 0, 0] || [1, 1, 1, 1] || [0, 0, 1, 1]
        let odds = dots.filter(dot => dot === 1).length;
        let evens = dots.filter(dot => dot === 0).length;

        let minus = Math.abs(evens - odds);

        let resultIsEven = (minus === 4 || minus === 0);

        let acceptedEven = resultIsEven && (id === 1 || (evens === 4 && id === 3) || (odds === 4 && id === 4));
        let acceptedOdd = (!resultIsEven) && (id === 2 || (evens === 3 && id === 5) || (odds === 3 && id === 6));

        return acceptedEven || acceptedOdd;
    }
}

app.createComponent(XocDiaBetContainerButton);