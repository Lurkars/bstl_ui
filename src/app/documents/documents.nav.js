angular.module('bstl_ui').config(function($stateProvider) {

    $stateProvider.state('root.documents', {
        url: "/:node",
        template: '<div bstl-documents filter="model.filter" view="model.view" rows="model.rows" columns="model.columns" order="model.order" context="page.context"></div>',
        params: {
            filter: undefined
        },
        resolve: {
            navnode: function(DocumentService, DocumentsService, $state, $stateParams, navconfig) {
                if ($stateParams.node) {
                    return DocumentService.getDocument($stateParams.node).then(function(response) {
                        return response.data;
                    }, function(error) {
                        $state.go('root.documents', {
                            node: undefined
                        }, {
                            reload: true
                        });
                    });
                } else if (navconfig && navconfig.data && navconfig.data.navnodes) {
                    return DocumentsService.getByIds(navconfig.data.navnodes).then(function(response) {
                        return _.sortBy(response.data.documents, function(doc) {
                            return _.indexOf(navconfig.data.navnodes, doc.id);
                        });
                    }, function(error) {
                        return {
                            data: {
                                filter: {}
                            }
                        };
                    });
                } else {
                    return {
                        data: {
                            filter: {}
                        }
                    };
                }
            },
            _: function($stateParams, context, navnode) {
                var node = navnode;
                if (_.isArray(node) && node.length > 0) {
                    node = node[0];
                }

                context.filters = {};
                context.options = JSON.parse(localStorage.getItem("bstl.root.documents.options") || '{}');

                if (node.data && node.data.filter && !$stateParams.filter) {
                    context.filters['stateFilter'] = node.data.filter;
                } else {
                    context.filters['stateFilter'] = $stateParams.filter;
                }

                context.node = $stateParams.node;
            }
        },
        controller: 'DocumentsCtrl'
    });

});

angular.module('bstl_ui').controller('DocumentsCtrl', function($scope) {

    $scope.model = {};

    $scope.$watch("page.context.filters", function(filters) {
        $scope.model.filter = {
            "_and": []
        };

        _.each(filters, function(filter) {
            if (filter && !_.isEmpty(filter)) {
                $scope.model.filter["_and"].push(_.clone(filter));
            }
        });

        if (_.isEmpty($scope.model.filter["_and"])) {
            delete $scope.model.filter;
        }

    }, true)

    $scope.$watch("page.context.options", function(options, oldOptions) {
        $scope.model.order = options && options.order && _.clone(options.order) || {};
        $scope.model.view = options && _.clone(options.view);
        $scope.model.columns = options && _.clone(options.columns) || 1;
        $scope.model.rows = options && _.clone(options.rows) || 5;
    }, true)

})
