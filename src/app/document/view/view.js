/**
 * Document View
 */
angular.module('bstl_ui').directive('bstlDocumentView', function(DocumentService) {
    return {
        scope: {
            data: "=bstlDocumentView",
            context: "=?",
            view: "=?"
        },
        overwrite: true,
        templateUrl: 'templates/document/view/view.html',
        controller: function($scope) {

            $scope.$watch("data", function(data) {
                if (_.isString(data)) {
                    DocumentService.getDocument(data).then(function(resp) {
                        $scope.document = resp.data;
                    });
                } else {
                    $scope.document = data;
                }

                $scope.context = $scope.context || {};

                $scope.viewContext = {
                    uiconfig: $scope.context.uiconfig,
                    navconfig: $scope.context.navconfig,
                    document: data
                }
            }, true)

            $scope.hasStructure = function(key) {
                return $scope.document && $scope.document.meta && _.contains(_.flatten(_.map(_.values($scope.document.meta.structure), function(value) {
                    return _.keys(value)
                })), key);
            }
        }
    }
})

/**
 * Document Name
 */
angular.module('bstl_ui').directive('bstlDocumentName', function(DocumentService) {
    return {
        scope: {
            documentId: "=bstlDocumentName",
            context: "=?"
        },
        template: "{{name}}",
        link: function(scope, elem, attr) {
            if (_.isString(scope.documentId)) {
                DocumentService.getDocumentField(scope.documentId, ['data', 'name']).then(function(resp) {
                    scope.name = resp.data || scope.documentId;
                }, function(resp) {
                    scope.name = scope.documentId;
                });
            } else {
                scope.name = "";
            }
        }
    }
})
