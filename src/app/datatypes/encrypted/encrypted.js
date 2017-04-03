angular.module('bstl_ui').service('$bstlEncrypt', function($rootScope, $q, $mdDialog, DocumentService) {

    var working;
    var publicKeyText;
    var privateKeyText;
    var encryptedPrivateKey;
    var passphrase;
    var privateKey;

    return {
        isReady: function() {
            var bstlEncrypt = this;
            return !_.isEmpty(bstlEncrypt.privateKey);
        },
        isWorking: function() {
            var bstlEncrypt = this;
            return bstlEncrypt.working;
        },
        init: function() {
            var bstlEncrypt = this;

            if (bstlEncrypt.working) {
                return $q.when(false);
            }

            bstlEncrypt.publicKeyText = bstlEncrypt.publicKeyText || $rootScope.bstl && $rootScope.bstl.auth && $rootScope.bstl.auth.data && $rootScope.bstl.auth.data.pubkey;

            // init publicKeyText
            if (_.isEmpty(bstlEncrypt.publicKeyText)) {
                return bstlEncrypt.initPublicKeyText()
            }

            bstlEncrypt.privateKeyText = bstlEncrypt.privateKeyText || localStorage.getItem("bstl.privateKeyText");

            // init privateKeyText
            if (_.isEmpty(bstlEncrypt.privateKeyText)) {
                return bstlEncrypt.initPrivateKeyText();
            }


            bstlEncrypt.encryptedPrivateKey = bstlEncrypt.encryptedPrivateKey || openpgp.key.readArmored(bstlEncrypt.privateKeyText).keys[0];

            // remove privateKeyText if not readabeld
            if (_.isEmpty(bstlEncrypt.encryptedPrivateKey) || _.isEmpty(bstlEncrypt.encryptedPrivateKey.primaryKey)) {
                localStorage.removeItem("bstl.privateKeyText");
                delete bstlEncrypt.privateKeyText;
                bstlEncrypt.working = false;
                return bstlEncrypt.init();
            }

            if (_.isEmpty(bstlEncrypt.privateKey) && !bstlEncrypt.encryptedPrivateKey.primaryKey.isDecrypted) {
                bstlEncrypt.passphrase = bstlEncrypt.passphrase || sessionStorage.getItem("bstl.privateKeyPassphrase");
                // init passphrase
                if (_.isEmpty(bstlEncrypt.passphrase)) {
                    return bstlEncrypt.initPassphrase();
                }

                return bstlEncrypt.initPrivateKey();
            } else {
                // finished!
                bstlEncrypt.privateKey = bstlEncrypt.privateKey || bstlEncrypt.encryptedPrivateKey;
                bstlEncrypt.working = false;
                return $q.when(true);
            }

        },
        initPublicKeyText: function() {

            var bstlEncrypt = this;
            bstlEncrypt.working = true;

            return $mdDialog.show({
                templateUrl: 'templates/datatypes/encrypted/keygen.dialog.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                controller: "DatatypeEncryptedGenKeysCtrl"
            }).then(function(model) {
                if (model.store) {
                    localStorage.setItem("bstl.privateKeyText", model.privateKeyText);
                }

                return DocumentService.getDocument($rootScope.bstl.userId).then(function(response) {
                    var user = response.data;

                    if (!user.structure || _.isEmpty(user.structure)) {
                        user.structure = {};
                    }

                    user.structure.pubkey = {
                        "type": "textarea",
                        "options": {}
                    };

                    user.data.pubkey = model.publicKeyText;

                    return DocumentService.updateDocument(user).then(function(response) {
                        $rootScope.bstl.auth = response.data;
                        bstlEncrypt.working = false;
                        return bstlEncrypt.init();
                    }, function(error) {
                        bstlEncrypt.working = false;
                        return error;
                    })
                }, function(error) {
                    bstlEncrypt.working = false;
                    return error;
                })
            }, function(error) {
                bstlEncrypt.working = false;
                return error;
            });
        },
        initPrivateKeyText: function() {

            var bstlEncrypt = this;
            bstlEncrypt.working = true;

            return $mdDialog.show({
                templateUrl: 'templates/datatypes/encrypted/privkeytext.dialog.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                controller: function($scope, $mdDialog) {

                    $scope.storePrivateKeyText = function() {
                        $mdDialog.hide($scope.model);
                    }

                    $scope.closeDialog = function() {
                        $mdDialog.cancel();
                    }
                }
            }).then(function(model) {
                bstlEncrypt.privateKeyText = model.privateKeyText;
                if (model.store) {
                    localStorage.setItem("bstl.privateKeyText", bstlEncrypt.privateKeyText);
                }
                bstlEncrypt.working = false;
                return bstlEncrypt.init();
            }, function(error) {
                bstlEncrypt.working = false;
                return error;
            })
        },
        initPassphrase: function() {

            var bstlEncrypt = this;
            bstlEncrypt.working = true;

            return $mdDialog.show({
                templateUrl: 'templates/datatypes/encrypted/passphrase.dialog.html',
                parent: angular.element(document.body),
                fullscreen: true,
                clickOutsideToClose: true,
                controller: function($scope, $mdDialog) {
                    $scope.save = function() {
                        $mdDialog.hide($scope.model);
                    }

                    $scope.closeDialog = function() {
                        $mdDialog.cancel();
                    }
                }
            }).then(function(model) {
                bstlEncrypt.passphrase = model.passphrase;

                if (model.store) {
                    sessionStorage.setItem("bstl.privateKeyPassphrase", bstlEncrypt.passphrase);
                }

                bstlEncrypt.working = false;
                return bstlEncrypt.init();
            }, function(error) {
                bstlEncrypt.working = false;
                return error;
            });
        },
        initPrivateKey: function() {

            var bstlEncrypt = this;
            bstlEncrypt.working = true;

            var options = {
                privateKey: bstlEncrypt.encryptedPrivateKey,
                passphrase: bstlEncrypt.passphrase
            };

            return openpgp.decryptKey(options).then(function(privateKey) {
                bstlEncrypt.privateKey = privateKey.key;
                bstlEncrypt.working = false;
                return bstlEncrypt.init();
            }, function(error) {
                console.log(error);
                sessionStorage.removeItem("bstl.privateKeyPassphrase");
                delete bstlEncrypt.passphrase;
                bstlEncrypt.working = false;
                return bstlEncrypt.init();
            });
        },
        decryptMessage: function(cyphertext) {
            var bstlEncrypt = this;

            if (!bstlEncrypt.isReady()) {
                return $q.when(false);
            }

            var options = {
                message: openpgp.message.readArmored(cyphertext),
                privateKey: bstlEncrypt.privateKey
            }

            return openpgp.decrypt(options);
        },
        encryptData: function(plaintext, publicKeyText) {
            var options = {
                data: plaintext,
                publicKeys: openpgp.key.readArmored(publicKeyText).keys
            }

            return openpgp.encrypt(options);
        }
    }
});

