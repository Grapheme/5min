var gulp = require('gulp');
var watch = require('gulp-watch');

var connect = require('gulp-connect');
// var open = require('gulp-open');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
// var gulpIgnore = require('gulp-ignore');
var concat = require('gulp-concat');
// var prefix = require('gulp-autoprefixer');
// var bowerMain = require('bower-main');
// var rev = require('gulp-rev');
var plumber = require('gulp-plumber');
var wrap = require("gulp-wrap");
var preprocess = require('gulp-preprocess');
// var useref = require('gulp-useref');

var pem = require('pem');
var cors = require('cors');

var Project = {
  build: { path: './build' },
  src: { path: './src' }
};

Project.src.scripts = [Project.src.path + '/data/scripts/**/*.js'];
Project.src.mainjs = [Project.src.path + '/main.js'];
Project.src.views = [Project.src.path + '/data/views/*.jade'];


Project.src.styles = [Project.src.path + '/data/styles/**/*.scss'];
Project.src.sassFiles = [
  Project.src.path + '/data/styles/popup.scss',
  Project.src.path + '/data/styles/content.scss'
];

// Project.src.mainSass = 
Project.src.fonts = Project.src.path + '/data/fonts/**/*';
Project.src.images = Project.src.path + '/data/images/**/*';

Project.src.templates = Project.src.path + '/data/views/templates/**/*';

Project.src.static = [Project.src.fonts, Project.src.images, Project.src.path + '/*.json'];

Project.build.views = Project.build.path + '/data/';
Project.build.index = Project.build.views + '/index.html';
Project.build.scripts = Project.build.path + '/data/scripts';
Project.build.mainjs = Project.build.path;
Project.build.styles = Project.build.path + '/data/styles';
Project.build.fonts = Project.build.path + '/data/fonts';
Project.build.images = Project.build.path + '/data/images';
Project.build.templates = Project.build.path;


var server_options = {
  root: Project.build.path,
  // livereload: true,
  // port: 8888,
  // https: true,
  // middleware: function() {
  //   return [cors()];
  // },
};

var DEV_SERVER_URL =  '//localhost:' + server_options.port + '/';

gulp.task('server', function() {
  pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
    server_options.key = keys.serviceKey; 
    server_options.cert = keys.certificate;
    connect.server(server_options);
  });

  // connect.server(server_options);
//   gulp.src(Project.build.index)
//     .pipe(open('', { url: DEV_SERVER_URL }));
});



gulp.task('scripts', function() {
  return gulp.src(Project.src.scripts)
    // .pipe(concat('main.concat.js'))
    .pipe(gulp.dest(Project.build.scripts));
    // .pipe(connect.reload());
    // .pipe(rev.manifest())
    // .pipe(gulp.dest(app_path));
});

gulp.task('mainjs', function() {
  return gulp.src(Project.src.mainjs)
    .pipe(gulp.dest(Project.build.mainjs));
});

gulp.task('jade', function() {
  // var assets = useref.assets();
  
  return gulp.src(Project.src.views)
    .pipe(plumber())
    .pipe(jade({
      locals: {
        // hahaha: true
      },
      pretty: true
    }))

    // .pipe(assets)
    // .pipe(gulpif('*.js', uglify()))
    // .pipe(gulpif('*.css', minifyCss()))
    // .pipe(assets.restore())
    // .pipe(useref())

    .pipe(gulp.dest(Project.build.views));
    // .pipe(connect.reload());
});

gulp.task('client_templates', function() {
  return gulp.src(Project.src.templates)
    .pipe(plumber())
    .pipe(jade({
      client: true
    }))
    .pipe(wrap({ src: 'src/data/views/template_wrapper.txt' }))
    .pipe(concat('templates.concat.js'))
    .pipe(gulp.dest(Project.build.views));
});


gulp.task('sass', function () {
  gulp.src(Project.src.sassFiles)
    .pipe(preprocess({context: { DEV_SERVER: DEV_SERVER_URL }}))
    .pipe(sass.sync().on('error', sass.logError))
    // .pipe(prefix("last 3 version", "> 1%", "ie 8"))
    .pipe(gulp.dest(Project.build.styles));
    // .pipe(connect.reload());


});

gulp.task('copy_static', function () {
  gulp.src(Project.src.fonts)
   .pipe(gulp.dest(Project.build.fonts));

  gulp.src(Project.src.images)
   .pipe(gulp.dest(Project.build.images));

  gulp.src(Project.src.path + '/*.json')
   .pipe(gulp.dest(Project.build.path));

  // var js_components = [
  //   'jquery/dist/jquery.js',
  //   'perfect-scrollbar/js/perfect-scrollbar.jquery.js',
  //   'bxslider-4/dist/jquery.bxslider.js'
  // ];

  // gulp.src(js_components.map(function(i) {
  //   return Project.src.path + '/components/' + i;    
  // })).pipe(gulp.dest(Project.build.scripts + '/components'));

});

gulp.task('watch', function() {
  watch(Project.src.views, function () { 
    gulp.run('jade');
  });
  watch(Project.src.styles, function () { 
    gulp.run('sass');
  });
  watch(Project.src.scripts, function () { 
    gulp.run('scripts');
  });
  watch(Project.src.mainjs, function () { 
    gulp.run('mainjs');
  });
  watch(Project.src.static, function () { 
    gulp.run('copy_static');
  });

  watch(Project.src.templates, function () { 
    gulp.run('client_templates');
  });


});

var DEPLOY = false;
gulp.task('deploy', function() {
  DEPLOY = true;
  gulp.run('build');
  console.log('no deploy options specified 😒');
});

gulp.task('build', ['scripts', 'sass', 'mainjs', 'copy_static', 'client_templates', 'jade']);

gulp.task('default', [ 'build', 'watch', 'server']);