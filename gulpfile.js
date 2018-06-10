var gulp = require("gulp");
var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var htmlbuild = require("gulp-htmlbuild");


gulp.task("buildHtmlWeb", function() {
  gulp.src('src/index.html')
    .pipe(htmlbuild({
      js: htmlbuild.preprocess.js(function (block) {
        block.write('/js/main.min.js');
        block.end();
      }),
      css: htmlbuild.preprocess.css(function (block) {
        block.write('/css/custom.min.css');
        block.end();
      }),
      removeWeb: function (block) {
        block.end();
      }
    }))
    .pipe(minifyHtml())
    .pipe(gulp.dest('build/web'));
});

gulp.task("buildHtmlExt", function() {
  gulp.src('src/index.html')
    .pipe(htmlbuild({
      js: htmlbuild.preprocess.js(function (block) {
        block.write('/js/main.min.js');
        block.end();
      }),
      css: htmlbuild.preprocess.css(function (block) {
        block.write('/css/custom.min.css');
        block.end();
      }),
      removeExt: function (block) {
        block.end();
      }
    }))
    .pipe(minifyHtml())
    .pipe(gulp.dest('build/ext'));
});

gulp.task("buildCSS", function() {
  gulp.src([
    'src/css/bootstrap.min.css',
    'src/css/bootstrap-grid.min.css',
    'src/css/style.css',
  ])
   .pipe(concat("custom.min.css"))
   .pipe(minifyCss())
   .pipe(gulp.dest("build/web/css"))
   .pipe(gulp.dest("build/ext/css"));
});

gulp.task("buildJSWeb", function() {
  gulp.src([
    'src/js/jquery.min.js',
    'src/js/bootstrap.bundle.js',
    'src/js/URI.js',
    'src/js/script.js',
  ])
   .pipe(concat("main.min.js"))
   .pipe(uglify())
   .pipe(gulp.dest("build/web/js"));
});

gulp.task("buildJSExt", function() {
  gulp.src([
    'src/js/jquery.min.js',
    'src/js/bootstrap.bundle.js',
    'src/js/URI.js',
    'src/js/ext.js',
    'src/js/script.js',
  ])
   .pipe(concat("main.min.js"))
   .pipe(uglify())
   .pipe(gulp.dest("build/ext/js"));
});

gulp.task("copyRes", function() {
  gulp.src('./extension/**/*').pipe(gulp.dest("./build/ext"));
  gulp.src('./src/img/*').pipe(gulp.dest("./build/web/img"));
  gulp.src('./src/img/*').pipe(gulp.dest("./build/ext/img"));
  gulp.src('./src/favicon.ico').pipe(gulp.dest("./build/web"));
  gulp.src('./src/favicon.ico').pipe(gulp.dest("./build/ext"));
  //gulp.src('./build/web/css/custom.min.css').pipe(gulp.dest("./build/ext/css/custom.min.css"));
});

gulp.task("buildAll", ["buildHtmlWeb", "buildHtmlExt", "buildCSS", "copyRes", "buildJSWeb", "buildJSExt"]);
