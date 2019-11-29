---
layout: post
title: "Using component as a variable type"
date: "2007-08-30T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/30/Using-component-as-a-variable-type
guid: 2314
---

Did you know that ColdFusion 8 adds "component" as a valid type to both the returnType attribute of cffunction and the type attribute of cfargument? What does this mean? The default "rule" for types is that if you do not specify a type recognized by ColdFusion (list provided at the bottom of this post), then ColdFusion assumes you mean a component. So for example:

<code>
&lt;cfargument name="app" type="apple"&gt;
</code>

This line means that the app argument must be a component of type apple. It is also valid to pass in a component that extends apple, like greenapple.cfc. But again - what happened here was that ColdFusion didn't recognize apple and therefore considers it the name of a component.

ColdFusion 8 adds to the list of the supported types by adding "component". When you use component, you can pass <i>any</i> CFC instance. In the past, the only way to allow for any CFC would be to use "any". If we wanted to change that app argument to allow any CFC, we could use this:

<code>
&lt;cfargument name="app" type="component"&gt;
</code>

For your reference, here is the list of supported types for cfargument/cffunction.

<table border="1" cellpadding="10">
<tr>
<td>any</td>
<td>Any variable type is allowed.</td>
</tr>
<tr>
<td>array</td>
<td>An array is required.</td>
</tr>
<tr>
<td>binary</td>
<td>Binary data is required.</td>
</tr>
<tr>
<td>boolean</td>
<td>Boolean data is required.</td>
</tr>
<tr>
<td>component</td>
<td>A component instance is required.</td>
</tr>
<tr>
<td>date</td>
<td>Date data is required.</td>
</tr>
<tr>
<td>guid</td>
<td>A valid GUID value is required.</td>
</tr>
<tr>
<td>numeric</td>
<td>Numeric data is required.</td>
</tr>
<tr>
<td>query</td>
<td>Query data is required. In case it isn't obvious, a query with no rows is still a valid query.</td>
</tr>
<tr>
<td>string</td>
<td>String data is required.</td>
</tr>
<tr>
<td>struct</td>
<td>Structure data is required.</td>
</tr>
<tr>
<td>uuid</td>
<td>A ColdFusion UUID is required.</td>
</tr>
<tr>
<td>variableName</td>
<td>The value must be a string and must be a valid ColdFusion variable name. It doesn't mean the variable has to exist, just that the variable name is valid.</td>
</tr>
<tr>
<td>void</td>
<td>Speficies that no value is used. This only works in cffunction, not cfargument.</td>
</tr>
<tr>
<td>XML</td>
<td>XML data is required.</td>
</tr>
</table>

One last note - you can also specify a component name and brackets. For example, apple[]. This means that an array of apple components is required. Do note though that ColdFusion only checks the first item in the array.