# unics-jassa
An angular module with a facade to interact with the [Jassa library](https://github.com/sirisacademic/Jassa-Core), and some services to config endpoints/prefixes/taxonomies in the context of projects related to UNICS.


---


#### Documentation ####
There is documentation automatically generated from the jsDoc annotation in the js files
[Visit the docs](/docs/markdown/readme.md)


---


##### Requeriments #####
* A config file (/config/unics-config-json) in the angular app using this angular module dependency.
* the jassa library already loaded (since this add jassa and submodules to the global namespace) 

---

Contains also services to define:
* SPARQL prefixes for the ontologies being used.
* A key-valued object with the available aggregation functions.
* An object with all the available terms present in the taxonomies, in the form of RDF Nodes .


---


This module loads a configuration file that will be used by services within the module to setup things like:
* The URL of the SPARQL endpoint
* Prefixes to be used when creating SPARQL queries
* Taxonomies to be used within the ontology.


---


Configuration file has to be loaded before the declaration of services, since it contains the data that will config the services themselves. The approach used to achieve this is [explained here](https://jacopretorius.net/2016/09/loading-configuration-data-on-startup-with-angular.html): basically the order of execution is:
* Declaration of the module and declaration of a provider to hold the config (note that a Provider is the only injectable thing availlble in the config block of the module
* $.get to load the file
* on file loaded, config block of the module sets up the config provider
* Run block of the module is executed (adding jassa and submodules to the global namespace)

---


#### Configuration file ####
This module is aimed to be integrated as a module dependency in other angularjs 1.x applications, and expects a configuration (**unics-config.json**) file within a config folder located at the root of the webapp.

The configuration file contains data 
```json
{
    "sparql_endpoint" : "http://ec2-52-51-177-228.eu-west-1.compute.amazonaws.com/unics_2.0/sparql/query",
    "prefixes" : {
        "ontop"   : "http://www.semanticweb.org/ontologies/2016/4/untitled-ontology-69#",
        "ris3cat" : "http://www.semanticweb.org/ontologies/2016/4/untitled-ontology-69/ris3cat#",
        "rdf"     : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "dcterms" : "http://purl.org/dc/terms/"
    },
    "taxonomies" : {
        "ris3cat" : [
            "ambitSectorial",
            "AmbitSectorial",
            "tecnologiaFacilitadora",
            "TecnologiaFacilitadora"
          ],
        "ontop" : [
            "extendedName"
        ]
    }
}
```
