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

function getJSONData() {
    var JSONText = fs.readFileSync(json_filename).toString();
    var JSONData = JSON.parse(jsonText);
    return JSONData.stringify();
}

function saveJSONFile(message) {
    fs.writeFile(json_filename, JSON.parse(message).stringify())
}
