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
        aggregateFunctions = _.map([sparql.AggAvg, sparql.AggCount, sparql.AggMax, sparql.AggMin, sparql.AggSum ],
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
'use strict';

/**
 * @ngdoc service
 * @name UnicsJassa.Prefixes
 * @description
 * # Prefixes
 * Service in the UnicsJassa.
 */
angular.module('UnicsJassa')
  .factory('Prefixes', function ($http, configuration) {    

    var prefixes = new rdf.PrefixMappingImpl(configuration.prefixes);
    return {
      getPrefixOntop   : function() { return 'ontop'; },
      getPrefixRdf     : function() { return 'rdf'; },
      getPrefixDcterms : function() { return 'dcterms'; },
      getPrefixRis3cat : function() { return 'ris3cat'; },
      prefixMapping    : prefixes,
      getUriPrefix     : function(prefix) { return prefixes.getNsPrefixURI(prefix); }      
    }
  });

'use strict';

/**
 * @ngdoc service
 * @name UnicsJassa.SparqlFacade
 * @description
 * # SparqlFacade
 * Service in the UnicsJassa.
 */
angular.module('UnicsJassa')
  .service('SparqlFacade', function (Prefixes, unics, AggregateFunctions) {
    var prefixes = Prefixes.prefixMapping;

    var service = {
      typeOf : typeOf,
      triple : triple,
      instanceOf : instanceOf,
      predicateObjectList : predicateObjectList,
      constraint : constraint,
      generateAggregators : generateAggregators,
      exploreObjectType : exploreObjectType,
      setAsOptional : setAsOptional,
      setFilter : setFilter,
      setFilterByNodeUri : setFilterByNodeUri,
      getReferencedVarsInFilters : getReferencedVarsInFilters,
      getVarsAndValuesFromFilter : getVarsAndValuesFromFilter,
      negateFilter : negateFilter,
      constraintBoolean : constraintBoolean,
      findElementFiltersByVars : findElementFiltersByVars
    };

    return service;



    ////////////////////////////////////////////////////////////////////////////////



    /**
     * Generates a varExprList containing the aggregators indicated in
     * an array of AggregateSpecification
     * 
     * @param {any} aggregateSpecs 
     * @returns varExprList array of aggregations
     */
    function generateAggregators(aggregateSpecs) {
      var varExprList = new sparql.VarExprList(),
          agg;

      aggregateSpecs.forEach( function(aggSpec) {
        switch(aggSpec.aggregationType) {
          case AggregateFunctions.AVG: 
            agg = sparql.AggregatorFactory.createAvg(aggSpec.isDistinct, aggSpec.getVar()); 
            break;
          case AggregateFunctions.COUNT: 
            agg = sparql.AggregatorFactory.createCount(aggSpec.isDistinct, aggSpec.getVar()); 
            break;
          case AggregateFunctions.MAX: 
            agg = sparql.AggregatorFactory.createMax(aggSpec.isDistinct, aggSpec.getVar()); 
            break;
          case AggregateFunctions.MIN: 
            agg = sparql.AggregatorFactory.createMin(aggSpec.isDistinct, aggSpec.getVar()); 
            break;
          case AggregateFunctions.SUM: 
            agg = sparql.AggregatorFactory.createSum(aggSpec.isDistinct, aggSpec.getVar()); 
            break;            
        };

        varExprList.add(
          aggSpec.getAggVar(),
          new sparql.ExprAggregator(null, agg)
        );
      });

      return varExprList;
    }



    /**
     * Generates a triple composed as {?var predicate object}
     * 
     * @param {any} subject 
     * @param {any} predicate 
     * @param {any} object 
     * @returns A rdf.Triple
     */
    function instanceOf(subject, predicate, object) {
      return new rdf.Triple(
        unics.asVar(subject),predicate, object
      );
    }



    /**
     * Generates a triple composed as {?var :type predicate}
     * 
     * @param {any} subject 
     * @param {any} object 
     * @returns A rdf.Triple
     */
    function typeOf(subject, object) {
      return new rdf.Triple(
        unics.asVar(subject), 
        jassa.vocab.rdf.type, //rdf.NodeUtils.toPrettyString(vocab.rdf.type, prefixes), 
        object //rdf.NodeUtils.toPrettyString(object, prefixes)
      );
    };



    /**
     * Generates a triple composed as {?var predicate ?var}
     * 
     * @param {any} subject 
     * @param {any} predicate 
     * @param {any} object 
     * @returns 
     */
    function triple(subject, predicate, object) {
      return new rdf.Triple(
        unics.asVar(subject), 
        predicate, //rdf.NodeUtils.toPrettyString(predicate, prefixes),
        unics.asVar(object)
      );
    }



    /**
     * Creates a pattern of triples with a common subject
     * https://www.w3.org/TR/rdf-sparql-query/#QSynTriples
     * 
     * @param {any} subject 
     * @param {any} predicates 
     * @returns A sparql.ElementTriplesBlock
     */
    function predicateObjectList(subject, predicates) {
      return new sparql.ElementTriplesBlock(
        _(predicates)
          .map(function(predicate) { 
            if(predicate instanceof Object && predicate.constructor === Object)
              return triple(subject, predicate.p, predicate.o);
            else
              return triple(subject, predicate, predicate);
          })
          .value()
        );
    }


    /**
     * Returns a ElementTriplesBlock composed of triples: first 
     * triple describes the type of the subject {?var :type predicate}
     * and the rest are triples as {?var predicate ?var}
     * 
     * @param {any} subject 
     * @param {any} type 
     * @param {any} predicates 
     * @returns A sparql.ElementTriplesBlock
     */
    function exploreObjectType(subject, type, predicates) {
      var tp = new sparql.ElementTriplesBlock();
      tp.addTriples(typeOf(subject, type))
      tp.addTriples(predicateObjectList(subject, predicates).getTriples());
      return tp;
    }



    /**
     * Generates a triple composed as {subject predicate NodeLiteral}
     * 
     * @param {any} subject 
     * @param {any} predicate 
     * @param {any} literalValue 
     * @returns 
     */
    function constraint(subject, predicate, literalValue) {
      return new rdf.Triple(
        subject,
        predicate,
        new rdf.NodeFactory.createPlainLiteral(literalValue, null)
      );
    }



    /**
     * Creates a triple constrained by a boolean value
     * @param {*} subject 
     * @param {*} predicate 
     * @param {*} literalValue 
     */
    function constraintBoolean(subject, predicate, literalValue) {
      return new rdf.Triple(
        subject,
        predicate,
        sparql.NodeValueUtils.createLiteral(literalValue, jassa.vocab.xsd.xboolean.getUri())
      );
    }




    function setAsOptional(elementTriplesBlock) {      
      return new sparql.ElementOptional(elementTriplesBlock);
    }


    
    /**
     * Return an ElementFilter
     * 
     * @param {any} node_uri 
     * @param {any} literalValues Can be a single value or an array of values
     * @param {any} expressionName an sparql expression, like E_NotEquals
     * @param {any} logicalOperator an sparql logical expression: 'AND' , 'OR'
     * @returns An ElementFilter
     */
    function setFilter(node_uri, literalValues, expressionName, logicalOperator) {

      // map the value or array of values to an array
      // of E_Equals expressions
      var equalsExpressions = _([].concat(literalValues))
        .map(function(literalValue) {
          return new sparql[expressionName](
            new sparql.ExprVar(unics.asVar(node_uri)),            
            // using isNaN = isString -> https://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number            
            (_.isInteger(literalValue))?
            sparql.NodeValueUtils.makeInteger(literalValue) : 
            sparql.NodeValueUtils.makeString(literalValue)
          )
        })
        .value();

      // return the element filter
      return new sparql.ElementFilter(
        (equalsExpressions.length == 1)?
          _.first(equalsExpressions) : 
          (logicalOperator == 'OR')? sparql.ExprUtils.orify(equalsExpressions) : sparql.ExprUtils.andify(equalsExpressions)
      );
    }




    /**
     * Return an ElementFilter
     * 
     * @param {any} node_uri 
     * @param {any} Node_Uris Can be a single Node_Uri or an array of Node_Uris
     * @param {any} expressionName an sparql expression, like E_NotEquals
     * @param {any} logicalOperator an sparql logical expression: 'AND' , 'OR'
     * @returns An ElementFilter
     */
    function setFilterByNodeUri(node_uri, node_uris, expressionName, logicalOperator) {
      
      // map the value or array of values to an array
      // of E_Equals expressions
      var equalsExpressions = _([].concat(node_uris))
        .map(function(n) {
          return new sparql[expressionName](
            new sparql.ExprVar(unics.asVar(node_uri)),
            n
          )
        })
        .value();

      // return the element filter
      return new sparql.ElementFilter(
        (equalsExpressions.length == 1)?
          _.first(equalsExpressions) : 
          (logicalOperator == 'OR')? sparql.ExprUtils.orify(equalsExpressions) : sparql.ExprUtils.andify(equalsExpressions)
      );
    }



    /**
     * return an varExprList with the vars mentioned in the 
     * array of element filters
     */
    function getReferencedVarsInFilters(elementFiltersArr) {
      var varExprList = new sparql.VarExprList();
      
      varExprList.addAll(
        _(elementFiltersArr)
        .map(function(e) { return e.getVarsMentioned(); })
        .flatten()
        .value()
      );
      
      return varExprList;
    }



    /**
     * Returns an ElementFilter with the negated expression of the original filter
     * @param {*} elementFilter 
     */
    function negateFilter(elementFilter) {
      return new sparql.ElementFilter(
        new sparql.E_LogicalNot(elementFilter.expr) 
      );
    }


    /**
     * Receives a filter element and returns an object with
     * mentioned variables in the filter as the object's keys 
     * and values and operations of these variables as object's values  
     */
    function getVarsAndValuesFromFilter(elementFilter) {
      // the filter can be composed with multiple
      // conditions, which in turn can be nested: so 
      // traverse them as a tree structure and collect
      // vars mentioned and its values
      var expressionsNotLogical = [];
      var isLogical = function(expr) {
        return expr instanceof sparql.E_LogicalAnd || expr instanceof sparql.E_LogicalOr;
      };

      // get those expressions that are not logical (equal, greater than, etc..)
      // as they have vars and values
      var containsExprLogical = function(element) {
        var hasLogicals = false,
            notLogicals = [];

        if(!isLogical(element))
          notLogicals.push(element);
        else {
          notLogicals = _.filter(
            [element.left, element.right],
            function(expr) { return !isLogical(expr); }
          );
          // if one child was logical we will continue traversing the three
          hasLogicals = !(notLogicals.length == 2)
        }
        //acumulate not logical expressions
        expressionsNotLogical = expressionsNotLogical.concat(notLogicals)

        return hasLogicals;
      };

      // get children, this is, nested logical expressions
      var getChildren = function(element) {
        return _.filter(
          [element.left, element.right],
          function(expr) { return isLogical(expr); }
        );
      }

      // traverse the filter expresion
      jassa.util.TreeUtils.visitDepthFirst(
        elementFilter.expr,
        getChildren,    
        containsExprLogical 
      );
      
      // after navigatin the filter expresion, return
      // variables and its values
      var result = {};      
      expressionsNotLogical.forEach(function(expr) {
        // add varname as key
        if( result[expr.getLeft().asVar().name] == undefined)
          result[expr.getLeft().asVar().name] = [];

        // add values and the operation over that var
        result[expr.getLeft().asVar().name].push(
          {
            value : expr.getRight().node.getLiteral().val,
            op : expr.name
          }
        );        
      });

      return result;
    }



    
    /**
     * Given an array of ElementFilter, return the first ElementFilter 
     * that contains any of the vars indicated
     * @param {*} elementFilters 
     * @param {*} vars 
     */
    function findElementFiltersByVars(elementFilters, vars) {

      return _.find(
        elementFilters,
        function(e) {
          var varExprList = new sparql.VarExprList();
              varExprList.addAll(e.getVarsMentioned());      
          return _.some(vars, function(v) { 
            return varExprList.contains(v); 
          });
        }
      );      
    }




  });

'use strict';

/**
 * @ngdoc service
 * @name UnicsJassa.OntologyVocabulary
 * @description
 * # OntologyVocabulary
 * Service in the UnicsJassa
 */
angular.module('UnicsJassa')
.service('unics', ['Prefixes', 'configuration', function (Prefixes, configuration) {

    var service = {
      asVar : asVar,
      asVars : asVars,
      asString : asString
      // nodes created from the taxonomy will be included here
      // ...
    }


    ////////////////////////////////////////////////////////////////////////////////



    /**
     * Converts a Node_Uri to a String
     * 
     * @param {any} node_uri 
     * @returns 
     */
    function asString(node_uri) {
      return rdf.NodeUtils.toPrettyString(node_uri);
    }



    /**
     * Converts a Node_Uri to a Var
     * 
     * @param {any} node_uri 
     * @returns 
     */
    function asVar(node_uri) {
      return rdf.NodeFactory.createVar(
        rdf.NodeUtils.toPrettyString(node_uri)
        //util.UriUtils.extractLabel(node_uri.getUri())
      );
    }



    /**
     * Converts an array of Node_Uris to an
     * array of Vars
     * 
     * @param {any} node_uris 
     * @returns 
     */
    function asVars(node_uris) {
      return _(node_uris)
        .map(function(node_uri) { return asVar(node_uri); })
        .value();
    }

        
    /**
     * generate an object like:
     * {
     *   termA : rdf.NodeFactory.createUri(uri + 'termA'),
     *  termB : rdf.NodeFactory.createUri(uri + 'termB')
     *  ...
     * }
     * for the keys, we need to replace some characters that
     * are invalid when used within a term that is used as
     */
    function createNodesFromTaxonomy(taxonomy, uri) {
      return _.zipObject(      
        _.map(taxonomy, function(key) { return _.replace(key, new RegExp('-', 'g'), '_'); }),     //keys, use a the RegExp with global option to replace all occurrences
        _.map(taxonomy, function(key) { return rdf.NodeFactory.createUri(uri + key.toString())} ) //values
      );
    }
    

    // inject into the service object all the taxonomies
    // coming from the configuration file
    _.forOwn(
      configuration.taxonomies,
      function(taxonomy, uri) {
        service = _.merge(service, createNodesFromTaxonomy(taxonomy, Prefixes.getUriPrefix(uri)));
      }
    )

    return service;
  }]);

var unicsjassa = angular.module('UnicsJassa', [])
    .provider('configuration', function() {
        var configurationData;
        this.initialize = function(data) {
            configurationData = data;
        }
        this.$get = function() {
            return configurationData;
        }
    })

// https://jacopretorius.net/2016/09/loading-configuration-data-on-startup-with-angular.html

$.get('/config/unics-config.json', function(response) {
    unicsjassa.config(function(configurationProvider, $routeProvider, $locationProvider) {       
        // set the configuration with the external config data      
        configurationProvider.initialize(response);
    })
    .run(function() {    
        // add jassa and submodules to the global namespace
        window.jassa = new Jassa(Promise, $.ajax);
        window.sparql = jassa.sparql;
        window.rdf = jassa.rdf;
    });
});


