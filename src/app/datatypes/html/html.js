angular.module('bstl_ui').directive('bstlDatatypeHtml', function($timeout, $sanitize, $mdMedia) {
    return {
        scope: {
            document: "=",
            key: "="
        },
        require: "ngModel",
        link: function(scope, elem, attr, ngModel) {
            var idIndex = 0;
            var id = 'bstl-html-' + (scope.document && scope.document.id ? scope.document.id + '-' : '') + scope.key + '-' + idIndex;

            while (tinymce.editors.length > idIndex) {
                idIndex++;
                id = 'bstl-html-' + (scope.document && scope.document.id ? scope.document.id + '-' : '') + scope.key + '-' + idIndex;
            }

            var update = function() {
                $timeout(function() {
                    if (_.isEmpty(elem.text())) {
                        ngModel.$setViewValue('');
                    } else {
                        ngModel.$setViewValue($sanitize(elem.html()));
                    }
                });
            }

            ngModel.$render = function() {
                elem.html(ngModel.$viewValue || "");
            }

            elem.attr('id', id);

            var config = {
                selector: '#' + id,
                inline: true,
                fixed_toolbar_container: '#tinymce-toolbar',
                plugins: 'autoresize advlist autolink lists link image charmap anchor fullscreen searchreplace code media table contextmenu paste',
                menubar: 'edit insert format table tools',
                toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | fullscreen',
                setup: function(editor) {
                    editor.on('change', function(e) {
                        update();
                    })

                    editor.on('blur', function(e) {
                        update();
                    })

                    editor.on('keyPress', function(e) {
                        update();
                    })

                    editor.on('postProcess', function(e) {
                        update();
                    })
                }
            };

            scope.$watch(function() {
                return $mdMedia('xs');
            }, function(xs) {
                tinymce.remove("#" + id);
                if (xs) {
                    config.theme = 'inlite';
                    tinymce.init(config);
                } else {
                    delete config.theme;
                    tinymce.init(config);
                }
            });

            scope.$on("$destroy", function() {
                tinymce.remove("#" + id);
            })

        }
    }
})
