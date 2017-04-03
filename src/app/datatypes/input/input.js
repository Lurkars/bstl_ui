angular.module('bstl_ui').controller('DatatypeInputCtrl', function($scope) {

    if (!$scope.structure || _.isEmpty($scope.structure)) {
        $scope.structure = {};
    }

    $scope.$watch("structure.options", function(options, oldOptions) {
        if (!options) {
            $scope.structure.options = {};
            $scope.structure.options.inputType = 'text';
        } else if (oldOptions && options.inputType !== oldOptions.inputType) {
            $scope.structure.options = {
                inputType: options.inputType || 'text'
            };
        }

        if (options && !options.inputType) {
            $scope.structure.options.inputType = 'text';
        }
    })

})

angular.module('bstl_ui').directive('bstlDatatypeInputOptions', function() {
    return {
        scope: {
            structure: "=bstlDatatypeInputOptions"
        },
        templateUrl: 'templates/datatypes/input/input.options.html',
        controller: "DatatypeInputCtrl",
        link: function(scope, elem, attr, ngModel) {

            var disabledInputTypes = ['file', 'datetime'];

            scope.inputTypes = _.difference(['checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'month', 'number', 'password', 'radio', 'range', 'text', 'time', 'url', 'week'], disabledInputTypes);
        }
    }
})
