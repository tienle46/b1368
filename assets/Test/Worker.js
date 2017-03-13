var session = null;

self.addEventListener("connect", function(e) {
    var port = e.ports[0];
    port.start();
    port.addEventListener("message", function(e) {

        if (e.data === "justTest") {
            if (session === null) {
                session = true;
                port.postMessage('trung bai cmnr');
            } else {
                port.postMessage('cccc');
            }
        }
    }, false);
}, false);