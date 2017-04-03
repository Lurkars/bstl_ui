angular.module('bstl_ui').controller('DatatypeListCtrl', function($scope) {


    $scope.data[$scope.key] = $scope.data[$scope.key] || [];
    $scope.listModel = {};

    var createKeyedObject = function(object) {
        var emptyObject = {};
        _.each(object, function(value, key) {
            if (_.isObject(value)) {
                emptyObject[key] = createKeyedObject(value);
            }
        })

        return emptyObject;
    }

    $scope.addItem = function() {
        $scope.data[$scope.key].push(_.clone($scope.listModel.new));
        var newValue = undefined;
        if (_.isArray($scope.listModel.new)) {
            newValue = [];
        } else if (_.isObject($scope.listModel.new)) {
            newValue = createKeyedObject($scope.listModel.new);
        }

        $scope.listModel = {
            new: newValue
        };
    }

    $scope.removeItem = function(item) {
        $scope.data[$scope.key] = _.without($scope.data[$scope.key], item);
    };

    $scope.$watch('DatatypeListForm' + $scope.$id, function(formController) {
        $scope.DatatypeListForm = formController;
    });
})
