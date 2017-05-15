/**
 * Created by Thanh on 5/11/2017.
 */

import app from 'app'

/**
 * @blockConfig
 *      + keyMessage is key used in app.res.string(key) and it MUST have `time` as a parameter
 *      + duration : time between twice actions
 */
const blockConfig = {
    'invitePlayGame': {duration: 10*1000, keyMessage: "message_block_invite_game_action"},
    'userWithdrawal': {duration: 20*60*1000, keyMessage: "message_block_exchange_card_action"},
}

/**
 * managed by username as a namespace, with the same key in blockConfig
 * Ex:
 * lastActionTimes = {
 *      username1: {
 *          invitePlayGame: 0,
 *          userWithdrawal: 1234,
 *      }, ...
 * }
 */
const lastActionTimes = {
    
}

// return user readable data based on millisecond
function timeMeansurementFromMillisecond(duration) {
    duration = duration/1000;
    let seconds= Math.floor(duration % 60),
        minutes=  Math.floor(duration/60 % 60),
        hours= Math.floor(duration/(60*60) % 24);
    
    return (hours > 0 ? `${hours}h ${minutes > 0 ? minutes +'p': ''}` : minutes > 0 ? `${minutes}p ${seconds > 0 ? seconds +'s': ''}` : `${seconds}s`).trim();
}

export default class ActionBlocker {

    static runAction(key, runFunc){

        if(!key){
            runFunc && runFunc()
        }else{
            let username = app.context.getMyInfo() ? app.context.getMyInfo().name : null;
            if(username) {
                if(!lastActionTimes[username])
                    lastActionTimes[username] = {};
                if(!lastActionTimes[username].hasOwnProperty(key))
                    lastActionTimes[username][key] = 0;
                let lastActionTime = lastActionTimes[username][key]
                let {duration, keyMessage} = blockConfig[key]
                let message = app.res.string(keyMessage, {time: timeMeansurementFromMillisecond(duration)})
                let currentTime = new Date().getTime()


                if( lastActionTime == undefined || !duration || (currentTime - lastActionTime) >= duration){
                    runFunc && runFunc();
                    lastActionTimes[username][key] = currentTime;
                } else {
                    message && app.system.showToast(message)
                }
            }

        }
    }
    
    /**
     * @param {object} blockConfig 
     * 
     * @memberof ActionBlocker
     */
    static onClientConfigChanged(blockConfig) {
        for(var key in blockConfig) {
            blockConfig[key] && (blockConfig[key]['duration'] = blockConfig[key]);
        }
    }
    
    static resetLastTime(key) {
        let username = app.context.getMyInfo() ? app.context.getMyInfo().name : null;
        if(username) {
            lastActionTimes[username][key] = 0;
        }
    }
}

ActionBlocker.USER_WITHDRAWAL = "userWithdrawal";