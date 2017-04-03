angular.module('bstl_ui').controller('DatatypeCustomOptionsCtrl', function($scope) {

    $scope.structure.options = $scope.structure.options || {};
    $scope.structure.options.typeView = "<div>{{data[key]}}</div>";
    $scope.structure.options.typeEdit = "<textarea ng-model='data[key]' ng-required='isRequired'></textarea>";

})

angular.module('bstl_ui').directive('bstlDatatypeCustomEdit', function($compile) {
    return {
        scope: {
            structure: "=ngModel"
        },
        require: "ngModel",
        link: function(scope, elem, attr, ngModel) {
            elem.html(scope.structure.options.typeEdit);

            $compile(elem.contents())(scope);
        }
    }
})

angular.module('bstl_ui').directive('bstlDatatypeCustomView', function($compile) {
    return {
        scope: {
            structure: "=ngModel"
        },
        require: "ngModel",
        link: function(scope, elem, attr, ngModel) {
            elem.html(scope.structure.options.typeView);
            $compile(elem.contents())(scope);
        }
    }
})
