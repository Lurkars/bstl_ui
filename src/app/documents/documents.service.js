/** Documents Service * */
angular.module('bstl_ui').service('DocumentsService', function($http, $rootScope) {
    return {
        /**
         * convert all _ to $
         **/
        convertFilter: function(filter) {
            var that = this;

            if (_.isArray(filter)) {
                filter = _.map(filter, function(item) {
                    return that.convertFilter(item);
                })
            } else if (_.isObject(filter)) {
                filter = _.reduce(filter, function(result, value, key) {
                    key = key.startsWith("_") ? "$" + key.substr(1, key.length) : key;
                    key = key.replace(/_\+_/g, '.');
                    result[key] = that.convertFilter(value);

                    return result;
                }, {});
            }

            if (_.isString(filter) && filter == "_currentUser") {
                return $rootScope.bstl && $rootScope.bstl.userId;
            }

            return filter;
        },
        getRequestParams: function(filter, fields, pagination) {
            var data = {};
            if (!_.isEmpty(filter)) {
                data.filter = this.convertFilter(filter);
                if (_.isEmpty(data.filter)) {
                    delete data.filter;
                }
            }

            if (!_.isEmpty(fields)) {
                data.fields = fields;
                if (_.isEmpty(data.fields)) {
                    delete data.fields;
                }
            }

            if (!_.isEmpty(pagination)) {
                data.pagination = pagination;
                if (_.isEmpty(data.pagination)) {
                    delete data.pagination;
                }
            }

            return data;
        },
        find: function(filter, pagination, fields) {
            return $http.post('bstlapi/documents', this.getRequestParams(filter, fields, pagination));
        },
        findOne: function(filter, fields) {
            return $http.post('bstlapi/documents/one', this.getRequestParams(filter, fields));
        },
        count: function(filter) {
            return $http.post('bstlapi/documents/count', this.getRequestParams(filter));
        },
        getByIds: function(ids, fields, filter) {

            var that = this;
            var idsFilter = {
                'id': {
                    '_in': ids
                }
            };

            if (filter && !_.isEmpty(filter)) {
                idsFilter = {
                    '_and': [idsFilter, filter]
                };
            }

            return that.find(idsFilter, {
                limit: 9999
            }, fields);
        }
    }
})
