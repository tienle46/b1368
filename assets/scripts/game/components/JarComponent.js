import app from 'app';
import Component from 'Component';
import moment from 'moment';
import Utils from 'Utils';

export default class JarComponent extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            remainTime: cc.Label,
            jarTotalMoney: cc.Label,
        }
    }
  
    onLoad() {
        super.onLoad();
    }
    
    init({id, remainTime, startTime, endTime, currentMoney} = {}) {
        console.debug(id, remainTime, startTime, endTime, currentMoney)
        console.debug(moment(remainTime).format('hh:mm:ss'));
        this.remainTime.string = moment(remainTime).format('hh:mm:ss');
        
        console.debug(Utils.formatNumberType2(900000));
        this.jarTotalMoney.string = currentMoney;
        this.node.active = true;
    }
    
    onDestroy() {
        super.onDestroy();
        console.debug('onDestroy');
    }
}

app.createComponent(JarComponent);