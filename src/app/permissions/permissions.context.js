angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "permissionsCreateDialog",
        index: 5,
        properties: {
            title: "permissions",
            icon: "lock"
        },
        supports: function(name, context) {
            return _.contains(['root.document:create'], name) && context.document && !context.document.id;
        },
        callback: function($bstlPermissions, DocumentService, context) {
            return $bstlPermissions.openPermissionsDialog(context.document).then(function(permissionModel) {
                context.document.permissions = permissionModel.permissions;
                context.document.users = permissionModel.users;
            });
        }
    })

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "permissionsUpdateDialog",
        index: 5,
        properties: {
            title: "permissions",
            icon: "lock"
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.view', 'root.document.edit', 'root.document.structure', 'root.document.json'], name) && context.document && context.document.id && $bstlPermissions.hasPermission(context.document, "own");
        },
        callback: function($bstlPermissions, $bstlSynonyms, DocumentService, $bstlToast, context) {
            return $bstlPermissions.openPermissionsDialog(context.document).then(function(permissionModel) {
                return DocumentService.updateDocumentPermissions(context.document.id, permissionModel.permissions, permissionModel.users).then(function(response) {
                    $bstlToast.success();
                    context.document = response.data;
                }, function(error) {
                    $bstlToast.httpError(error);
                });
            });
        }
    })

})
