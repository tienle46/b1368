/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';

export default class MessageEvent{
    constructor({title, sub, nodeId} = {}){
        this.title = title;
        this.sub = sub;
        this.nodeId = nodeId;
    }
}