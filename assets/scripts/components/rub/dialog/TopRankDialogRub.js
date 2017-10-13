import app from 'app';

const url = `${app.const.DIALOG_DIR_PREFAB}/rank`;

const tabModels = [
    { title: 'Top VIP',prefabPath: `${url}/tab_top_vip`, componentName: 'TabTopVip'},
    { title: 'Top Cao thủ',prefabPath: `${url}/tab_top_cao_thu`, componentName: 'TabTopCaoThu'},
    { title: 'Top Đại gia',prefabPath: `${url}/tab_top_dai_gia`, componentName: 'TabTopDaiGia'}
];

export default class TopRankDialogRub {

    constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");

        this.multiTabPopup.changeToChatTab = this.changeToChatTab.bind(this);
        this.multiTabPopup.setTitle('Xếp hạng');
    }

    changeToChatTab(data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(TopRankDialogRub.TAB_TOP_VIP_INDEX, data);
    } 
    
    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show(Object.assign({}, {parentNode, tabModels}, options));
    }
}

TopRankDialogRub.TAB_TOP_VIP_INDEX = 0;
TopRankDialogRub.TAB_TOP_CAO_THU_INDEX = 1;
TopRankDialogRub.TAB_TOP_DAI_GIA_INDEX = 2;