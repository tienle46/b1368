/**
 * Created by Thanh on 11/18/2016.
 */

export default class ArrayUtils {

    static clear(arr) {
        this.isArray(arr) && arr.splice(0, arr.length);
    }

    static isArray(arr) {
        return arr && (typeof arr == 'array');
    }

    static isEmpty(arr) {
        return !arr || arr.length == 0;
    }

    static findFirst(arr, findItem, equalsFn) {
        let index = this.findIndex(arr, findItem, equalsFn);
        return index >= 0 && arr[index];
    }

    /**
     *
     * @param {Array} arr
     * @param {Object} findItem
     * @param {function} equalsFn
     * @returns {number} index of finding item or -1 if not found
     */
    static findIndex(arr, findItem, equalsFn) {
        if (!arr || !findItem) return -1;

        let index = -1;
        if (equalsFn || findItem.equals) {
            equalsFn = equalsFn || ((obj1, obj2) => obj1.equals(obj2));
            arr.some((val, i) => {
                if (equalsFn(val, findItem)) {
                    index = i;
                    return true;
                }
            });
        } else {
            index = arr.indexOf(findItem);
        }
        
        return index;
    }

    /**
     *
     * @param {Array} arr
     * @param {any} removing
     * @param {function} equalsFn
     * @returns {Array} remove item has removed
     */
    static remove(arr, removing, equalsFn) {
        if(arr && arr.length > 0){
            let index = this.findIndex(arr, removing, equalsFn);
            if (index >= 0) {
                let removedObj = arr[index];
                arr.splice(index, 1);
                return removedObj;
            }
        }
    }

    /**
     *
     * @param {Array} arr
     * @param {Array} removingArr
     * @param {function} equalsFn
     * @returns {Array} remove items has removed
     */
    static removeAll(arr, removingArr, equalsFn) {
        if (!arr || !removingArr || removingArr.length == 0) return arr;

        let removedCards = [];
        let filteredArr = arr.filter(obj => {
            let index = this.findIndex(removingArr, obj, equalsFn);
            index >= 0 && removedCards.push(obj);
            return index < 0;
        });

        arr.splice(0, arr.length, ...filteredArr);

        return removedCards;
    }

    static swap(arr, index1, index2){
        if(!arr || index1 < 0 || index1 >= arr.length || index2 < 0 || index2 >= arr.length) return;

        let tmp = arr[index1]
        arr[index1] = arr[index2]
        index2 = tmp
    }

    /**
     *
     * @param {Array} arr
     * @param {any} checkObj
     * @param {function} equalsFn
     * @returns {boolean}
     */
    static contains(arr, checkObj, equalsFn) {
        return this.findIndex(arr, checkObj, equalsFn) >= 0;
    }

    /**
     *
     * @param {Array} arr
     * @param {Array} checkArr
     * @param {function} equalsFn
     * @returns {boolean} true if all item in checkArr has contains in arr
     */
    static containsAll(arr, checkArr, equalsFn) {

        if (!arr || !checkArr || arr.length < checkArr.length) return false;

        let containObjs = arr.filter(obj => this.findIndex(checkArr, obj, equalsFn) >= 0);
        return containObjs.length == checkArr.length;
    }

    /**
     *
     * @param {Array} arr
     * @param {Array} checkArr
     * @param (number} count
     * @param {function} equalsFn
     * @returns {boolean} true if some item in checkArr has contains in arr
     */
    static containsSome(arr, checkArr, count = 1, equalsFn) {
        let containCount = 0;
        let contain = false;
        arr.some(obj => {
            if (this.findIndex(checkArr, obj, equalsFn) >= 0 && ++containCount == count) {
                contain = true;
                return true;
            }
        });

        return contain;
    }
}