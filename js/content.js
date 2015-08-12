//content.js (всё, что указано в content_scripts) имеет доступ к DOM и может слушать сообщения от background.js.


// слушатель для background.js
chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request, sender, sendResponse);
	return true;
});

///
console.log('content loaded');

var allowed_hosts = [
  'facebook.com',
  'www.facebook.com',
  'login.facebook.com',
  'www.login.facebook.com',
  'fbcdn.net',
  'www.fbcdn.net',
  'fbcdn.com',
  'www.fbcdn.com',
  'static.ak.fbcdn.net',
  'static.ak.connect.facebook.com',
  'connect.facebook.net',
  'www.connect.facebook.net',
  'apps.facebook.com'
]
  
$(function() {
  if ($.inArray(window.location.host, allowed_hosts) != -1) {
    alert('fb!')
  }
})