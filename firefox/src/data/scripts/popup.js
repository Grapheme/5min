var panel = self;

panel.port.on('ss', function(ss) {
  console.log(ss);
  
  $(function() {  
    var template = window.___sr_templates['popup_settings'];

      $('body').html(template({ data: ss.data }));
      SmartReminder.slider({ el: $('.sr-slider'), pageSize: 2 });
  });
  
});