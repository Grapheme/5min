$(function() {
  // $('button').click(function(e){
  //   e.preventDefault();
  //   chrome.extension.sendMessage({type: "hello", msg: 'Привет Говно!'});
  // });
  
  SmartReminder.slider({ el: $('.sr-slider'), pageSize: 2 });
});