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