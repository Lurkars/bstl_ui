angular.module("bstl_ui").service('$bstlSynonyms', function($rootScope) {
    return function() {

        var key = arguments[0];
        var value = key;

        window.synonymDebug = window.synonymDebug || [];
        var synonyms = $rootScope.synonyms;
        var order = _.keys(synonyms);
        var synonym = _.first(order);
        var isIcon = _.isString(key) && key.indexOf('icon.') === 0;

        if (!synonyms) {
            if (!isIcon && !_.contains(window.synonymDebug, key)) {
                window.synonymDebug.push(key);
            }
            if (isIcon) {
                value = key.replace("icon.", '');
            }

            return value;
        }

        if (synonyms[synonym] && synonyms[synonym][key]) {
            window.synonymDebug = _.without(window.synonymDebug, key);
            value = synonyms[synonym][key];
        } else {
            var index = 1;
            while (index < (order.length - 1) && synonyms[order[index]] && !synonyms[order[index]][key]) {
                index++;
            }
            if (synonyms[order[index]] && synonyms[order[index]][key]) {
                window.synonymDebug = _.without(window.synonymDebug, key);
                value = synonyms[order[index]][key];
            } else {
                if (!isIcon && !_.contains(window.synonymDebug, key)) {
                    window.synonymDebug.push(key);
                }
                if (isIcon) {
                    value = key.replace("icon.", '');
                }
            }
        }

        for (var i = 1; i < arguments.length; i++) {
            value = value.replace('$' + i, arguments[i]);
        }

        return value;
    }
})

angular.module("bstl_ui").filter("synonym", function($bstlSynonyms) {
    return function() {
        return $bstlSynonyms.apply(this, arguments);
    }
});
