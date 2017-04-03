angular.module('bstl_ui').controller('DatatypeDocumentOptionsCtrl', function($scope, $bstlPermissions) {

    $scope.templateFilterStructure = {
        type: 'picker',
        required: true,
        options: {
            singleton: true,
            filter: {
                'template': {
                    "_eq": true
                }
            },
            editFilter: true
        }
    }


    $scope.structure.options.requiredPermission = $scope.structure.options.requiredPermission || 'edit';

    if ($scope.structure.options.permissions) {
        $scope.usePermissions = true;
    }

    $scope.order = $scope.structure.options.order && _.keys($scope.structure.options.order)[0];

    $scope.$watch('structure.options.createOnView', function(createOnView, oldCreateOnView) {
        if (createOnView && createOnView != oldCreateOnView) {
            $scope.structure.options.requiredPermission = 'view';
        }
    })

    $scope.openPermissionsDialog = function() {
        $bstlPermissions.openPermissionsDialog($scope.structure.options, true).then(function(permissionsModel) {
            $scope.structure.options.permissions = permissionsModel.permissions;
        })
    }

    $scope.$watch("usePermissions", function(usePermissions) {
        if (!usePermissions) {
            delete $scope.structure.options.permissions;
        }
    });

});


angular.module('bstl_ui').controller('DatatypeDocumentEditCtrl', function($scope, $q, $state, $bstlPermissions, DocumentService, DocumentsService) {

    if (_.isObject($scope.data)) {
        $scope.data[$scope.key] = "empty";
    }

    var setUsers = function() {
        if ($scope.model.document) {
            $scope.model.document.users = _.clone($scope.document.users) || [];
            // handle author roles
            if ($scope.model.document.author != $scope.document.author) {
                // add original author to users
                if (!_.contains($scope.model.document.users, $scope.document.author)) {
                    $scope.model.document.users.push($scope.document.author);
                }
                // remove user from list
                $scope.model.document.users = _.without($scope.model.document.users, $scope.model.document.author);
            }
        }
    }

    var initFilter = function() {
        $scope.documentsContext = $scope.documentsContext || {};

        $scope.documentsContext.filters = $scope.documentsContext.filters || {};

        $scope.documentsContext.filters['parentFilter'] = {};
        $scope.documentsContext.filters['parentFilter']['parent' + $scope.structure.options.requiredPermission] = $scope.document && $scope.document.id;

        $scope.model.initFilter = true;
    };

    $scope.$watch("documentsContext.filters", function(filters) {
        $scope.model = $scope.model || {};

        $scope.model.filter = {
            "_and": []
        };

        _.each(filters, function(filter) {
            if (filter && !_.isEmpty(filter)) {
                $scope.model.filter["_and"].push(_.clone(filter));
            }
        });

        if (_.isEmpty($scope.model.filter["_and"])) {
            delete $scope.model.filter;
        }

    }, true)

    var initModel = function() {
        $scope.model = {};

        $scope.documentsContext = {};

        $scope.documentsContext.options = {};
        $scope.documentsContext.options.columns = $scope.structure.options.columns || 1;
        $scope.documentsContext.options.rows = $scope.structure.options.rows || 5;
        $scope.documentsContext.options.order = $scope.structure.options.order;
        $scope.documentsContext.options.view = $scope.structure.options.view;

        if (!$scope.canCreate) {
            initFilter();
            return;
        }

        DocumentService.getDocumentTemplate($scope.structure.options.template).then(function(response) {
            $scope.model.document = response.data;

            if ($scope.structure.options.users) {
                setUsers();
            }

            if ($scope.structure.options.permissions) {
                $scope.model.document.permissions = $scope.structure.options.permissions;
            }

            if ($scope.document && $scope.document.id) {
                initFilter();

                DocumentsService.count($scope.model.filter).then(function(response) {
                    if ($scope.structure.options.singleton && response.data > 0) {
                        $scope.canCreate = false;
                    }

                    if (!response.data || response.data < 1) {
                        $scope.model.empty = true;
                    } else {
                        $scope.model.empty = false;
                    }
                })
            } else {
                $scope.model.empty = true;
            }

        }, function(error) {
            if ($scope.document && $scope.document.id) {
                initFilter();
            }
        })
    }

    var createDocument = function(reload) {

        $scope.model.initFilter = false;
        if ($scope.DatatypeDocumentEditForm.$invalid || !$scope.model.document) {
            return;
        }

        delete $scope.documentsContext.filter;

        $scope.model.document['parent' + $scope.structure.options.requiredPermission] = $scope.document && $scope.document.id;

        DocumentService.updateDocument($scope.model.document).then(function(response) {
            if (reload) {
                $state.go('root.document.edit', {
                    id: $scope.document.id,
                    reload: true
                });
            }

            if ($scope.structure.options.singleton) {
                initFilter();
            } else {
                initModel()
            };
        })
    }

    $scope.createDocument = function() {
        $scope.model.initFilter = false;
        if (!$scope.document) {
            return;
        }

        if ($scope.document.id) {
            createDocument();
        } else {
            DocumentService.updateDocument($scope.document).then(function(response) {
                $scope.document = response.data;
                if ($scope.document.id) {
                    createDocument(true);
                }
            })
        }
    }

    var initDocument = false;

    $scope.$watch("document", function(document) {
        if (document && !initDocument) {
            $scope.canCreate = $scope.structure.options.requiredPermission && $bstlPermissions.hasPermission(document, $scope.structure.options.requiredPermission);
            // init
            initModel();
            initDocument = true;
        }
    }, true)

    $scope.$watch("document.users", function() {
        setUsers();
    })

    $scope.$watch('DatatypeDocumentEditForm' + $scope.$id, function(formController) {
        $scope.DatatypeDocumentEditForm = formController;
    });


});
