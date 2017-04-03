angular.module('bstl_ui').controller('DatatypeTextareaViewCtrl', function($scope) {


    $scope.trim = function(text) {
        if (!$scope.excerpt || !$scope.structure.options.trim || $scope.structure.options.trim < 1) {
            return text;
        } else {
            return text.substring(0, $scope.structure.options.trim) + ((text.length > $scope.structure.options.trim) ? ' ...' : '');
        }
    }

    $scope.text = $scope.trim($scope.data);
});
