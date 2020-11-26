/*
# Uninstall previous Gulp installation and related packages, if any
$ npm rm gulp -g
$ npm rm gulp-cli -g
$ cd [your-project-dir/]
$ npm rm gulp --save-dev
$ npm rm gulp --save
$ npm rm gulp --save-optional
$ npm cache clean # for npm < v5

# Install the latest Gulp CLI tools globally
$ npm install --global gulp-cli

# Install Gulp 4 into your project as dev dependency
$ npm install gulp --save-dev

npm install

# Check the versions installed. Make sure your versions are not lower than shown.
$ gulp -v
*/
(() => {

  'use strict';

  const gulp = require('gulp');
  const browsersync   = require('browser-sync').create();
  const proxy = require('http-proxy-middleware');

  const files = [
    './*.html',
    './js/*.js',
    './js/*/*.js',
    './css/*.css'
  ];

  const jsonPlaceholderProxy = proxy(['/pessoa'], {
    target: 'http://localhost:8080',
    changeOrigin: true,
    logLevel: 'debug'
  });
  
  function watch (){
    browsersync.init({
      server: {
        baseDir: './',
        index: 'index.html',
        port: 3000,
        middleware: [jsonPlaceholderProxy]
      }
    });
  }
  
  gulp.watch(files).on('change', browsersync.reload);
  const dev = gulp.series(watch);

  exports.default = dev;

})();setTimeout