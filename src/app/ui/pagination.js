angular.module('bstl_ui').directive('bstlPagination', function($templateRequest, $mdSticky, $compile) {
    return {
        scope: {
            maxSize: "=maxSize",
            pagination: "=ngModel",
            pageModel: "=?",
            sticky: "=?",
            hideEmpty: "=?"
        },
        require: "ngModel",
        templateUrl: 'templates/ui/pagination.html',
        link: function(scope, elem, attr, ngModel) {

            if (scope.sticky) {
                $templateRequest('templates/ui/pagination.html').then(function(response) {
                    $mdSticky(scope, elem, $compile(response)(scope));
                })
            }

            scope.page = scope.page || 1;

            var init = function() {
                if (scope.pagination) {
                    scope.pages = [];
                    scope.currentPage = 1;
                    scope.paginationoffset = 0;
                    scope.maxSize = scope.maxSize || 5;
                    scope.maxPages = Math.ceil(scope.pagination.total / scope.pagination.limit);

                    for (var i = 1; i <= scope.maxPages; i++) {
                        scope.pages.push({
                            no: i
                        });
                    }
                }
            }

            scope.$watch("pagination.total", init, true);
            scope.$watch("pagination.limit", init, true);

            scope.$watch("maxSize", function() {
                scope.page = scope.currentPage;
            });


            scope.$watch("page", function(page) {

                var offsetLimit = Math.ceil(scope.maxSize / 2);

                if (scope.maxPages > scope.maxSize) {
                    if (page - offsetLimit < 1) {
                        scope.offset = 0;
                    } else if (page + offsetLimit > scope.maxPages) {
                        scope.offset = scope.maxPages - scope.maxSize;
                    } else {
                        scope.offset = page - offsetLimit;
                    }
                } else {
                    scope.offset = 0;
                }

                scope.currentPage = page;
                scope.pagination.offset = (page - 1) * scope.pagination.limit;

            });

            scope.select = function(page) {
                scope.page = page;
            }

            scope.newer = function() {
                if (scope.currentPage > 1) {
                    scope.page = scope.currentPage - 1;
                }
            }

            scope.older = function() {
                if (scope.currentPage < scope.maxPages) {
                    scope.page = scope.currentPage + 1;
                }
            }
        }
    }
})
