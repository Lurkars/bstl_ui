angular.module('bstl_ui').directive("bstlJsonBind", function($timeout) {
    return {
        require: "ngModel",
        link: function(scope, el, attrs, ngModel) {

            ngModel.$parsers.push(function(input) {
                var output = ngModel.$modelValue;
                try {
                    output = JSON.parse(input);
                    ngModel.$setValidity("validjson", true);
                } catch (e) {
                    ngModel.$setValidity("validjson", false);
                }

                return output;
            });

            ngModel.$formatters.push(function(data) {
                return JSON.stringify(data, undefined, 4);
            });

            $timeout(function() {
                el[0].style.height = "" + (window.innerHeight - el[0].getBoundingClientRect().top - 55) + "px";
            })
        }
    }
})