angular.module('bstl_ui').controller('DatatypeEncryptedGenKeysCtrl', function($scope, $rootScope, $mdDialog) {

    $scope.model = {};

    $scope.passphraseStructure = {
        type: 'input',
        options: {
            'inputType': 'password'
        }
    };

    $scope.genKeys = function() {

        if ($scope.EncryptedGenKeysForm.$invalid) {
            return;
        }

        delete $scope.model.privateKeyText;
        delete $scope.model.publicKeyText;

        $scope.working = true;
        var options = {
            userIds: [{
                name: $rootScope.auth && $rootScope.auth.data && $rootScope.auth.data.name || $rootScope.auth && $rootScope.auth.id
            }],
            numBits: 4096,
            passphrase: $scope.model.passphrase
        };

        openpgp.generateKey(options).then(function(key) {
            $scope.model.privateKeyText = key.privateKeyArmored;
            $scope.model.publicKeyText = key.publicKeyArmored;
            delete $scope.model.passphrase;
            $scope.working = false;
            $scope.$apply();
        }, function(error) {
            console.log(error);
            $scope.working = false;
            $scope.$apply();
        });
    }

    $scope.clipboard = function() {
        var textArea = document.createElement("textarea");
        textArea.value = $scope.model.privateKeyText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    $scope.saveKey = function() {
        $mdDialog.hide($scope.model);
    }

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    }

    $scope.$watch('EncryptedGenKeysForm' + $scope.$id, function(formController) {
        $scope.EncryptedGenKeysForm = formController;
    });

});


