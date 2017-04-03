angular.module('bstl_ui').config(function($stateProvider) {

    $stateProvider.state('root.document.view', {
        url: "/",
        template: '<div bstl-document-view="page.context.document" context="page.context"></div>'
    });

})
