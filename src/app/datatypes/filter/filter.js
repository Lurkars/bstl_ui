angular.module('bstl_ui').service('$bstlFilterDialog', function($mdDialog) {
    return function(filter) {
        return $mdDialog.show({
            templateUrl: 'templates/datatypes/filter/filter.dialog.html',
            parent: angular.element(document.body),
            fullscreen: true,
            clickOutsideToClose: true,
            locals: {
                'filter': filter,
            },
            multiple: true,
            controller: function($scope, $mdDialog, filter) {

                $scope.model = {};

                $scope.model.filter = filter;

                $scope.filterStructure = {
                    type: "filter"
                };

                $scope.save = function() {
                    $mdDialog.hide($scope.model.filter);
                }

                $scope.closeDialog = function() {
                    $mdDialog.cancel();
                }
            }
        });
    }
});




angular.module('bstl_ui').controller('DatatypeFilterCtrl', function($scope) {

    $scope.filterToModel = function(filters) {
        if (_.isArray(filters)) {
            var model = [];
            _.each(filters, function(filter) {
                model.push($scope.filterToModel(filter));
            })
            return model;
        } else if (_.isObject(filters)) {
            var model = {};
            _.each(filters, function(filter, key) {
                model = {
                    key: key,
                    value: $scope.filterToModel(filter)
                };
            })
            return model;
        } else {
            return filters;
        }
    }

    $scope.modelToFilter = function(model) {
        if (_.isArray(model)) {
            var filters = [];
            _.each(model, function(filter) {
                filters.push($scope.modelToFilter(filter));
            })
            return filters;
        } else if (_.isObject(model)) {
            var filter = {};
            filter[model.key] = $scope.modelToFilter(model.value);
            return filter;
        } else {
            return model;
        }
    };


    $scope.createFilter = function() {
        $scope.model = {
            key: '',
            value: {
                key: "_eq"
            }
        };
    }

    $scope.removeFilter = function() {
        delete $scope.model;
    }

    if ($scope.data[$scope.key] && !_.isEmpty($scope.data[$scope.key])) {
        $scope.model = $scope.filterToModel($scope.data[$scope.key]);
    } else {
        $scope.createFilter();
    }

    $scope.$watch("model", function(model, oldModel) {
        if (model && oldModel) {
            $scope.data[$scope.key] = $scope.modelToFilter(model);
        } else {
            delete $scope.data[$scope.key];
        }
    }, true);

})

