# This folder contains outgame message contents
The contents saved in objects with [key,value] represent to [errorCode, content], inside its "language" properties
Example: 
    Object["vi"] = {
        /* ERROR CODE SENT FROM SERVER */
        errorCode: content
        // sometimes errorCode represents for an object
        errorCode: {
            child_code: ....
        }
        /* ERROR CODE SELF-DEFINED. */
        // Convention: 4xx is error code from user inputs, 2xx is code for notification
        "4xx" : content,
        "2xx" : content
        // or an unique key
        "unique": content
    }