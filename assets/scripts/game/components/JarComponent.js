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
        this.remainTime.string = moment(remainTime).format('hh:mm:ss');
        this.jarTotalMoney.string = currentMoney;
        this.node.active = true;
    }
    
    onDestroy() {
        super.onDestroy();
    }
}

app.createComponent(JarComponent);