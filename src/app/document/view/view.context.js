angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "documentToggleRead",
        index: 1,
        properties: function($rootScope, name, context) {
            var read = false;
            if (context.document && context.document.contribute && context.document.contribute[$rootScope.bstl.userId] && context.document.contribute[$rootScope.bstl.userId].read) {
                read = true;
            }
            return {
                icon: read ? "drafts" : "markunread",
                title: "document.read",
                iconButton: true
            }
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.view'], name) && context.document && context.document.id && $bstlPermissions.hasPermission(context.document, "contribute");
        },
        callback: function(DocumentService, $rootScope, $bstlToast, context) {
            context.working = true;

            var read = true;
            if (context.document && context.document.contribute && context.document.contribute[$rootScope.bstl.userId] && context.document.contribute[$rootScope.bstl.userId].read) {
                read = false;
            }
            return DocumentService.updateDocumentContribute(context.document.id, 'read', read).then(function(response) {
                context.document = response.data;
                context.working = false;
                $bstlToast.success();
            }, function(error) {
                context.working = false;
                $bstlToast.httpError(error);
            });
        }
    })

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "documentToggleLike",
        index: 1,
        properties: function($rootScope, name, context) {
            var like = false;
            if (context.document && context.document.contribute && context.document.contribute[$rootScope.bstl.userId] && context.document.contribute[$rootScope.bstl.userId].like) {
                like = true;
            }
            return {
                icon: "thumb_up",
                classes: like ? "" : "md-primary",
                title: "document.like",
                iconButton: true
            }
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.view'], name) && context.document && context.document.id && $bstlPermissions.hasPermission(context.document, "contribute") && context.navconfig && context.navconfig.data && context.navconfig.data.advanced && context.navconfig.data.advanced.like;
        },
        callback: function(DocumentService, $rootScope, $bstlToast, context) {
            context.working = true;

            var like = true;
            if (context.document && context.document.contribute && context.document.contribute[$rootScope.bstl.userId] && context.document.contribute[$rootScope.bstl.userId].like) {
                like = false;
            }
            return DocumentService.updateDocumentContribute(context.document.id, 'like', like).then(function(response) {
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
        id: "stateDocumentView",
        index: 1,
        properties: {
            icon: "find_in_page"
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.edit', 'root.document.structure', 'root.document.json'], name) && context.document && !context.document.template && context.document.id && $bstlPermissions.hasPermission(context.document, "view");
        },
        callback: function($state, context) {
            $state.go('root.document.view', {
                id: context.document.id,
                reload: true
            });
        }
    })

});
