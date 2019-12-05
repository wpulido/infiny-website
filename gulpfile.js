const { src, task, watch, series, parallel, dest } = require("gulp");
const sass = require("gulp-sass");
const useref = require("gulp-useref");
const uglify = require("gulp-uglify");
const gulpIf = require("gulp-if");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const del = require("del");
const browserSync = require("browser-sync").create();

// Sass
function style(done) {
  src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(dest("app/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
  done();
}

task("style", style);

// Vendor
function vendor(done) {
  // Bootstrap
  src([
    "./node_modules/bootstrap/dist/**/*",
    "./node_modules/bootstrap/scss/**/*",
    "!./node_modules/bootstrap/dist/css/bootstrap-grid*",
    "!./node_modules/bootstrap/dist/css/bootstrap-reboot*"
  ]).pipe(dest("./app/vendor/bootstrap"));

  // Normalize
  src(["./node_modules/normalize.css/*.css"]).pipe(
    dest("./app/vendor/normalize")
  );

  // Animate
  src(["./node_modules/animate.css/*.css"]).pipe(dest("./app/vendor/animate"));

  // Font Awesome
  src(["./node_modules/@fortawesome/**/*"]).pipe(
    dest("./app/vendor/font-awesome")
  );

  // jQuery
  src([
    "./node_modules/jquery/dist/*",
    "!./node_modules/jquery/dist/core.js"
  ]).pipe(dest("./app/vendor/jquery"));

  // Popper
  src(["./node_modules/popper.js/dist/umd/*.js"]).pipe(
    dest("./app/vendor/popper")
  );
  done();
}

task("assets", vendor);

// BrowserSync
function browser_Sync(done) {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
  done();
}

task("browser_sync", browser_Sync);

// BrowserSync Reload
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

// Minifier & Uglifier
function minifier(done) {
  src("app/**/*.+(html|php)")
    .pipe(useref())
    .pipe(
      gulpIf(
        "*.js",
        uglify().on("error", function(e) {
          console.log(e);
        })
      )
        .pipe(gulpIf("*.css", cssnano()))
        .pipe(dest("dist"))
    );
  done();
}

task("minify", minifier);

// Images
function img(done) {
  src("app/images/**/*.+(png|jpg|gif|svg|webp)")
    .pipe(
      cache(
        imagemin({
          interlaced: true
        })
      )
    )
    .pipe(dest("dist/images"));
  done();
}

task("img", img);

// Fonts
function fonts(done) {
  src("app/fonts/**/*").pipe(dest("dist/fonts"));
  done();
}

task("fonts", fonts);

// Delete
function clean(done) {
  del.sync(["dist"]);
  done();
}

task("delete", clean);

// Watch
function watchFiles(done) {
  watch("app/scss/**/*.scss", style);
  watch("app/*.+(html|php)", browserSyncReload);
  watch("app/js/**/*.js", browserSyncReload);
  done();
}

task("watch", parallel(watchFiles, browser_Sync));

// Build
task("build", series(clean, parallel(style, minifier, fonts, img)));

// Default
task(
  "default",
  parallel(watchFiles, vendor, browser_Sync, style, minifier, fonts, img)
);
