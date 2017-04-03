angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_filter", {
        id: "documentsTextFilter",
        index: 1,
        properties: {
            type: "search",
            icon: "search"
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['documents', 'root.documents'], name);
        },
        callback: function($rootScope, $state, context) {
            var that = this;

            if (_.isEmpty(context.filters)) {
                context.filters = {};
            }

            if (_.isEmpty(context.options)) {
                context.options = {};
            }

            if (that.value) {
                context.filters[that.id] = {
                    "_text": {
                        "_search": that.value
                    }
                };

                context.options.order = {
                    'text-score': {
                        '$meta': 'textScore'
                    }
                };
            } else {
                context.filters[that.id] = {};
                context.options.order = {};
            }
        }
    })

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "documentsCustomFilter",
        index: 2,
        properties: {
            icon: "filter_list",
            xs: true
        },
        supports: function($rootScope, $bstlPermissions, name, context) {
            return _.contains(['documents', 'root.documents'], name);
        },
        callback: function($bstlFilterDialog, $rootScope, context) {
            var that = this;
            if (_.isEmpty(context.filters)) {
                context.filters = {};
            }

            return $bstlFilterDialog(context.filters[that.id]).then(function(filter) {
                context.filters[that.id] = filter;
            });
        }
    })

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "documentsOptions",
        index: 1,
        properties: {
            icon: "list",
            xs: true
        },
        supports: function($rootScope, $bstlPermissions, name, context) {
            return _.contains(['documents', 'root.documents'], name);
        },
        callback: function($mdDialog, $rootScope, context) {
            return $mdDialog.show({
                templateUrl: 'templates/documents/options.dialog.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                locals: {
                    'options': _.clone(context.options) || {}
                },
                multiple: true,
                controller: function($scope, $mdDialog, options) {
                    $scope.model = options;

                    $scope.save = function() {
                        $mdDialog.hide($scope.model);
                    }

                    $scope.closeDialog = function() {
                        $mdDialog.cancel();
                    }
                }
            }).then(function(model) {
                if (model.store) {
                    localStorage.setItem('bstl.root.documents.options', JSON.stringify(model));
                }

                context.options = _.clone(model);
            });
        }
    })

});
