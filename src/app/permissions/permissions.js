/** Permissions Service * */
angular.module('bstl_ui').service('$bstlPermissions', function($rootScope, $mdDialog) {
    return {
        getPermissions: function(document, userId) {
            var userId = userId || $rootScope.bstl && $rootScope.bstl.userId;

            var roles = ["p"]; // public

            if (userId) {
                roles.push("o"); // other
            }

            if (_.contains(document.users, userId)) {
                roles.push("u"); // user
            }

            if (userId == document.author) {
                roles.push("a"); // author
            }
            if (userId == document.id) {
                roles.push("id"); // id
            }

            var permissions = [];

            if ($rootScope.bstl && $rootScope.bstl.devmode && $rootScope.bstl.userId == "system") {
                permissions = ["own", "remove", "structure", "edit", "contribute", "view"];
            }

            _.each(document.permissions, function(permission, key) {
                _.each(roles, function(role) {
                    if (permission && permission[role] && !_.contains(permissions, key)) {
                        permissions.push(key);
                    }
                });
            });

            return permissions;
        },
        hasPermission: function(document, permission, userId) {
            return _.contains(this.getPermissions(document, userId), permission);
        },
        permissionFilter: function(permission, userId) {
            var userId = userId || $rootScope.bstl && $rootScope.bstl.userId;
            var filter = {
                '_or': []
            };

            var publicFilter = {};
            publicFilter['permissions_+_' + permission + '_+_p'] = true;
            filter['_or'].push(publicFilter);

            if (!userId) {
                return filter;
            }

            var otherFilter = {};
            otherFilter['permissions_+_' + permission + '_+_o'] = true;
            filter['_or'].push(otherFilter);

            var userFilter = {
                '_and': []
            };
            var userPermFilter = {};
            userPermFilter['permissions_+_' + permission + '_+_u'] = true;
            userFilter['_and'].push(userPermFilter);
            userFilter['_and'].push({
                'aggregate_users': {
                    '_in': [userId]
                }
            });
            filter['_or'].push(userFilter);

            var authorFilter = {
                '_and': []
            };
            var authorPermFilter = {};
            authorPermFilter['permissions_+_' + permission + '_+_a'] = true;
            authorFilter['_and'].push(authorPermFilter);
            authorFilter['_and'].push({
                'author': userId
            });
            filter['_or'].push(authorFilter);
            return filter;
        },
        openPermissionsDialog: function(permissionsObject, hideUsers) {
            return $mdDialog.show({
                controller: "DocumentPermissionsCtrl",
                templateUrl: 'templates/document/permissions/permissions.dialog.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                locals: {
                    'document': permissionsObject,
                    'hideUsers': hideUsers
                },
                multiple: true
            });
        }
    }
})

angular.module('bstl_ui').constant("bstlPermissions", {
    public: {
        "own": {
            a: true,
            u: true
        },
        "remove": {
            a: true,
            u: true
        },
        "structure": {
            a: true,
            u: true
        },
        "edit": {
            a: true,
            u: true
        },
        "contribute": {
            a: true,
            u: true,
            o: true
        },
        "view": {
            a: true,
            u: true,
            o: true,
            p: true
        }
    },
    restricted: {
        "own": {
            a: true
        },
        "remove": {
            a: true
        },
        "structure": {
            a: true,
            u: true
        },
        "edit": {
            a: true,
            u: true
        },
        "contribute": {
            a: true,
            u: true,
            o: true
        },
        "view": {
            a: true,
            u: true,
            o: true
        }
    },
    private: {
        "own": {
            a: true
        },
        "remove": {
            a: true,
        },
        "structure": {
            a: true
        },
        "edit": {
            a: true,
            u: true
        },
        "contribute": {
            a: true,
            u: true
        },
        "view": {
            a: true,
            u: true
        }
    }
});

