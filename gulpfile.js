const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");

// запуск сервера
gulp.task("server", function () {
   browserSync({
      server: {
         baseDir: "dist", //запуск оптимизированного сервера
      },
   });

   gulp.watch("src/*.html").on("change", browserSync.reload);
});
// обработка и формирование файлов
gulp.task("styles", function () {
   return gulp
      .src("src/sass/**/*.+(scss|sass)")
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(rename({ suffix: ".min", prefix: "" }))
      .pipe(autoprefixer())
      .pipe(cleanCSS({ compatibility: "ie8" }))
      .pipe(gulp.dest("dist/css")) // помещаем обработанный файл в dist
      .pipe(browserSync.stream());
});
// отслеживаем изменения в файлах
gulp.task("watch", function () {
   gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
   gulp.watch("src/*.html").on("change", gulp.parallel("html"));
});
// обработка html и помещение в dist
gulp.task("html", function () {
   return gulp
      .src("src/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("dist/"));
});
// перемешение скриптов в dist без изменений
gulp.task("scripts", function () {
   return gulp.src("src/js/**/*.js").pipe(gulp.dest("dist/js"));
});
// перемешение шрифтов в dist без изменений
gulp.task("fonts", function () {
   return gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});
// перемешение иконок в dist без изменений
gulp.task("icons", function () {
   return gulp.src("src/icons/**/*").pipe(gulp.dest("dist/icons"));
});
// перемешение mailer в dist без изменений
gulp.task("mailer", function () {
   return gulp.src("src/mailer/**/*").pipe(gulp.dest("dist/mailer"));
});
// перемешение картинок в dist со сжатием
gulp.task("images", function () {
   return gulp.src("src/img/**/*").pipe(imagemin()).pipe(gulp.dest("dist/img"));
});

// перезапуск styles при изменениях
gulp.task(
   "default",
   gulp.parallel(
      "watch",
      "server",
      "styles",
      "scripts",
      "fonts",
      "icons",
      "images",
      "mailer",
      "html"
   )
);
