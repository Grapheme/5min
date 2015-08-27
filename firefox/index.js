var data = require('sdk/self').data;

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "popup",
  label: "Smart Reminder",
  icon: {
    "16": "./images/icon-16.png",
    "32": "./images/icon-32.png",
    "64": "./images/icon-64.png",
  },
  onClick: handleClick
});

var popup = require("sdk/panel").Panel({
  width: 360,
  height: 450,
  contentURL: data.url("popup.html"),
  contentScriptFile: data.url("popup.js"),
  position: button
});

function handleClick(state) {
  popup.show()
}