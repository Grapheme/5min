
chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request, sender, sendResponse);
	return true;
});

var timer = SmartReminder.block('timer', { time: '99:99' });
timer.element.hide().slideDown();


console.log('content loaded/ /');