angular.module('bstl_ui').directive('bstlLayoutMain', function() {
    return {
        templateUrl: 'templates/layout/main.html',
        replace: true,
        controller: function($scope, $mdSidenav) {

            $scope.toggleSidebarLeft = function() {
                $mdSidenav('sidebar_left').toggle();
            };

            $scope.closeSidebarLeft = function() {
                $mdSidenav('sidebar_left').close();
            };
        }
    }
})
