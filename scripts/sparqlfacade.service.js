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
