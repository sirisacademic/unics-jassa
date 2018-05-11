# Global





* * *

### combineNodeUris(node_uri1, node_uri2, uri) 

Concatenates labels of two nodes_uris to create a new node_uri,
using the specified uri

**Parameters**

**node_uri1**: `node_uri`, first node_uri

**node_uri2**: `node_uri`, second node_uri

**uri**: `uri`, Concatenates labels of two nodes_uris to create a new node_uri,
using the specified uri



### combineNodes(node_uri1, node_uri2) 

Creates a new node_uri, concatenating the label of
the two nodes

**Parameters**

**node_uri1**: `node_uri`, first node_uri

**node_uri2**: `node_uri`, second node_uri



### extendedNameOf(node_uri) 

Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'extendedName'

**Parameters**

**node_uri**: `node_uri`, Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'extendedName'



### identifierOf(node_uri) 

Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'identifier'

**Parameters**

**node_uri**: `*`, Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'identifier'



### shortNameOf(node_uri) 

Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'shortName'

**Parameters**

**node_uri**: `*`, Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'shortName'



### acronymOf(node_uri) 

Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'acronym'

**Parameters**

**node_uri**: `*`, Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'acronym'



### textualValueOf(node_uri) 

Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'textualValue'

**Parameters**

**node_uri**: `*`, Creates a new node_uri, concatenating the label of the existing one 
with the the label of node_uri 'textualValue'



### asString(node_uri) 

Converts a Node_Uri to a String

**Parameters**

**node_uri**: `any`, Converts a Node_Uri to a String

**Returns**: `string`


### asVar(node_uri) 

Converts a Node_Uri to a Var

**Parameters**

**node_uri**: `any`, Converts a Node_Uri to a Var

**Returns**: `NodeVar`


### asVars(node_uris) 

Converts an array of Node_Uris to an
array of Vars

**Parameters**

**node_uris**: `any`, Converts an array of Node_Uris to an
array of Vars

**Returns**: `array`


### createNodesFromTaxonomy() 

generate an object like:
{
  termA : rdf.NodeFactory.createUri(uri + 'termA'),
 termB : rdf.NodeFactory.createUri(uri + 'termB')
 ...
}
for the keys, we need to replace some characters that
are invalid when used within a term that is used as




* * *










