angular.module('bstl_ui').directive('bstlLayoutSidebar', function() {
    return {
        templateUrl: 'templates/layout/sidebar/sidebar.html',
        replace: true,
        controller: function($scope, $rootScope, $bstlPermissions, $state, DocumentService, DocumentsService, bstlDefaultNavnode) {

            $scope.uiconfig = $scope.page.context.uiconfig;
            $scope.navconfig = $scope.page.context.navconfig;

            $scope.$watch("uiconfig.data", function(data) {
                if (data) {
                    DocumentsService.getByIds(data.navconfigs).then(function(response) {
                        $scope.navconfigs = _.sortBy(response.data.documents, function(doc) {
                            return _.indexOf(data.navconfigs, doc.id);
                        });
                    })
                } else {
                    $scope.navconfigs = [];
                }
            }, true)

            $scope.$watch("navconfig.data", function(data) {
                if (data) {
                    DocumentsService.getByIds(data.navnodes).then(function(response) {
                        $scope.navnodes = _.sortBy(response.data.documents, function(doc) {
                            return _.indexOf(data.navnodes, doc.id);
                        });
                        if (!$scope.navnodes || _.isEmpty($scope.navnodes)) {
                            $scope.navnodes = [bstlDefaultNavnode];
                        }

                        var userId = $rootScope.bstl && $rootScope.bstl.userId;

                        if (userId) {
                            _.each($scope.navnodes, function(navnode) {

                                var filter = {
                                    '_and': []
                                };

                                var unreadFilter = {};
                                unreadFilter['contribute_+_' + userId + '_+_read'] = {
                                    '_ne': true
                                };

                                filter['_and'].push(unreadFilter);
                                filter['_and'].push($bstlPermissions.permissionFilter('contribute'));
                                if (!_.isEmpty(navnode.data.filter)) {
                                    filter['_and'].push(navnode.data.filter);
                                }

                                DocumentsService.count(filter).then(function(response) {
                                    navnode.unread = response.data;
                                })
                            })
                        }
                    })
                }
            }, true)

            $scope.previousNavConfig = function() {
                var index = _.indexOf(_.pluck($scope.navconfigs, 'id'), $scope.navconfig.id);

                index--;

                if (index < 0) {
                    index = _.size($scope.navconfigs) - 1;
                }

                $scope.page.context.navconfig = $scope.navconfigs[index];
                $scope.navconfig = $scope.page.context.navconfig;
            }

            $scope.nextNavConfig = function() {
                var index = _.indexOf(_.pluck($scope.navconfigs, 'id'), $scope.navconfig.id);
                index++;
                if (index >= _.size($scope.navconfigs)) {
                    index = 0;
                }

                $scope.page.context.navconfig = $scope.navconfigs[index];
                $scope.navconfig = $scope.page.context.navconfig;
            }

            $scope.editConfig = function(config) {
                if (config.id) {
                    if (config.author == $scope.bstl.userId) {
                        $state.go("root.document.edit", {
                            id: config.id
                        });
                    } else {
                        $state.go("root.document:create", {
                            clone: config.id,
                            template: undefined
                        });
                    }
                } else {
                    DocumentService.updateDocument(config).then(function(response) {
                        $state.go("root.document.edit", {
                            id: response.data.id
                        });
                    })
                }
            }
        }
    }
})
