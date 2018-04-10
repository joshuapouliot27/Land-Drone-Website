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
        getData();
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
    var editedJSONData = JSON.parse(JSON.stringify(currentJSONData));
    editedJSONData.moving_forward = false;
    editedJSONData.moving_backward = false;
    editedJSONData.moving_left = false;
    editedJSONData.moving_right = false;
    if (element.id.toLowerCase() === "leftbutton") {
        editedJSONData.moving_left = true;
    } else if (element.id.toLowerCase() === "rightbutton") {
        editedJSONData.moving_right = true;
    } else if (element.id.toLowerCase() === "upbutton") {
        editedJSONData.moving_forward = true;
    } else if (element.id.toLowerCase() === "downbutton") {
        editedJSONData.moving_backward = true;
        console.log(JSON.stringify(editedJSONData));
    }
    console.log(JSON.stringify(JSON.parse(JSON.stringify(editedJSONData))));
    console.log(JSON.stringify(editedJSONData));
    webSocket.send(JSON.stringify(editedJSONData));

}
