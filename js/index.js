var webSocket;
var webSocketConnected;
var currentJSONData;
var autoRefresh;

function tabClicked(contentType, element) {

    var i, n, tabbedContent, newContent;

    tabbedContent = document.getElementsByClassName("tabbedContent");
    for (n=0; n<tabbedContent.length; n++) {
        tabbedContent.item(n).style.display = "none";
    }
    console.log(Modernizr.svg)
    if (Modernizr.svg) {
        var svgElements, svgAltElements;
        svgElements = document.getElementsByTagName("svg")
        svgAltElements = document.getElementsByClassName("svgAlt")
        for (n = 0; n< svgElements.length; n++) {
            svgElements[n].style.display = "none";
        }
        for (n = 0; n < svgAltElements.length; n++) {
            svgAltElements[n].style.display = "inherit";
        }
    }

    if (contentType.toLowerCase() === "mapgps") {
        buttonPressed(element);
    }

    tabContent = document.getElementById(contentType);
    tabContent.style.display = "inherit";
}

function loadConnection() {
    webSocket = new WebSocket("ws://raspberrypi.local:8081");
    webSocket.onerror = function (err) {
        console.log('error: ', err);
    };
    webSocket.onopen = function() {
        console.log("Connected Websocket!");
        autoRefresh = setInterval(getData, 50);
    };
    webSocket.onclose = function() {
        console.log("Disconnected Websocket!");
        clearInterval(autoRefresh);
    }
    webSocket.onmessage = function (message) {
        console.log("recieved message: "+message.data.toString());
        saveJSONData(message.data);
    };
}

function getData() {
    webSocket.send("return");
}

function saveJSONData(message) {
    currentJSONData = JSON.parse(message);
}

function buttonPressed(element) {
    if (webSocket === null) {
        console.log("WEBSOCKET NOT CONNECTED!");
        loadConnection();
        return;
    }
    currentJSONData.moving_forward = false;
    currentJSONData.moving_backward = false;
    currentJSONData.moving_left = false;
    currentJSONData.moving_right = false;
    console.log("element: "+element.id);
    if (element.id.toLowerCase() === "leftButton") {
        currentJSONData.moving_left = true;
    } else if (element.id.toLowerCase() === "rightButton") {
        currentJSONData.moving_right = true;
    } else if (element.id.toLowerCase() === "upButton") {
        currentJSONData.moving_forward = true;
    } else if (element.id.toLowerCase() === "downButton") {
        currentJSONData.moving_backward = true;
    }
    console.log("edited JSON: "+JSON.stringify(currentJSONData));
    webSocket.send(JSON.stringify(currentJSONData));

}
