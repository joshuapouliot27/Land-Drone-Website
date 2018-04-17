var webSocket;
var currentJSONData;
var autoRefresh;

function tabClicked(contentType, element) {

    var n, tabbedContent;

    tabbedContent = document.getElementsByClassName("tabbedContent");
    for (n=0; n<tabbedContent.length; n++) {
        tabbedContent.item(n).style.display = "none";
    }

    document.getElementById(contentType).style.display = "inherit";
}

function loadConnection() {
    webSocket = new WebSocket("ws://raspberrypi.local:8181");
    webSocket.onerror = function (err) {
        console.log('error: ', err);
    };
    webSocket.onopen = function() {
        getData();
        console.log("Connected Websocket!");
        autoRefresh = setInterval(getData, 500);
    };
    webSocket.onclose = function() {
        console.log("Disconnected Websocket!");
        clearInterval(autoRefresh);
    };
    webSocket.onmessage = function (message) {
        console.log("recieved message: "+message.data.toString());
        saveJSONData(message.data);
        setLabels();
    };
}

function getData() {
    console.log("fetching data");
    webSocket.send("return");
}

function setLabels() {
    var copyJSONData = JSON.parse(JSON.stringify(currentJSONData));
    document.getElementById("latitude_longitude").innerHTML
        = "Latitude: " + copyJSONData.current_latitude.toString() +
        ", Longitude: " + copyJSONData.current_longitude.toString();
    document.getElementById("distance_ahead").innerHTML =
        "Distance ahead: "+copyJSONData.current_distance_ahead.toString()+"ft";
    document.getElementById("direction").innerHTML
        = "Direction: "+copyJSONData.current_direction_degrees.toString()+"°";
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
    console.log("button, "+element.id.toString()+", pressed");
    if (element.id.toLowerCase() === "leftbutton") {
        editedJSONData.moving_forward = false;
        editedJSONData.moving_backward = false;
        editedJSONData.moving_right = false;
        if (editedJSONData.moving_left === true) {
            editedJSONData.moving_left = false;
        } else {
            editedJSONData.moving_left = true;
        }
    } else if (element.id.toLowerCase() === "rightbutton") {
        editedJSONData.moving_forward = false;
        editedJSONData.moving_backward = false;
        editedJSONData.moving_left = false;
        if (editedJSONData.moving_right === true) {
            editedJSONData.moving_right = false;
        } else {
            editedJSONData.moving_right = true;
        }
    } else if (element.id.toLowerCase() === "upbutton") {
        editedJSONData.moving_backward = false;
        editedJSONData.moving_left = false;
        editedJSONData.moving_right = false;
        if (editedJSONData.moving_forward === true) {
            editedJSONData.moving_forward = false;
        } else {
            editedJSONData.moving_forward = true;
        }
    } else if (element.id.toLowerCase() === "downbutton") {
        editedJSONData.moving_forward = false;
        editedJSONData.moving_left = false;
        editedJSONData.moving_right = false;
        if (editedJSONData.moving_backward === true) {
            editedJSONData.moving_backward = false;
        } else {
            editedJSONData.moving_backward = true;
        }
    } else if (element.id.toLowerCase() === "stopbutton") {
        if (editedJSONData.stop_everything === true) {
            editedJSONData.stop_everything = false;
        } else {
            editedJSONData.stop_everything = true;
        }
    } else if (element.id.toLowerCase() === "tabmanual") {
        editedJSONData.automated = false;
    } else if (element.id.toLowerCase() === "tabautomated") {
        editedJSONData.automated = true;
    }
    webSocket.send(JSON.stringify(editedJSONData));

}
