/**
 * Created by Thanh on 9/5/2016.
 */

export default class ClickEvent {
    constructor() {
        // this.event = cc.EventListener.MOUSE
        this.event = cc.EventListener.TOUCH_ONE_BY_ONE;
        this.swallowTouches = true;
    }

    // onMouseMove(event){
    //     log("onMouseMove: ")
    //     log(event.getTarget());
    // }
    //
    // onMouseUp(event){
    //     log("onMouseMove: ")
    //     log(event.getTarget());
    // }
    //
    // onMouseDown(event){
    //     log("onMouseMove: ")
    //     log(event.getTarget());
    // }
    //
    // onMouseScroll(event){
    //     log("onMouseMove: ")
    //     log(event.getTarget());
    // }

    //onTouchBegan event callback function
    onTouchBegan (touch, event) {
        // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.
        var target = event.getCurrentTarget();

        //Get the position of the current point relative to the button
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        //Check the click area
        if (cc.rectContainsPoint(rect, locationInNode)) {
            cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
            target.opacity = 180;
            return true;
        }
        return false;
    }

    //Trigger when moving touch
    onTouchMoved (touch, event) {
        //Move the position of current button sprite
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
    }

    //Process the touch end event
    onTouchEnded (touch, event) {
        var target = event.getCurrentTarget();
        cc.log("sprite onTouchesEnded.. ");
        target.setOpacity(255);
        //Reset zOrder and the display sequence will change
        if (target == sprite2) {
            sprite1.setLocalZOrder(100);
        } else if (target == sprite1) {
            sprite1.setLocalZOrder(0);
        }
    }
}