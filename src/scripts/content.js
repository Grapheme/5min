chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request, sender, sendResponse);
	return true;
});


var t = window.___sr_templates['timer'];
$('body').append(t({ time: '999:999' }));


console.log('content loaded');