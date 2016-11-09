let RubUtils = {
    loadRes: (resURL, isSpriteFrame = false) => {
        return new Promise((resolve, reject) => {
            function handler(err, prefab) {
                if (err)
                    reject(err);

                resolve(prefab);
            }

            if (isSpriteFrame) {
                cc.loader.loadRes(resURL, cc.SpriteFrame, handler);
            } else {
                cc.loader.loadRes(resURL, handler);
            }
        });
    },

    /**
     * @param spriteComponent: (cc.Component) sprite we need to add spriteFrame to
     * @param resURL: (string) resource url || image url we need to load before adding
     * @param ccSize: (cc.size), used to resize spriteFrame to slice image fit to current node ( node will be reset its size based on spriteFrame's size after adding )
     * @param cb: (function) callback function
     * @param isCORS: (boolean) if resURL is http protocol, it need to be `true`
     */
    loadSpriteFrame: (spriteComponent, resURL, ccSize = null, isCORS = false, cb) => {
        let textureCache;

        function spriteFrameDefaultConfig(spriteComponent) {
            spriteComponent.type = cc.Sprite.Type.SLICED;
            spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            ccSize && spriteComponent.node.setContentSize(ccSize);
            cb && cb(spriteComponent);
        }

        if (isCORS) {
            textureCache = cc.textureCache.addImage(resURL);
            let spriteFrame = new cc.SpriteFrame(textureCache);
            spriteComponent.spriteFrame = spriteFrame;
            spriteFrameDefaultConfig(spriteComponent);

        } else {
            return RubUtils.loadRes(resURL, true).then((spriteFrame) => {
                spriteFrame && (spriteComponent.spriteFrame = spriteFrame);
                spriteFrameDefaultConfig(spriteComponent);

            });
        }
    },
    calcWidthByGroup: (parentWidth, widths = [], spaceX = 0, padding = 0) => {
        // parentWidth -= 2 * padding;

        // ['', '10%', 30, '']
        widths = widths.map((width) => {
            let w;

            if (width) {
                if (!isNaN(Number(width))) {
                    w = Number(width);
                } else {
                    if (width.indexOf('%') > 0) {
                        w = Number(width.replace('%', '')) * parentWidth / 100;
                    } else
                        w = null;
                }
                if (w && w < 0)
                    w = null;
            } else
                w = null;

            return w;
        }); // => [null, 10*parentWidth/100, 30, null]

        // total width inside array
        let totalWidth = widths.reduce((p, n) => !isNaN(p) && (Number(p) + Number(n)), 0);

        // remaing array which cotains null -> ["", null...]
        let remains = widths.filter((e) => !isNaN(e) && Number(e) === 0).length;

        // remaining width for null array, it will be equally divided.
        let n = parentWidth > totalWidth ? parentWidth - totalWidth : 0;
        let equallyDivided = n / remains;

        return widths.map((e) => {
            let number = ((e === null && Number(e) === 0 && equallyDivided) || e) - spaceX - padding / widths.length;
            return number > 0 ? number : 0;
        });
    },
    /**
     * @param node {cc.Node} node where widget to be added
     * @param defaultValue: defaultValue of top and bottom align
     * @param opts {any}
     *  {
     *      top, left, bottom, right : number
     *      isOnBottom, isOnTop: boolean # node will not be resized when parent/its height's changed
     *      verticalCenter: boolean # when this property equals true, node will be align by verticalCenter to parent's height without using top and bottom
     *  }
     * @param isAlignOnce : boolean # default = false
     */
    addWidgetComponentToNode: (node, opts = {}, defaultValue = 10, isAlignOnce = false) => {
        let widget = node.getComponent(cc.Widget) || node.addComponent(cc.Widget);
        widget.isAlignOnce = isAlignOnce;

        widget.isAlignVerticalCenter = opts.verticalCenter || false;

        if (!opts.verticalCenter) {
            if (opts.hasOwnProperty('isOnBottom') || opts.hasOwnProperty('isOnTop')) {
                opts.isOnTop && (widget.isAlignTop = true) && (widget.top = opts.top || defaultValue);
                opts.isOnBottom && (widget.isAlignBottom = true) && (widget.bottom = opts.bottom || defaultValue);
            } else {
                if (opts.hasOwnProperty('top')) {
                    widget.isAlignTop = true;
                    widget.top = opts.top;
                }
                if (opts.hasOwnProperty('bottom')) {
                    widget.isAlignBottom = true;
                    widget.bottom = opts.bottom;
                }
            }
        } else {
            widget.verticalCenter = 0;
        }

        if (opts.hasOwnProperty('right')) {
            widget.isAlignRight = true;
            widget.right = opts.right;
        }

        if (opts.hasOwnProperty('left')) {
            widget.isAlignLeft = true;
            widget.left = opts.left;
        }
    }
};
export default RubUtils;