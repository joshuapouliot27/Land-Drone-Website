'use strict';

var fs = require('fs');
var json_filename = "land_drone.JSON"

const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8081});

wss.on('connection', function(ws) {
   ws.on('message', function(message) {
       if (checkMessage(message)) {
           ws.send(getJSONData());
       }
   })
});

function checkMessage(message) {
    if (message.toLowerCase() === "return") {
        return true;
    }
    saveJSONFile(message);
    return false;
}

function makeEmptyJSON() {
    var JSONObj = {
        moving_forward: false,
        moving_right: false,
        moving_left: false,
        moving_backward: false,
        current_latitude: null,
        current_longitude: null,
        current_direction_degrees: null,
        current_distance_ahead: null,
        stop_everything: null
    }
    var JSONArray = [];
    JSONArray.push(JSONObj);
    return JSON.stringify(JSONArray);
}

function getJSONData() {
    if (!fs.existsSync(json_filename)) {
        saveJSONFile(makeEmptyJSON());
    }
    var JSONText = fs.readFileSync(json_filename).toString();
    var JSONData = JSON.parse(jsonText);
    return JSONData.stringify();
}

function saveJSONFile(message) {
    JSONObj = JSON.parse(message);
    JSONStr = JSONObj.stringify();
    fs.writeFileSync(json_filename, JSONStr);
}
