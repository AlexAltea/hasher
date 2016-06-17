var md5 = require('md5');
var sha1 = require('sha1');
var sha256 = require('sha256');

// ClipboardJS
var clipboard = new Clipboard('[data-clipboard-text]');
clipboard.on('success', function(e) {
    var tooltip = e.trigger.nextSibling;
    if (tooltip && tooltip.hasAttribute('content')) {
        var tooltipInner = tooltip.children[1];
        var newLeft = (parseInt(tooltip.style.left, 10) + 27) + "px";
        tooltip.style.left = newLeft;
        tooltipInner.innerHTML = 'Copied!';
    }
});

// AngularJS
var H = angular.module('Hasher', ['ui.bootstrap']);

H.controller('HasherController', ['$scope', function ($scope) {
    // Default
    $scope.pass = { value: "123456",  mode: "A" };
    $scope.salt = { value: "",        mode: "A" };
    $scope.user = { value: "",        mode: "A" };
    $scope.hash = { value: "",        mode: "X" };

    // Methods
	$scope.methods = [{
        name: 'MD5($pass)',
        func: function (n1) { return md5(n1); },
        hashcat: 0
    }, {
        name: 'MD5($pass.$salt)',
        func: function (n1, n2) { return md5(n1 + n2); },
        hashcat: 10
    }, {
        name: 'MD5(MD5(MD5($pass)))',
        func: function (n1) { return md5(md5(md5(n1))); },
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

// Directives
H.directive('hashInput', function () {
    return {
        templateUrl: 'views/hash-input.html',
        restrict: 'E',
        scope: {
            name: '@?',
            field: '=field'
        }
    };
});

H.directive('hashOutput', function () {
    return {
        templateUrl: 'views/hash-output.html',
        restrict: 'E',
        scope: {
            result: '=?',
            method: '=method'
        }
    };
});

// Filters
H.filter('filterMethods', function () {
    return function (methods, scope) {
        return methods.filter(function (method) {
            var tPass = scope.pass.value;
            var tSalt = scope.salt.value;
            var tUser = scope.user.value;

            // Filter by used parameters
            switch (method.func.length) {
            case 3: if (!tPass || !tSalt || !tUser) { return false; } break;
            case 2: if (!tPass || !tSalt ||  tUser) { return false; } break;
            case 1: if (!tPass ||  tSalt ||  tUser) { return false; } break;
            default:
                return false;
            }

            // Filter by expected hash
            var expectedHash = scope.hash.value;
            var resultingHash = method.func(tPass, tUser, tUser);
            return (resultingHash.indexOf(expectedHash) > -1);
        });
    };
});
