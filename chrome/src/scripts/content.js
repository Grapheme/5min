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


// !!! chrome specific
var tabId;
chrome.runtime.sendMessage({ message: 'listenFocusChange' }, function(id) { tabId = id; });
chrome.runtime.onMessage.addListener(function(message) {
  windowInactive = message.focus;
  console.log(message);
});


// var Manifest = chrome.runtime.getManifest();
// console.log('sdsd', Manifest);
chrome.runtime.sendMessage({ message: 'getFile', path: 'styles/content.css' }, function(file) {
  var css = file.replace(/EXTENSION_PATH([^\"]*)/gm, function (m, m1) {
    return chrome.runtime.getURL(m1);
  });

  chrome.runtime.sendMessage({ message: 'insertCSS', css: css }, function() {});
});


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
    timer.element.slideDown();
  }, 950);
  
  var timerPaused = function() {
    return settings.shown() ||
            congratulations.shown() || 
            confirm.shown() || 
            windowInactive
  }
  
  db.stats.today(function(today) {
    timer.render({ data: { time: TIME_PER_DAY - today.time }});
    
    if (today.time >= TIME_PER_DAY) {
      confirm.render({ data: { day: today.day }});
      confirm.show();
    }
    
  })
  
  function onTimer(){
    db.stats.today(function(today) {
      
      if (!timerPaused()){
        //console.log(today.time)
        today.time++;
      }
    });
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
  chrome.storage.local.get({ stats: [], test: 0 }, function(data) {
    this.render({ data: data });
    this.element.show();
    
    SmartReminder.slider({ el: $('.sr-slider'), pageSize: 2 });

  }.bind(this));
};


var congratulations = SmartReminder.block('congratulations', $.extend(windowEvents, {
  'click .button.facebook': function() {
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

    this.element.show();
    this.element.find('.close').hide();
  }.bind(this));
};


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

db.stats.createToday = function(data) {
  data.id = SmartReminder.date.ms.today();
  return db.stats.add(data);
};


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

  db.stats.clear();
  db.settings.clear();


db.settings.get('main', function(data) {
  if (!data) db.settings.add({ id: 'main' });
});
  // .catch(function(error) { console.log('sdd', e) });

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
    // !!! chrome specific
    chrome.storage.local.set({ stats: items, test: 1 });
    // chrome.storage.local.set({ statsIds: items.map(function(i) { return i.id; }) });
  });
}


Dexie.Promise.all(db.stats.yesterday(), db.stats.today(), db.editSettings()).then(function(results) {
  // console.log('?', results);
  
  var yesterday = results[0] || {};
  var today = results[1] || {};
  var settings = results[2] || {};
  
  console.log(yesterday, today, settings)
  console.log(SmartReminder.date.ms.today())
  
  if (today.time) {
    timer.start();
  } else {
    if (yesterday.time && yesterday.time < TIME_PER_DAY) {
      congratulations.render({ data: { day: yesterday.day }});
      if (yesterday.day < 4) {
        congratulations.show();          
      }
      //if (yesterday.day != 3) {
        db.stats.createToday({ time: 0, day: yesterday.day + 1 }).then(function() {
          timer.start();  
        });
      //}
    } else {
      if (!settings.askNext || settings.askNext <= SmartReminder.date.ms.today()) {
        confirm.render({ data: { start: true }});
        confirm.show();
      }
    }
  }
});

});
