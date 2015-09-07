var page = self;


function getNewKey(callback){
  page.port.emit('get_key');
  page.port.on('get_key', function(data){
    callback(data);
  });
}

$(function() {
console.log('content loaded');

var REDIRECT_URL = 'http://smartreading.ru';
var TIME_PER_DAY = 300; //seconds

var windowInactive = false;
$(window).on('focus', function() {
   windowInactive = false; 
});
$(window).on('blur', function() { 
  windowInactive = true; 
});

function isSharer() {
  return window.location.href.split('/')[3]=='sharer'
}

var tabId;

var timer = SmartReminder.block('timer', {
  'click .head': function() {
    this.element.toggleClass('hidden-block');
  },

  'click .settings' : function() {
    settings.show();
  }
});


timer.start = function() {
  console.log('timer start');

  setTimeout(function() {
    if (!isSharer()){
      timer.element.slideDown();
    }
  }, 950);
  
  var timerPaused = function() {
    return settings.shown() ||
            congratulations.shown() || 
            confirm.shown() || 
            windowInactive  ||
            isSharer()
  }
  
  function confirmShow(today){
    if (today.time >= TIME_PER_DAY && !confirm.shown()) {
      confirm.render({ data: { day: today.day }});
      confirm.show();
    }
  }
  
  db.stats.today(function(today) {
    timer.render({ data: { time: TIME_PER_DAY - today.time }});
    confirmShow(today)
  })
  
  
  function onTimer(){
    if (!timerPaused()){
      db.stats.today(function(today) {
        today.time++;
        confirmShow(today)
      });
    }
  }
  
  this.timerId = setInterval(function() { 
    onTimer();
  }, 1000);
  
};

timer.stop = function() {
  clearInterval(this.timerId);
};




var windowEvents = {
  'click .close': function() {
    this.hide();
  },

  'click .bg': function() {
    this.hide();
  }
};


var settings = SmartReminder.block('settings', $.extend(windowEvents, { }));
settings.hide();
settings.show = function() {
  page.port.emit('ss_load');
  page.port.on('ss_load', function(ss){
    var data = ss.data;
    
    this.render({ data: data });
    this.element.show();
    
    SmartReminder.slider({ el: $('.sr-slider'), pageSize: 2 });
    
  }.bind(this));
};


var congratulations = SmartReminder.block('congratulations', $.extend(windowEvents, {
  'click .button.facebook': function() {
    getNewKey(function(key){
      congratulations.render({ data: { share: true, code: key }});      
    })
    //congratulations.render({ data: { share: true, code: '343434' }});
    // TODO fb share, then ->
      // TODO congratulations.render({ data: { share: true, code: '343434' }}); 
  },

  'click .button.copy': function() {
    var input = this.element.find('input');
    input[0].focus();
    input[0].select();
    document.execCommand( 'Copy' );
  }
}));

congratulations.prepareData = function(data) {
  data.data.clipboardSupport = !!document.execCommand;
  return data;
};


congratulations.show = function(){
  if (!isSharer()) {
    this.element.show();
  }
}
  
// congratulations.render({ data: { share: true, code: '343434' }}); 
// congratulations.show();
// congratulations.render({ data: { install: true }});


var confirm = SmartReminder.block('confirm', $.extend(windowEvents, {
  
  'click .button.green': function() {
    if (this.data.data.start) {
      db.stats.createToday({ time: 0, day: 1}).then(function() {
        timer.start();
      });
      this.hide();
    } else {
      //timer.stop();
      location.href = REDIRECT_URL;
    }
  },

  
  'click .button.red': function() {
    db.editSettings(function(settings) {
      settings.askNext = SmartReminder.date.ms.tomorrow();
    });

    this.hide();
  },
  
  'click .bg': function(){},
  'click .close': function(){}
  
}));



confirm.show = function() {
  db.editSettings(function(settings) {
    if (settings.askNext && settings.askNext > SmartReminder.date.ms.today()) {
      return;
    }

    this.element.find('.close').hide();
    this.element.show();
  }.bind(this));
};

console.log($.fn.jquery);

Dexie.Promise.on('error', function(err) {
    // Log to console or show en error indicator somewhere in your GUI...
    console.log("Uncaught error: " + err);
});

var db = new Dexie('SmartReminder');
db.version(1).stores({
  stats: '&id',
  settings: '&id'
});

  
  
function isToday (item) {
  return item.id == SmartReminder.date.ms.today();
}

function isYesterday (item) {
  return item.id == SmartReminder.date.ms.yesterday();
}

// collection on one item - today stats
db.stats.today = function(dataOrFunc) {
  var c = db.stats.filter(isToday);
  if (dataOrFunc) {
    return c.modify(dataOrFunc);
  } else {
    return c.first();
  }
};

// collection on one item - yesterday stats
db.stats.yesterday = function(dataOrFunc) {
  var c = db.stats.filter(isYesterday);
  if (dataOrFunc) {
    return c.modify(dataOrFunc);
  } else {
    return c.first();
  }
};

var getLastDay = function(callback){
  db.stats.toArray(function(arr){
    var last_day = {id:0, day:0};
    $.each(arr, function(index, val){
      if (val.id>last_day.id && val.id != SmartReminder.date.ms.today() && val.day!=0){
        last_day = val;
      }
    })
    callback(last_day);
  })
}
  
db.stats.createToday = function(data) {
  data.id = SmartReminder.date.ms.today();
  return db.stats.add(data);
};

// создаёт дни когда пользователь не заходил
db.stats.createEmptyDays = function(callback){
  db.stats.each(function(item, cursor){
    console.log(item, 'each')
  });
  db.settings.each(function(item, cursor){
    console.log(item, 'each2')
  });
  
  db.stats.toArray(function(arr){
    console.log(arr, 'db.stats.arr')
    var last_day = arr[arr.length-1];
    if (last_day) {
      var empty_days_count = SmartReminder.date.ms.betweenDays(last_day.id, SmartReminder.date.ms.today());
      if (empty_days_count>1){
        for (var i = 1; i < empty_days_count; i++) {
          data = {
            time: 0,
            //day: parseInt(last_day.day)+i,
            day: 0,
            id: SmartReminder.date.ms.diffDays(last_day.id, i)
          };
          db.stats.add(data).then(function(){
            if (i == empty_days_count){
              callback();
            }
          });
          console.log(data, 'new empty')
        }
      } else {
        callback();
      }
    } else {
      callback();
    }
  });
}

db.editSettings = function(dataOrFunc) {
  var c = db.settings.toCollection();
  if (dataOrFunc) {
    return c.modify(dataOrFunc);
  } else {
    return c.first();
  }
};


db.open()
  .catch(function(error){ console.log('Uh oh : ' + error); });

document.addEventListener('cleanDB', function(e) {
  db.settings.update('promo', {shown: false}).then(function(data){
    db.stats.clear();
    db.settings.clear();
    alert('База данных очищена.');
    location.href='';
  });
});
//document.dispatchEvent(new CustomEvent('cleanDB')) -- очистить базу

db.settings.get('main', function(data) {
  if (!data) db.settings.add({ id: 'main' });
});
  // .catch(function(error) { console.log('sdd', e) });
db.settings.get('promo', function(data) {
  if (!data) db.settings.add({ id: 'promo', shown:false });
});
  
db.stats.hook('creating', function (id, obj) {
  sync();
});

db.stats.hook('updating', function(mods, id, obj) {
  if (isToday(obj)) {
    if (mods.time) {
      timer.render({ data: { time: TIME_PER_DAY - mods.time }});      
    }
  }

  sync();
});

function sync() {
  db.stats.toArray(function(items) {
    // !!! browser specific
    page.port.emit('ss_save', { stats: items, test: 1 })
  });
}

db.stats.createEmptyDays(function(){
  Dexie.Promise.all(db.stats.yesterday(), db.stats.today(), db.editSettings()).then(function(results) {
    // console.log('?', results);
    console.log(results);
    //var yesterday = results[0] || {};
    var today = results[1] || {};
    var settings = results[2] || {};
    getLastDay(function(yesterday){
      console.log(yesterday, today, settings)
      console.log(SmartReminder.date.ms.today())

      if (today.time !== undefined) {
        timer.start();
      } else {
        if (yesterday.time !== undefined && yesterday.time <= TIME_PER_DAY) {
          congratulations.render({ data: { day: yesterday.day }});
          db.settings.get('promo', function(data) {
            if (!data.shown) {
              congratulations.show();
              console.log(yesterday.day, 'day');
              if (yesterday.day == 3) {
                db.settings.update('promo', {shown: true}).then(function(data){
                  console.log(data, 'data2')
                });
              }
            }
          });
          //if (yesterday.day != 3) {
          getLastDay(function(last_day){
            db.stats.createToday({ time: 0, day: yesterday.day + 1 }).then(function() {
              timer.start();
            });
          })
          //}
        } else {
          if (!settings.askNext || settings.askNext <= SmartReminder.date.ms.today()) {
            if (yesterday.day != undefined && yesterday.day<4) {
              confirm.render({ data: { start: true }});
              confirm.show();
            } else {
              db.stats.createToday({ time: 0, day: yesterday.day + 1 }).then(function() {
                timer.start();
              });
            }
          }
        }
      }
    })
  });
});

});
