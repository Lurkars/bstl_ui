angular.module('bstl_ui').service('DocumentStructureService', function($mdDialog) {
    return {
        openStructureDialog: function(key, structure, clean) {
            return $mdDialog.show({
                controller: "DocumentStructureCtrl",
                templateUrl: 'templates/document/structure/structure.dialog.html',
                parent: angular.element(document.body),
                fullscreen: true,
                locals: {
                    'key': key,
                    'structure': structure,
                    'clean': clean
                },
                multiple: true
            });
        }
    }
})

angular.module('bstl_ui').controller('DocumentStructureCtrl', function($scope, $mdDialog, key, structure, clean) {

    $scope.showClean = clean;
    $scope.model = {};
    $scope.model.key = _.clone(key);
    $scope.model.structure = structure && _.clone(structure) || {};
    $scope.model.structure.options = $scope.model.structure.options || {};

    if (_.isEmpty($scope.model.structure)) {
        $scope.model.structure = {};
    }

    $scope.model.structure.type = $scope.model.structure.type || "textarea";

    $scope.save = function() {
        $mdDialog.hide($scope.model);
    }

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    }

    $scope.$watch('DocumentStructureDialogForm' + $scope.$id, function(formController) {
        $scope.DocumentStructureDialogForm = formController;
    });

})

angular.module('bstl_ui').directive('bstlDocumentStructure', function(DocumentService, DocumentStructureService) {
    return {
        scope: {
            data: "=bstlDocumentStructure",
            jsoneditor: "=?",
            hideTemplate: "=?"
        },
        overwrite: true,
        templateUrl: 'templates/document/structure/structure.html',
        controller: function($scope, $bstlPermissions, $bstlSynonyms, $bstlConfirm) {

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

                if (_.isEmpty($scope.document.structure)) {
                    $scope.document.structure = {};
                }

                $scope.interfacesPickerStructure = {
                    type: "picker",
                    options: {}
                };

                if ($scope.document.id) {
                    $scope.interfacesPickerStructure.options.filter = {
                        "id": {
                            "_ne": $scope.document.id
                        }
                    }
                }
            }, true)

            $scope.$watch('DocumentStructureForm' + $scope.$id, function(formController) {
                $scope.DocumentStructureForm = formController;
            })

            $scope.openStructureDialog = function(key) {
                if (!$scope.document.structure || _.isEmpty($scope.document.structure)) {
                    $scope.document.structure = {};
                }

                DocumentStructureService.openStructureDialog(key, $scope.document.structure[key], $scope.document.data && $scope.document.data[key])
                    .then(function(model) {
                        delete $scope.newKey;
                        $scope.DocumentStructureForm.$setPristine();
                        $scope.DocumentStructureForm.$setUntouched();
                        $scope.document.structure[model.key] = model.structure;
                        if (model.clean) {
                            delete $scope.document.data[model.key];
                        }
                        $scope.document.meta.structure[model.key] = model.structure;

                    }, function() {});
            }

            $scope.removeStructure = function(key) {

                $bstlConfirm('structure.remove.confirm', $bstlSynonyms('structure.remove.confirm.text', '<strong>' + key + '</strong>')).then(function() {
                    delete $scope.document.structure[key];
                    delete $scope.document.data[key];
                    delete $scope.document.meta.structure[$scope.document.id][key];
                    $scope.document.structureKeys = _.without($scope.document.structureKeys, key);
                    if (_.isEmpty($scope.document.structure)) {
                        delete $scope.document.structure;
                    }
                })
            }

            $scope.openTemplatePermissions = function() {
                var data = {};
                data.permissions = $scope.document.templatePermissions ? $scope.document.templatePermissions : $scope.document.permissions;
                $bstlPermissions.openPermissionsDialog(data, true).then(function(permissionModel) {
                    $scope.document.templatePermissions = permissionModel.permissions;
                })
            }

            $scope.$watch("document.interfaces", function(interfaces, oldInterfaces) {
                if (!_.isEmpty(oldInterfaces) && oldInterfaces != interfaces) {
                    _.each(_.difference(oldInterfaces, interfaces), function(removedInterface) {
                        if ($scope.document.meta && $scope.document.meta.structure && $scope.document.meta.structure[removedInterface]) {
                            _.extend($scope.document.structure, $scope.document.meta.structure[removedInterface]);
                        }
                    });
                }
            })

            $scope.$watch("document.template", function(isTemplate, oldIsTemplate) {
                if (isTemplate && isTemplate != oldIsTemplate) {
                    delete $scope.document.type;
                }
            }, true);

            var keyPattern = new RegExp(/^(\w+)+$/);

            $scope.invalidKey = function(key) {
                var keys = _.flatten(_.map(_.values($scope.document && $scope.document.meta && $scope.document.meta.structure || {}), function(value) {
                    return _.keys(value);
                }));

                return !key || key === '' || key === "" || !keyPattern.test(key) || _.contains(keys, key);
            }
        }
    }
})
