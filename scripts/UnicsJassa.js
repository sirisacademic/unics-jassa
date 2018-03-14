
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


