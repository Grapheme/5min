//background.js крутится всегда и один для всего браузера, умеет только слать сообщения на разные слои и слушать их.

//слушатель для popup.js
chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request);

  // getLastTab(function(tab){
    //отправка в content.js
    // chrome.tabs.sendMessage(tab, {type: "test.test"}, function(response) {});    
  // });
  
  chrome.runtime.reload();
  

});
  

function getLastTab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    callback(lastTabId);
  });
}

console.log('backgroun loaded');

