if (!window.SmartReminder) window.SmartReminder = {};

SmartReminder.slider = function slider (options) {
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
};

SmartReminder.blockClass = function() {};
SmartReminder.blockClass.prototype = {
  mapEvents: function(events) {
    $.each(events || {}, function(event_selector, func) {
      var selector = event_selector.split(/\s+/);
      var event = selector.shift();
      var args = [event];
      if (selector.length) args.push(selector.join(' '));
      args.push(func.bind(this));
      this.element.on.apply(this.element, args);
    }.bind(this));

  },
  show: function() {
    this.element.show();
  },

  hide: function() {
    this.element.hide();
  },
  shown: function() {
    return this.element.is(':visible');
  },

  prepareData: function(data) { 
    return data;
  },

  render: function(data) {
    if (!data) data = {};
    this.data = this.prepareData(data);
    this.element.html(this.template(this.data));
    return this;
  }

};

SmartReminder.block = function block(id, events, data) {
  var b = new SmartReminder.blockClass();
  b.template = window.___sr_templates[id];
  b.element = $('<div id="smart_reminder__'+ id +'"></div');  
  b.hide(); 
  b.mapEvents(events);  
  b.render(data);
  $('body').append(b.element);
  return b;
};



SmartReminder.date = {};

SmartReminder.date.ms = {
  dayLong: 24 * 60 * 60 * 1000,

  day: function (date) {
    return (new Date(date)).setHours(0,0,0,0).valueOf();
  },

  today: function () {
    return this.day(Date.now());
  },

  diffDays: function(date, count) {
    return Number(date) + count * this.dayLong;
  },

  yesterday: function () {
    return this.diffDays(this.today(), -1);
  },

  tomorrow: function () {
    return this.diffDays(this.today(), +1);
  } 
};