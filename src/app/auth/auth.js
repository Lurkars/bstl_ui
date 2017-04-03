angular.module('bstl_ui').service('AuthService', function($http, $rootScope) {
    return {
        auth: function() {
            return $http.get('bstlapi/auth');
        },
        login: function(loginname, password) {
            return $http.post('bstlapi/auth/login', {
                "loginname": loginname,
                "password": password
            }).then(function(response) {
                $rootScope.bstl = $rootScope.bstl || {};
                $rootScope.bstl.auth = response.data;
                $rootScope.bstl.userId = $rootScope.bstl.auth.id;
            }, function(error) {
                return error;
            });
        },
        logout: function() {
            return $http.post('bstlapi/auth/logout').then(function() {
                delete $rootScope.bstl.auth;
                delete $rootScope.bstl.userId;
            });
        }
    }
})

angular.module('bstl_ui').directive('bstlAuthView', function($state, $window, $mdDialog, $http, AuthService) {
    return {
        templateUrl: 'templates/auth/auth.html',
        link: function(scope, elem, attr) {

            scope.model = {};

            scope.openLoginDialog = function() {
                $mdDialog.show({
                    templateUrl: 'templates/auth/login.dialog.html',
                    parent: angular.element(document.body),
                    fullscreen: true,
                    clickOutsideToClose: true,
                    controller: function($scope, AuthService) {

                        $scope.login = function() {
                            AuthService.login($scope.model.loginname, $scope.model.password).then(function(error) {
                                if (error) {
                                    $scope.loginError = true;
                                } else {
                                    $mdDialog.hide();
                                }
                            });
                        }

                        $scope.closeDialog = function() {
                            $mdDialog.cancel();
                        }

                        $scope.$watch('AuthLoginForm' + $scope.$id, function(formController) {
                            $scope.AuthLoginForm = formController;
                        });
                    }
                }).then(function() {
                    $state.go($state.current, {}, {
                        reload: true
                    });
                });
            }

            /**
             * Logout
             */
            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('root.documents', {}, {
                        reload: true
                    });
                });
            }

            scope.$watch("bstl.auth.data", function(data) {
                if (data && data.avatar && data.avatar.files && !_.isEmpty(data.avatar.files)) {
                    var avatarUrl = window.bstlapi + '/document/' + scope.bstl.auth.id + '/file/' + _.keys(data.avatar.files)[0];
                    $http.get(avatarUrl).then(function(response) {
                        scope.userAvatar = avatarUrl;
                    })
                }
            })
        }
    }
})
