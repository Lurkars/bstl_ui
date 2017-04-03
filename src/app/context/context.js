angular.module("bstl_ui").provider("$bstlContext", function() {

    var providers = {};

    this.addProvider = function(type, provider) {
        providers[type] = providers[type] || [];
        providers[type].push(provider);
    }

    this.$get = function($injector, $state, $q) {
        return {
            activeProviders: function(name, context) {
                var activeProviders = {};
                _.each(providers, function(typeProviders, type) {
                    activeProviders[type] = activeProviders[type] || [];
                    _.each(typeProviders, function(provider) {
                        if (provider.supports && _.isFunction(provider.supports)) {
                            if ($injector.invoke(provider.supports, provider, {
                                    name: name,
                                    context: context
                                })) {

                                var properties = provider.properties
                                if (provider.properties && _.isFunction(provider.properties)) {
                                    properties = $injector.invoke(provider.properties, provider, {
                                        name: name,
                                        context: context
                                    });
                                }

                                activeProviders[type].push({
                                    id: provider.id,
                                    index: provider.index,
                                    group: provider.group || 'default',
                                    properties: properties,
                                    callback: provider.callback,
                                    context: context
                                });
                            }
                        }
                    })

                    activeProviders[type] = _.sortBy(activeProviders[type], function(provider) {
                        return provider.index;
                    });
                })
                return activeProviders;
            },
            callback: function(provider) {
                return $q(function(resolve) {
                    if (_.isFunction(provider.callback)) {
                        resolve($injector.invoke(provider.callback, provider, {
                            context: provider.context
                        }));
                    }
                })
            }
        }
    }
})



/**
 * View
 */
angular.module('bstl_ui').directive('bstlContext', function() {
    return {
        scope: {
            type: "=bstlContext",
            context: "=",
            view: "=",
            name: "=",
        },
        templateUrl: 'templates/context/context.html',
        controller: function($scope, $bstlContext, $mdMedia) {


            $scope.$mdMedia = $mdMedia;
            var init = true;
            var updateItems = function(value, oldValue) {
                if (oldValue != value || init) {
                    $scope.providers = $bstlContext.activeProviders($scope.name, $scope.context);
                    $scope.items = $scope.providers && $scope.providers[$scope.type] || [];
                    $scope.groups = _.groupBy($scope.items, "group");
                    init = false;
                }
            }

            $scope.$watch("name", updateItems, true);

            $scope.$watch("context.document", updateItems, true);
            $scope.$watch("context.uiconfig", updateItems, true);
            $scope.$watch("context.navconfig", updateItems, true);

            $scope.callback = function(provider) {
                provider.working = true;
                $bstlContext.callback(provider).then(function() {
                    provider.working = false;
                }, function() {
                    provider.working = false;
                });
            }

        }
    }
})
