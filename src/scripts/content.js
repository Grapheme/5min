(function() {
// console.log('content loaded');

// chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
//   console.log(request, sender, sendResponse);
//   return true;
// });


// chrome.runtime.sendMessage({ message: 'try innstall' });

chrome.storage.local.set({'value': 123456789}, function() {
  chrome.storage.local.get('value', function(item) {
    console.log('items', item.value);
  });
});



var timer = SmartReminder.block('timer', {
  'click .head': function() {
    this.element.toggleClass('hidden-block');
  },

  'click .settings' : function() {
    settings.element.show();
  }
});

timer.element.hide().slideDown();
var time = 100;

var timerId = setInterval(function() {
  time++;
  timer.render({ time: time });
}, 1000);




var windowEvents = {
  'click .close': function() {
    this.element.hide();
  },

  'click .bg': function() {
    this.element.hide();
  }
};

var settings = SmartReminder.block('settings', $.extend(windowEvents, { }));
// settings.element.hide();

var congratulations = SmartReminder.block('congratulations', $.extend(windowEvents, {
  //
}));
// congratulations.element.hide();

congratulations.render({ install: true });
// congratulations.render({ share: true });
// congratulations.render({ day: 1 });
// congratulations.render({ day: 2 });
// congratulations.render({ day: 3 });


var confirm = SmartReminder.block('confirm', $.extend(windowEvents, {
  //
}));
confirm.element.hide();
// confirm.render({ start: true });
// confirm.render({ day: 1 });
// confirm.render({ day: 2 });
// confirm.render({ day: 3 });




})();
