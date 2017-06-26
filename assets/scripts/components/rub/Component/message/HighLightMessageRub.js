/**
 * Currently HighLightMessageRub just only contains messages get from responsed server command "hm" 
 * 
 * @export
 * @class HighLightMessageRub
 */
export default class HighLightMessageRub {
    constructor() {
        this.messages = [];
    }

    pushMessage(message) {
        this.messages.push(message);
    }

    getMessages() {
        return this.messages;
    }

    getMessage() {
        return this.messages.shift();
    }
    
    getLastMessage() {
        return this.messages[this.messages.length - 1];
    }
}