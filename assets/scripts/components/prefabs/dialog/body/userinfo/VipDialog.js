import app from 'app';
import DialogActor from 'DialogActor';
import { destroy, active } from 'CCUtils';
import RubUtils from 'RubUtils';

export default class VipDialog extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            iconContainerNode: cc.Node,
            iconSprite: cc.Sprite,
            iconSpriteNode: cc.Node,
            benefitContainerNode: cc.Node,
            benefitRowItem: cc.Node,
            benefitNameLbl: cc.Label,
            contentVipLbl: cc.Label,
        };
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        app.service.send({
            cmd: app.commands.GET_VIP_BENEFIT
        });
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_VIP_BENEFIT, this._onGetVipBenefit, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_VIP_BENEFIT, this._onGetVipBenefit, this);
    }
    
    _onGetVipBenefit(data) {
        let {ids, urls, names, benefits} = data;
        
        let index = 0;
        app.async.mapSeries(ids || [], (id, cb) => {
            let url = urls[index];
            
            RubUtils.loadSpriteFrame(this.iconSprite, url, null, true, (sprite) => {
                let iconSpriteNode = cc.instantiate(this.iconSpriteNode);
                iconSpriteNode.active = true;
                
                this.iconContainerNode.addChild(iconSpriteNode);
                
                index ++;
                cb && cb();
            });
        });
        // (ids || []).forEach((id, index) => {
        //     let url = urls[index];
            
        //     RubUtils.loadSpriteFrame(this.iconSprite, url, null, true, (sprite) => {
        //         let iconSpriteNode = cc.instantiate(this.iconSpriteNode);
        //         iconSpriteNode.active = true;
                
        //         this.iconContainerNode.addChild(iconSpriteNode);
        //     });
        // });
        
        this._appendRowContent("Loại VIP", names);
        
        benefits.forEach(benefit => {
            this._appendRowContent(benefit.name, Object.values(benefit.benefit));
        });
    }
    
    _appendRowContent(title, contents) {
        this.benefitNameLbl.string = title;
        
        contents.forEach((content, index) => {
            this.contentVipLbl.string = "";
            this.contentVipLbl.string = content;
            let node = cc.instantiate(this.contentVipLbl.node);
            node.active = true;
            let color = index == 0 ? new cc.Color(188, 255, 253) : index == 1 ? new cc.Color(255, 236, 8) : new cc.Color(210, 62, 244);
            node.color = color;
            
            this.benefitRowItem.addChild(node); 
        });
          
        let row = cc.instantiate(this.benefitRowItem);
        row.active = true;
        this.benefitContainerNode.addChild(row);
    }
    
    onCloseBtnClick() {
        destroy(this.node);
    }
}

app.createComponent(VipDialog);