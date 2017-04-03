'use strict';

var app = angular.module('bstl_ui', ['ngSanitize', 'ngMaterial', 'ui.router'])

angular.module('bstl_ui').run(function($state, $bstlSynonyms, $rootScope) {

    // redirect on state errors
    $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {
            if (error.status === 401 || error.status === 403) {
                $state.go("root.documents");
            } else if (error.status === 404) {
                $state.go("root.documents");
            }
        });

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams, options) {
            var name = $state.$current.self.name;

            $rootScope.page = $rootScope.page || {};
            $rootScope.page.name = name;
            $rootScope.page.title = $bstlSynonyms('nav.title', $bstlSynonyms(name));

            var context = {};
            if ($state.$current.locals.globals.context) {
                context = $state.$current.locals.globals.context;
            }

            $rootScope.page.context = context;
        })


    $rootScope.regexscape = function(str) {
        return str && str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }


    $rootScope.bstl = $rootScope.bstl || {};

    $rootScope.bstl.apiUrl = window.bstlapi;

    var openpgp = window.openpgp;

    openpgp.initWorker({
        path: 'js/openpgp.worker.min.js'
    })

    openpgp.config.aead_protect = true;

})

angular.module('bstl_ui').config(function($locationProvider, $urlRouterProvider, $httpProvider, $qProvider, $mdThemingProvider) {

    $locationProvider.html5Mode(true);

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    $httpProvider.interceptors.push(function($q) {
        return {
            'request': function(config) {
                if (config.url.indexOf('bstlapi') === 0) {
                    config.url = config.url.replace('bstlapi', window.bstlapi);
                }
                return config;
            }
        };
    });

    $qProvider.errorOnUnhandledRejections(false);

    $urlRouterProvider.otherwise("/");

    $mdThemingProvider.theme('default')
        .primaryPalette('grey')
        .accentPalette('blue-grey');

})
