module.exports = function (config) {

  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai'],
    files: [
      // Dependencies & libraries
      'chromeApp/lib/jquery-min.js',
      'chromeApp/lib/angular-min.js',
      'chromeApp/lib/node.js',
      'chromeApp/lib/qr-code.js',

      // Files to test
      'chromeApp/app.js',

      // Specs
      'test/client/angularAppSpec.js'
    ],
    exclude: [
      'karma.conf.js'
    ],
    reporters: ['progress', 'coverage'],
    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher'
    ],
    browsers: ['Chrome'],
    singleRun: true,
    autoWatch: false
  });

};
