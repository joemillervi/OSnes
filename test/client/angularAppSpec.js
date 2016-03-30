var expect = chai.expect;
// var expect = require('chai').expect;

describe('app.js', function () {

  var $rootScope, $scope, createController;

  // beforeEach(function () {
  //   var chrome = require('sinon-chrome');
  // });

  beforeEach(module('main'));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    var $controller = $injector.get('$controller');
    createController = function () {
      return $controller('mainCtrl', {
        $scope: $scope,
      });
    };
    createController();
  }));

  it('should at least be a test', function () {
    expect(true).to.equal(true);
  });
  //
  // it('should have a \'$scope.togglePlaying\' function', function () {
  //   // expect(true).to.equal(false);
  // });

});
