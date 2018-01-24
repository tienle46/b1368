import BasePopup from 'BasePopup'
import SlotTopItem from 'SlotTopItem';


class SlotTopPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            container: cc.Node,
            itemPrefab: cc.Node
        });

    }
    onEnable() {
        super.onEnable();
        this.scheduleOnce(this.initValue, 0.2);
    }

    onDisable() {
        super.onDisable();

    }
    initValue() {
        const data = []
        for(let i=0;i<15;i++) {
            data.push({
                stt: i+1,
                username: `aneo${i}`,
                bet: 1000+i,
                win: 2000*i
            })
        }
        console.log(data)
        data.forEach(i=>{
            let item = cc.instantiate(this.itemPrefab)
            item.active = true
            item.getComponent(SlotTopItem).loadData(i)
            this.container.addChild(item)
        })
    }
}

app.createComponent(SlotTopPopup);
