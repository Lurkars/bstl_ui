angular.module('bstl_ui').config(function($stateProvider) {

    $stateProvider.state('root.document', {
        abtract: true,
        url: "/document/{id}",
        template: '<div ui-view><div>',
        resolve: {
            document: function(DocumentService, $stateParams) {
                return DocumentService.getDocument($stateParams.id);
            },
            _: function(context, document) {
                context.document = document.data;
                context.jsoneditor = false;
            }
        }
    });

});
