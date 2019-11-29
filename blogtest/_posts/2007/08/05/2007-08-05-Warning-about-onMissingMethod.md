---
layout: post
title: "Warning about onMissingMethod"
date: "2007-08-05T23:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/05/Warning-about-onMissingMethod
guid: 2253
---

Tonight I played around with onMissingMethod, a cool new feature in ColdFusion 8. See Ben Nadel's <a href="http://www.bennadel.com/index.cfm?dax=blog:868.view">entry</a> on it for more detail. I knew that the method took two arguments - the name of the method invoked and a struct of the arguments that was passed.

What I didn't realize and was surprised by - you can't rename these arguments. So consider this:

<!--more-->

<code>
&lt;cffunction name="onMissingMethod" access="public" returnType="any" output="false"&gt;
	&lt;cfargument name="method" type="string" required="true"&gt;
	&lt;cfargument name="args" type="struct" required="true"&gt;
</code>

While the method itself will run, the arguments above will not actually be used. You <i>must</i> name them as Ben describe's in his entry: 

<code>
&lt;cffunction name="onMissingMethod" access="public" returnType="any" output="false"&gt;
	&lt;cfargument name="missingMethodName" type="string" required="true"&gt;
	&lt;cfargument name="missingMethodArguments" type="struct" required="true"&gt;
</code>

As a side note - for the life of me I couldn't find any mention of onMissingMethod in the docs - neither the Developer's Guide nor the Reference. Can anyone else find it?

This is the code I'm using in a generic bean:

<code>
&lt;cfcomponent name="Core Bean" output="false"&gt;

&lt;cffunction name="onMissingMethod" access="public" returnType="any" output="false"&gt;
	&lt;cfargument name="missingMethodName" type="string" required="true"&gt;
	&lt;cfargument name="missingMethodArguments" type="struct" required="true"&gt;
	&lt;cfset var key = ""&gt;
	
	&lt;cfif find("get", arguments.missingMethodName) is 1&gt;
		&lt;cfset key = replaceNoCase(arguments.missingMethodName,"get","")&gt;
		&lt;cfif structKeyExists(variables, key)&gt;
			&lt;cfreturn variables[key]&gt;
		&lt;/cfif&gt;
	&lt;/cfif&gt;

	&lt;cfif find("set", arguments.missingMethodName) is 1&gt;
		&lt;cfset key = replaceNoCase(arguments.missingMethodName,"set","")&gt;
		&lt;cfif structKeyExists(arguments.missingMethodArguments, key)&gt;
			&lt;cfset variables[key] = arguments.missingMethodArguments[key]&gt;
		&lt;/cfif&gt;
	&lt;/cfif&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

This let's me define a simple bean like so:

<code>
&lt;cfcomponent output="false" extends="bean"&gt;

&lt;cfset variables.id = ""&gt;
&lt;cfset variables.username = ""&gt;
&lt;cfset variables.password = ""&gt;
&lt;cfset variables.name = ""&gt;
&lt;cfset variables.email = ""&gt;

&lt;/cfcomponent&gt;
</code>