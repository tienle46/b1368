/**
 * Created by Thanh on 9/23/2016.
 */

export default class TLMNUtils {
    constructor() {

    }

    static checkPlayCard(cards, preCards){
        let valid = cards && cards.length > 0;
        !valid && console.warn("Card selected is null");

        if(valid){
            //TOD
        }

        return valid;
    }
}