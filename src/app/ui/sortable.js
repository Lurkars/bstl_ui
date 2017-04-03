angular.module('bstl_ui').directive('bstlSortable', function($timeout) {
    return {
        require: "ngModel",
        link: function(scope, el, attr, ngModel) {
            var element = attr['bstlSortable'] && el.find(attr['bstlSortable']) && el.find(attr['bstlSortable'])[0] || el[0];

            var options = {
                onEnd: function(evt) {
                    if (evt.newIndex >= ngModel.$viewValue.length) {
                        var move = evt.newIndex - ngModel.$viewValue.length;
                        while ((move--) + 1) {
                            ngModel.$viewValue.push(undefined);
                        }
                    }
                    ngModel.$viewValue.splice(evt.newIndex, 0, ngModel.$viewValue.splice(evt.oldIndex, 1)[0]);
                    scope.$apply();
                }
            };

            if (attr['handle']) {
                options.handle = attr['handle'];
            }

            if (attr['draggable']) {
                options.draggable = attr['draggable'];
            }

            if (attr['filter']) {
                options.filter = attr['filter'];
            }

            var sortable = Sortable.create(element, options);
        }
    }
})
