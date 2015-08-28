var data = require('sdk/self').data;
var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var pageMod = require('sdk/page-mod');
var ss = require("sdk/simple-storage");

ss.storage.data = ss.storage.data || { stats: [], test: 0 }

var button = buttons.ActionButton({
  id: 'popup',
  label: 'Smart Reminder',
  icon: {
    '16': './images/icon-16.png',
    '32': './images/icon-32.png',
    '64': './images/icon-64.png',
  },
  onClick: handleClick
});

console.log(ss.storage.data, 1);

var popup = require('sdk/panel').Panel({
  width: 360,
  height: 450,
  contentURL: data.url('popup.html'),
  contentStyleFile: [data.url('styles/popup.css'),],
  contentScriptFile: [
    data.url('scripts/vendor/jquery.js'), 
    data.url('scripts/vendor/jade-runtime.js'),
    data.url('templates.concat.js'),
    data.url('scripts/common.js'),
    data.url('scripts/popup.js'),
  ],
  position: button
});

function handleClick(state) {
  popup.show();
  popup.port.emit('ss', ss.storage);
}

pageMod.PageMod({
  include: ['*.facebook.com'],
  contentStyleFile: data.url('styles/content.css'),
  //contentScript: 'window.alert("Page matches ruleset");',
  contentScriptFile: [
    data.url("scripts/vendor/jquery.js"),
    data.url("scripts/vendor/jade-runtime.js"),
    data.url("scripts/vendor/indexeddb.shim.min.js"),
    data.url("scripts/vendor/Dexie.js"),
    data.url("templates.concat.js"),
    data.url("scripts/common.js"),
    data.url("scripts/content.js"),
  ],
  onAttach: function(worker) {
    worker.port.on('ss_save', function(data) {
      ss.storage.data = data;
      console.log('Save to SS', ss.storage.data);
    });
    worker.port.on('ss_load', function(){
      worker.port.emit("ss_load", ss.storage);
    });
  }
});