angular.module('bstl_ui').directive("bstlDatatypeEncrypted", function() {
    return {
        scope: {
            model: "=bstlDatatypeEncrypted",
            document: "=",
            data: "=ngModel",
            required: "=?"
        },
        templateUrl: 'templates/datatypes/encrypted/encrypted.html',
        require: "ngModel",
        controller: function($scope, $bstlEncrypt, DocumentsService) {

            $scope.init = function() {
                $bstlEncrypt.init().then(function(result) {
                    $scope.model.isReady = result;
                }, function(error) {
                    console.log(error);
                });
            }

            $scope.isWorking = function() {
                return $bstlEncrypt.isWorking();
            }

            $scope.$watch(function() {
                return $bstlEncrypt.isReady()
            }, function(isReady) {
                if (!$scope.model.isReady) {
                    $scope.init();
                } else if (!$scope.model.isDecrypted && !_.isEmpty($scope.model.cyphertext)) {
                    $scope.working = true;
                    $bstlEncrypt.decryptMessage($scope.model.cyphertext).then(function(plaintext) {
                        $scope.model.plaintext = plaintext.data;
                        $scope.model.isDecrypted = true;
                        $scope.working = false;
                        $scope.$apply();
                    }, function(error) {
                        console.log(error);
                        $scope.working = false;
                        $scope.$apply();
                    });
                }
            })

            $scope.$watch("model.isReady", function(isReady) {
                if (isReady && !$scope.model.isDecrypted && !_.isEmpty($scope.model.cyphertext)) {
                    $scope.working = true;
                    $bstlEncrypt.decryptMessage($scope.model.cyphertext).then(function(plaintext) {
                        $scope.model.plaintext = plaintext.data;
                        $scope.model.isDecrypted = true;
                        $scope.working = false;
                        $scope.$apply();
                    }, function(error) {
                        console.log(error);
                        $scope.model.isDecrypted = false;
                        $scope.working = false;
                        $scope.$apply();
                    });
                }
            });

            $scope.$watch("model.plaintext", function(plaintext) {
                $scope.data = {};
                if (!$scope.working && !_.isEmpty(plaintext) && !_.isEmpty($scope.model.users) && $scope.model.edit) {
                    _.each($scope.model.users, function(pubKeyString, userId) {
                        $scope.working = true;

                        $bstlEncrypt.encryptData(plaintext, pubKeyString).then(function(ciphertext) {
                                $scope.data[userId] = ciphertext.data;
                                $scope.working = false;
                                $scope.$apply();
                            },
                            function(error) {
                                console.log(error);
                                $scope.working = false;
                                $scope.$apply();
                            });
                    });
                }
            });


            $scope.$watch("document.aggregate_users", function(users, oldUsers) {
                $scope.working = true;
                $scope.model.users = {};
                $scope.model.noKeyUsers = [];
                DocumentsService.getByIds(_.union([$scope.document.author], users), {
                    "id": true,
                    "data.name": true,
                    "data.pubkey": true
                }).then(function(response) {
                    _.each(response.data.documents, function(user) {
                        if (user.data && user.data.pubkey) {
                            $scope.model.users[user.id] = user.data.pubkey;
                        } else {
                            $scope.model.noKeyUsers.push({
                                id: user.id,
                                name: user.data && user.data.name,
                                access: true
                            });
                        }
                    });

                    _.each(_.union([$scope.document.author], users), function(userId) {
                        if (!_.contains(_.pluck(response.data.documents, "id"), userId)) {
                            $scope.model.noKeyUsers.push({
                                id: userId,
                                access: false
                            });
                        }
                    })
                    $scope.working = false;
                }, function(error) {
                    $scope.working = false;
                })
            }, true);
        }
    }
});

angular.module('bstl_ui').controller('DatatypeEncryptedViewCtrl', function($scope, $rootScope) {

    $scope.model = {};

    if (!$scope.data || _.isEmpty($scope.data)) {
        $scope.data = {};
        $scope.model.isDecrypted = true;
    }

    $scope.model.cyphertext = $scope.data[$rootScope.bstl.userId];
});


angular.module('bstl_ui').controller('DatatypeEncryptedEditCtrl', function($scope, $rootScope) {

    $scope.model = {
        edit: true
    };

    if (!$scope.data[$scope.key] || _.isEmpty($scope.data[$scope.key])) {
        $scope.data[$scope.key] = {};
        $scope.model.isDecrypted = true;
    }

    $scope.model.cyphertext = $scope.data[$scope.key][$rootScope.bstl.userId];
});
