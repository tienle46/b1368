export default class Rub {
    constructor(node) {
        this.node = node;
    }

    /**
     * add element to node. default this.prefab
     * 
     * @param {cc.Node || cc.Prefab} [element=null]
     * 
     * @memberOf Rub
     */
    addToNode(element = null) {
        this.node.addChild(element ? element : this.prefab);
    }
}