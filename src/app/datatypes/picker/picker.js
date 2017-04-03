angular.module('bstl_ui').controller('DatatypePickerViewCtrl', function($scope, DocumentsService) {

    $scope.selection = [];

    if ($scope.data && !_.isEmpty($scope.data)) {
        var ids = $scope.structure.options.singleton ? [$scope.data] : $scope.data;
        DocumentsService.getByIds(ids, {
            "id": true,
            "data.name": true
        }).then(function(response) {
            _.each(_.sortBy(response.data.documents, function(doc) {
                return _.indexOf(ids, doc.id);
            }), function(doc) {
                $scope.selection.push({
                    id: doc.id,
                    name: doc.data.name
                })
            });
        })
    }

})

angular.module('bstl_ui').controller('DatatypePickerEditCtrl', function($scope, $q, $bstlPermissions, $bstlFilterDialog, DocumentService, DocumentsService) {

    $scope.pickerFilter = {};

    if ($scope.structure.options && $scope.structure.options.filter && !_.isEmpty($scope.structure.options.filter)) {
        $scope.pickerFilter = $scope.structure.options.filter;
    }

    $scope.editFilter = function() {
        if ($scope.structure.options.editFilter) {
            delete $scope.pickerFilterExtend;
            $bstlFilterDialog($scope.pickerFilter).then(function(filter) {
                $scope.pickerFilter = filter;
            });
        } else {
            $bstlFilterDialog($scope.pickerFilterExtend).then(function(filter) {
                $scope.pickerFilterExtend = filter;
            });
        }
    }

    $scope.getDocuments = function(query) {
        var filter = {
            "_and": []
        };

        if (query && query != '') {
            filter["_and"].push({
                "_text": {
                    "_search": query
                }
            });
        }

        if (!_.isEmpty($scope.pickerFilter)) {
            filter["_and"].push($scope.pickerFilter);
        }

        if (!_.isEmpty($scope.pickerFilterExtend)) {
            filter["_and"].push($scope.pickerFilterExtend);
        }

        if (_.isEmpty(filter["_and"])) {
            filter = {};
        }

        return DocumentsService.find(filter, {
            limit: 5,
            order: {
                'text-score': {
                    '$meta': 'textScore'
                }
            }
        }, {
            "id": true,
            "author": true,
            "users": true,
            "data.name": true,
            "permissions": true
        }).then(function(response) {
            var result = [];
            _.each(response.data.documents, function(doc) {
                result.push({
                    id: doc.id,
                    name: doc.data.name,
                    edit: $bstlPermissions.hasPermission(doc, 'edit')
                });
            });
            return result;
        });
    }

    $scope.$watch("selection", function(selection) {
        if (!$scope.working) {
            if ($scope.structure.options.singleton) {
                if (!selection || _.isEmpty(selection)) {
                    delete $scope.data[$scope.key];
                } else if ($scope.data[$scope.key] !== selection[0].id) {
                    $scope.data[$scope.key] = selection[0].id;
                }
            } else {
                $scope.data[$scope.key] = [];
                _.each(selection, function(item) {
                    $scope.data[$scope.key].push(item.id);
                })
            }
        }
    }, true);


    $scope.$watch(function() {
        return $scope.data[$scope.key];
    }, function(items, oldItems) {
        if (_.isEmpty(items) && !_.isEmpty(oldItems)) {

            $scope.selection = [];
        }
    }, true)

    if ($scope.data[$scope.key] && !_.isEmpty($scope.data[$scope.key])) {
        $scope.working = true;
        var ids = $scope.structure.options.singleton ? [$scope.data[$scope.key]] : $scope.data[$scope.key];
        DocumentsService.getByIds(ids, {
            "id": true,
            "author": true,
            "users": true,
            "data.name": true,
            "permissions": true
        }).then(function(response) {
            $scope.selection = [];
            _.each(_.sortBy(response.data.documents, function(doc) {
                return _.indexOf(ids, doc.id);
            }), function(doc) {
                $scope.selection.push({
                    id: doc.id,
                    name: doc.data.name,
                    edit: $bstlPermissions.hasPermission(doc, 'edit')
                });
            });
            $scope.working = false;
        }, function(error) {
            $scope.working = false;
        })
    } else {
        $scope.selection = [];
    }

})