angular.module('bstl_ui').controller('DocumentPermissionsCtrl', function($scope, $mdDialog, DocumentService, bstlPermissions, document, hideUsers) {

    $scope.model = {};
    $scope.document = _.clone(document);
    $scope.hideUsers = hideUsers;
    $scope.model.permissions = _.clone($scope.document.permissions) || {};
    $scope.model.users = _.clone($scope.document.users) || [];

    if (!$scope.model.permissions.view) {
        $scope.model.permissions.view = {};
    }
    if (!$scope.model.permissions.contribute) {
        $scope.model.permissions.contribute = {};
    }
    if (!$scope.model.permissions.edit) {
        $scope.model.permissions.edit = {};
    }
    if (!$scope.model.permissions.structure) {
        $scope.model.permissions.structure = {};
    }
    if (!$scope.model.permissions.remove) {
        $scope.model.permissions.remove = {};
    }
    if (!$scope.model.permissions.own) {
        $scope.model.permissions.own = {};
    }

    $scope.userpicker = {
        type: "picker",
        options: {
            filter: {
                "interfaces": {
                    "_in": ["authentication"]
                }
            },
            editFilter: true
        }
    }

    $scope.updatePermissions = function() {
        $mdDialog.hide($scope.model);
    }

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    }

    $scope.$watch('model.template', function(permissionTemplate) {
        if (permissionTemplate) {
            switch (permissionTemplate) {
                case 'public':
                    $scope.model.permissions = JSON.parse(JSON.stringify(bstlPermissions.public));
                    break;
                case 'restricted':
                    $scope.model.permissions = JSON.parse(JSON.stringify(bstlPermissions.restricted));
                    break;
                case 'private':
                    $scope.model.permissions = JSON.parse(JSON.stringify(bstlPermissions.private));
                    break;
            }
        }
    });


    var autoPermissions = function(permissions, oldPermissions, role, parentRole) {
        // self restrict
        if (!permissions.view[role] && oldPermissions.view[role]) {
            permissions.contribute[role] = false;
        }

        if (!permissions.contribute[role] && oldPermissions.contribute[role]) {
            permissions.edit[role] = false;
        }

        if (!permissions.edit[role] && oldPermissions.edit[role]) {
            permissions.structure[role] = false;
        }

        if (!permissions.structure[role] && oldPermissions.structure[role]) {
            permissions.remove[role] = false;
        }

        if (!permissions.remove[role] && oldPermissions.remove[role]) {
            permissions.own[role] = false;
        }

        // self allow
        if (permissions.own[role]) {
            permissions.remove[role] = true;
        }

        if (permissions.remove[role]) {
            permissions.structure[role] = true;
        }

        if (permissions.structure[role]) {
            permissions.edit[role] = true;
        }

        if (permissions.edit[role]) {
            permissions.contribute[role] = true;
        }

        if (permissions.contribute[role]) {
            permissions.view[role] = true;
        }

        if (parentRole) {
            // parent restict
            if (permissions.view[role] && !permissions.view[parentRole] && oldPermissions.view[parentRole]) {
                permissions.view[role] = false;
            }

            if (permissions.contribute[role] && !permissions.contribute[parentRole] && oldPermissions.contribute[parentRole]) {
                permissions.contribute[role] = false;
            }

            if (permissions.edit[role] && !permissions.edit[parentRole] && oldPermissions.edit[parentRole]) {
                permissions.edit[role] = false;
            }

            if (permissions.structure[role] && !permissions.structure[parentRole] && oldPermissions.structure[parentRole]) {
                permissions.structure[role] = false;
            }

            if (permissions.remove[role] && !permissions.remove[parentRole] && oldPermissions.remove[parentRole]) {
                permissions.remove[role] = false;
            }

            if (permissions.own[role] && !permissions.own[parentRole] && oldPermissions.own[parentRole]) {
                permissions.own[role] = false;
            }

            // parent allow
            if (permissions.view[role] && !oldPermissions.view[parentRole]) {
                permissions.view[parentRole] = true;
            }

            if (permissions.contribute[role] && !oldPermissions.contribute[parentRole]) {
                permissions.contribute[parentRole] = true;
            }

            if (permissions.edit[role] && !oldPermissions.edit[parentRole]) {
                permissions.edit[parentRole] = true;
            }

            if (permissions.structure[role] && !oldPermissions.structure[parentRole]) {
                permissions.structure[parentRole] = true;
            }

            if (permissions.remove[role] && !oldPermissions.remove[parentRole]) {
                permissions.remove[parentRole] = true;
            }

            if (permissions.own[role] && !oldPermissions.own[parentRole]) {
                permissions.own[parentRole] = true;
            }
        }
    }


    var permissionEquals = function(permissionA, permissionB) {
        var permA = _.size(permissionA) >= _.size(permissionB) ? permissionA : permissionB;
        var permB = _.size(permissionA) >= _.size(permissionB) ? permissionB : permissionA;
        return _.every(permA, function(items, permissionKey) {
            var itemsA = _.size(items) >= _.size(permB[permissionKey]) ? items : permB[permissionKey];
            var itemsB = _.size(items) >= _.size(permB[permissionKey]) ? permB[permissionKey] : items;
            return _.every(itemsA, function(item, itemKey) {
                if (!item) {
                    return !itemsB || !itemsB[itemKey];
                } else {
                    return itemsB && itemsB[itemKey];
                }
            })
        })
    }

    $scope.$watch('model.permissions', function(permissions, oldPermissions) {
        if (permissions) {
            // auto author
            autoPermissions(permissions, oldPermissions || {}, "a");
            // auto user
            autoPermissions(permissions, oldPermissions || {}, "u");
            // auto other
            autoPermissions(permissions, oldPermissions || {}, "o", "u");
            // auto public
            autoPermissions(permissions, oldPermissions || {}, "p", "o");

            if (permissionEquals(permissions, bstlPermissions.public)) {
                $scope.model.template = "public";
            } else if (permissionEquals(permissions, bstlPermissions.restricted)) {
                $scope.model.template = "restricted";
            } else if (permissionEquals(permissions, bstlPermissions.private)) {
                $scope.model.template = "private";
            } else {
                $scope.model.template = "";
                $scope.model.extended = true;
            }
        } else {
            $scope.model.template = "";
            $scope.model.extended = true;
        }
    }, true)

    $scope.toggleExtended = function() {
        $scope.model.extended = !$scope.model.extended;
        if ($scope.model.template === "") {
            $scope.model.extended = true;
        }
    }

    $scope.$watch('PermissionsForm' + $scope.$id, function(formController) {
        $scope.PermissionsForm = formController;
    });
})
