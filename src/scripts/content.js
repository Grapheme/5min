(function() {

chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
  console.log(request, sender, sendResponse);
  return true;
});


var timer = SmartReminder.block('timer', {
  'click .head': function() {
    this.element.toggleClass('hidden-block');
  },

  'click .settings' : function() {
    console.log('sdsd', settings);
    settings.element.show();
  }
});

timer.element.hide().slideDown();
var time = 0;
// time++;
timer.render({ time: time });


var settings = SmartReminder.block('settings', {
  'click .close': function() {
    this.element.hide();
  },

  'click .bg': function() {
    this.element.hide();
  }
});

settings.element.hide();



})();

console.log('content loaded');