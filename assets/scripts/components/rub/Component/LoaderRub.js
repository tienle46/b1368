import RubUtils from 'RubUtils';
import Rub from 'Rub';

export default class LoaderRub extends Rub {
    constructor(node, opts = {}) {
        super(node);
        let defaultOptions = {
            position: cc.v2(0, 0)
        };
        this.options = Object.assign({}, defaultOptions, opts);
    }

    init() {
        let url = 'Common/spin_loader';
        return RubUtils.loadRes(url).then((prefab) => {
            this.prefab = cc.instantiate(prefab);
            this.circleNode = this.prefab.getChildByName('loader').getChildByName('circle');
            return null;
        }).then(() => {
            this._setRotateAction();
            return this;
        });
    }

    _setRotateAction() {
        let repeat = cc.repeatForever(cc.rotateBy(1.0, 360));
        this.circleNode.runAction(repeat);
    }

    _hideBackground() {
        let bgNode = this.prefab.getChildByName('bg');
        bgNode.active = false;
    }

    static show(node, opts = {}, showBg = true) {
        return new LoaderRub(node, opts).init().then((a) => {
            a.addToNode();

            console.log(showBg);
            if (!showBg) {
                console.log(showBg);
                a._hideBackground();
            }
        });
    }
}