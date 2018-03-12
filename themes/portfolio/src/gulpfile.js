'use strict';

const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const browserSync = require("browser-sync");
const runSequence = require("run-sequence");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

gulp.task("browserSync", () => {
  browserSync({
    server: {
      baseDir: "../dist/",
      index: "index.html"
    }
  });
});

gulp.task("reload", () => {
  browserSync.reload();
});

gulp.task("watch", () => {
  gulp.watch("./*.ejs", () => {
    runSequence("ejs" , "reload");
  });
  gulp.watch("./scss/**/*.scss", () => {
    runSequence("sass" , "reload");
  });
  gulp.watch("./js/**/*.js", () => {
    runSequence("reload");
  });
});

gulp.task("ejs", () => {
  gulp.src("./*.ejs")
  .pipe(ejs())
  .pipe(rename({
    extname: ".html"
  }))
  .pipe(gulp.dest("../dist"))
});

gulp.task("sass", () => {
  gulp.src("./scss/style.scss")
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ["last 2 version", "iOS >= 8.1" , "Android >= 4.4"],
    cascade: false
  }))
  .pipe(minify())
  .pipe(rename({
    extname: ".min.css"
  }))
  .pipe(gulp.dest("./"))
  .pipe(gulp.dest("../dist"))
});

gulp.task("default", ["browserSync" , "watch" , "ejs" , "sass"], () => {
  gulp.src("./img/**/*")
  .pipe(gulp.dest("../dist/img"))

  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("./"))
    .pipe(gulp.dest("../dist"))
});

//build for wordpress template
gulp.task("generate-wp-templates", () => {
  gulp.src("../dist/*.html")
  .pipe(rename({
    extname: ".php"
  }))
  .pipe(gulp.dest("../"))
});

gulp.task("copy-css-file", () => {
  gulp.src("../dist/style.min.css")
  .pipe(gulp.dest("../"))
});

gulp.task("copy-img-folder", () => {
  gulp.src("../dist/img/**/*")
  .pipe(gulp.dest("../img"))
});

gulp.task("build", ["generate-wp-templates" , "copy-css-file" , "copy-img-folder"], () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("../"))
});
