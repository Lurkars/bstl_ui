angular.module('bstl_ui').config(function($stateProvider) {

    $stateProvider.state('root.document.structure', {
        url: "/structure",
        template: '<ng-form name="StructureForm{{$id}}"><div bstl-document-structure="page.context.document" jsoneditor="page.context.jsoneditor"></div></ng-form>',
        controller: function($scope, $rootScope) {

            $scope.$watch(function() {
                return $scope.StructureForm && $scope.StructureForm.$invalid;
            }, function(invalid) {
                if ($rootScope.page && $rootScope.page.context) {
                    $rootScope.page.context.disabled = invalid;
                }
            })

            $scope.$watch('StructureForm' + $scope.$id, function(formController) {
                $scope.StructureForm = formController;
            });

        }
    });
});
