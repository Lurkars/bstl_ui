/** Document Service * */
angular.module('bstl_ui').service('DocumentService', function($http, $bstlFiles) {
    return {
        getDocument: function(id) {
            return $http.get('bstlapi/document/' + id);
        },
        getDocumentTemplate: function(id, clone) {
            return $http.get('bstlapi/document/' + id + "?template=true" + (clone ? "&clone=true" : ""));
        },
        getDocumentClone: function(id) {
            return $http.get('bstlapi/document/' + id + "?clone=true");
        },
        getDocumentField: function(id, path) {
            return $http.get('bstlapi/document/' + id + "/" + path.join("/"));
        },
        updateDocument: function(document, progressModel) {
            var that = this;
            var postdata = new FormData();
            if (!document.data || _.isEmpty(document.data)) {
                document.data = {};
            }

            $bstlFiles(document.data, postdata);

            postdata.append("--data--", new Blob([angular.toJson(_.clone(document))], {
                type: "application/json"
            }));

            return $http.post('bstlapi/document', postdata, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                },
                uploadEventHandlers: {
                    progress: function(e) {
                        if (progressModel) {
                            progressModel.progress = e.loaded / e.total * 100;
                        }
                    }
                }
            });
        },
        updateDocumentPermissions: function(id, permissions, users) {
            var data = {
                permissions: permissions,
                users: users
            };

            return $http.post('bstlapi/document/' + id + "/permissions", data);
        },
        updateDocumentStructure: function(id, structure) {
            if (!structure || _.isEmpty(structure)) {
                structure = {};
            }
            return $http.post('bstlapi/document/' + id + "/structure", structure);
        },
        updateDocumentData: function(id, data, progressModel) {
            var that = this;
            var postdata = new FormData();
            if (!data || _.isEmpty(data)) {
                data = {};
            }

            $bstlFiles(data, postdata);

            postdata.append("--data--", new Blob([angular.toJson(_.clone(data))], {
                type: "application/json"
            }));

            return $http.post('bstlapi/document/' + id + "/data", postdata, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                },
                uploadEventHandlers: {
                    progress: function(e) {
                        if (progressModel) {
                            progressModel.progress = e.loaded / e.total * 100;
                        }
                    }
                }
            });
        },
        updateDocumentContribute: function(id, contribute, value) {
            var data = {};
            data[contribute] = value;
            return $http.post('bstlapi/document/' + id + "/contribute", data);
        },
        removeDocument: function(id) {
            return $http.delete('bstlapi/document/' + id);
        }
    }
})
