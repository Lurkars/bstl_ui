angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "updateDocumentData",
        index: 1,
        properties: {
            title: "document.updateData",
            icon: "save",
            isDisabled: true,
            progress: true,
            xs: true
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['root.document.edit'], name) && context.document && context.document.id && !$bstlPermissions.hasPermission(context.document, "own");
        },
        callback: function(DocumentService, $bstlSynonyms, $bstlToast, context) {
            context.working = true;
            return DocumentService.updateDocumentData(context.document.id, context.document.data, context).then(function(response) {
                context.document = response.data;
                context.working = false;
                $bstlToast.success();
            }, function(error) {
                context.working = false;
                $bstlToast.httpError(error);
            });
        }
    })

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "stateDocumentEdit",
        index: 2,
        properties: {
            title: "document.edit",
            icon: "create"
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.view', 'root.document.structure', 'root.document.json'], name) && context.document && !context.document.template && context.document.id && $bstlPermissions.hasPermission(context.document, "edit");
        },
        callback: function($state, context) {
            $state.go('root.document.edit', {
                id: context.document.id
            });
        }
    })

});
