import app from 'app';
import Component from 'Component';
import moment from 'moment';
import Utils from 'Utils';

export default class JarComponent extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            remainTime: cc.Node,
            jarTotalMoney: cc.Label,
        }
    }
  
    onLoad() {
        super.onLoad();
    }
    
    init({id, remainTime, startTime, endTime, currentMoney} = {}) {
        this.remainTime.string = moment(remainTime).format('hh:mm:ss');
        
        console.debug(Utils.formatNumberType1());
        this.jarTotalMoney.string = currentMoney;
        this.node.active = true;
    }
}

app.createComponent(JarComponent);