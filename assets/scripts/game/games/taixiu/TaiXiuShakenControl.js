import app from 'app';
import ShakenControl from 'ShakenControl';

class TaiXiuShakenControl extends ShakenControl {
    constructor() {
        super();
    }
    
    reset() {
        super.reset();
    }
}

app.createComponent(TaiXiuShakenControl);