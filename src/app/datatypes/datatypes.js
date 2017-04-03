angular.module('bstl_ui').constant("bstlDatatypes", ['input', 'textarea', 'select', 'html', 'files',
    'list', 'encrypted', 'structure', 'document', 'filter', 'picker', 'custom'
]);

angular.module('bstl_ui').controller('DatatypeCtrl', function($scope) {

    if (!$scope.structure || _.isEmpty($scope.structure)) {
        $scope.structure = {};
    }

    if (!$scope.structure.type) {
        $scope.structure.type = 'textarea';
    }

    if (!$scope.structure.options || _.isEmpty($scope.structure.options)) {
        $scope.structure.options = {};
    }

})

angular.module('bstl_ui').directive('bstlDatatypeView', function() {
    return {
        scope: {
            structure: "=?bstlDatatypeView",
            data: "=ngModel",
            document: "=?",
            excerpt: "=?",
            label: "=?"
        },
        require: "ngModel",
        templateUrl: 'templates/datatypes/view.html',
        controller: 'DatatypeCtrl',
        link: function(scope, elem, attr) {}
    }
})

angular.module('bstl_ui').directive('bstlDatatypeEdit', function() {
    return {
        scope: {
            structure: "=?bstlDatatypeEdit",
            data: "=ngModel",
            key: "=",
            document: "=?",
            label: "=?",
            required: "=?"
        },
        require: "ngModel",
        templateUrl: 'templates/datatypes/edit.html',
        controller: 'DatatypeCtrl',
        link: function(scope, elem, attr, ngModel) {

            scope.$watch('required', function(required) {
                if (attr.required !== undefined) {
                    scope.isRequired = required && scope.structure && scope.structure.required;
                } else {
                    scope.isRequired = scope.structure && scope.structure.required;
                }
            });

            scope.$watch(function() {
                return scope.data[scope.key];
            }, function(data) {
                if (scope.isRequired && (!data || _.isEmpty(data))) {
                    ngModel.$setValidity(scope.key, false);
                } else {
                    ngModel.$setValidity(scope.key, true);
                }
            }, true)
        }
    }
})

angular.module('bstl_ui').directive('bstlDatatypeOptions', function(bstlDatatypes) {
    return {
        scope: {
            structure: "=bstlDatatypeOptions"
        },
        templateUrl: 'templates/datatypes/options.html',
        controller: 'DatatypeCtrl',
        link: function(scope, elem, attr, ngModel) {
            scope.datatypes = bstlDatatypes;

            scope.disabledDatatype = ['etherpad'];

            scope.isDatatypeDisabled = function(datatype) {
                return _.contains(scope.disabledDatatype, datatype);
            }

            scope.$watch("structure.type", function(type, oldType) {
                if (type && oldType && type !== oldType) {
                    scope.structure.options = {};
                }
            }, true);

        }
    }
})


angular.module('bstl_ui').directive('isolateForm', function() {
    return {
        restrict: 'A',
        require: '?form',
        link: function link(scope, elem, attr, formController) {
            if (!formController) {
                return;
            }

            formController.$$parentForm.$removeControl(formController);
        }
    };
});
