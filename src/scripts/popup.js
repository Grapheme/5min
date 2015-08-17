$(function() {
  // $('button').click(function(e){
  //   e.preventDefault();
  //   chrome.extension.sendMessage({type: "hello", msg: 'Привет Говно!'});
  // });
  

  slider($('.slider'));
});

function slider ($slider) {
  var container = $slider.find('.container');
  var items = container.find('.items');
  var currentItem = 0;

  function move(index) {
    // check current
    // container move animate
    // class active
  }

  // arrows
  $slider.find('.arrow').click(function() {
    var left = $(this).is('.left');
    move(left ? currentItem + 1 : currentItem - 1);
  });
}