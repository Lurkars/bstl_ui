angular.module('bstl_ui').config(function($bstlContextProvider) {

    $bstlContextProvider.addProvider("toolbar_action", {
        id: "createDocument",
        index: 1,
        properties: {
            title: "document.update",
            icon: "save",
            isDisabled: true,
            progress: true,
            xs: true
        },
        supports: function(name, context) {
            return _.contains(['root.document:create', 'root.document.edit', 'root.document.structure'], name) && context.document && !context.document.id;
        },
        callback: function(DocumentService, $bstlSynonyms, $bstlToast, $state, context) {
            context.working = true;
            return DocumentService.updateDocument(context.document, context).then(function(response) {
                context.working = false;
                $bstlToast.success();
                $state.go("root.document.view", {
                    id: response.data.id
                });
            }, function(error) {
                context.working = false;
                $bstlToast.httpError(error);
            });
        }
    })

    $bstlContextProvider.addProvider("createmenu_template", {
        id: "createTemplateDocument",
        properties: function(name, context) {
            return {
                label: context.document.data && context.document.data.name || context.document.id,
                icon: 'note_add'
            }
        },
        supports: function(name, context) {
            return _.contains(['root.document.view', 'root.document.edit', 'root.document.structure'], name) && context.document && context.document.id;
        },
        callback: function(DocumentService, $state, context) {
            $state.go("root.document:create", {
                template: context.document.id,
                clone: undefined
            });
        }
    })


    $bstlContextProvider.addProvider("createmenu_clone", {
        id: "createTemplateDocument",
        properties: function(name, context) {
            return {
                label: context.document.data && context.document.data.name || context.document.id,
                icon: 'content_copy'
            }
        },
        supports: function(name, context) {
            return _.contains(['root.document.view', 'root.document.edit', 'root.document.structure'], name) && context.document && context.document.id;
        },
        callback: function(DocumentService, $state, context) {
            $state.go("root.document:create", {
                clone: context.document.id,
                template: undefined
            });
        }
    })

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "stateDocumentStructure",
        index: 1,
        properties: {
            icon: "build"
        },
        supports: function(name, context) {
            return _.contains(['root.document:create', 'root.document.edit', 'root.document.structure'], name) && context.document && !context.document.id && context.create == "edit";
        },
        callback: function($state, context) {
            context.create = "structure";
        }
    })

    $bstlContextProvider.addProvider("toolbar_menu", {
        id: "stateDocumentEdit",
        index: 2,
        properties: {
            title: "document.edit",
            icon: "create"
        },
        supports: function(name, context) {
            return _.contains(['root.document:create', 'root.document.edit', 'root.document.structure'], name) && context.document && !context.document.id && context.create == "structure";
        },
        callback: function($state, context) {
            context.create = "edit";
        }
    })

});
