// function onInstalled() {
  // alert('onInstalled');
  // var manifest = chrome.runtime.getManifest();
  // var css = manifest.content_scripts[0].css;


  // var js = manifest.content_scripts[0].js;

  // getLastTab(function(tab) {
  //   js.forEach(function(f) {
  //     chrome.tabs.executeScript(null, {file: f });  
  //   });
  // });
// }

// chrome.runtime.onInstalled.addListener(onInstalled);




//слушатель для popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request);

  // if (request.message == 'onInstall') {
  //   onInstalled();
  // }

  // getLastTab(function(tab){
    //отправка в content.js
    // chrome.tabs.sendMessage(tab, {type: "test.test"}, function(response) {});    
  // });
  
  // chrome.runtime.reload();
});
  

function getLastTab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    callback(lastTabId);
  });
}

// console.log('backgroun loaded');

