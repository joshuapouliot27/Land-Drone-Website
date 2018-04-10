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
    var JSONData = JSON.parse("");
    JSONData.moving_forward = false;
    JSONData.moving_right = false;
    JSONData.moving_left = false;
    JSONData.moving_backward = false;
    JSONData.current_latitude = null;
    JSONData.current_longitude = null;
    JSONData.current_direction_degrees = null;
    JSONData.current_distance_ahead = null;
    JSONData.stop_everything = null;
    return JSONData;
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
    fs.writeFileSync(json_filename, JSON.parse(message).stringify())
}
