angular.module('bstl_ui').service('$bstlToast', function($mdToast, $bstlSynonyms) {
    return {
        success: function() {
            return $mdToast.show($mdToast.simple().textContent($bstlSynonyms('success')).position("top right").hideDelay(150));
        },
        error: function() {
            return $mdToast.show($mdToast.simple().textContent($bstlSynonyms('error')).position("top right").hideDelay(150));
        },
        errorAction: function() {
            return $mdToast.show($mdToast.simple().textContent($bstlSynonyms('success')).position("top right").hideDelay(0).action($bstlSynonyms('ok')).highlightAction(true).highlightClass('md-warn'));
        },
        httpError: function(error) {
            return $mdToast.show($mdToast.simple().textContent($bstlSynonyms('httpError', error.status, error.statusText)).position("top right").hideDelay(0).action($bstlSynonyms('ok')).highlightAction(true).highlightClass('md-warn'));
        }
    }
});
