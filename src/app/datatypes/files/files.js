angular.module('bstl_ui').service('$bstlFiles', function() {
    var handleFiles = function(data, postdata, keyPrefix) {
        _.each(data, function(value, key) {
            if (value && value.$filesToUpload && _.isArray(value.$filesToUpload) && _.every(value.$filesToUpload, function(item) {
                    return item && "[object File]" === item.toString()
                })) {

                data[key].files = data[key].files || {};
                if (_.isEmpty(data[key].files)) {
                    data[key].files = {};
                }
                _.each(value.$filesToUpload, function(file, index) {

                    var keyCount = 0;
                    var fileKey = (keyPrefix ? keyPrefix + "-" : '') + key + "-" + keyCount;
                    while (_.contains(_.keys(data[key].files), fileKey)) {
                        keyCount++;
                        fileKey = (keyPrefix ? keyPrefix + "-" : '') + key + "-" + keyCount;
                    };

                    var fileName = file.name;
                    var fileCount = 0;
                    while (_.contains(_.pluck(_.values(data[key].files), "name"), fileName)) {
                        fileCount++;
                        fileName = file.name + " (" + fileCount + ")";
                    };

                    data[key].files[fileKey] = {
                        name: fileName,
                        size: file.size
                    };

                    postdata.append(fileKey, file, encodeURIComponent(file.name));
                });

                delete data[key].$filesToUpload;
            } else if (value && _.isObject(value)) {
                handleFiles(data[key], postdata, (keyPrefix ? keyPrefix + "-" : '') + key);
            }
        })
    };

    return handleFiles;
})

angular.module('bstl_ui').directive('bstlDatatypeFile', function($timeout) {
    return {
        require: "ngModel",
        link: function(scope, elem, attrs, ngModel) {

            if (attrs.singleton !== "true") {
                elem.attr('multiple', '');
            }

            elem.bind("change", function(event) {

                scope.$apply(function() {
                    if (attrs.singleton === "true") {
                        ngModel.$setViewValue({});
                    } else {
                        ngModel.$setViewValue(ngModel.$viewValue || {});
                    }

                    ngModel.$viewValue.$filesToUpload = ngModel.$viewValue.$filesToUpload || [];
                    _.each(_.clone(event.target.files), function(file) {
                        ngModel.$viewValue.$filesToUpload.push(file);
                    })
                });

                delete event.target.files;
                event.target.value = '';
            });

        }
    };
})

angular.module('bstl_ui').controller('DatatypeFilesViewCtrl', function($scope) {
    $scope.apiUrl = window.bstlapi;

    $scope.hasFile = function() {
        return $scope.data && $scope.data.files && _.size(_.keys($scope.data.files)) > 0;
    }
});

angular.module('bstl_ui').controller('DatatypeFilesEditCtrl', function($scope) {

    $scope.apiUrl = window.bstlapi;

    $scope.removeFile = function(filekey) {
        delete $scope.data[$scope.key].files[filekey];
    }

    $scope.removeFileToUpload = function(file) {
        $scope.data[$scope.key].$filesToUpload = _.without($scope.data[$scope.key].$filesToUpload, file);
    }

    $scope.hasFile = function() {
        return $scope.data[$scope.key] && $scope.data[$scope.key].files && _.size(_.keys($scope.data[$scope.key].files)) > 0;
    }
});

angular.module('bstl_ui').filter("filesize", function($bstlSynonyms) {
    var kb = 1024;
    var mb = kb * 1024;
    var gb = mb * 1024;

    return function(bytes) {
        if (!bytes) {
            return $bstlSynonyms('unknown');
        }
        if (bytes > gb) {
            return "" + Math.floor(bytes / gb) + " " + $bstlSynonyms('gigabyte');
        } else if (bytes > mb) {
            return "" + Math.floor(bytes / mb) + " " + $bstlSynonyms('megabyte');
        } else if (bytes > kb) {
            return "" + Math.floor(bytes / kb) + " " + $bstlSynonyms('kilobyte');
        }

        return "" + bytes + " " + $bstlSynonyms('byte');
    }
})
