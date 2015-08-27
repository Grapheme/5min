$(function() {  
  var template = window.___sr_templates['popup_settings'];

  chrome.storage.local.get({ stats: [], test: 0 }, function(data) {

    // console.log('sdsd', data);

    $('body').html(template({ data: data }));  
    SmartReminder.slider({ el: $('.sr-slider'), pageSize: 2 });
  });
});