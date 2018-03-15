# Global





* * *

### instanceOf(subject, predicate, object) 

Generates a triple composed as {?var predicate object}

**Parameters**

**subject**: `any`, Generates a triple composed as {?var predicate object}

**predicate**: `any`, Generates a triple composed as {?var predicate object}

**object**: `any`, Generates a triple composed as {?var predicate object}

**Returns**: , A rdf.Triple


### typeOf(subject, object) 

Generates a triple composed as {?var :type predicate}

**Parameters**

**subject**: `any`, Generates a triple composed as {?var :type predicate}

**object**: `any`, Generates a triple composed as {?var :type predicate}

**Returns**: , A rdf.Triple


### triple(subject, predicate, object) 

Generates a triple composed as {?var predicate ?var}

**Parameters**

**subject**: `any`, Generates a triple composed as {?var predicate ?var}

**predicate**: `any`, Generates a triple composed as {?var predicate ?var}

**object**: `any`, Generates a triple composed as {?var predicate ?var}

**Returns**: , rdf.Triple


### predicateObjectList(subject, predicates) 

Creates a pattern of triples with a common subject
https://www.w3.org/TR/rdf-sparql-query/#QSynTriples

**Parameters**

**subject**: `any`, Creates a pattern of triples with a common subject
https://www.w3.org/TR/rdf-sparql-query/#QSynTriples

**predicates**: `any`, Creates a pattern of triples with a common subject
https://www.w3.org/TR/rdf-sparql-query/#QSynTriples

**Returns**: , A sparql.ElementTriplesBlock


### exploreObjectType(subject, type, predicates) 

Returns a ElementTriplesBlock composed of triples: first 
triple describes the type of the subject {?var :type predicate}
and the rest are triples as {?var predicate ?var}

**Parameters**

**subject**: `any`, Returns a ElementTriplesBlock composed of triples: first 
triple describes the type of the subject {?var :type predicate}
and the rest are triples as {?var predicate ?var}

**type**: `any`, Returns a ElementTriplesBlock composed of triples: first 
triple describes the type of the subject {?var :type predicate}
and the rest are triples as {?var predicate ?var}

**predicates**: `any`, Returns a ElementTriplesBlock composed of triples: first 
triple describes the type of the subject {?var :type predicate}
and the rest are triples as {?var predicate ?var}

**Returns**: , A sparql.ElementTriplesBlock


### constraint(subject, predicate, literalValue) 

Generates a triple composed as {subject predicate NodeLiteral}

**Parameters**

**subject**: `any`, Generates a triple composed as {subject predicate NodeLiteral}

**predicate**: `any`, Generates a triple composed as {subject predicate NodeLiteral}

**literalValue**: `any`, Generates a triple composed as {subject predicate NodeLiteral}

**Returns**: , rdf.Triple


### constraintBoolean(subject, predicate, literalValue) 

Creates a triple constrained by a boolean value

**Parameters**

**subject**: `*`, Creates a triple constrained by a boolean value

**predicate**: `*`, Creates a triple constrained by a boolean value

**literalValue**: `*`, Creates a triple constrained by a boolean value



### setFilter(node_uri, literalValues, expressionName, logicalOperator) 

Return an ElementFilter

**Parameters**

**node_uri**: `any`, Return an ElementFilter

**literalValues**: `any`, Can be a single value or an array of values

**expressionName**: `any`, an sparql expression, like E_NotEquals

**logicalOperator**: `any`, an sparql logical expression: 'AND' , 'OR'

**Returns**: , An ElementFilter


### setFilterByNodeUri(node_uri, Node_Uris, expressionName, logicalOperator) 

Return an ElementFilter

**Parameters**

**node_uri**: `any`, Return an ElementFilter

**Node_Uris**: `any`, Can be a single Node_Uri or an array of Node_Uris

**expressionName**: `any`, an sparql expression, like E_NotEquals

**logicalOperator**: `any`, an sparql logical expression: 'AND' , 'OR'

**Returns**: , An ElementFilter


### getReferencedVarsInFilters() 

return an varExprList with the vars mentioned in the 
array of element filters



### negateFilter(elementFilter) 

Returns an ElementFilter with the negated expression of the original filter

**Parameters**

**elementFilter**: `*`, Returns an ElementFilter with the negated expression of the original filter



### getVarsAndValuesFromFilter() 

Receives a filter element and returns an object with
mentioned variables in the filter as the object's keys 
and values and operations of these variables as object's values



### findElementFiltersByVars(elementFilters, vars) 

Given an array of ElementFilter, return the first ElementFilter 
that contains any of the vars indicated

**Parameters**

**elementFilters**: `*`, Given an array of ElementFilter, return the first ElementFilter 
that contains any of the vars indicated

**vars**: `*`, Given an array of ElementFilter, return the first ElementFilter 
that contains any of the vars indicated



### queryExtendedNamesForType(type, propertyLabel) 

Generates a varExprList and a QueryPattern to perform queries like:
 Prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        Prefix dcterms: <http://purl.org/dc/terms/> 
        Select Distinct ?propertyLabel {
          ?type rdf:type ontop:type . 
          ?type ontop:extendedName ?propertyLabel
        }

**Parameters**

**type**: `any`, Type of object we want to explore

**propertyLabel**: `any`, values of this property, for the type of object specified

**Returns**: , Object { varExprList: VarExprList, queryPattern : QueryPattern]



* * *










