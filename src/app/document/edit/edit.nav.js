angular.module('bstl_ui').config(function($stateProvider) {

    $stateProvider.state('root.document.edit', {
        url: "/edit",
        template: '<ng-form name="EditForm{{$id}}"><div bstl-document-edit="page.context.document" jsoneditor="page.context.jsoneditor"></div></form>',
        controller: function($scope, $rootScope) {

            $scope.$watch(function() {
                return $scope.EditForm && $scope.EditForm.$invalid;
            }, function(invalid) {
                if ($rootScope.page && $rootScope.page.context) {
                    $rootScope.page.context.disabled = invalid;
                }
            })

            $scope.$watch('EditForm' + $scope.$id, function(formController) {
                $scope.EditForm = formController;
            });

        }
    });

})
