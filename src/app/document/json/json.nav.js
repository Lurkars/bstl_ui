angular.module('bstl_ui').config(function($stateProvider) {

    $stateProvider.state('root.document.json', {
        url: "/json",
        templateUrl: 'templates/document/json/json.html',
        controller: function($scope, $rootScope) {

            $scope.$watch(function() {
                return $scope.JsonForm && $scope.JsonForm.$invalid;
            }, function(invalid) {
                if ($rootScope.page && $rootScope.page.context) {
                    $rootScope.page.context.disabled = invalid;
                }
            })

            $scope.$watch('JsonForm' + $scope.$id, function(formController) {
                $scope.JsonForm = formController;
            });

        }
    });

})
