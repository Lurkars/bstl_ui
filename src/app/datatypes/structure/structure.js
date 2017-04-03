angular.module('bstl_ui').controller('DatatypeStructureCtrl', function($scope) {

    if (!$scope.data[$scope.key] || _.isEmpty($scope.data[$scope.key])) {
        $scope.data[$scope.key] = {};
    }

})
