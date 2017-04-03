angular.module('bstl_ui').directive('bstlDocumentEdit', function(DocumentService) {
    return {
        scope: {
            data: "=bstlDocumentEdit",
            jsoneditor: "=?"
        },
        overwrite: true,
        templateUrl: 'templates/document/edit/edit.html',
        controller: function($scope, $bstlPermissions) {

            $scope.hasPermission = function(permission) {
                return !$scope.document.id || $bstlPermissions.hasPermission($scope.document, permission);
            }

            $scope.$watch("data", function(data) {
                if (_.isString(data)) {
                    DocumentService.getDocument(data).then(function(resp) {
                        $scope.document = resp.data;
                    });
                } else {
                    $scope.document = data;
                }

                if (!$scope.document.data || _.isEmpty($scope.document.data)) {
                    $scope.document.data = {};
                }

                if (_.isEmpty($scope.document.users)) {
                    $scope.document.users = [];
                }

                $scope.usersPickerStructure = {
                    type: "picker",
                    options: {
                        filter: {
                            "interfaces": {
                                "_in": ["authentication"]
                            }
                        },
                        editFilter: true
                    }
                }


            }, true)

            $scope.hasStructure = function(key) {
                return $scope.document && $scope.document.meta && _.contains(_.flatten(_.map(_.union(_.values($scope.document.meta.structure), $scope.document.structure ? [$scope.document.structure] : []), function(value) {
                    return _.keys(value)
                })), key);
            }
        }
    }
})
