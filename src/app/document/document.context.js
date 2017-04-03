angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "updateDocument",
        index: 1,
        properties: {
            title: "document.update",
            icon: "save",
            isDisabled: true,
            progress: true,
            xs: true
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['root.document.edit', 'root.document.structure', 'root.document.json'], name) && context.document && context.document.id && $bstlPermissions.hasPermission(context.document, "own");
        },
        callback: function(DocumentService, $bstlSynonyms, $bstlToast, $state, context) {
            context.working = true;
            return DocumentService.updateDocument(context.document, context).then(function(response) {
                context.document = response.data;
                context.working = false;
                $bstlToast.success();
            }, function(error) {
                context.working = false;
                $bstlToast.httpError(error);
            });
        }
    })

});
