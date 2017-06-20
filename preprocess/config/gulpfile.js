"use strict";

const gulp       = require('gulp'),
      del        = require('del'),
      config     = require('./config.json'),
      publicPath = config.publicPath;

gulp.task('delete-builds', function () {
    return del([
        publicPath + '/dist/js/*',
        publicPath + '/dist/css/*',
        publicPath + '/dist/fonts/*',
        publicPath + '/dist/built/*',
        publicPath + '/resources/views/dist/*'
     ], {
        force: true,
        ignore: '.gitkeep'
    });
});

gulp.task('default', ['delete-builds']);