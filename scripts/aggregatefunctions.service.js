'use strict';

/**
 * @ngdoc service
 * @name UnicsJassa.AggregateFunctions
 * @description
 * # AggregateFunctions Offers a list of available aggregation functions based on the exisiting
 * aggregators in the jassa library 
 * Service in the UnicsJassa.
 */
angular.module('UnicsJassa')
  .service('AggregateFunctions', function () {
    
    var sparql = jassa.sparql,
        aggregateFunctions = _.map([sparql.AggAvg, sparql.AggCount, sparql.AggMax, sparql.AggMin, sparql.AggSum, sparql.AggGroup_Concat],
            function(aggClass) {
                return (new aggClass()).name;
            }
        );

    // keys will be the available aggregate functions from jassa lib
    // values will be the string 
    return _.zipObject(        
        // keys
        _.map(aggregateFunctions, function(aggFunc) {
            return aggFunc.toUpperCase()
        }),
        // values
        aggregateFunctions
    );
    
  });