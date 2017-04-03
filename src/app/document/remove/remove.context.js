angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "actionDocumentRemove",
        index: 4,
        properties: {
            icon: "delete"
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.view', 'root.document.edit', 'root.document.structure', 'root.document.json'], name) && context.document && context.document.id && $bstlPermissions.hasPermission(context.document, "remove");
        },
        callback: function($bstlConfirm, $bstlSynonyms, DocumentService, $bstlToast, $state, context) {
            var name = '<strong>' + context.document.id + '</strong>';
            if (context.document.data && context.document.data.name) {
                name = '<strong>' + context.document.data.name + '</strong> (' + context.document.id + ')';
            }
            return $bstlConfirm('document.remove.confirm', $bstlSynonyms('document.remove.confirm.text', name)).then(function() {
                context.working = true;
                return DocumentService.removeDocument(context.document.id).then(function(response) {
                    context.working = false;
                    $bstlToast.success();
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }, function(error) {
                    context.working = false;
                    $bstlToast.httpError(error);
                });
            })
        }
    })

});
