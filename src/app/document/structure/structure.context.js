angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "updateDocumentStructure",
        index: 1,
        properties: {
            icon: "save",
            xs: true
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['root.document.structure'], name) && context.document && context.document.id && !$bstlPermissions.hasPermission(context.document, "own");
        },
        callback: function(DocumentService, $bstlSynonyms, $bstlToast, context) {
            context.working = true;
            return DocumentService.updateDocumentStructure(context.document.id, context.document.structure).then(function(response) {
                return DocumentService.updateDocumentData(context.document.id, context.document.data).then(function(response) {
                    context.document = response.data;
                    context.working = false;
                    $bstlToast.success();
                }, function(error) {
                    context.working = false;
                    $bstlToast.httpError(error);
                });
            }, function(error) {
                context.working = false;
                $bstlToast.httpError(error);
            });
        }
    })

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "stateDocumentStructure",
        index: 3,
        group: "adv",
        properties: {
            icon: "build"
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.view', 'root.document.edit', 'root.document.json'], name) && context.document && context.document.id && $bstlPermissions.hasPermission(context.document, "structure");
        },
        callback: function($state, context) {
            $state.go('root.document.structure', {
                id: context.document.id
            });
        }
    })

});