angular.module('bstl_ui').directive('bstlDatatypeFilterExpression', function() {
    return {
        scope: {
            model: "=ngModel"
        },
        require: "ngModel",
        templateUrl: 'templates/datatypes/filter/expression.html',
        controller: function($scope) {

            $scope.select = {};

            $scope.addValue = function() {
                if (_.isArray($scope.model)) {
                    switch ($scope.select.type) {
                        case 'number':
                            $scope.model.push(0);
                            break;
                        case 'boolean':
                            $scope.model.push(false);
                            break;
                        default:
                            $scope.model.push('');
                    }
                }
            }

            $scope.addObject = function() {
                if (_.isArray($scope.model)) {
                    $scope.model.push({
                        key: '',
                        value: {
                            key: "_eq"
                        }
                    });
                }
            }

            $scope.removeFilter = function(index) {
                if (_.isArray($scope.model)) {
                    $scope.model = _.filter(_.clone($scope.model), function(value, idx) {
                        return idx != index;
                    });
                }
            }

            $scope.isOperator = function(key) {
                return key && _.contains(_.pluck($scope.operators, "value"), key);
            }


            $scope.isRootOperator = function(key) {
                return key && _.contains(_.pluck($scope.rootOperators(), "value"), key);
            }

            $scope.isElemOperator = function(key) {
                return key && _.contains(_.pluck($scope.elemOperators(), "value"), key);
            }

            $scope.$watch('model.key', function(key, oldKey) {
                if ($scope.isOperator(key)) {
                    var operator = _.findWhere($scope.operators, {
                        value: key
                    });

                    if ($scope.isOperator(oldKey)) {
                        var oldOperator = _.findWhere($scope.operators, {
                            value: oldKey
                        });

                        if (operator.next != oldOperator.next) {
                            $scope.model.value = JSON.parse(operator.next);
                        }
                    } else {
                        $scope.model.value = JSON.parse(operator.next);
                    }
                } else {
                    if (key && $scope.isOperator(oldKey)) {
                        $scope.model.value = {
                            key: "_eq",
                            value: ""
                        };
                    }
                    $scope.filterKeys = key && key.split('_+_') || [''];
                }

                var value = $scope.model;

                if (_.isArray(value)) {
                    value = $scope.model[0];
                } else {
                    value = $scope.model.value;
                }

                if (!_.isObject(value)) {
                    console.log(key, $scope.model);
                    if (_.isNumber(value)) {
                        $scope.select.type = 'number';
                    } else if (_.isBoolean(value)) {
                        $scope.select.type = 'boolean';
                    } else if (value == '_currentUser') {
                        $scope.select.type = 'currentUser';
                    } else if (!value || _.isString(value)) {
                        $scope.select.type = 'string';
                    }
                }

            })

            var keyPattern = new RegExp(/^(\w+)+$/);

            $scope.$watch('filterKeys', function(filterKeys, oldFilterKeys) {
                if (filterKeys !== oldFilterKeys && _.every(filterKeys, function(value) {
                        return value && keyPattern.test(value);
                    })) {
                    $scope.model.key = filterKeys.join('_+_');
                }
            }, true);



            $scope.removeFilterKey = function(index) {
                if (_.isArray($scope.filterKeys)) {
                    $scope.filterKeys = _.filter(_.clone($scope.filterKeys), function(value, idx) {
                        return idx != index;
                    });
                }

                if (_.isEmpty($scope.filterKeys)) {
                    $scope.filterKeys = [''];
                }
            }

            $scope.disabledOperators = [{
                value: "_not",
                label: "$not",
                next: '""'
            }, {
                value: "_elemMatch",
                label: "$elemMatch",
                next: '{"key" : "", "value" : {"key" : "_eq"}}',
                root: true
            }];

            $scope.operators = [{
                value: "_and",
                label: "$and",
                next: '[{"key" : "", "value" : {"key" : "_eq"}}]',
                root: true
            }, {
                value: "_or",
                label: "$or",
                next: '[{"key" : "", "value" : {"key" : "_eq"}}]',
                root: true
            }, {
                value: "_nor",
                label: "$nor",
                next: '[{"key" : "", "value" : {"key" : "_eq"}}]',
                root: true
            }, {
                value: "_eq",
                label: "$eq",
                next: '""'
            }, {
                value: "_gt",
                label: "$gt",
                next: '""'

            }, {
                value: "_gte",
                label: "$gte",
                next: '""'

            }, {
                value: "_lt",
                label: "$lt",
                next: '""'

            }, {
                value: "_lte",
                label: "$let",
                next: '""'

            }, {
                value: "_ne",
                label: "$ne",
                next: '""'

            }, {
                value: "_in",
                label: "$in",
                next: '[""]'

            }, {
                value: "_nin",
                label: "$nin",
                next: '[""]'

            }, {
                value: "_exists",
                label: "$exists",
                next: "true"
            }, {
                value: "_all",
                label: "$all",
                next: '[""]'

            }, {
                value: "_size",
                label: "$size",
                next: '""'
            }, {
                "_regex": {
                    label: "$regex",
                    options: ["i,m,x,s"],
                    next: '""'
                }
            }];

            $scope.rootOperators = function() {
                return _.filter($scope.operators, function(operator) {
                    return operator.root;
                });
            }

            $scope.elemOperators = function() {
                return _.filter($scope.operators, function(operator) {
                    return !operator.root;
                });
            }

            $scope.isArray = function(model) {
                return _.isArray(model);
            }

            $scope.isObject = function(model) {
                return _.isObject(model);
            }

            $scope.isBoolean = function(model) {
                return _.isBoolean(model);
            }

            $scope.isNumber = function(model) {
                return _.isNumber(model);
            }

            $scope.isString = function(model) {
                return _.isString(model);
            }

            $scope.$watch("select.type", function(value, oldValue) {
                if (value != oldValue) {
                    switch (value) {
                        case 'number':
                            if (_.isArray($scope.model)) {
                                $scope.model = _.map($scope.model, function(filter) {
                                    return 0;
                                })
                            } else {
                                $scope.model.value = 0;
                            }
                            break;
                        case 'boolean':
                            if (_.isArray($scope.model)) {
                                $scope.model = _.map($scope.model, function(filter) {
                                    return false;
                                })
                            } else {
                                $scope.model.value = false;
                            }
                            break;
                        case 'currentUser':
                            if (_.isArray($scope.model)) {
                                $scope.model = ["_currentUser"];
                            } else {
                                $scope.model.value = "_currentUser";
                            }
                            break;
                        default:
                            if (_.isArray($scope.model)) {
                                _.map($scope.model, function(filter) {
                                    return '';
                                })
                            } else {
                                $scope.model.value = '';
                            }
                    }
                }
            }, true)


        }
    }
})
