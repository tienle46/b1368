import app from 'app';

const url = `${app.const.DIALOG_DIR_PREFAB}/agency`;

const tabModels = [
    { title: 'Chuyển chip', prefabPath: `${url}/TransferMoney`, componentName: 'TabBuddyTransfer'},
    { title: 'Quy định', prefabPath: `${url}/PolicyMoney`, componentName: 'TabBuddyPolicy'},
];

export default class AgencyDialogRub {

    constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");
        
        this.multiTabPopup.changeToChatTab = this.changeToChatTab.bind(this);
    }
    
    changeToChatTab(data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(AgencyDialogRub.TAB_AGENCY_INDEX, data);
    } 
    
    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show(Object.assign({}, {parentNode, tabModels}, options));
    }
}

AgencyDialogRub.TAB_AGENCY_INDEX = 0;
AgencyDialogRub.TAB_POLICY_INDEX = 1;

