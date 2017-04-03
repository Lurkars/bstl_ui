angular.module('bstl_ui').controller('DatatypeInputRadioCtrl', function($scope) {

    $scope.$watch("structure.options.structure", function(structure, oldStructure) {

        $scope.optionsStructure = {
            "type": "list",
            "excerpt": $scope.structure.excerpt,
            "options": {
                "structure": structure || {
                    "required": true
                }
            }

        };

        if (structure && oldStructure && structure.type !== oldStructure.type) {
            $scope.structure.options.options = [];
        }
    }, true);

})
