import app from 'app'
import Actor from 'Actor'
import TaiXiuTreoManager from 'TaiXiuTreoManager'

class SoiCauDialog extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            transparentBg: cc.Node,
            resultTable: cc.Graphics,
            diceTable: cc.Graphics,
            diceLayouts: {
                default: [],
                type: cc.Graphics
            },
            diceToggles: {
                default: [],
                type: cc.Toggle
            },
            tableLable: cc.Label,
            lastIdLbl: cc.Label,
            lastDice: cc.Label,
            lastText: cc.Label
        });
    }

    onLoad() {
        super.onLoad();
        this.transparentBg.on('touchstart', () => {});
        
        this._drawTable(this.resultTable, SoiCauDialog.RESULT_TABLE_STEP)
        this._drawTable(this.diceTable, SoiCauDialog.DICE_TABLE_STEP)
    }
    
    start() {
        super.start()
        
        app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_DICE_HISTORY})
    }
    onEnable() {
        super.onEnable()
    }
    
    onDestroy() {
        super.onDestroy()
    }
    
    _addGlobalListener() {
        super._addGlobalListener()
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_DICE_HISTORY, this._onTaiXiuDiceHistory, this);
    }

    _removeGlobalListener() {
       super._removeGlobalListener()
       app.system.removeListener(app.commands.MINIGAME_TAI_XIU_DICE_HISTORY, this._onTaiXiuDiceHistory, this);
    }
    
    _onTaiXiuDiceHistory(data) {
        let {histories, lastId} = data
        histories && this._draw(histories)
        lastId && (this.lastIdLbl.string = `#${lastId}`)
    }
    
    onCloseBtnClick() {
        this.node.destroy()    
    }
    
    onToggleClick(toggle) {
        let index = this.diceToggles.findIndex(t => t == toggle)
        ~index && (this.diceLayouts[index].node.active = toggle.isChecked)
    }
    
    _drawTable(ctx, step) {
        for(let i = 0; i <= SoiCauDialog.NUMBER_OF_ROWS; i++) {
            let from = cc.v2(0, i * SoiCauDialog.SIZE_OF_CELL)
            let to = cc.v2(cc.v2(SoiCauDialog.SIZE_OF_CELL * SoiCauDialog.NUMBER_OF_COLUMS, i * SoiCauDialog.SIZE_OF_CELL))
            this._createLine(ctx, from, to, SoiCauDialog.CELL_COLOR)
        }
        
        for(let j = 0; j <= SoiCauDialog.NUMBER_OF_COLUMS; j++) {
            let from = cc.v2(j * SoiCauDialog.SIZE_OF_CELL, 0) 
            let to = cc.v2(j * SoiCauDialog.SIZE_OF_CELL, SoiCauDialog.SIZE_OF_CELL * SoiCauDialog.NUMBER_OF_ROWS)
            this._createLine(ctx, from, to, SoiCauDialog.CELL_COLOR)
        }
        
        this._fillText(ctx.node, step)
        
        ctx.stroke()
    }
    
    _fillText(parent, step) {
        for(let i = 0; i <= SoiCauDialog.NUMBER_OF_ROWS; i++) {
            this.tableLable.string = step * (i + 1)
            let lbl = cc.instantiate(this.tableLable.node)
            lbl.active = true
            
            lbl.setAnchorPoint(1, 0)
            lbl.setPosition(-SoiCauDialog.SIZE_OF_CELL / 2, i * SoiCauDialog.SIZE_OF_CELL - 5)
            
            parent.addChild(lbl)
        }    
    }
    
    _draw(data) {
        if(!data || data.length < 1) 
            return 
            
        // result table
        this._fillPoints(this.resultTable, 
            data.map(ar => ar.reduce((a, b) => a + b, 0)), 
            SoiCauDialog.RESULT_TABLE_STEP,
            null,
            (ctx, values, points) => {
                let color1 = SoiCauDialog.XIU_COLOR
                let r1 = SoiCauDialog.POINT_RADIUS
                let color2 = null
                let r2 = null
                
                values.forEach((sum, i) => {
                    if(sum >= 11) {
                        color2 = SoiCauDialog.TAI_COLOR
                        r2 = SoiCauDialog.POINT_RADIUS - 1.5
                    }
                    let {x, y} = points[i]
                    if(i < values.length - 1) {
                        ctx.lineWidth = 1.5
                        this._createLine(ctx, points[i], points[i + 1], SoiCauDialog.LINE_COLOR)
                    }
                    ctx.lineWidth = 1
                    this._createPoint(ctx, x, y, color1, r1, r2, color2)
                })
            }
        )
        
        // dices table
        let dices = {}
        data.forEach(arr => {
            for(let i = 0; i < arr.length; i++) {
                if(!(i+1 in dices))
                    dices[i+1] = []
                    
                dices[i+1].push(arr[i])
            }
        })
        
        Object.keys(dices).forEach((key, i) => {
            this._fillPoints(this.diceLayouts[i], 
                dices[key],
                SoiCauDialog.DICE_TABLE_STEP,
                SoiCauDialog[`DICE_${key}_COLOR`],
                (ctx, values, points, color) => {
                    let radius = SoiCauDialog.DICE_RADIUS
                    values.forEach((v, i) => {
                        let {x, y} = points[i]
                        if(i < values.length - 1) {
                            ctx.lineWidth = 1.2
                            this._createLine(ctx, points[i], points[i + 1], color)
                        }
                        ctx.lineWidth = 1
                        this._createPoint(ctx, x, y, color, radius)
                    })
                }
            )
        })
        
        // last dice
        let lastDice = data[data.length - 1]
        if(lastDice && lastDice instanceof Array) {
            let sum = lastDice.reduce((a, b) => a + b, 0)
            this.lastDice.string = `${sum} (${lastDice.toString().replace(/,/g, '-')})`
            this.lastText.string = `${sum >= 11 ? 'Tài' : 'Xỉu'}`.toUpperCase()
        }
    }
    
    _fillPoints(ctx, values, step, color, cb) {
        // sprite    
        let points = values.map((sum, i) => {
            let x = i * SoiCauDialog.SIZE_OF_CELL
            let y = SoiCauDialog.SIZE_OF_CELL * (sum - step) / step
            
            return {x, y}
        })
        cb && cb(ctx, values, points, color)
    }
    
    _createPoint(ctx, x, y, color1, r1, r2, color2) {
        ctx.circle(x, y, r1)
        ctx.fillColor = color1
        ctx.fill()
        if(r2 && color2) {
            ctx.circle(x, y, r2)
            ctx.fillColor = color2
        }
        ctx.fill()
        ctx.stroke()
        ctx.close()
    }
    
    _createLine(ctx, u, v, color) {
        if(!v)
            return
            
        color && (ctx.strokeColor = color)
        ctx.moveTo(u.x, u.y)
        ctx.lineTo(v.x, v.y)
        ctx.stroke()
        ctx.close()
    }
}

SoiCauDialog.NUMBER_OF_ROWS = 5
SoiCauDialog.NUMBER_OF_COLUMS = 20
SoiCauDialog.SIZE_OF_CELL = 33 // 33x33

SoiCauDialog.POINT_RADIUS = 6.5
SoiCauDialog.DICE_RADIUS = 4.5

SoiCauDialog.RESULT_TABLE_STEP = 3 // minimum: 3, step: 3 => (3, 6, 9, 12...)
SoiCauDialog.DICE_TABLE_STEP = 1 // minimum: 1, step: 3 => (1, 2, 3, 4...)

SoiCauDialog.CELL_COLOR = new cc.Color(29, 59, 113)
SoiCauDialog.LINE_COLOR = new cc.Color(22, 111, 175)

SoiCauDialog.TAI_COLOR = cc.Color.BLACK
SoiCauDialog.XIU_COLOR = cc.Color.WHITE

SoiCauDialog.DICE_1_COLOR = cc.Color.GREEN
SoiCauDialog.DICE_2_COLOR = cc.Color.RED
SoiCauDialog.DICE_3_COLOR = cc.Color.ORANGE

app.createComponent(SoiCauDialog);