// function onInstalled() {
  // alert('onInstalled');
  // var manifest = chrome.runtime.getManifest();
  // var css = manifest.content_scripts[0].css;
  // var js = manifest.content_scripts[0].js;
// }

// chrome.runtime.onInstalled.addListener(onInstalled);


chrome.listenToFocusChanged = [];

chrome.tabs.onActivated.addListener(function(info) {  
  var tab;
  chome.lastTabId = info.tabId;

  for (var i=0; i < chrome.listenToFocusChanged.length; ++i) {
    tab = chrome.listenToFocusChanged[i];
    chrome.tabs.sendMessage(tab.tabId, { focused: info.tabId == tab.tabId && info.windowId == tab.windowId });
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) { 
  var tab, focused;
  chrome.tabs.getCurrent(function(currentTab) {
    for (var i=0; i < chrome.listenToFocusChanged.length; ++i) {
      tab = chrome.listenToFocusChanged[i];
      focused = windowId == tab.windowId && (currentTab ? currentTab.id : chrome.lastTabId) == tab.tabId;
      chrome.tabs.sendMessage(tab.tabId, { focused: focused });
    }    
  });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request);
  if (request.message == 'listenFocusChange') {
    chrome.listenToFocusChanged.push({ tabId: sender.tab.id, windowId: sender.tab.windowId });
    // sendResponse(sender.tab.id);
  }
});
  

// function getLastTab(callback) {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     lastTabId = tabs[0].id;
//     callback(lastTabId);
//   });
// }

// console.log('backgroun loaded');

