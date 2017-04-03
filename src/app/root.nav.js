angular.module('bstl_ui').config(function($stateProvider, $bstlContextProvider) {

    $stateProvider.state('root', {
        abstract: true,
        template: "<div bstl-layout-main></div>",
        resolve: {
            auth: function($rootScope, AuthService) {
                return AuthService.auth().then(function(response) {
                    $rootScope.bstl = $rootScope.bstl || {};
                    $rootScope.bstl.auth = response.data;
                    $rootScope.bstl.userId = $rootScope.bstl.auth.id;
                    return response.data
                }, function(error) {
                    $rootScope.bstl && delete $rootScope.bstl.auth;
                    $rootScope.bstl && delete $rootScope.bstl.userId;
                    return {};
                });
            },
            uiconfig: function(DocumentsService, auth, bstlDefaultUiConfig) {
                return DocumentsService.findOne({
                    "_and": [{
                        author: auth.id || "system"
                    }, {
                        interfaces: {
                            "_in": ['uiconfig']
                        }
                    }]
                }).then(function(response) {
                    var uiconfig = response.data;
                    if (_.isEmpty(uiconfig)) {
                        return DocumentsService.findOne({
                            "_and": [{
                                author: "system"
                            }, {
                                interfaces: {
                                    "_in": ['uiconfig']
                                }
                            }]
                        }).then(function(response) {
                            return response.data && response.data || bstlDefaultUiConfig;
                        }, function(error) {
                            return bstlDefaultUiConfig;
                        })
                    } else {
                        return uiconfig;
                    }
                })
            },
            navconfig: function(DocumentsService, uiconfig, bstlDefaultNavConfig, auth) {
                if (uiconfig && uiconfig.data && uiconfig.data.navconfigs && !_.isEmpty(uiconfig.data.navconfigs)) {
                    return DocumentsService.getByIds(uiconfig.data.navconfigs).then(function(response) {

                        var navconfigs = _.sortBy(response.data.documents, function(doc) {
                            return _.indexOf(uiconfig.data.navconfigs, doc.id);
                        });

                        return navconfigs && navconfigs[0] || bstlDefaultNavConfig;
                    }, function(error) {
                        return bstlDefaultNavConfig;
                    })
                } else {
                    return bstlDefaultNavConfig;
                }
            },
            context: function($rootScope, DocumentsService, uiconfig, navconfig) {
                if (uiconfig && uiconfig.data && uiconfig.data.synonyms) {
                    return DocumentsService.getByIds(uiconfig.data.synonyms).then(function(response) {
                        $rootScope.synonyms = {};
                        _.each(_.sortBy(response.data.documents, function(doc) {
                            return _.indexOf(uiconfig.data.synonyms, doc.id);
                        }), function(synonyms) {
                            $rootScope.synonyms[synonyms.id] = {};
                            _.each(synonyms.data.synonyms, function(synonym) {
                                $rootScope.synonyms[synonyms.id][synonym.key] = synonym.value;
                            })
                        });

                        return {
                            uiconfig: uiconfig,
                            navconfig: navconfig
                        }
                    });
                } else return {
                    uiconfig: uiconfig,
                    navconfig: navconfig
                }


            }
        }
    });


    $stateProvider.state('root.info', {
        url: "/global/info",
        templateUrl: 'templates/info.html'
    });

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "devmode",
        index: 2,
        properties: function($rootScope, name, context) {
            var devmode = $rootScope.bstl && $rootScope.bstl.devmode;
            return {
                icon: "thumb_up",
                classes: devmode ? "" : "md-primary",
                title: "icon.developer_mode"
            }
        },
        supports: function($rootScope, name, context) {
            return _.contains(['root.info'], name) && $rootScope.bstl && $rootScope.bstl.userId === 'system';
        },
        callback: function($rootScope, context) {
            $rootScope.bstl.devmode = !$rootScope.bstl.devmode;
        }
    })

})
