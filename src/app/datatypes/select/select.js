angular.module('bstl_ui').controller('DatatypeSelectCtrl', function($scope) {

    $scope.$watch("structure.options.structure", function(structure, oldStructure) {

        $scope.optionsStructure = {
            "type": "list",
            "excerpt": $scope.structure.excerpt,
            "options": {
                "structure": {
                    "type": 'structure',
                    "options": {
                        "structure": {
                            "label": {
                                "required": true,
                                "options": {
                                    "inputType": "text"
                                },
                                "type": 'input'
                            },
                            "value": structure || {
                                "required": true
                            }
                        }
                    }
                }
            }
        };

        if (structure && oldStructure && structure.type !== oldStructure.type) {
            $scope.structure.options.options = [];
        }
    }, true);

})

angular.module('bstl_ui').controller('DatatypeSelectEditCtrl', function($scope) {

    if ($scope.structure.options && $scope.structure.options.onView && !_.isObject($scope.data[$scope.key])) {
        $scope.data[$scope.key] = {};
    }

    $scope.$watch(function() {
        return $scope.data[$scope.key] && $scope.data[$scope.key].options
    }, function(options, oldOptions) {
        if (!_.isEmpty(oldOptions) && $scope.data[$scope.key]) {
            $scope.data[$scope.key].default = _.indexOf(_.pluck(options, 'label'), oldOptions[$scope.data[$scope.key].default] && oldOptions[$scope.data[$scope.key].default].label);
        }
    }, true)

})




angular.module('bstl_ui').controller('DatatypeSelectViewCtrl', function($scope) {

    if ($scope.data && (!$scope.data.default || $scope.data.default < 0)) {
        $scope.data.default = 0;
    }

    if ($scope.structure.options && $scope.structure.options.onView && $scope.data && $scope.data.default) {
        $scope.model = $scope.data.options && $scope.data.options[$scope.data.default] && $scope.data.options[$scope.data.default].value;

    }
})
