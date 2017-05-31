import app from 'app';
import DialogActor from 'DialogActor';
import { destroy, active } from 'CCUtils';
import Utils from 'Utils';
import RubUtils from 'RubUtils';

export default class VipDialog extends DialogActor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            benefitContainerNode: cc.Node,
            benefitRowItem: cc.Node,
            benefitNameLbl: cc.Label,
            contentVipLbl: cc.Label,
            iconNode: cc.Node,
            type1Lbl: cc.Label,
            type2Lbl: cc.Label,
            type3Lbl: cc.Label,
            iconSprite: cc.Sprite
        });
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
        let contents = [];
        app.async.mapSeries(ids || [], (id, cb) => {
            let url = urls[index];
            
            RubUtils.loadSpriteFrame(this.iconSprite, url, null, true, (sprite) => {
                let iconNode = cc.instantiate(this.iconNode);
                contents.push(iconNode);
                
                index ++;
                if(index == ids.length && contents.length > 0) {
                    this._appendRowContent("Icon VIP", contents);
                    this._appendRowContent("Loại VIP", names);
                    names.forEach((name, index) => {
                        this[`type${index+1}Lbl`] && (this[`type${index+1}Lbl`].string = name);
                    })
                  
                    benefits.forEach(benefit => {
                        this._appendRowContent(benefit.name, Object.values(benefit.benefit));
                    });
                }
                
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
        
        // this._appendRowContent("Loại VIP", names);
        
        // benefits.forEach(benefit => {
        //     this._appendRowContent(benefit.name, Object.values(benefit.benefit));
        // });
    }
    
    _appendRowContent(title, contents) {
        this.benefitNameLbl.string = title;
        let row = cc.instantiate(this.benefitRowItem);
        
        contents.forEach((content, index) => {
            let node = content;
            let color = index == 0 ? VipDialog.COLOR_VIP1 : index == 1 ? VipDialog.COLOR_VIP2 : VipDialog.COLOR_VIP3;
            if(Utils.isString(content)) {
                // this.contentVipLbl.string = "";
                this.contentVipLbl.string = content;
                node = cc.instantiate(this.contentVipLbl.node);
            }
            node.active = true;
            node.color = color;
            
            row.addChild(node); 
        });
        row.active = true;
        this.benefitContainerNode.addChild(row);
    }
    
    onCloseBtnClick() {
        destroy(this.node);
    }
}

app.createComponent(VipDialog);

VipDialog.COLOR_VIP1 = new cc.Color(188, 255, 253);
VipDialog.COLOR_VIP2 = new cc.Color(255, 236, 8);
VipDialog.COLOR_VIP3 = new cc.Color(210, 62, 244);