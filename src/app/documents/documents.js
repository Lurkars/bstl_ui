/**
 * Documents View
 */
angular.module('bstl_ui').directive('bstlDocuments', function(DocumentsService) {
    return {
        scope: {
            filter: "=?",
            view: "=?",
            columns: "=?",
            rows: "=?",
            order: "=?",
            context: "=?",
            hideEmpty: "=?"
        },
        templateUrl: 'templates/documents/documents.html',
        controller: function($scope, $mdMedia) {
            // Get documents
            var update = function() {
                if ($scope.working || !$scope.model.pagination) {
                    return;
                }
                $scope.working = true;

                DocumentsService.find($scope.filter, $scope.model.pagination).then(function(resp) {
                    var result = resp.data;
                    $scope.model.pagination = result.pagination;
                    $scope.model.documents = result.documents;
                    $scope.working = false;
                }, function(error) {
                    $scope.working = false;
                });
            }

            $scope.model = {};
            $scope.rows = $scope.rows || 5;
            $scope.columns = $scope.columns || 1;

            $scope.$watch("filter", function(filter) {
                update();
            }, true)

            $scope.$watch(function() {
                return {
                    columns: $scope.columns,
                    rows: $scope.rows,
                    order: $scope.order
                };
            }, function(model) {
                var columns = _.isNumber($scope.columns) && $scope.columns > 0 && $scope.columns || 1;
                var rows = _.isNumber($scope.rows) && $scope.rows > 0 && $scope.rows || 5;

                $scope.model.flex = (100 / columns) - (100 / columns % 5);
                if (columns == 3) {
                    $scope.model.flex = 33;
                }

                $scope.model.pagination = $scope.model.pagination || {}

                if ($scope.order && !_.isEmpty($scope.order)) {

                    var order = {};

                    _.each($scope.order, function(value, orderkey) {
                        var key = orderkey.startsWith("_") ? "$" + orderkey.substr(1, orderkey.length) : orderkey;
                        order[key] = value;
                    })

                    $scope.model.pagination.order = order;
                } else {
                    delete $scope.model.pagination.order;
                }


                $scope.model.pagination.limit = columns * rows;
                $scope.model.pagination.offset = 0;

                update();
            }, true)

            $scope.$watch("model.pagination.offset", function(offset) {
                update();
            }, true)

            $scope.$watch("model.pagination.limit", function(limit) {
                update();
            }, true)

            $scope.$watch(function() {
                return $mdMedia('xs');
            }, function(xs) {
                if (xs) {
                    $scope.model.maxSize = 3;
                }
            });

            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                if (sm) {
                    $scope.model.maxSize = 5;
                }
            });

            $scope.$watch(function() {
                return $mdMedia('gt-sm');
            }, function(md) {
                if (md) {
                    $scope.model.maxSize = 10;
                }
            });

            // init
            update();
        }
    }
})

/**
 * Documents View
 */
angular.module('bstl_ui').directive('bstlDocumentsOptions', function(DocumentsService) {
    return {
        scope: {
            model: "=ngModel"
        },
        require: "ngModel",
        templateUrl: 'templates/documents/documents.options.html',
        controller: function($scope) {

            $scope.model = $scope.model || {};

            $scope.views = ['card', 'full', 'excerpt', 'link'];

            $scope.model.order = $scope.model.order && _.clone($scope.model.order) || {};

            $scope.order = $scope.model.order && _.keys($scope.model.order)[0] && _.keys($scope.model.order)[0] + "";

            $scope.$watch('order', function(order, oldOrder) {
                if (oldOrder && !order) {
                    delete $scope.model.order;
                } else if (!_.isEmpty(order) && (!$scope.model.order || $scope.model.order[order + ''] != 1)) {
                    $scope.model.order = {};
                    $scope.model.order[order + ''] = -1;
                }
            })

        }
    }
});
