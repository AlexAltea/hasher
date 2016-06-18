var md4 = require('js-md4');
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

// Utils
function stringToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++)
        hex += ("00" + str.charCodeAt(i).toString(16)).slice(-2);
    return hex;
}
function hexToString(hex) {
    var str = '';
    hex = hex.replace(' ', '');
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

// Input
function HashInput (mode, value) {
    this.mode = mode;
    this.value = value;

    this.get = function () {
        if (this.valid()) {
            if (this.mode == 'A') { return this.value; }
            if (this.mode == 'B') { return atob(this.value); }
            if (this.mode == 'X') { return hexToString(this.value); }
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
        if (this.mode == 'B') { this.value = btoa(this.value); }
        if (this.mode == 'X') { this.value = stringToHex(this.value); }
    } 
}

// AngularJS
var H = angular.module('Hasher', ['ui.bootstrap']);

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
        func: function (p) { return md5(p); },
        hashcat: 0
    }, {
        name: 'MD5($pass.$salt)',
        func: function (p, s) { return md5(p + s); },
        hashcat: 10
    }, {
        name: 'MD5($salt.$pass)',
        func: function (p, s) { return md5(s + p); },
        hashcat: 20
    }, {
        name: 'SHA1($pass)',
        func: function (p) { return sha1(p); },
        hashcat: 100
    }, {
        name: 'SHA1($pass.$salt)',
        func: function (p, s) { return sha1(p + s); },
        hashcat: 110
    }, {
        name: 'SHA1($salt.$pass)',
        func: function (p, s) { return sha1(s + p); },
        hashcat: 120
    }, {
        name: 'MD4($pass)',
        func: function (p) { return md4(p); },
        hashcat: 900
    },  {
        name: 'SHA256($pass)',
        func: function (p) { return sha256(p); },
        hashcat: 1400
    }, {
        name: 'SHA256($pass.$salt)',
        func: function (p, s) { return sha256(p + s); },
        hashcat: 1410
    }, {
        name: 'SHA256($salt.$pass)',
        func: function (p, s) { return sha256(s + p); },
        hashcat: 1420
    }, {
        name: 'MD5(MD5(MD5($pass)))',
        func: function (p) { return md5(md5(md5(p))); },
        hashcat: 3500
    }, {
        name: 'MD5(MD5($salt).$pass)',
        func: function (p, s) { return md5(md5(s) + p); },
        hashcat: 3610
    }, {
        name: 'MD5($salt.MD5($pass))',
        func: function (p, s) { return md5(s + md5(p)); },
        hashcat: 3710
    }, {
        name: 'MD5($pass.MD5($salt))',
        func: function (p, s) { return md5(p + md5(s)); },
        hashcat: 3720
    }, {
        name: 'MD5($salt.$pass.$salt)',
        func: function (p, s) { return md5(s + p + s); },
        hashcat: 3800
    }, {
        name: 'MD5(MD5($pass).MD5($salt))',
        func: function (p, s) { return md5(md5(p) + md5(s)); },
        hashcat: 3910
    }, {
        name: 'MD5($salt.MD5($salt.$pass))',
        func: function (p, s) { return md5(s + md5(s + p)); },
        hashcat: 4010
    }, {
        name: 'MD5($salt.MD5($pass.$salt))',
        func: function (p, s) { return md5(s + md5(p + s)); },
        hashcat: 4110
    }, {
        // TODO: Salt is not used
        name: 'MD5($user.\'\\x00\'.MD5($salt))',
        func: function (p, s, u) { return md5(u + '\x00' + p); },
        hashcat: 4210
    }, {
        name: 'MD5(SHA1($pass))',
        func: function (p) { return md5(sha1(p)); },
        hashcat: 4400
    }, {
        name: 'SHA1(SHA1($pass))',
        func: function (p) { return sha1(sha1(p)); },
        hashcat: 4500
    }, {
        name: 'SHA1(SHA1(SHA1($pass)))',
        func: function (p) { return sha1(sha1(sha1(p))); },
        hashcat: 4600
    }, {
        name: 'SHA1(MD5($pass))',
        func: function (p) { return sha1(md5(p)); },
        hashcat: 4700
    }, {
        name: 'SHA1($salt.$pass.$salt)',
        func: function (p, s) { return sha1(s + p + s); },
        hashcat: 4900
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
            var expectedHash = scope.hash.value;
            var resultingHash = method.func(tPass, tUser, tUser);
            return (resultingHash.indexOf(expectedHash) > -1);
        });
    };
});
