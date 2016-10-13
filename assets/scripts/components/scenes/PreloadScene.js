import app from 'app';
import Component from 'Component';
import LoaderRub from 'LoaderRub';
// import _ from 'lodash';

class PreloadScene extends Component {
    constructor() {
        super();
    }

    onLoad() {
        new LoaderRub(this.node, true).show();

        // progress bar
        // let progressBarNode = this.node.getChildByName('progressBar');
        // let progressBar = progressBarNode.getComponent(cc.ProgressBar);
        // let innerProgress = progressBarNode.getChildByName('bar');
        let endTime = 5; // 5s
        let counter = 0;
        let n = setInterval(() => {
            counter++;
            // progressBar.progress = (counter * _.random(1.97, 2.0, true)) / 100;
            // innerProgress.width = progressBar.progress * progressBarNode.width;
            if (counter == endTime * 10) {
                clearInterval(n);
                this.node.runAction(cc.sequence(
                    cc.fadeOut(0.8),
                    cc.callFunc(function() {
                        app.system.loadScene(app.const.scene.ENTRANCE_SCENE);
                    })
                ));
            }
        }, 100); // 1/10 s
        // cc.loader.load(resources, (completedCount, totalCount) => {
        //     var progress = (100 * completedCount / totalCount).toFixed(2);
        //     cc.log(progress + '%');
        //     cc.log(completedCount, totalCount);
        // }, (a) => {
        //     cc.log(a);
        //     cc.log('done');
        // });
    }
}

app.createComponent(PreloadScene);