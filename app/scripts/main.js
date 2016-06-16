var md5 = require('md5');
var sha1 = require('sha1');
var sha256 = require('sha256');

// AngularJS
var H = angular.module('Hasher', []);

H.controller('HasherController', ['$scope', function ($scope) {
    // Default
    $scope.pass = "123456";
    $scope.salt = "";
    $scope.user = "";
    $scope.hash = "";

    // Types
	$scope.types = [{
        name: 'MD5($pass)',
        func: function (n1) { return md5(n1); },
        hashcat: 0
    }, {
        name: 'MD5($pass.$salt)',
        func: function (n1, n2) { return md5(n1 + n2); },
        hashcat: 10
    }, {
        name: 'MD5(MD5(MD5($pass)))',
        func: function (n1, n2) { return md5(md5(md5(n1))); },
        hashcat: 3500
    }, {
        name: 'MD5($pass.MD5($salt))',
        func: function (n1, n2) { return md5(n1 + md5(n2)); },
        hashcat: 3720
    }, {
        name: 'MD5($salt.$pass.$salt)',
        func: function (n1, n2) { return md5(n2 + n1 + n2); },
        hashcat: 3800
    }, {
        name: 'SHA1($pass)',
        func: function (n1) { return sha1(n1); },
        hashcat: 100
    }, {
        name: 'SHA1($pass.$salt)',
        func: function (n1, n2) { return sha1(n1 + n2); },
        hashcat: 110
    }, {
        name: 'SHA256($pass.$salt)',
        func: function (n1, n2) { return sha256(n1 + n2); },
        hashcat: 1410
    }];
}]);
