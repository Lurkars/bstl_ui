angular.module('bstl_ui').config(function($stateProvider) {

    $stateProvider.state('root.document:create', {
        url: "/document/create/?template?clone",
        templateUrl: 'templates/document/create/create.html',
        resolve: {
            document: function(DocumentService, $stateParams) {
                if ($stateParams.template) {
                    return DocumentService.getDocumentTemplate($stateParams.template, $stateParams.clone);
                } else if ($stateParams.clone) {
                    return DocumentService.getDocumentClone($stateParams.clone);
                }
            },
            _: function(context, document) {
                context.document = document.data;
                context.create = "edit";
            }
        },
        controller: function($scope, $rootScope, $mdBottomSheet) {
            $mdBottomSheet.hide();

            $scope.$watch(function() {
                return $scope.CreateForm && $scope.CreateForm.$invalid;
            }, function(invalid) {
                if ($rootScope.page && $rootScope.page.context) {
                    $rootScope.page.context.disabled = invalid;
                }
            })

            $scope.$watch('CreateForm' + $scope.$id, function(formController) {
                $scope.CreateForm = formController;
            });
        }
    });

})
