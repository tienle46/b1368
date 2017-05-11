/**
 * Created by Thanh on 5/11/2017.
 */

import app from 'app'

const blockConfig = {
    'invitePlayGame': {duration: 10000, message: app.res.string("message_block_invite_game_action", {time: "10s"})}
}

const lastActionTimes = {
    'invitePlayGame': 0
}

export default class ActionBlocker {

    static runAction(key, runFunc){

        if(!key){
            runFunc && runFunc()
        }else{

            let lastActionTime = lastActionTimes[key]
            let {duration, message} = blockConfig[key]
            let currentTime = new Date().getTime()


            if( lastActionTime == undefined || !duration || (currentTime - lastActionTime) >= duration){
                runFunc && runFunc();
                lastActionTimes[key] = currentTime;
            }else{
                message && app.system.showToast(message)
            }

        }
    }
}