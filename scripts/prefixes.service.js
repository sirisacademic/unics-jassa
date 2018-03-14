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
