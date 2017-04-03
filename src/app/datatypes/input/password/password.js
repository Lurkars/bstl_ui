angular.module('bstl_ui').controller('DatatypeInputPasswordCtrl', function($scope) {

    $scope.regexscape = function(str) {
        return str && str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
})
