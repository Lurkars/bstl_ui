angular.module('bstl_ui').constant("bstlDefaultUiConfig", {
    "author": "system",
    "interfaces": ["template", "uiconfig"],
    "permissions": {
        "own": {
            "a": true
        },
        "remove": {
            "a": true
        },
        "structure": {
            "a": true
        },
        "edit": {
            "a": true
        },
        "view": {
            "a": true,
            "u": true,
            "o": true,
            "p": true
        }
    },
    "data": {
        "name": "UiConfig System",
        "navconfigs": []
    }
});

angular.module('bstl_ui').constant("bstlDefaultNavConfig", {
    "author": "system",
    "interfaces": ["template", "navconfig"],
    "permissions": {
        "own": {
            "a": true
        },
        "remove": {
            "a": true
        },
        "structure": {
            "a": true
        },
        "edit": {
            "a": true
        },
        "view": {
            "a": true,
            "u": true,
            "o": true,
            "p": true
        }
    },
    "data": {
        "name": "NavConfig System",
        "navnodes": ["navnode-system"],
        "create": ["template"]
    }
});



angular.module('bstl_ui').constant("bstlDefaultNavnode", {
    "author": "system",
    "interfaces": ["template", "navnode"],
    "permissions": {
        "own": {
            "a": true
        },
        "remove": {
            "a": true
        },
        "structure": {
            "a": true
        },
        "edit": {
            "a": true
        },
        "view": {
            "a": true,
            "u": true,
            "o": true,
            "p": true
        }
    },
    "data": {
        "name": "Navnode System",
        "title": "System",
        "filter": {}
    }
});
