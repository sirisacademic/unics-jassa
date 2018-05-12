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
      asString : asString,
      extendedNameOf : extendedNameOf,
      identifierOf : identifierOf,
      shortNameOf : shortNameOf,
      acronymOf : acronymOf,
      textualValueOf : textualValueOf,
      combineNodes : combineNodes
      // nodes created from the taxonomy will be included here
      // ...
    }


    ////////////////////////////////////////////////////////////////////////////////


    /**
     * Concatenates labels of two nodes_uris to create a new node_uri,
     * using the specified uri
     * @param {node_uri} node_uri1 first node_uri
     * @param {node_uri} node_uri2 second node_uri
     * @param {uri} uri 
     */
    function combineNodeUris(node_uri1, node_uri2, uri) {
    // get label and concat with the label of node 'extendedName'  
      var label = jassa.util.UriUtils.extractLabel(node_uri1.getUri()) + 
                    _.capitalize(
                      jassa.util.UriUtils.extractLabel(
                        node_uri2.getUri()
                        )
                      );
      
      return rdf.NodeFactory.createUri(uri + label);
    }



    /**
     * Creates a new node_uri, concatenating the label of
     * the two nodes
     * @param {node_uri} node_uri1 first node_uri
     * @param {node_uri} node_uri2 second node_uri
     */
    function combineNodes(node_uri1, node_uri2) {
      if ( Prefixes.getUriPrefix(Prefixes.prefixMapping.getNsURIPrefix(node_uri1.getUri())) !=
           Prefixes.getUriPrefix(Prefixes.prefixMapping.getNsURIPrefix(node_uri2.getUri()))
        )
        return console.error("node_uris must have same URI");

      return combineNodeUris(
        node_uri1, 
        node_uri2,
        Prefixes.getUriPrefix(
          Prefixes.prefixMapping.getNsURIPrefix(node_uri1.getUri())  
        )
      );
    }




    /**
     * Creates a new node_uri, concatenating the label of the existing one 
     * with the the label of node_uri 'extendedName'
     * @param {node_uri} node_uri 
     */
    function extendedNameOf(node_uri) {
      return combineNodeUris(
        node_uri, 
        service.extendedName,
        Prefixes.getUriPrefix(
          Prefixes.prefixMapping.getNsURIPrefix(node_uri.getUri())  
        )
      );
    }




    /**
     * Creates a new node_uri, concatenating the label of the existing one 
     * with the the label of node_uri 'identifier'
     * @param {*} node_uri 
     */
    function identifierOf(node_uri) {
      return combineNodeUris(
        node_uri, 
        service.identifier,
        Prefixes.getUriPrefix(
          Prefixes.prefixMapping.getNsURIPrefix(node_uri.getUri())  
        )
      );
    }




    /**
     * Creates a new node_uri, concatenating the label of the existing one 
     * with the the label of node_uri 'shortName'
     * @param {*} node_uri 
     */
    function shortNameOf(node_uri) {
      return combineNodeUris(
        node_uri, 
        service.shortName,
        Prefixes.getUriPrefix(
          Prefixes.prefixMapping.getNsURIPrefix(node_uri.getUri())  
        )
      );
    }



    /**
     * Creates a new node_uri, concatenating the label of the existing one 
     * with the the label of node_uri 'acronym'
     * @param {*} node_uri 
     */
    function acronymOf(node_uri) {
      return combineNodeUris(
        node_uri, 
        service.acronym,
        Prefixes.getUriPrefix(
          Prefixes.prefixMapping.getNsURIPrefix(node_uri.getUri())  
        )
      );
    }





    /**
     * Creates a new node_uri, concatenating the label of the existing one 
     * with the the label of node_uri 'textualValue'
     * @param {*} node_uri 
     */
    function textualValueOf(node_uri) {
      return combineNodeUris(
        node_uri, 
        service.textualValue,
        Prefixes.getUriPrefix(
          Prefixes.prefixMapping.getNsURIPrefix(node_uri.getUri())  
        )
      );
    }




    /**
     * Converts a Node_Uri to a String
     * 
     * @param {any} node_uri 
     * @returns {string}
     */
    function asString(node_uri) {
      return rdf.NodeUtils.toPrettyString(node_uri);
    }



    /**
     * Converts a Node_Uri to a Var
     * 
     * @param {any} node_uri 
     * @returns {NodeVar}
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
     * @returns {array}
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