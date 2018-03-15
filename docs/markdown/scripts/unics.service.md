# Global





* * *

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










