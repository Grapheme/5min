function slider (options) {
  if (!options.pageSize) options.pageSize = 1;
  options.container = options.el.find('.container');
  options.items = options.container.find('.item');
  options.currentItem = 0;

  options.move = function (index) {
    if (index > this.items.length - 1) index = 0;
    if (index < 0) index = 0;

    this.currentItem = index;
    this.items.removeClass('active');
    this.items.eq(this.currentItem).addClass('active');
    var scrollTo = this.currentItem;
    if (this.items.length - this.currentItem < this.pageSize) scrollTo = this.items.length - this.pageSize;
    var pos = this.items.eq(scrollTo).position().left;
    this.container.stop().animate({ left: -pos });
  };

  options.el.find('.arrow').click(function(e) {
    var left = $(e.target).is('.left');
    this.move(left ? (this.currentItem - 1) : (this.currentItem + 1));
  }.bind(options));

  return options;
}


function view(id, data) {
  var block = {};
  block.template = window.___sr_templates[id];
  block.element = $('<div id="smart_reminder__'+ id +'"></div');
  block.render = function(data) {
    if (!data) data = {};
    this.element.html(this.template(data));
    return this;
  };
  $('body').append(block.render(data).element);
  return block;
}