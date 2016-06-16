// AngularJS
var H = angular.module('Hasher', []);

H.controller('HasherController', ['$scope', function ($scope) {
    // Types
	$scope.types = [{
        name: 'MD5($pass)',
        func: function (n1) { return n1; },
        hashcat: 0
    }, {
        name: 'MD5($pass.$salt)',
        func: function (n1, n2) { return n1 + n2; },
        hashcat: 10
    }, {
        name: 'SHA1($pass)',
        func: function (n1) { return n1; },
        hashcat: 100
    }];
}]);

