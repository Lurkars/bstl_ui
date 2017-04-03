angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "stateDocumentJson",
        index: 6,
        group: "adv",
        properties: {
            title: "document.json",
            icon: "code"
        },
        supports: function($bstlPermissions, name, context) {
            return _.contains(['document', 'root.document.view', 'root.document.edit', 'root.document.structure'], name) && context.document && context.document.id && $bstlPermissions.hasPermission(context.document, "own") && context.navconfig && context.navconfig.data && context.navconfig.data.advanced && context.navconfig.data.advanced.json;
        },
        callback: function($state, context) {
            $state.go('root.document.json', {
                id: context.document.id
            });
        }
    })


    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "toggleJsonEditor",
        index: 7,
        group: "json",
        properties: function(name, context) {
            return {
                title: "edit.asJson",
                icon: context.jsoneditor ? "note_add" : "code"
            }
        },
        supports: function(name, context) {
            return _.contains(['root.document:create', 'root.document.edit', 'root.document.structure'], name) && context.document && context.navconfig && context.navconfig.data && context.navconfig.data.advanced && context.navconfig.data.advanced.json;
        },
        callback: function(context) {
            context.jsoneditor = !context.jsoneditor;
            context.document.meta = context.document.meta || {};
            context.document.meta.toggleRefresh = !context.document.meta.toggleRefresh;
        }
    })

});
