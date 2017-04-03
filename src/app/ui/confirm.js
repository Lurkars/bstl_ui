angular.module('bstl_ui').service('$bstlConfirm', function($mdDialog) {
    return function(title, text) {
        return $mdDialog.show({
            locals: {
                title: title,
                text: text
            },
            templateUrl: 'templates/ui/confirm.dialog.html',
            parent: angular.element(document.body),
            fullscreen: true,
            clickOutsideToClose: true,
            multiple: true,
            controller: function($scope, title, text) {

                $scope.title = title;
                $scope.text = text;
                $scope.confirm = function() {
                    $mdDialog.hide();
                }

                $scope.closeDialog = function() {
                    $mdDialog.cancel();
                }

                $scope.$watch('ConfirmDialogForm' + $scope.$id, function(formController) {
                    $scope.ConfirmDialogForm = formController;
                });
            }
        });
    }
});
