angular.module('bstl_ui').directive('bstlLayoutCreatemenu', function(DocumentsService) {
    return {
        templateUrl: 'templates/layout/createmenu/createmenu.html',
        replace: true,
        controller: function($scope, $mdBottomSheet, $bstlContext) {

            $scope.$watch("navconfig.data", function(data) {
                if (data) {
                    $scope.creates = data.create;
                }
            }, true);

            $scope.openCreateBottomsheet = function() {
                $mdBottomSheet.show({
                    templateUrl: 'templates/layout/createmenu/createmenu.bottomsheet.html',
                    parent: angular.element(document.body),
                    locals: {
                        creates: $scope.creates
                    },
                    controller: function($scope, $mdBottomSheet, $bstlContext, creates) {

                        $scope.creates = creates;

                        $scope.createContext = $bstlContext.activeProviders($scope.page.name, $scope.page.context);

                        $scope.createContextClone = $scope.createContext && $scope.createContext['createmenu_clone'] || [];
                        $scope.createContextTemplate = $scope.createContext && $scope.createContext['createmenu_template'] || [];

                        $scope.callback = function(provider) {
                            provider.working = true;
                            $bstlContext.callback(provider).then(function() {
                                provider.working = false;
                            }, function() {
                                provider.working = false;
                            });
                        }

                        $scope.closeBottomsheet = function() {
                            $mdBottomSheet.hide();
                        }

                    }
                });
            };

        }
    }
})
