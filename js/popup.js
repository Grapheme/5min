//popup.js обращается к DOM всплывающего окна и умеет слать сообщения в background.js

// отправка в background.js
//chrome.extension.sendMessage({type: "hello", msg: 'Привет Говно!'});


$(function() {
  $('button').click(function(e){
    e.preventDefault();
    chrome.extension.sendMessage({type: "hello", msg: 'Привет Говно!'});
  })
});