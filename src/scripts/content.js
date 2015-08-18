
chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request, sender, sendResponse);
	return true;
});


var time = 0;
// time++;
// timer.render({ time: time });

var timer = SmartReminder.block('timer');
timer.element.hide().slideDown();
timer.element.on('click', '.head', function() {
  timer.element.toggleClass('hidden-block');
});



console.log('content loaded');