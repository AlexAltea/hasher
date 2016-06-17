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

// Input
function HashInput (mode, value) {
    this.mode = mode;
    this.value = value;

    this.get = function () {
        if (this.valid()) {
            // Plain-text
            if (this.mode == 'A') {
                return this.value;
            }
            // Base 64
            if (this.mode == 'B') {
                return atob(this.value);
            }
            // Hexadecimal
            if (this.mode == 'X') {
                var str = '', hex = this.value.replace(' ', '');
                for (var i = 0; i < hex.length; i += 2)
	                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                return str;
            }
        } else {
            return '';
	    }
    }
    this.valid = function () {
        switch (this.mode) {
        case 'A': // Plain-text
            return true;
        case 'B': // Base 64
            return /^([0-9A-Za-z+/]{4})*(([0-9A-Za-z+/]{2}==)|([0-9A-Za-z+/]{3}=))?$/.test(this.value);
        case 'X': // Hexadecimal
            return /^[0-9A-Fa-f ]*$/.test(this.value);
        default:
            return false;
        }
    }
    this.convert = function (mode) {
        this.value = this.valid() ? this.get() : this.value;
        this.mode = mode;
        // Base 64
        if (this.mode == 'B') {
            this.value = btoa(this.value);
        }
        // Hexadecimal
        if (this.mode == 'X') {
            var hex = '', str = this.value;
	        for (var i = 0; i < str.length; i++)
		        hex += ("00" + str.charCodeAt(i).toString(16)).slice(-2);
	        this.value = hex;
        }
    } 
}

// Controllers
H.controller('HasherController', ['$scope', function ($scope) {
    // Default
    $scope.pass = new HashInput("A", "123456");
    $scope.salt = new HashInput("A", "");
    $scope.user = new HashInput("A", "");
    $scope.hash = new HashInput("X", "");

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
            var tPass = scope.pass.get();
            var tSalt = scope.salt.get();
            var tUser = scope.user.get();

            // Filter by used parameters
            switch (method.func.length) {
            case 3: if (!tPass || !tSalt || !tUser) { return false; } break;
            case 2: if (!tPass || !tSalt ||  tUser) { return false; } break;
            case 1: if (!tPass ||  tSalt ||  tUser) { return false; } break;
            default:
                return false;
            }

            // Filter by expected hash (TODO: Only works if hash.mode is hexadecimal)
            var expectedHash = scope.hash.get();
            var resultingHash = method.func(tPass, tUser, tUser);
            return (resultingHash.indexOf(expectedHash) > -1);
        });
    };
});
